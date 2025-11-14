<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "booklovers";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Kết nối thất bại: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$password = $data['password'];

// Sử dụng prepared statements để tránh SQL injection
$stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        // Trả về thông tin người dùng trong phản hồi JSON
        echo json_encode([
            'success' => true,
            'user' => [
                'userID' => $row['userID'],
                'name' => $row['name'],
                'email' => $row['email'],
                'role' => $row['role']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Mật khẩu không đúng.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Email không tồn tại.']);
}

$stmt->close();
$conn->close();
?>