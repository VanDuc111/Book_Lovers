# Website Bán Sách BookLovers

Dự án phát triển một hệ thống website thương mại điện tử chuyên bán sách. Hệ thống cung cấp đầy đủ các tính năng cơ bản của một trang bán hàng trực tuyến, bao gồm quản lý sản phẩm, giỏ hàng, và giao dịch cơ bản.

---

## Live Demo: https://book-lovers-izlv.onrender.com

---

## Công nghệ và Môi trường Phát triển

| Hạng mục               | Công nghệ/Phiên bản                     | Vai trò                                         |
| :--------------------- | :-------------------------------------- | :---------------------------------------------- |
| **Ngôn ngữ Lập trình** | PHP (Phiên bản 7.x trở lên)             | Ngôn ngữ xử lý logic phía máy chủ.              |
| **Cơ sở dữ liệu**      | MySQL                                   | Lưu trữ dữ liệu sản phẩm, người dùng, đơn hàng. |
| **Môi trường Server**  | Docker (Docker Compose)                 | Chạy Apache/PHP và MySQL qua Docker Compose.    |
| **Giao diện**          | HTML5, CSS3, JavaScript (Bootstrap 3/4) | Thiết kế giao diện người dùng.                  |

---

## Hướng dẫn chạy (Docker Compose)

Dự án có cấu hình sẵn để chạy bằng Docker Compose. Dùng Docker giúp bạn dễ thiết lập môi trường (Apache + PHP + MySQL + phpMyAdmin) mà không cần cài XAMPP.

Yêu cầu:

- Docker Engine (>= 20.x) và Docker Compose (đã tích hợp trong Docker Desktop).

1. Tạo file `.env` tại gốc repo (bên cạnh `docker-compose.yml`) với nội dung mẫu sau (ví dụ):

```
APACHE_PORT=8080
PHPMYADMIN_PORT=8081
MYSQL_ROOT_PASSWORD=secret_root_password
MYSQL_DATABASE=booklovers_db
MYSQL_USER=booklovers_user
MYSQL_PASSWORD=booklovers_pass
```

2. Khởi động dịch vụ bằng Docker Compose:

```bash
docker-compose up --build -d
```

3. Truy cập ứng dụng:

- Frontend: http://localhost:8080/pages/
- phpMyAdmin: http://localhost:8081/ (user: value of `MYSQL_USER`, password: `MYSQL_PASSWORD` in `.env`)

4. Cơ sở dữ liệu mặc định: thư mục `database/` được mount vào container MySQL và sẽ tự import các file `*.sql` khi container khởi tạo lần đầu. Nếu bạn cần import thủ công:

```bash
# import bằng cách exec vào container mysql
docker exec -i booklovers_db mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < database/booklovers.sql
```

5. Dừng và xóa containers (và volumes nếu muốn):

```bash
docker-compose down            # dừng và xóa containers
docker-compose down -v         # xóa cả volumes (dữ liệu DB sẽ mất)
```

6. Xem logs:

```bash
docker-compose logs -f
```

Ghi chú:

- `docker-compose.yml` trong dự án đã định nghĩa 3 service: `app` (Apache/PHP), `db` (MySQL) và `phpmyadmin`.
- Nếu đổi port trong `.env`, hãy dùng port tương ứng để truy cập.

---

## Các Tính năng Chính

- Quản lý Sản phẩm: Thêm, sửa, xóa sản phẩm, phân loại theo danh mục.
- Giỏ hàng động: Cho phép người dùng thêm/bỏ sản phẩm và thay đổi số lượng.
- Thanh toán đơn giản: Hệ thống xử lý quy trình đặt hàng và lưu trữ thông tin giao dịch.
- Giao diện người dùng: HTML/CSS/JS (Bootstrap), trang admin để quản lý nội dung.

---
