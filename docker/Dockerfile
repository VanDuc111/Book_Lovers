FROM php:8.1-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libzip-dev zip unzip libonig-dev \
    && docker-php-ext-install mysqli pdo pdo_mysql zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Runtime: project will be mounted into /var/www/html
