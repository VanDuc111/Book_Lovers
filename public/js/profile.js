document.addEventListener('DOMContentLoaded', () => {
    const config = window.profileConfig || {};
    const userID = new URLSearchParams(window.location.search).get('userID');
    
    if (!userID) {
        window.location.href = config.loginUrl || '/login';
        return;
    }

    // Elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarEmail = document.getElementById('sidebar-email');
    const avatarImg = document.getElementById('profile-avatar-img');

    // Tab Switching Logic
    const navItems = document.querySelectorAll('.profile-nav-item');
    const contentPanes = document.querySelectorAll('.content-pane');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            if (!targetId) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            contentPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === targetId) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // Fetch User Data
    if (config.apiUrl) {
        fetch(`${config.apiUrl}/${userID}`)
            .then(res => res.json())
            .then(user => {
                if (user) {
                    if (nameInput) nameInput.value = user.name || '';
                    if (emailInput) emailInput.value = user.email || '';
                    if (phoneInput) phoneInput.value = user.phone || '';
                    if (addressInput) addressInput.value = user.address || '';
                    
                    if (sidebarName) sidebarName.textContent = user.name || 'Người dùng';
                    if (sidebarEmail) sidebarEmail.textContent = user.email || '';
                    
                    if (avatarImg) {
                        avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=ff6347&color=fff&size=128`;
                    }
                }
            })
            .catch(err => console.error('Error fetching user:', err));
    }

    // Save Profile Logic
    const saveProfileBtn = document.querySelector('.save-profile-btn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const updatedData = {
                name: nameInput.value,
                phone: phoneInput.value,
                address: addressInput.value
            };
            updateUser(updatedData);
        });
    }

    // Save Password Logic
    const savePasswordBtn = document.querySelector('.save-password-btn');
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', () => {
            const currentPass = document.getElementById('current_password').value;
            const newPass = document.getElementById('new_password').value;
            const confirmPass = document.getElementById('new_password_confirmation').value;

            if (!currentPass || !newPass) {
                alert('Vui lòng điền đầy đủ các thông tin mật khẩu.');
                return;
            }

            if (newPass !== confirmPass) {
                alert('Xác nhận mật khẩu mới không khớp.');
                return;
            }

            const data = {
                current_password: currentPass,
                password: newPass
            };
            updateUser(data);
        });
    }

    function updateUser(data) {
        fetch(`${config.apiUrl}/${userID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': config.csrfToken
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success || !result.error) {
                if (data.password) {
                    document.getElementById('current_password').value = '';
                    document.getElementById('new_password').value = '';
                    document.getElementById('new_password_confirmation').value = '';
                }
                alert('Cập nhật thành công!');
                if (data.name) {
                    if (sidebarName) sidebarName.textContent = data.name;
                    if (avatarImg) {
                        avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=ff6347&color=fff&size=128`;
                    }
                }
            } else {
                alert('Lỗi: ' + (result.error || result.message));
            }
        })
        .catch(err => alert('Đã xảy ra lỗi khi kết nối server.'));
    }

    // Logout Sidebar
    const logoutSidebar = document.getElementById('logout-sidebar');
    if (logoutSidebar) {
        logoutSidebar.addEventListener('click', (e) => {
            e.preventDefault();
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.click();
            } else {
                localStorage.removeItem('userID');
                window.location.href = config.homeUrl || '/';
            }
        });
    }
});
