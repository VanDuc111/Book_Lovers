
CREATE DATABASE IF NOT EXISTS `booklovers` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `booklovers`;

-- Users
CREATE TABLE `user` (
  `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `uk_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories
CREATE TABLE `category` (
  `categoryID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `categoryName` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Books
CREATE TABLE `book` (
  `bookID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `author` VARCHAR(100) DEFAULT NULL,
  `publisher` VARCHAR(100) DEFAULT NULL,
  `bookPrice` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `description` TEXT DEFAULT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `categoryID` INT UNSIGNED DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`bookID`),
  KEY `fk_book_category` (`categoryID`),
  CONSTRAINT `fk_book_category` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart (one per user)
CREATE TABLE `cart` (
  `cartID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userID` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cartID`),
  KEY `fk_cart_user` (`userID`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart items
CREATE TABLE `cart_item` (
  `cartItemID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cartID` INT UNSIGNED NOT NULL,
  `bookID` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`cartItemID`),
  KEY `fk_cartitem_cart` (`cartID`),
  KEY `fk_cartitem_book` (`bookID`),
  CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cartID`) REFERENCES `cart` (`cartID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cartitem_book` FOREIGN KEY (`bookID`) REFERENCES `book` (`bookID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders
CREATE TABLE `order` (
  `orderID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userID` INT UNSIGNED DEFAULT NULL,
  `order_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `shipping_address` VARCHAR(255) DEFAULT NULL,
  `order_status` ENUM('Pending','Processing','Shipped','Delivered','Cancelled') NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (`orderID`),
  KEY `fk_order_user` (`userID`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items
CREATE TABLE `order_item` (
  `orderItemID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `orderID` INT UNSIGNED DEFAULT NULL,
  `bookID` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`orderItemID`),
  KEY `fk_orderitem_order` (`orderID`),
  KEY `fk_orderitem_book` (`bookID`),
  CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`orderID`) REFERENCES `order` (`orderID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_orderitem_book` FOREIGN KEY (`bookID`) REFERENCES `book` (`bookID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews
CREATE TABLE `review` (
  `reviewID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bookID` INT UNSIGNED NOT NULL,
  `userID` INT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `comment` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewID`),
  KEY `fk_review_book` (`bookID`),
  KEY `fk_review_user` (`userID`),
  CONSTRAINT `fk_review_book` FOREIGN KEY (`bookID`) REFERENCES `book` (`bookID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Helpful indexes
ALTER TABLE `book` ADD INDEX `idx_book_title` (`title`(50));
ALTER TABLE `order` ADD INDEX `idx_order_user_date` (`userID`,`order_date`);

-- Dữ liệu mẫu: users (1 admin, 2 client)
INSERT INTO `user` (`name`, `email`, `password`, `address`, `phone`, `role`) VALUES
('Admin User', 'admin@example.com', '$2y$10$ZbKG81D8zCHe8.zxqqg39uTMchBtbMVkfP/GxnXZE13EJ/ANtSt6S', 'Hanoi', '0123456789', 'admin'),
('Client One', 'client1@example.com', '$2y$10$zR7snQhZSYLM5fXgY05SieU.9A2cWS98NXAwjGZbZ4ZSfmTWcY1DO', 'Hanoi', '0987654321', 'client'),
('Client Two', 'client2@example.com', '$2y$10$cx7CvmFaa.aRSNwgwarLh.U6DKj9uO1/C6UxTgS./I6lks0h.r0sW', NULL, NULL, 'client');

-- Dữ liệu mẫu: categories (gộp, chỉ giữ 4 mục chính)
INSERT INTO `category` (`categoryID`, `categoryName`, `description`) VALUES
(1, 'Văn học', 'Tiểu thuyết, truyện, văn học'),
(2, 'Phát triển bản thân', 'Sách động lực, tự lực, hướng nghiệp'),
(3, 'Kiến thức & Kinh tế', 'Sách khoa học, kinh tế, marketing'),
(4, 'Thiếu nhi', 'Sách cho trẻ em');

-- Thêm sách mẫu (gán category đã gộp)
INSERT INTO `book` (`title`, `author`, `publisher`, `bookPrice`, `description`, `stock`, `categoryID`, `image`) VALUES
('7 Thói Quen Của Bạn Trẻ Thành Đạt', 'Tác giả VN', 'NXB Tổng Hợp', 99000.00, 'Sách phát triển bản thân', 25, 2, '7-thoi-quen-cua-ban-tre-thanh-dat.jpg'),
('Alice In Borderland - Tập 1', 'Haro Aso', 'NXB Văn Học', 120000.00, 'Truyện giả tưởng', 18, 1, 'alice-in-borderland-tap-1.jpg'),
('Bố Già', 'Mario Puzo', 'NXB Văn Học', 150000.00, 'Tiểu thuyết kinh điển', 12, 1, 'bo-gia-mario-puzo.jpg'),
('Đi Tìm Lẽ Sống', 'Viktor E. Frankl', 'NXB Tri Thức', 140000.00, 'Tự lực và ý nghĩa sống', 20, 2, 'di-tim-le-song.jpg'),
('Đồng Tháp Mười và Người - Tập 10', 'Tác giả VN', 'NXB Địa Phương', 80000.00, 'Văn học địa phương', 10, 1, 'dong-thap-dat-va-nguoi-tap-10.jpg'),
('Doraemon - Túi Thần Kỳ', 'Fujiko F. Fujio', 'NXB Thiếu Nhi', 60000.00, 'Truyện thiếu nhi', 40, 4, 'doraemon-tui-than-ky-cua-doraemon.jpg'),
('Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', 'NXB Văn Học', 170000.00, 'Tiểu thuyết giả tưởng', 22, 1, 'harry-potter-va-hon-da-phu-thuy.jpg'),
('Không Gì Là Không Thể', 'Tác giả VN', 'NXB Tri Thức', 85000.00, 'Sách động lực', 30, 2, 'khong-gi-la-khong-the.jpg'),
('Marketing Căn Bản', 'Tác giả VN', 'NXB Kinh Tế', 110000.00, 'Sách marketing cơ bản', 15, 3, 'marketing-can-ban.jpg'),
('Nhà Giả Kim', 'Paulo Coelho', 'NXB Văn Học', 130000.00, 'Tiểu thuyết nổi tiếng', 28, 1, 'nha-gia-kim.jpg'),
('Nơi Buồn Chiến Tranh', 'Tác giả VN', 'NXB Văn Học', 90000.00, 'Văn học chiến tranh', 8, 1, 'noi-buon-chien-tranh.jpg'),
('Sherlock Holmes - Toàn Tập (Tập 3)', 'Arthur Conan Doyle', 'NXB Văn Học', 160000.00, 'Truyện trinh thám', 14, 1, 'sherlock-holmes-toan-tap-3-tap.jpg'),
('Thiên Cho Người Mới Bắt Đầu', 'Tác giả VN', 'NXB Tri Thức', 79000.00, 'Sách hướng nghiệp', 20, 2, 'thien-cho-nguoi-moi-bat-dau.jpg'),
('Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Nguyễn Nhật Ánh', 'NXB Trẻ', 85000.00, 'Tiểu thuyết thiếu nhi/thiếu niên', 26, 1, 'toi-thay-hoa-vang-tren-co-xanh.jpg'),
('Tuổi Trẻ Đáng Giá Bao Nhiêu', 'Lý Hâm', 'NXB Tri Thức', 95000.00, 'Sách phát triển cá nhân', 30, 2, 'tuoi-tre-dang-gia-bao-nhieu.jpg');

-- End of schema
