# 📚 Book Lovers - Nền tảng mua sắm sách hiện đại

**Book Lovers** là một ứng dụng Web Thương mại điện tử (E-commerce) chuyên biệt cho lĩnh vực nhà sách trực tuyến. Dự án tập trung vào việc cung cấp trải nghiệm mua sắm hiện đại, quy trình đặt hàng tối ưu và hệ thống quản lý nội dung mạnh mẽ, đáp ứng đầy đủ các tiêu chuẩn của một nền tảng bán lẻ chuyên nghiệp.

---

**Live Demo:** https://book-lovers-izlv.onrender.com/

---

## 🚀 Công nghệ sử dụng

| Thành phần           | Công nghệ             | Chi tiết                                      |
| :------------------- | :-------------------- | :-------------------------------------------- |
| **Frontend**         | **Vue.js 3**          | Sử dụng Composition API, Reactive Components. |
| **Backend**          | **Laravel 12**        | PHP 8.4, API-driven architecture.             |
| **Build Tool**       | **Vite**              | Tối ưu hóa việc đóng gói asset và HMR.        |
| **UI Framework**     | **Bootstrap 5 & CSS** | Giao diện hiện đại, responsive.               |
| **Database**         | **MySQL**             | Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ.    |
| **Containerization** | **Docker**            | Triển khai nhanh chóng qua Docker Compose.    |

---

## ✨ Tính năng nổi bật

- **Giao diện Trang chủ năng động**: Tích hợp các slider sách nổi bật, gợi ý hàng ngày và đánh giá mới nhất.
- **Tìm kiếm & Lọc nâng cao**: Hệ thống tìm kiếm thời gian thực và lọc theo danh mục được xử lý mượt mà.
- **Giỏ hàng thông minh**: Thêm/xóa sản phẩm, cập nhật số lượng và tính tiền tự động trong nháy mắt.
- **Quản lý Tài khoản & Hồ sơ**: Xem lịch sử đơn hàng, danh sách sách đã mua và thay đổi thông tin cá nhân.
- **Đánh giá & Xếp hạng**: Hệ thống đánh giá sách tích hợp sao, dành riêng cho người dùng đã sở hữu sản phẩm.
- **Thiết kế Mobile-First**: Trải nghiệm nhất quán trên mọi thiết bị từ điện thoại đến máy tính.

---

## 🛠️ Hướng dẫn cài đặt

### 1. Sử dụng Docker

Dự án đã được cấu hình sẵn môi trường Docker gọn nhẹ:

```bash
# Clone dự án
git clone https://github.com/VanDuc111/Book_Lovers.git
cd booklovers

# Khởi động dịch vụ
docker compose up -d
```

Ứng dụng sẽ khả dụng tại: [http://localhost](http://localhost)

### 2. Cài đặt thủ công (Local)

Yêu cầu: PHP >= 8.4, Node.js >= 20, MySQL.

```bash
# 1. Cài đặt thư viện PHP
composer install

# 2. Cấu hình môi trường
cp .env.example .env
php artisan key:generate

# 3. Cài đặt & Build Frontend
npm install
npm run build

# 4. Chạy Migration (đảm bảo DB đã được tạo)
php artisan migrate --seed

# 5. Khởi động server
php artisan serve
```

---

## 📂 Cấu trúc thư mục chính

- `app/`: Chứa các logic nghiệp vụ Backend (Controllers, Models, Middleware).
- `resources/js/`: Chứa toàn bộ mã nguồn Frontend (Vue components, JavaScript logic).
- `routes/`: Nơi định nghĩa các đường dẫn API và Web của hệ thống.
- `public/`: Chứa các tài nguyên tĩnh đã được build (CSS, Images, Assets).
- `database/`: Quản lý cấu trúc cơ sở dữ liệu, Migrations và Seeders.

---

## 🤝 Liên hệ

Dự án được thực hiện bởi **VanDuc111**. Hãy nhấn **Star** ⭐ nếu bạn thấy dự án này hữu ích!
