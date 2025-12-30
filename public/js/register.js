document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value; // Lấy giá trị tên người dùng
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp.", "warning");
      return;
    }

    if (!username.trim()) {
      // Kiểm tra xem tên người dùng có rỗng không
      showToast("Vui lòng nhập tên người dùng.", "warning");
      return;
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
      body: JSON.stringify({
        name: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showToast("Đăng ký thành công! Đang chuyển hướng...", "success");
          setTimeout(() => {
             window.location.href = "/login";
          }, 1500);
        } else {
          showToast("Đăng ký thất bại: " + data.message, "danger");
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        showToast("Đã xảy ra lỗi khi đăng ký.", "danger");
      });
  });
