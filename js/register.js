document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value; // Lấy giá trị tên người dùng
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!username.trim()) {
      // Kiểm tra xem tên người dùng có rỗng không
      alert("Vui lòng nhập tên người dùng.");
      return;
    }

    fetch("../api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          alert("Đăng ký thành công!");
          window.location.href = "login.html";
        } else {
          alert("Đăng ký thất bại: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi khi đăng ký.");
      });
  });

// Attach password toggle for register page
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSelector = this.getAttribute("data-target");
      let input;
      if (targetSelector) input = document.querySelector(targetSelector);
      else
        input = this.parentElement.querySelector(
          'input[type="password"], input[type="text"]'
        );
      if (!input) return;
      if (input.type === "password") {
        input.type = "text";
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        input.type = "password";
        this.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  });
});
