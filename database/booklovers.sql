-- Consolidated dump for Booklovers
-- Tables use plural names for Laravel conventions and utf8mb4 charset
-- Import this single file into phpMyAdmin

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Create and select database
CREATE DATABASE IF NOT EXISTS `booklovers` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `booklovers`;

-- --------------------------------------------------------

-- Table structure for table `books`

CREATE TABLE `books` (
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

-- Dumping data for table `books`

INSERT INTO `books` (`bookID`, `title`, `author`, `publisher`, `bookPrice`, `description`, `stock`, `categoryID`, `image`) VALUES
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

-- --------------------------------------------------------

-- Table structure for table `carts`

CREATE TABLE `carts` (
  `cartID` int UNSIGNED NOT NULL,
  `userID` int UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `carts`

INSERT INTO `carts` (`cartID`, `userID`, `created_at`) VALUES
(1, 1, '2025-11-20 04:39:10'),
(2, 2, '2025-11-20 11:05:01');

-- --------------------------------------------------------

-- Table structure for table `cart_items`

CREATE TABLE `cart_items` (
  `cartItemID` int UNSIGNED NOT NULL,
  `cartID` int UNSIGNED NOT NULL,
  `bookID` int UNSIGNED NOT NULL,
  `quantity` int UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `cart_items`

INSERT INTO `cart_items` (`cartItemID`, `cartID`, `bookID`, `quantity`) VALUES
(3, 2, 2, 1),
(4, 1, 2, 1);

-- --------------------------------------------------------

-- Table structure for table `categories`

CREATE TABLE `categories` (
  `categoryID` int UNSIGNED NOT NULL,
  `categoryName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `categories`

INSERT INTO `categories` (`categoryID`, `categoryName`, `description`) VALUES
(1, 'Văn Học', 'Tiểu thuyết, truyện, sách văn học'),
(2, 'Phát triển bản thân', 'Sách phát triển, động lực, hướng nghiệp'),
(3, 'Kiến thức & Kinh tế', 'Sách kinh tế, marketing'),
(4, 'Thiếu nhi', 'Sách cho trẻ em, truyện');

-- --------------------------------------------------------

-- Table structure for table `orders`

CREATE TABLE `orders` (
  `orderID` int UNSIGNED NOT NULL,
  `userID` int UNSIGNED DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_status` enum('Pending','Processing','Shipped','Delivered','Cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `orders`

INSERT INTO `orders` (`orderID`, `userID`, `order_date`, `total_amount`, `shipping_address`, `order_status`) VALUES
(1, 1, '2025-12-13 07:57:57', 150000.00, 'Địa chỉ mặc định', 'Processing'),
(2, 1, '2025-12-13 13:42:25', 198000.00, '', 'Pending'),
(3, 1, '2025-12-13 13:42:33', 180000.00, '', 'Pending');

-- --------------------------------------------------------

-- Table structure for table `order_items`

CREATE TABLE `order_items` (
  `orderItemID` int UNSIGNED NOT NULL,
  `orderID` int UNSIGNED DEFAULT NULL,
  `bookID` int UNSIGNED NOT NULL,
  `quantity` int UNSIGNED NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `order_items`

INSERT INTO `order_items` (`orderItemID`, `orderID`, `bookID`, `quantity`, `price`) VALUES
(1, 1, 3, 1, 150000.00),
(2, 2, 1, 2, 99000.00),
(3, 3, 6, 3, 60000.00);

-- --------------------------------------------------------

-- Table structure for table `reviews`

CREATE TABLE `reviews` (
  `reviewID` int UNSIGNED NOT NULL,
  `bookID` int UNSIGNED NOT NULL,
  `userID` int UNSIGNED NOT NULL,
  `rating` tinyint UNSIGNED NOT NULL DEFAULT '5',
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `reviews`

INSERT INTO `reviews` (`reviewID`, `bookID`, `userID`, `rating`, `comment`, `created_at`) VALUES
(1, 3, 1, 3, 'Hay tuyệt cú mèo', '2025-12-13 09:28:11'),
(2, 6, 1, 4, 'okokok', '2025-12-13 13:42:55');

-- --------------------------------------------------------

-- Table structure for table `users`

CREATE TABLE `users` (
  `userID` int UNSIGNED NOT NULL,
  `name` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`

INSERT INTO `users` (`userID`, `name`, `email`, `password`, `address`, `phone`, `role`, `created_at`) VALUES
(1, 'Admin', 'admin@example.com', '$2y$10$GIeugSmmHoVJyMCjicCeRuDS3yZwUMuMdItlyrdMyFJZMFc4Ujj.S', '', '', 'admin', '2025-11-19 13:23:58'),
(2, 'Client One', 'client1@example.com', '$2y$10$zR7snQhZSYLM5fXgY05SieU.9A2cWS98NXAwjGZbZ4ZSfmTWcY1DO', 'Hanoi', '0987654321', 'client', '2025-11-19 13:23:58'),
(3, 'Client Two', 'client2@example.com', '$2y$10$cx7CvmFaa.aRSNwgwarLh.U6DKj9uO1/C6UxTgS./I6lks0h.r0sW', NULL, NULL, 'client', '2025-11-19 13:23:58');

--
-- Indexes and keys
--

ALTER TABLE `books`
  ADD PRIMARY KEY (`bookID`),
  ADD KEY `fk_book_category` (`categoryID`),
  ADD KEY `idx_book_title` (`title`(50));

ALTER TABLE `carts`
  ADD PRIMARY KEY (`cartID`),
  ADD KEY `fk_cart_user` (`userID`);

ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cartItemID`),
  ADD KEY `fk_cartitem_cart` (`cartID`),
  ADD KEY `fk_cartitem_book` (`bookID`);

ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryID`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderID`),
  ADD KEY `fk_order_user` (`userID`),
  ADD KEY `idx_order_user_date` (`userID`,`order_date`);

ALTER TABLE `order_items`
  ADD PRIMARY KEY (`orderItemID`),
  ADD KEY `fk_orderitem_order` (`orderID`),
  ADD KEY `fk_orderitem_book` (`bookID`);

ALTER TABLE `reviews`
  ADD PRIMARY KEY (`reviewID`),
  ADD KEY `fk_review_book` (`bookID`),
  ADD KEY `fk_review_user` (`userID`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `uk_user_email` (`email`);

-- AUTO_INCREMENT

ALTER TABLE `books`
  MODIFY `bookID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `carts`
  MODIFY `cartID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `cart_items`
  MODIFY `cartItemID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `categories`
  MODIFY `categoryID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `orders`
  MODIFY `orderID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `order_items`
  MODIFY `orderItemID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `reviews`
  MODIFY `reviewID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `users`
  MODIFY `userID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- Constraints (foreign keys) adjusted to plural table names

ALTER TABLE `books`
  ADD CONSTRAINT `fk_book_category` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`categoryID`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `carts`
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cartitem_book` FOREIGN KEY (`bookID`) REFERENCES `books` (`bookID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cartID`) REFERENCES `carts` (`cartID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_orderitem_book` FOREIGN KEY (`bookID`) REFERENCES `books` (`bookID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`orderID`) REFERENCES `orders` (`orderID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_book` FOREIGN KEY (`bookID`) REFERENCES `books` (`bookID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
