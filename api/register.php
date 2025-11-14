<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root"; // Thay bằng username MySQL của bạn
$password = "";     // Thay bằng password MySQL của bạn
$dbname = "booklovers";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Kết nối thất bại: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$name = isset($data['name']) ? trim($data['name']) : '';
$email = $data['email'];
$password = $data['password'];

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Kiểm tra email đã tồn tại
$sql = "SELECT * FROM user WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email đã tồn tại.']);
    $conn->close();
    exit;
}

// Thêm người dùng mới
$sql = "INSERT INTO user (name, email, password) VALUES ('$name', '$email', '$hashedPassword')";
if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $sql . '<br>' . $conn->error]);
}

$conn->close();
?>