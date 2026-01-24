# --- Stage 1: Build Frontend Assets ---
FROM node:20-slim AS frontend-builder
WORKDIR /app

# Giới hạn bộ nhớ cho Node.js để tránh lỗi Out of Memory trên gói Free của Render (512MB RAM)
ENV NODE_OPTIONS="--max-old-space-size=400"

COPY package*.json ./
# Sử dụng --no-audit và --no-fund để giảm việc sử dụng RAM và tăng tốc cài đặt
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# --- Stage 2: Build PHP Application ---
FROM php:8.4-apache
WORKDIR /var/www/html

# Cài đặt các gói hệ thống cần thiết (dùng -y và --no-install-recommends để giảm dung lượng image)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài đặt PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

# Kích hoạt mod_rewrite cho Laravel
RUN a2enmod rewrite

# Copy Composer từ image chính thức
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy mã nguồn dự án
COPY . .

# Chỉ copy kết quả đã build từ Stage 1
COPY --from=frontend-builder /app/public/build ./public/build

# Cài đặt PHP dependencies, bỏ qua dev và tối ưu hóa autoloader
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Cấu hình quyền truy cập thư mục cho Laravel
RUN mkdir -p storage/logs storage/framework/views storage/framework/sessions storage/framework/cache/data bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Cập nhật cấu hình Apache trỏ vào thư mục /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Expose port 80 cho Render
EXPOSE 80

CMD ["apache2-foreground"]
