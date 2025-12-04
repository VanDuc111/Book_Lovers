function runLoginJS() {
    const loginForm = document.getElementById('loginForm');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-btn');
    const userIcon = document.querySelector('.fa-user');

    function login(email, password) {
        fetch('../api/login.php', {
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
                            window.location.href = '/pages/admin.html'; // Chuyển hướng đến trang admin
                        } else {
                            window.location.href = '/pages/home.html'; // Chuyển hướng đến trang người dùng
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
        window.location.href = '/pages/home.html';
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
                    userLink.href = `profile.html?userID=${user.userID}`;
                } else if (userLink) {
                    userLink.href = 'profile.html'; // Nếu không có userID, chuyển hướng mà không có query parameter
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
                    userLink.href = 'login.html';
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

// Attach password toggle handlers (works for login and other pages that include this file)
function attachPasswordToggle() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
        // find the associated input (password or text)
        const input = btn.parentElement.querySelector('input[type="password"], input[type="text"]');
        if (!input) return;

        // initialize icon and state
        btn.innerHTML = '<i class="fas fa-eye"></i>'; // default modern eye
        btn.classList.remove('visible');

        // show toggle only when user types something
        const updateVisibility = () => {
            if (input.value && input.value.length > 0) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
                // ensure input is masked when empty
                input.type = 'password';
                btn.innerHTML = '<i class="fas fa-eye"></i>';
            }
        };

        // initial visibility
        updateVisibility();

        input.addEventListener('input', updateVisibility);

        // toggle show/hide on click
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>'; // eye-slash when visible
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
}

// Initialize
try { runLoginJS(); } catch (e) { console.warn('runLoginJS init failed:', e); }
try { attachPasswordToggle(); } catch (e) { /* no-op if DOM not ready */ }