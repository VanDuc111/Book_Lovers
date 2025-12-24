# Website Bán Sách BookLovers (Laravel Version)

Dự án phát triển một hệ thống website thương mại điện tử chuyên bán sách, đã được chuyển đổi từ PHP thuần sang **Laravel Framework**. Hệ thống cung cấp đầy đủ các tính năng cơ bản của một trang bán hàng trực tuyến, bao gồm quản lý sản phẩm, giỏ hàng, đánh giá và giao dịch cơ bản.

---

## Công nghệ và Môi trường Phát triển

| Hạng mục               | Công nghệ/Phiên bản                     | Vai trò                                         |
| :--------------------- | :-------------------------------------- | :---------------------------------------------- |
| **Framework**          | Laravel 11.x                            | Framework PHP hiện đại, mạnh mẽ.                |
| **Ngôn ngữ Lập trình** | PHP 8.2+                                | Ngôn ngữ xử lý logic phía máy chủ.              |
| **Cơ sở dữ liệu**      | MySQL                                   | Lưu trữ dữ liệu sản phẩm, người dùng, đơn hàng. |
| **Môi trường Server**  | Docker (Laravel Sail)                   | Môi trường phát triển containerized.            |
| **Giao diện**          | Blade Templates, Bootstrap 5, JS Module | Thiết kế giao diện người dùng.                  |

---

## Hướng dẫn chạy (Laravel Sail)

Dự án sử dụng **Laravel Sail** (dựa trên Docker Compose) để quản lý môi trường phát triển.

### Yêu cầu:

-   Docker Engine và Docker Compose.

### Các bước cài đặt:

1. **Clone repo và vào thư mục dự án**:

    ```bash
    cd booklovers_laravel
    ```

2. **Cài đặt dependencies**:

    ```bash
    docker run --rm \
        -u "$(id -u):$(id -g)" \
        -v "$(pwd):/var/www/html" \
        -w /var/www/html \
        laravelsail/php82-composer:latest \
        composer install --ignore-platform-reqs
    ```

3. **Cấu hình môi trường**:

    - Copy file `.env.example` thành `.env`:
        ```bash
        cp .env.example .env
        ```
    - Cấu hình các thông số DB trong `.env` (mặc định Sail sử dụng `mysql` host, user `sail`, password `password`).

4. **Khởi động Sail**:

    ```bash
    ./vendor/bin/sail up -d
    ```

5. **Tạo key và chạy migration**:

    ```bash
    ./vendor/bin/sail artisan key:generate
    ./vendor/bin/sail artisan migrate
    ```

    _(Nếu có file seed dữ liệu mẫu: `./vendor/bin/sail artisan db:seed`)_

6. **Cài đặt gói frontend (nếu cần)**:

    ```bash
    ./vendor/bin/sail npm install
    ./vendor/bin/sail npm run dev
    ```

7. **Truy cập ứng dụng**:
    - Web: http://localhost

### Các lệnh thường dùng:

-   Truy cập container: `./vendor/bin/sail shell` or `docker compose exec laravel.test bash`
-   Chạy artisan: `./vendor/bin/sail artisan ...`

---

## Các Tính năng Chính (Đã Migrate)

-   **API RESTful**: Backend đã được chuyển hoàn toàn sang Controllers và API Routes (`/api/books`, `/api/orders`, ...).
-   **Quản lý Sản phẩm**: Hiển thị, tìm kiếm, lọc theo danh mục.
-   **Giỏ hàng & Đặt hàng**: Thêm/bỏ sản phẩm, cập nhật số lượng, checkout tạo đơn hàng.
-   **Tài khoản**: Đăng ký, Đăng nhập (Token based/Session), Cập nhật thông tin profile.
-   **Đánh giá**: Xem và gửi đánh giá cho sách đã mua.
-   **Admin**: Dashboard quản lý sách, user, đơn hàng (Fetch API integration).

---
