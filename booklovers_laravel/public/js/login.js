function runLoginJS() {
    const loginForm = document.getElementById('loginForm');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-btn');
    const userIcon = document.querySelector('.fa-user');

    function login(email, password) {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateUI(data.user);
                        if (data.user.role === 'admin') {
                            window.location.href = '/admin';
                        } else {
                            window.location.href = '/';
                    }
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Lỗi đăng nhập:', error);
                alert('Đã xảy ra lỗi khi đăng nhập.');
            });
    }

    function logout() {
        localStorage.removeItem('user');
        updateUI(null);
        window.location.href = '/';
    }

    function updateUI(user) {
        if (welcomeMessage) {
            if (user) {
                welcomeMessage.textContent = `Xin chào ${user.name}`;
                welcomeMessage.style.display = 'inline';
                logoutButton.style.display = 'inline';

                // Thay đổi href thành profile.html và truyền userID
                const userLink = document.getElementById('login-btn');
                if (userLink && user.userID) { // Kiểm tra user.userID tồn tại
                    userLink.href = `/profile?userID=${user.userID}`;
                } else if (userLink) {
                    userLink.href = '/profile'; // Nếu không có userID, chuyển hướng mà không có query parameter
                } else {
                    console.error("login-btn element not found!");
                }
            } else {
                welcomeMessage.textContent = 'Đăng nhập';
                welcomeMessage.style.display = 'inline';
                logoutButton.style.display = 'none';

                // Giữ nguyên href là login.html
                const userLink = document.getElementById('login-btn');
                if (userLink) {
                    userLink.href = '/login';
                } else {
                    console.error("login-btn element not found!");
                }
            }
        } else {
            console.error("welcomeMessage element not found!");
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Kiểm tra Local Storage khi trang tải
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        updateUI(user);
    } catch (error) {
        console.error('Lỗi khi parse JSON từ Local Storage:', error);
    }
}

// Attach password toggle handlers
function attachPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(icon => {
        const input = icon.parentElement.querySelector('input');
        if (!input) return;

        icon.addEventListener('click', function () {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            // Toggle the icon
            this.src = type === 'password' ? '/assets/icons/eye.svg' : '/assets/icons/eye-slash.svg';
        });
    });
}

// Initialize
try { runLoginJS(); } catch (e) { console.warn('runLoginJS init failed:', e); }
try { attachPasswordToggle(); } catch (e) { /* no-op if DOM not ready */ }