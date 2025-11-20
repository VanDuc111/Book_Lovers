<?php
header('Content-Type: application/json');

// Cấu hình DB: dùng biến môi trường khi chạy trong Docker
$servername = getenv('MYSQL_HOST') ?: 'localhost';
$username = getenv('MYSQL_USER') ?: 'root';
$password = getenv('MYSQL_PASSWORD') ?: '';
$dbname = getenv('MYSQL_DATABASE') ?: 'booklovers';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Kết nối thất bại: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$name = isset($data['name']) ? trim($data['name']) : '';
$email = $data['email'];
$password = $data['password'];

// Mã hóa mật khẩu
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Kiểm tra email đã tồn tại (prepared statement)
$stmt = $conn->prepare('SELECT userID FROM user WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email đã tồn tại.']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Thêm người dùng mới với role = 'client'
$role = 'client'; 
$stmt = $conn->prepare('INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)');
$stmt->bind_param('ssss', $name, $email, $hashedPassword, $role);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $stmt->error]);
}
$stmt->close();

$conn->close();
?>