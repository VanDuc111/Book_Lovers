<?php
session_start();
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "booklovers";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Kết nối cơ sở dữ liệu thất bại: ' . $conn->connect_error]);
    exit;
}

$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';
$method = $_SERVER['REQUEST_METHOD'];

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
    default:
        echo json_encode(['error' => 'Endpoint không hợp lệ']);
        exit;
}
$conn->close();

//Các hàm xử lý
function getBooks($conn) {
    header('Content-Type: application/json');
    $sql = "SELECT bookID, title, author, publisher, bookPrice, stock, categoryName, image, description
            FROM book";
    $result = $conn->query($sql);
    $books = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $books[] = $row;
        }
    }
    echo json_encode($books);
}

// Hàm getBookById
function getBookById($conn, $id) {
    header('Content-Type: application/json');
    $id = intval($id);
    $stmt = $conn->prepare("SELECT * FROM book WHERE bookID = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $book = $result->fetch_assoc();
    $stmt->close();
    echo json_encode($book);
}

// Hàm getBooksByCategory
function getBooksByCategory($conn, $categoryName) {
    $categoryName = mysqli_real_escape_string($conn, $categoryName);
    $sql = "SELECT * FROM book WHERE categoryName = '$categoryName'"; // Sử dụng categoryName
    $result = $conn->query($sql);
    $books = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $books[] = $row;
        }
    }
    header('Content-Type: application/json');
    echo json_encode($books);
}


// Hàm createBook
function createBook($conn, $data) {
    header('Content-Type: application/json');
    try {
        if (isset($data['title']) && isset($data['author']) && isset($data['publisher']) && isset($data['categoryName']) && isset($data['bookPrice']) && isset($data['stock'])) {
            $title = mysqli_real_escape_string($conn, $data['title']);
            $author = mysqli_real_escape_string($conn, $data['author']);
            $publisher = mysqli_real_escape_string($conn, $data['publisher']);
            $categoryName = mysqli_real_escape_string($conn, $data['categoryName']);
            $bookPrice = floatval($data['bookPrice']);
            $stock = intval($data['stock']);
            $description = isset($data['description']) ? mysqli_real_escape_string($conn, $data['description']) : null;
            $image = isset($data['image']) ? mysqli_real_escape_string($conn, $data['image']) : null;

            $sql = "INSERT INTO book (title, author, publisher, categoryName, bookPrice, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssdiss", $title, $author, $publisher, $categoryName, $bookPrice, $stock, $description, $image);
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

// Hàm updateBook
function updateBook($conn, $data) {
    header('Content-Type: application/json');
    try {
        if (isset($data['bookID']) && isset($data['title']) && isset($data['author']) && isset($data['publisher']) && isset($data['categoryName']) && isset($data['bookPrice']) && isset($data['stock'])) {
            $bookID = intval($data['bookID']);
            $title = mysqli_real_escape_string($conn, $data['title']);
            $author = mysqli_real_escape_string($conn, $data['author']);
            $publisher = mysqli_real_escape_string($conn, $data['publisher']);
            $categoryName = mysqli_real_escape_string($conn, $data['categoryName']);
            $bookPrice = floatval($data['bookPrice']);
            $stock = intval($data['stock']);
            $description = isset($data['description']) ? mysqli_real_escape_string($conn, $data['description']) : null;
            $image = isset($data['image']) ? mysqli_real_escape_string($conn, $data['image']) : null;

            $sql = "UPDATE book SET title = ?, author = ?, publisher = ?, categoryName = ?, bookPrice = ?, stock = ?, description = ?, image = ? WHERE bookID = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssdssssi", $title, $author, $publisher, $categoryName, $bookPrice, $stock, $description, $image, $bookID);
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

// Hàm deleteBook
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

// Hàm getCategories
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

// Hàm createCategory
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

// Hàm updateCategory
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

// Hàm deleteCategory
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

// Hàm getUsers
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

// Hàm getUserById
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

// Hàm createUser
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

// Hàm updateUser
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
        $stmt->bind_param($params, ...$bindParams); // Sử dụng ... để truyền mảng làm tham số
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

// Hàm getReviews
function getReviews($conn) {
    header('Content-Type: application/json');
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

// Hàm deleteReview
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
            $stmt->bind_result($stock);
            $stmt->fetch();
            $stmt->close();

            if ($stock >= $quantity) {
                // Kiểm tra xem giỏ hàng của user đã tồn tại chưa
                $sql = "SELECT cartID FROM cart WHERE userID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $userID);
                $stmt->execute();
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
        $cartItems[] = $row;
    }
    echo json_encode($cartItems);
    $stmt->close();
}

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

function deleteCartItem($conn, $cartItemID) {
    header('Content-Type: application/json');
    if ($cartItemID) {
        // Lấy bookID và quantity của item bị xóa
        $sql = "SELECT bookID, quantity FROM cart_item WHERE cartItemID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $cartItemID);
        $stmt->execute();
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

function checkoutItems($conn, $data) {
    header('Content-Type: application/json');
    try {
        if (isset($data['cartItemIDs']) && is_array($data['cartItemIDs'])) {
            $cartItemIDs = $data['cartItemIDs'];

            // Lấy thông tin cartItems
            $sql = "SELECT cart_item.*, book.stock, book.bookPrice, cart.userID FROM cart_item JOIN book ON cart_item.bookID = book.bookID JOIN cart ON cart_item.cartID = cart.cartID WHERE cartItemID IN (" . implode(',', $cartItemIDs) . ")";
            $result = $conn->query($sql);
            $cartItems = $result->fetch_all(MYSQLI_ASSOC);

            // Kiểm tra số lượng sách trong kho
            foreach ($cartItems as $item) {
                if ($item['stock'] < $item['quantity']) {
                    throw new Exception('Không đủ số lượng sách trong kho cho sản phẩm: ' . $item['bookID']);
                }
            }

            // Tính toán total_amount
            $totalAmount = 0;
            foreach ($cartItems as $item) {
                $totalAmount += $item['bookPrice'] * $item['quantity'];
            }

            // Tạo đơn hàng mới
            $sql = "INSERT INTO `order` (userID, order_date, total_amount, shipping_address, order_status) VALUES (?, NOW(), ?, ?, 'pending')";
            $stmt = $conn->prepare($sql);
            $shippingAddress = "Địa chỉ mặc định"; // Thay thế bằng địa chỉ thực tế
            $stmt->bind_param("ids", $cartItems[0]['userID'], $totalAmount, $shippingAddress);
            $stmt->execute();
            $orderID = $conn->insert_id;
            $stmt->close();

            // Thêm order_items
            foreach ($cartItems as $item) {
                $sql = "INSERT INTO order_item (orderID, bookID, quantity, price) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("iiid", $orderID, $item['bookID'], $item['quantity'], $item['bookPrice']);
                $stmt->execute();
                $stmt->close();

                // Cập nhật số lượng sách trong kho
                $sql = "UPDATE book SET stock = stock - ? WHERE bookID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ii", $item['quantity'], $item['bookID']);
                $stmt->execute();
                $stmt->close();

                // Xóa cart_item đã thanh toán
                $sql = "DELETE FROM cart_item WHERE cartItemID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $item['cartItemID']);
                $stmt->execute();
                $stmt->close();
            }

            echo json_encode(['message' => 'Thanh toán thành công!']);
        } else {
            throw new Exception('Thiếu thông tin cần thiết.');
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}


?>