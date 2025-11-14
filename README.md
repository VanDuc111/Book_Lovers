#  Website Bán Sách BookLovers

Dự án phát triển một hệ thống website thương mại điện tử chuyên bán sách, được xây dựng trên nền tảng XAMPP. Hệ thống cung cấp đầy đủ các tính năng cơ bản của một trang bán hàng trực tuyến, bao gồm quản lý sản phẩm, giỏ hàng, và giao dịch cơ bản.

---

##  Công nghệ và Môi trường Phát triển

| Hạng mục | Công nghệ/Phiên bản | Vai trò |
| :--- | :--- | :--- |
| **Ngôn ngữ Lập trình** | PHP (Phiên bản 7.x trở lên) | Ngôn ngữ xử lý logic phía máy chủ. |
| **Cơ sở dữ liệu** | MySQL | Lưu trữ dữ liệu sản phẩm, người dùng, đơn hàng. |
| **Môi trường Server** | XAMPP | Cung cấp môi trường Apache và MySQL cục bộ. |
| **Giao diện** | HTML5, CSS3, JavaScript (Bootstrap 3/4) | Thiết kế giao diện người dùng. |

---

##  Hướng dẫn Cài đặt và Khởi chạy (Sử dụng XAMPP)

Để chạy dự án này trên máy tính cá nhân của bạn, hãy làm theo các bước sau:

### Bước 1: Cài đặt và Chuẩn bị Môi trường

1. Đảm bảo bạn đã cài đặt phần mềm **XAMPP** trên máy tính (hoặc WAMP/MAMP nếu bạn đang dùng môi trường khác).
2. Khởi động **XAMPP Control Panel** và bật các dịch vụ **Apache** và **MySQL**.

### Bước 2: Tải Mã nguồn và Đặt vào Thư mục `htdocs`

1. **Tải Mã nguồn:** Tải toàn bộ mã nguồn của Repository này về máy tính (dưới dạng file ZIP hoặc sử dụng lệnh `git clone`).
2. **Sao chép Folder:** Sao chép toàn bộ thư mục mã nguồn vừa tải vào thư mục **`htdocs`** của XAMPP.

### Bước 3: Thiết lập Cơ sở Dữ liệu (MySQL)

1. **Truy cập phpMyAdmin:** Mở trình duyệt web và truy cập địa chỉ: `http://localhost/phpmyadmin`.
2. **Tạo Database mới:** Tạo một cơ sở dữ liệu mới với tên là **`bookstore_db`** .
3. **Import Dữ liệu:**
    * Nhấn vào database **`bookstore_db`** vừa tạo.
    * Chọn tab **Import** (Nhập).
    * Chọn file **`bookstore_db.sql`**  nằm trong thư mục project và nhấn **Go** (Thực hiện) để nhập dữ liệu.

### Bước 4: Chạy Ứng dụng

1. **Kiểm tra file cấu hình:** Mở file cấu hình kết nối database của bạn (ví dụ: `connect.php` hoặc `db_config.php`) và đảm bảo các thông số sau là chính xác:
    * **Tên Database:** `bookstore_db`
    * **Username:** `root` (Mặc định của XAMPP)
    * **Password:** (Thường để trống hoặc `""` - Mặc định của XAMPP)
2. **Truy cập Website:** Mở trình duyệt và truy cập địa chỉ sau:
    ```
    http://localhost/booklovers/pages/
    ```

---

## 📌 Các Tính năng Chính

* **Quản lý Sản phẩm:** Thêm, sửa, xóa sản phẩm, phân loại theo danh mục.
* **Giỏ hàng Động:** Cho phép người dùng thêm/bỏ sản phẩm và thay đổi số lượng.
* **Thanh toán Đơn giản:** Hệ thống xử lý quy trình đặt hàng và lưu trữ thông tin giao dịch.
* **Giao diện Người dùng (Front-end):** Thiết kế trực quan, dễ sử dụng.

