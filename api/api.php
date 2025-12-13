<?php
session_start();
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cấu hình kết nối DB: ưu tiên biến môi trường, nếu không có dùng mặc định
$servername = getenv('MYSQL_HOST') ?: 'localhost';
$username = getenv('MYSQL_USER') ?: 'root';
$password = getenv('MYSQL_PASSWORD') ?: '';
$dbname = getenv('MYSQL_DATABASE') ?: 'booklovers';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Kết nối cơ sở dữ liệu thất bại: ' . $conn->connect_error]);
    exit;
}

$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Xử lý các endpoint API 
switch ($endpoint) {
    case 'books':
        if ($method == 'GET') {
            if (isset($_GET['id'])) {
                getBookById($conn, $_GET['id']);
            } elseif (isset($_GET['category'])) {
                getBooksByCategory($conn, $_GET['category']);
            } elseif (isset($_GET['search'])) {
                $searchTerm = $_GET['search']; // Lấy từ khóa
                $sql = "SELECT * FROM book WHERE title LIKE ? OR author LIKE ?";
                $stmt = $conn->prepare($sql);
                if ($stmt) {
                    $searchTerm = "%" . $searchTerm . "%"; // Thêm wildcard
                    $stmt->bind_param("ss", $searchTerm, $searchTerm);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    if ($result->num_rows > 0) {
                        $books = [];
                            while ($row = $result->fetch_assoc()) {
                                // Normalize image
                                $row['image'] = fixImagePath($row['image'] ?? null);
                                $books[] = $row;
                            }
                        echo json_encode($books);
                    } else {
                        http_response_code(404); // Not Found
                        echo json_encode(['error' => 'Không tìm thấy sách nào']);
                    }
                    $stmt->close();
                } else {
                    http_response_code(500); // Internal Server Error
                    echo json_encode(['error' => 'Lỗi truy vấn cơ sở dữ liệu: ' . $conn->error]);
                }
            } else {
                getBooks($conn);
            }
        } elseif ($method == 'POST') {
            createBook($conn, json_decode(file_get_contents("php://input"), true));
        } elseif ($method == 'PUT') {
            updateBook($conn, json_decode(file_get_contents("php://input"), true));
        } elseif ($method == 'DELETE') {
            deleteBook($conn, isset($_GET['id']) ? $_GET['id'] : null);
        } else {
            http_response_code(405); // Method Not Allowed
            echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
        }
        break;

    case 'upload':
        // Tải ảnh lên: multipart/form-data, trường 'image'
        if ($method == 'POST') {
            // xử lý upload
            if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../assets/images/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
                $tmp = $_FILES['image']['tmp_name'];
                $orig = basename($_FILES['image']['name']);
                // tạo tên file an toàn, giữ extension png/jpg/gif
                $ext = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
                $allowed = ['png','jpg','jpeg','gif'];
                if (!in_array($ext, $allowed)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Định dạng ảnh không được phép']);
                    exit;
                }
                $filename = uniqid('img_') . '.' . $ext;
                $dest = $uploadDir . $filename;
                if (move_uploaded_file($tmp, $dest)) {
                    echo json_encode(['filename' => $filename]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Không lưu được file']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Không có file được gửi']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không hợp lệ']);
        }
        break;

    case 'categories':
        if ($method == 'GET') {
            getCategories($conn);
        } elseif ($method == 'POST') {
            createCategory($conn, json_decode(file_get_contents("php://input"), true));
        } elseif ($method == 'PUT') {
            updateCategory($conn, json_decode(file_get_contents("php://input"), true));
        } elseif ($method == 'DELETE') {
            deleteCategory($conn, isset($_GET['id']) ? $_GET['id'] : null);
        }
        break;

    case 'users':
        if ($method == 'GET' && isset($_GET['userID'])) {
            getUserById($conn, $_GET['userID']); // Lấy thông tin người dùng theo userID
        } elseif ($method == 'GET') {
            getUsers($conn);
        } elseif ($method == 'POST') {
            createUser($conn, json_decode(file_get_contents("php://input"), true));
        } elseif ($method == 'PUT') {
            updateUser($conn, json_decode(file_get_contents("php://input"), true));
        } elseif ($method == 'DELETE') {
            deleteUser($conn, isset($_GET['id']) ? $_GET['id'] : null);
        }
        break;

    case 'order':
        if ($method == 'GET') {
            getOrders($conn);
        } elseif ($method == 'PUT') {
            updateOrder($conn, json_decode(file_get_contents("php://input"), true));
         }
        break;

    case 'review':
        if ($method == 'GET') {
            getReviews($conn);
        } elseif ($method == 'POST') {
            createReview($conn, json_decode(file_get_contents("php://input"), true));
        } elseif ($method == 'DELETE') {
            deleteReview($conn, isset($_GET['id']) ? $_GET['id'] : null);
        }
        break;

    case 'cart':
        if ($method == 'POST') {
            addToCart($conn, json_decode(file_get_contents("php://input"), true));
        } elseif ($method == 'GET') {
            getCartItems($conn, isset($_GET['userID']) ? $_GET['userID'] : null);
        } elseif ($method == 'PUT') {
            updateCartItem($conn, json_decode(file_get_contents("php://input"), true));
        } elseif ($method == 'DELETE') {
            deleteCartItem($conn, isset($_GET['cartItemID']) ? $_GET['cartItemID'] : null);
        } else {
            http_response_code(405); 
            echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
        }
        break;

    case 'checkout':
        if ($method == 'POST') {
            checkoutItems($conn, json_decode(file_get_contents("php://input"), true));
        } else {
            http_response_code(405); 
            echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
        }
        break;

    case 'purchased-books':
        if ($method == 'GET') {
            getPurchasedBooks($conn, isset($_GET['userID']) ? $_GET['userID'] : null);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
        }
        break;
    default:
        echo json_encode(['error' => 'Endpoint không hợp lệ']);
        exit;
}
$conn->close();

//Các hàm xử lý
/**
 * Normalize image value from DB (which may store only filename).
 * Returns a public path (absolute from web root) or null.
 */
function fixImagePath($image) {
    if (empty($image)) return null;
    // If already an absolute URL, keep it
    if (preg_match('#^https?://#i', $image)) return $image;
    // If starts with slash, assume public path already
    if (strpos($image, '/') === 0) return $image;
    // If contains directory separators, assume it's already a path
    if (strpos($image, '/') !== false) return $image;
    // Otherwise it's a bare filename -> prefix with public assets folder
    return '/assets/images/' . $image;
}

function getBooks($conn) {
    header('Content-Type: application/json');
    // Lấy sách kèm tên thể loại và sửa đường dẫn ảnh ngắn -> URL
    $sql = "SELECT b.bookID, b.title, b.author, b.publisher, b.bookPrice, b.stock, b.image, b.description, b.categoryID, c.categoryName
            FROM book b
            LEFT JOIN category c ON b.categoryID = c.categoryID";
    $result = $conn->query($sql);
    $books = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Normalize image field
            $row['image'] = fixImagePath($row['image'] ?? null);
            $books[] = $row;
        }
    }
    echo json_encode($books);
}

// Hàm getBookById
function getBookById($conn, $id) {
    header('Content-Type: application/json');
    $id = intval($id);
    $stmt = $conn->prepare("SELECT b.*, c.categoryName FROM book b LEFT JOIN category c ON b.categoryID = c.categoryID WHERE b.bookID = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $book = $result->fetch_assoc();
    $stmt->close();
    if ($book) $book['image'] = fixImagePath($book['image'] ?? null);
    echo json_encode($book);
}

// Hàm getBooksByCategory
function getBooksByCategory($conn, $category) {
    // Truy vấn theo categoryName hoặc categoryID
    header('Content-Type: application/json');
    $books = [];
    if (is_numeric($category)) {
        $stmt = $conn->prepare("SELECT b.*, c.categoryName FROM book b LEFT JOIN category c ON b.categoryID = c.categoryID WHERE b.categoryID = ?");
        $cid = intval($category);
        $stmt->bind_param('i', $cid);
    } else {
        $stmt = $conn->prepare("SELECT b.*, c.categoryName FROM book b LEFT JOIN category c ON b.categoryID = c.categoryID WHERE c.categoryName = ?");
        $cname = $category;
        $stmt->bind_param('s', $cname);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['image'] = fixImagePath($row['image'] ?? null);
            $books[] = $row;
        }
    }
    $stmt->close();
    echo json_encode($books);
}


// Hàm có chức năng tạo sách mới 
function createBook($conn, $data) {
    header('Content-Type: application/json');
    try {
        if (isset($data['title']) && isset($data['author']) && isset($data['publisher']) && (isset($data['categoryName']) || isset($data['categoryID'])) && isset($data['bookPrice']) && isset($data['stock'])) {
            $title = mysqli_real_escape_string($conn, $data['title']);
            $author = mysqli_real_escape_string($conn, $data['author']);
            $publisher = mysqli_real_escape_string($conn, $data['publisher']);
            // Xác định categoryID từ categoryID hoặc categoryName
            $categoryID = null;
            if (isset($data['categoryID'])) {
                $categoryID = intval($data['categoryID']);
            } else {
                $tmpName = mysqli_real_escape_string($conn, $data['categoryName']);
                $stmtCat = $conn->prepare("SELECT categoryID FROM category WHERE categoryName = ? LIMIT 1");
                $stmtCat->bind_param('s', $tmpName);
                $stmtCat->execute();
                $foundCatID = null;
                $stmtCat->bind_result($foundCatID);
                if ($stmtCat->fetch()) { $categoryID = $foundCatID; }
                $stmtCat->close();
            }
            // Các trường khác
            $bookPrice = floatval($data['bookPrice']);
            $stock = intval($data['stock']);
            $description = isset($data['description']) ? mysqli_real_escape_string($conn, $data['description']) : null;
            $image = isset($data['image']) ? mysqli_real_escape_string($conn, $data['image']) : null;
            // Lưu image là tên file ngắn
            if (!empty($image)) { $image = basename($image); }
            $sql = "INSERT INTO book (title, author, publisher, categoryID, bookPrice, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssidiss", $title, $author, $publisher, $categoryID, $bookPrice, $stock, $description, $image);
            // Thực thi và kiểm tra kết quả
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Sách đã được thêm thành công', 'bookID' => $stmt->insert_id]);
            } else {
                throw new Exception('Lỗi khi thêm sách: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            throw new Exception('Thiếu thông tin cần thiết để thêm sách');
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Hàm updateBook giúp cập nhật thông tin sách
function updateBook($conn, $data) {
    header('Content-Type: application/json');
    try {
        if (isset($data['bookID']) && isset($data['title']) && isset($data['author']) && isset($data['publisher']) && (isset($data['categoryName']) || isset($data['categoryID'])) && isset($data['bookPrice']) && isset($data['stock'])) {
            $bookID = intval($data['bookID']);
            $title = mysqli_real_escape_string($conn, $data['title']);
            $author = mysqli_real_escape_string($conn, $data['author']);
            $publisher = mysqli_real_escape_string($conn, $data['publisher']);
            // Xác định categoryID từ categoryID hoặc categoryName
            $categoryID = null;
            if (isset($data['categoryID'])) {
                $categoryID = intval($data['categoryID']);
            } else {
                $tmpName = mysqli_real_escape_string($conn, $data['categoryName']);
                $stmtCat = $conn->prepare("SELECT categoryID FROM category WHERE categoryName = ? LIMIT 1");
                $stmtCat->bind_param('s', $tmpName);
                $stmtCat->execute();
                $foundCatID = null;
                $stmtCat->bind_result($foundCatID);
                if ($stmtCat->fetch()) { $categoryID = $foundCatID; }
                $stmtCat->close();
            }
            $bookPrice = floatval($data['bookPrice']);
            $stock = intval($data['stock']);
            $description = isset($data['description']) ? mysqli_real_escape_string($conn, $data['description']) : null;
            $image = isset($data['image']) ? mysqli_real_escape_string($conn, $data['image']) : null;

            // Lưu image là tên file ngắn
            if (!empty($image)) { $image = basename($image); }
            $sql = "UPDATE book SET title = ?, author = ?, publisher = ?, categoryID = ?, bookPrice = ?, stock = ?, description = ?, image = ? WHERE bookID = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssidissi", $title, $author, $publisher, $categoryID, $bookPrice, $stock, $description, $image, $bookID);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Thông tin sách đã được cập nhật']);
            } else {
                throw new Exception('Lỗi khi cập nhật sách: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            throw new Exception('Thiếu thông tin cần thiết để cập nhật sách');
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Hàm deleteBook giúp xóa sách
function deleteBook($conn, $bookID) {
    header('Content-Type: application/json');
    if ($bookID !== null) {
        $bookID = intval($bookID);
        $stmt = $conn->prepare("DELETE FROM book WHERE bookID = ?");
        $stmt->bind_param("i", $bookID);
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['message' => 'Sách đã được xóa thành công']);
            } else {
                echo json_encode(['message' => 'Không tìm thấy sách để xóa']);
            }
        } else {
            echo json_encode(['error' => 'Lỗi khi xóa sách: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu ID sách để xóa']);
    }
}

// Hàm getCategories giúp lấy danh sách thể loại
function getCategories($conn) {
    header('Content-Type: application/json');
    $sql = "SELECT categoryID, categoryName, description FROM category";
    $result = $conn->query($sql);
    $categories = [];
    if ($result) {
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $categories[] = $row;
            }
        }
        echo json_encode($categories);
    } else {
        echo json_encode(['error' => 'Lỗi truy vấn cơ sở dữ liệu: ' . $conn->error]);
    }
}

// Hàm createCategory giúp thêm thể loại mới
function createCategory($conn, $data) {
    header('Content-Type: application/json');
    if (isset($data['categoryName'])) {
        $categoryName = mysqli_real_escape_string($conn, $data['categoryName']);
        $description = isset($data['description']) ? mysqli_real_escape_string($conn, $data['description']) : null;
        $sql = "INSERT INTO category (categoryName, description) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $categoryName, $description);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Thể loại đã được thêm thành công', 'categoryID' => $stmt->insert_id]);
        } else {
            echo json_encode(['error' => 'Lỗi khi thêm thể loại: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu tên thể loại']);
    }
}

// Hàm updateCategory giúp cập nhật thể loại
function updateCategory($conn, $data) {
    header('Content-Type: application/json');
    if (isset($data['categoryID']) && isset($data['categoryName'])) {
        $categoryID = intval($data['categoryID']);
        $categoryName = mysqli_real_escape_string($conn, $data['categoryName']);
        $description = isset($data['description']) ? mysqli_real_escape_string($conn, $data['description']) : null;
        $sql = "UPDATE category SET categoryName = ?, description = ? WHERE categoryID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $categoryName, $description, $categoryID);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Thông tin thể loại đã được cập nhật']);
        } else {
            echo json_encode(['error' => 'Lỗi khi cập nhật thể loại: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu thông tin cần thiết để cập nhật thể loại']);
    }
}

// Hàm deleteCategory giúp xóa thể loại
function deleteCategory($conn, $categoryID) {
    header('Content-Type: application/json');
    if ($categoryID !== null) {
        $categoryID = intval($categoryID);
        $stmt = $conn->prepare("DELETE FROM category WHERE categoryID = ?");
        $stmt->bind_param("i", $categoryID);
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['message' => 'Thể loại đã được xóa thành công']);
            } else {
                echo json_encode(['message' => 'Không tìm thấy thể loại để xóa']);
            }
        } else {
            echo json_encode(['error' => 'Lỗi khi xóa thể loại: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu ID thể loại để xóa']);
    }
}

// Hàm getUsers giúp lấy danh sách người dùng
function getUsers($conn) {
    header('Content-Type: application/json');
    $sql = "SELECT userID, name, email, role FROM user";
    $result = $conn->query($sql);
    $users = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    echo json_encode($users);
}

// Hàm getUserById giúp lấy thông tin người dùng theo userID
function getUserById($conn, $userID) {
    $userID = intval($userID);
    $stmt = $conn->prepare("SELECT userID, name, email, address, phone FROM user WHERE userID = ?");
    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    echo json_encode($user);
}

// Hàm createUser giúp thêm người dùng mới
function createUser($conn, $data) {
    header('Content-Type: application/json');
    if (isset($data['name']) && isset($data['email']) && isset($data['password']) && isset($data['role'])) {
        $name = mysqli_real_escape_string($conn, $data['name']);
        $email = mysqli_real_escape_string($conn, $data['email']);
        $password = password_hash($data['password'], PASSWORD_DEFAULT); // Mã hóa mật khẩu
        $address = isset($data['address']) ? mysqli_real_escape_string($conn, $data['address']) : null;
        $phone = isset($data['phone']) ? mysqli_real_escape_string($conn, $data['phone']) : null;
        $role = mysqli_real_escape_string($conn, $data['role']);

        $sql = "INSERT INTO user (name, email, password, address, phone, role) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssss", $name, $email, $password, $address, $phone, $role);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Người dùng đã được thêm thành công', 'userID' => $stmt->insert_id]);
        } else {
            echo json_encode(['error' => 'Lỗi khi thêm người dùng: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu thông tin cần thiết để thêm người dùng (name, email, password, role)']);
    }
}

// Hàm updateUser giúp cập nhật thông tin người dùng
function updateUser($conn, $data) {
    header('Content-Type: application/json');
    if (isset($data['userID']) && isset($data['name']) && isset($data['email']) && isset($data['role'])) {
        $userID = intval($data['userID']);
        $name = mysqli_real_escape_string($conn, $data['name']);
        $email = mysqli_real_escape_string($conn, $data['email']);
        $password = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : null; // Mã hóa nếu có mật khẩu mới
        $address = isset($data['address']) ? mysqli_real_escape_string($conn, $data['address']) : null;
        $phone = isset($data['phone']) ? mysqli_real_escape_string($conn, $data['phone']) : null;
        $role = mysqli_real_escape_string($conn, $data['role']);

        $sql = "UPDATE user SET name = ?, email = ?, role = ?, address = ?, phone = ?";
        $params = "sssss";
        $bindParams = [$name, $email, $role, $address, $phone];

        if ($password !== null) {
            $sql .= ", password = ?";
            $params .= "s";
            $bindParams[] = $password;
        }

        $sql .= " WHERE userID = ?";
        $params .= "i";
        $bindParams[] = $userID;

        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            echo json_encode(['error' => 'Lỗi chuẩn bị truy vấn: ' . $conn->error]);
            return;
        }

        // bind_param requires parameters by reference; build an array of references
        $refs = [];
        $refs[] = & $params;
        foreach ($bindParams as $key => $value) {
            $refs[] = & $bindParams[$key];
        }
        call_user_func_array([$stmt, 'bind_param'], $refs);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Thông tin người dùng đã được cập nhật']);
        } else {
            echo json_encode(['error' => 'Lỗi khi cập nhật người dùng: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu thông tin cần thiết để cập nhật người dùng (userID, name, email, role)']);
    }
}

// Hàm deleteUser
function deleteUser($conn, $userID) {
    header('Content-Type: application/json');
    if ($userID !== null) {
        $userID = intval($userID);
        $stmt = $conn->prepare("DELETE FROM user WHERE userID = ?");
        $stmt->bind_param("i", $userID);
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['message' => 'Người dùng đã được xóa thành công']);
            } else {
                echo json_encode(['message' => 'Không tìm thấy người dùng để xóa']);
            }
        } else {
            echo json_encode(['error' => 'Lỗi khi xóa người dùng: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu ID người dùng để xóa']);
    }
}

// Hàm getOrders
function getOrders($conn) {
    header('Content-Type: application/json');
    $sql = "SELECT orderID, userID, order_date, total_amount, shipping_address, order_status FROM `order`";
    $result = $conn->query($sql);
    $orders = [];
    if ($result) {
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $orders[] = $row;
            }
        }
        echo json_encode($orders);
    } else {
        echo json_encode(['error' => 'Lỗi truy vấn cơ sở dữ liệu: ' . $conn->error]);
    }
}

// Hàm updateOrder
function updateOrder($conn, $data) {
    header('Content-Type: application/json');
    if (isset($data['orderID']) && isset($data['order_status'])) {
        $orderID = intval($data['orderID']);
        $orderStatus = mysqli_real_escape_string($conn, $data['order_status']);

        $sql = "UPDATE `order` SET order_status = ? WHERE orderID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $orderStatus, $orderID);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Trạng thái đơn hàng đã được cập nhật']);
        } else {
            echo json_encode(['error' => 'Lỗi khi cập nhật trạng thái đơn hàng: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu thông tin cần thiết để cập nhật trạng thái đơn hàng (orderID, order_status)']);
    }
}

// Hàm getReviews giúp lấy đánh giá
function getReviews($conn) {
    header('Content-Type: application/json');
    // If caller requests a summary, return aggregated reviews per book
    if (isset($_GET['summary']) && ($_GET['summary'] == '1' || strtolower($_GET['summary']) === 'true')) {
        // Truy vấn tổng hợp: đếm số đánh giá và tính điểm trung bình cho mỗi sách
        $sql = "SELECT r.bookID, COUNT(*) AS review_count, ROUND(AVG(r.rating),2) AS avg_rating, b.title, b.image
                FROM review r
                LEFT JOIN book b ON r.bookID = b.bookID
                GROUP BY r.bookID
                ORDER BY review_count DESC";
        $result = $conn->query($sql);
        $out = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $row['image'] = fixImagePath($row['image'] ?? null);
                // cast numeric fields
                $row['review_count'] = intval($row['review_count']);
                $row['avg_rating'] = floatval($row['avg_rating']);
                $out[] = $row;
            }
            echo json_encode($out);
            return;
        } else {
            echo json_encode(['error' => 'Lỗi truy vấn cơ sở dữ liệu: ' . $conn->error]);
            return;
        }
    }

    // Default: return raw reviews
    $sql = "SELECT reviewID, bookID, userID, rating, comment, created_at FROM review";
    $result = $conn->query($sql);
    $reviews = [];
    if ($result) {
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $reviews[] = $row;
            }
        }
        echo json_encode($reviews);
    } else {
        echo json_encode(['error' => 'Lỗi truy vấn cơ sở dữ liệu: ' . $conn->error]);
    }
}

// Hàm deleteReview giúp xóa đánh giá
function deleteReview($conn, $reviewID) {
    header('Content-Type: application/json');
    if ($reviewID !== null) {
        $reviewID = intval($reviewID);
        $stmt = $conn->prepare("DELETE FROM review WHERE reviewID = ?");
        $stmt->bind_param("i", $reviewID);
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['message' => 'Đánh giá đã được xóa thành công']);
            } else {
                echo json_encode(['message' => 'Không tìm thấy đánh giá để xóa']);
            }
        } else {
            echo json_encode(['error' => 'Lỗi khi xóa đánh giá: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu ID đánh giá để xóa']);
    }
}

// Hàm createReview giúp thêm đánh giá mới
function createReview($conn, $data) {
    header('Content-Type: application/json');
    try {
        if (isset($data['bookID']) && isset($data['userID']) && isset($data['rating'])) {
            $bookID = intval($data['bookID']);
            $userID = intval($data['userID']);
            $rating = intval($data['rating']);
            $comment = isset($data['comment']) ? mysqli_real_escape_string($conn, $data['comment']) : null;

            if ($rating < 1 || $rating > 5) {
                throw new Exception('Đánh giá phải từ 1 đến 5 sao');
            }

            $sql = "INSERT INTO review (bookID, userID, rating, comment) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("iiis", $bookID, $userID, $rating, $comment);
            
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Đánh giá đã được gửi thành công', 'reviewID' => $stmt->insert_id]);
            } else {
                throw new Exception('Lỗi khi gửi đánh giá: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            throw new Exception('Thiếu thông tin cần thiết (bookID, userID, rating)');
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Hàm thêm sách vào giỏ hàng 
function addToCart($conn, $data) {
    header('Content-Type: application/json');
    try {
        if (isset($data['bookID']) && isset($data['quantity']) && isset($data['userID'])) {
            $bookID = intval($data['bookID']);
            $quantity = intval($data['quantity']);
            $userID = intval($data['userID']);

            // Kiểm tra xem sách có đủ số lượng trong kho hay không
            $sql = "SELECT stock FROM book WHERE bookID = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $bookID);
            $stmt->execute();
            $stock = 0;
            $stmt->bind_result($stock);
            $stmt->fetch();
            $stmt->close();

            if ($stock >= $quantity) {
                // Kiểm tra xem giỏ hàng của user đã tồn tại chưa
                $sql = "SELECT cartID FROM cart WHERE userID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $userID);
                $stmt->execute();
                $cartID = null;
                $stmt->bind_result($cartID);
                $stmt->fetch();
                $stmt->close();

                if (!$cartID) {
                    // Nếu giỏ hàng chưa tồn tại, tạo mới
                    $sql = "INSERT INTO cart (userID, created_at) VALUES (?, NOW())";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("i", $userID);
                    $stmt->execute();
                    $cartID = $conn->insert_id;
                    $stmt->close();
                }

                // Kiểm tra xem sách đã có trong giỏ hàng chưa
                $sql = "SELECT cartItemID FROM cart_item WHERE cartID = ? AND bookID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ii", $cartID, $bookID);
                $stmt->execute();
                $stmt->store_result();
                if ($stmt->num_rows > 0) {
                    // Nếu sách đã có trong giỏ hàng, cập nhật số lượng
                    $sql = "UPDATE cart_item SET quantity = quantity + ? WHERE cartID = ? AND bookID = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("iii", $quantity, $cartID, $bookID);
                } else {
                    // Nếu sách chưa có trong giỏ hàng, thêm mới
                    $sql = "INSERT INTO cart_item (cartID, bookID, quantity) VALUES (?, ?, ?)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("iii", $cartID, $bookID, $quantity);
                }
                $stmt->execute();
                $stmt->close();

                // Cập nhật số lượng sách trong kho
                $newStock = $stock - $quantity;
                $sql = "UPDATE book SET stock = ? WHERE bookID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ii", $newStock, $bookID);
                if ($stmt->execute()) {
                    echo json_encode(['message' => 'Thêm vào giỏ hàng thành công!']);
                } else {
                    throw new Exception('Lỗi khi cập nhật kho: ' . $stmt->error);
                }
                $stmt->close();
            } else {
                throw new Exception('Không đủ số lượng sách trong kho.');
            }
        } else {
            throw new Exception('Thiếu thông tin cần thiết.');
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Hàm getCartItems giúp lấy các mục trong giỏ hàng
function getCartItems($conn, $userID = null) {
    header('Content-Type: application/json');
    if ($userID) {
        $sql = "SELECT cart_item.*, book.title, book.bookPrice, book.image FROM cart_item JOIN book ON cart_item.bookID = book.bookID JOIN cart ON cart_item.cartID = cart.cartID WHERE cart.userID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userID);
    } else {
        $sql = "SELECT cart_item.*, book.title, book.bookPrice, book.image FROM cart_item JOIN book ON cart_item.bookID = book.bookID";
        $stmt = $conn->prepare($sql);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $cartItems = [];
    while ($row = $result->fetch_assoc()) {
        // Normalize book image on cart items
        if (isset($row['image'])) $row['image'] = fixImagePath($row['image']);
        $cartItems[] = $row;
    }
    echo json_encode($cartItems);
    $stmt->close();
}

// Hàm updateCartItem giúp cập nhật số lượng mục trong giỏ hàng
function updateCartItem($conn, $data) {
    header('Content-Type: application/json');
    try {
        if (isset($data['cartItemID']) && isset($data['quantity'])) {
            $cartItemID = intval($data['cartItemID']);
            $quantity = intval($data['quantity']);

            $sql = "UPDATE cart_item SET quantity = ? WHERE cartItemID = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $quantity, $cartItemID);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Cập nhật giỏ hàng thành công!']);
            } else {
                throw new Exception('Lỗi khi cập nhật giỏ hàng: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            throw new Exception('Thiếu thông tin cần thiết.');
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Hàm deleteCartItem giúp xóa mục khỏi giỏ hàng
function deleteCartItem($conn, $cartItemID) {
    header('Content-Type: application/json');
    if ($cartItemID) {
        // Lấy bookID và quantity của item bị xóa
        $sql = "SELECT bookID, quantity FROM cart_item WHERE cartItemID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $cartItemID);
        $stmt->execute();
        $bookID = null;
        $quantity = null;
        $stmt->bind_result($bookID, $quantity);
        $stmt->fetch();
        $stmt->close();

        // Cập nhật số lượng sách trong kho
        $sql = "UPDATE book SET stock = stock + ? WHERE bookID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $quantity, $bookID);
        if ($stmt->execute()) {
            // Xóa item khỏi giỏ hàng
            $sql = "DELETE FROM cart_item WHERE cartItemID = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $cartItemID);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Xóa khỏi giỏ hàng thành công!']);
            } else {
                echo json_encode(['error' => 'Lỗi khi xóa khỏi giỏ hàng: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(['error' => 'Lỗi khi cập nhật kho: ' . $stmt->error]);
        }
    } else {
        echo json_encode(['error' => 'Thiếu cartItemID.']);
    }
}

// Hàm checkoutItems giúp thanh toán các mục trong giỏ hàng
function checkoutItems($conn, $data) {
    header('Content-Type: application/json');
    try {
        if (isset($data['cartItemIDs']) && is_array($data['cartItemIDs']) && !empty($data['cartItemIDs'])) {
            $cartItemIDs = $data['cartItemIDs'];
            $userID = isset($data['userID']) ? intval($data['userID']) : null;
            $shippingAddress = isset($data['shippingAddress']) ? mysqli_real_escape_string($conn, $data['shippingAddress']) : '';

            if (!$userID) throw new Exception('Thiếu userID');

            // 1. Tính tổng số tiền và lấy thông tin các mục đặt hàng
            $totalAmount = 0;
            $itemsToOrder = [];
            
            // Tạo placeholders cho truy vấn IN
            $placeholders = implode(',', array_fill(0, count($cartItemIDs), '?'));
            $types = str_repeat('i', count($cartItemIDs));
            
            // Truy vấn để lấy thông tin các mục trong giỏ hàng
            $sql = "SELECT ci.cartItemID, ci.bookID, ci.quantity, b.bookPrice 
                    FROM cart_item ci 
                    JOIN book b ON ci.bookID = b.bookID 
                    WHERE ci.cartItemID IN ($placeholders)";
            
            $stmt = $conn->prepare($sql);
            if ($stmt === false) throw new Exception('Lỗi chuẩn bị truy vấn: ' . $conn->error);
            $refs = [];
            $refs[] = & $types;
            foreach ($cartItemIDs as $k => $v) {
                $cartItemIDs[$k] = intval($v);
                $refs[] = & $cartItemIDs[$k];
            }
            call_user_func_array([$stmt, 'bind_param'], $refs);
            $stmt->execute();
            $result = $stmt->get_result();
            // Tính tổng và lưu thông tin mục đặt hàng
            while ($row = $result->fetch_assoc()) {
                $itemsToOrder[] = $row;
                $totalAmount += $row['quantity'] * $row['bookPrice'];
            }
            $stmt->close();

            if (empty($itemsToOrder)) throw new Exception('Không tìm thấy sản phẩm trong giỏ hàng');

            // 2. Tạo đơn hàng mới
            $sql = "INSERT INTO `order` (userID, total_amount, shipping_address, order_status) VALUES (?, ?, ?, 'Pending')";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ids", $userID, $totalAmount, $shippingAddress);
            if (!$stmt->execute()) throw new Exception('Lỗi khi tạo đơn hàng: ' . $stmt->error);
            $orderID = $stmt->insert_id;
            $stmt->close();

            // 3. thêm từng mục vào order_item và xóa khỏi cart_item
            foreach ($itemsToOrder as $item) {
                // Insert into order_item
                $sql = "INSERT INTO order_item (orderID, bookID, quantity, price) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("iiid", $orderID, $item['bookID'], $item['quantity'], $item['bookPrice']);
                $stmt->execute();
                $stmt->close();

                // Delete from cart_item
                $sql = "DELETE FROM cart_item WHERE cartItemID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $item['cartItemID']);
                $stmt->execute();
                $stmt->close();
            }

            echo json_encode(['message' => 'Đặt hàng thành công', 'orderID' => $orderID]);

        } else {
            throw new Exception('Thiếu danh sách sản phẩm (cartItemIDs)');
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Hàm getPurchasedBooks giúp lấy danh sách sách đã mua của người dùng
function getPurchasedBooks($conn, $userID) {
    header('Content-Type: application/json');
    if ($userID) {
        $userID = intval($userID);
        $sql = "SELECT DISTINCT b.bookID, b.title, b.author, b.bookPrice, b.image, o.order_date
                FROM `order` o
                JOIN `order_item` oi ON o.orderID = oi.orderID
                JOIN `book` b ON oi.bookID = b.bookID
                WHERE o.userID = ?
                ORDER BY o.order_date DESC";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        $books = [];
        while ($row = $result->fetch_assoc()) {
            $row['image'] = fixImagePath($row['image'] ?? null);
            $books[] = $row;
        }
        echo json_encode($books);
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Thiếu userID']);
    }
}