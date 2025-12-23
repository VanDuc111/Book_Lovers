-- BookLovers SQL dump (wrapped for easy import)
-- Generated: Dec 23, 2025 - wrapped by script

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS=0;

DROP DATABASE IF EXISTS `booklovers`;
CREATE DATABASE `booklovers` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `booklovers`;

SET SESSION sql_require_primary_key = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `booklovers`
--

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `bookID` int UNSIGNED NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publisher` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bookPrice` decimal(10,2) NOT NULL DEFAULT '0.00',
  `description` text COLLATE utf8mb4_unicode_ci,
  `stock` int NOT NULL DEFAULT '0',
  `categoryID` int UNSIGNED DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`bookID`, `title`, `author`, `publisher`, `bookPrice`, `description`, `stock`, `categoryID`, `image`) VALUES
(1, '7 Thói Quen Của Bạn Trẻ Thành Đạt', 'Sean Covery', 'NXB Tổng Hợp', 99000.00, 'Sách phát triển bản thân', 23, 2, '7-thoi-quen-cua-ban-tre-thanh-dat.jpg'),
(2, 'Alice In Borderland - Tậ­p 1', 'Haro Aso', 'NXB Trẻ', 120000.00, 'Truyện tranh', 16, 4, 'alice-in-borderland-tap-1.jpg'),
(3, 'Bố Già', 'Mario Puzo', 'NXB Văn Học', 150000.00, 'Tiểu thuyết kinh điển', 10, 1, 'bo-gia-mario-puzo.jpg'),
(4, 'Đi Tìm Lẽ Sống', 'Viktor E. Frankl', 'NXB Tri Thức', 140000.00, 'Tích cực và phát triển tương lai', 20, 2, 'di-tim-le-song.jpg'),
(5, 'Đồng Tháp Đất & Người tập 10', 'Nhiều tác giả', 'NXB Đồng Nai', 80000.00, 'Văn học ', 10, 1, 'dong-thap-dat-va-nguoi-tap-10.jpg'),
(6, 'Doraemon - Túi Thần Kỳ Của Doraemon', 'Fujiko F. Fujio', 'NXB Kim Đồng', 60000.00, 'Truyện thiếu nhi', 37, 4, 'doraemon-tui-than-ky-cua-doraemon.jpg'),
(7, 'Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', 'NXB Trẻ', 170000.00, 'Tiểu thuyết giả tưởng', 22, 1, 'harry-potter-va-hon-da-phu-thuy.jpg'),
(8, 'Không Gì Là Không Thể', 'George Matthew Adams', 'NXB Tổng Hợp Tp.HCM', 85000.00, 'Sách động lực', 30, 2, 'khong-gi-la-khong-the.jpg'),
(9, 'Marketing Căn Bản', 'Don Sexton', 'NXB Lao Động', 110000.00, 'Sách marketing căn bản', 15, 3, 'marketing-can-ban.jpg'),
(10, 'Nhà Giả Kim', 'Paulo Coelho', 'NXB Văn Học', 130000.00, 'Tiểu thuyết nổi tiếng', 28, 1, 'nha-gia-kim.jpg'),
(11, 'Nỗi Buồn Chiến Tranh', 'Bảo Ninh', 'NXB Trẻ', 90000.00, 'Văn học chiến tranh', 8, 1, 'noi-buon-chien-tranh.jpg'),
(12, 'Sherlock Holmes - Toàn Tập (3 Tập)', 'Arthur Conan Doyle', 'NXB Văn Học', 360000.00, 'Truyện Trinh Thám', 14, 1, 'sherlock-holmes-toan-tap-3-tap.jpg'),
(13, 'Thiền cho người mới bắt đầu', 'Ian Tuhovsky', 'NXB Hồng Đức', 79000.00, 'Sách kỹ năng', 20, 2, 'thien-cho-nguoi-moi-bat-dau.jpg'),
(14, 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Nguyễn Nhật Ánh', 'NXB Trẻ', 85000.00, 'Tiểu thuyết thiếu niên nổi tiếng', 26, 1, 'toi-thay-hoa-vang-tren-co-xanh.jpg'),
(15, 'Tuổi Trẻ Đáng Giá Bao Nhiêu', 'Rosie Nguyễn', 'NXB Nhã Nam', 95000.00, 'Sách phát triển bản thân', 30, 2, 'tuoi-tre-dang-gia-bao-nhieu.jpg');

-- Users
CREATE TABLE `user` (
  `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` VARCHAR(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` ENUM('admin','client') NOT NULL DEFAULT 'client',
  PRIMARY KEY (`userID`),
  UNIQUE KEY `uniq_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories
CREATE TABLE `category` (
  `categoryID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `categoryName` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`categoryID`)
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

-- End of schema
