document.addEventListener('DOMContentLoaded', () => {
    const config = window.profileConfig || {};
    let userID = new URLSearchParams(window.location.search).get('userID');
    
    // If userID is not in URL, try to get it from localStorage
    if (!userID) {
        const user = JSON.parse(localStorage.getItem('user'));
        userID = user ? user.userID : null;
    }
    
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
            switchTab(targetId);
        });
    });

    function switchTab(targetId) {
        if (!targetId) return;

        navItems.forEach(nav => {
            nav.classList.remove('active');
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            }
        });

        contentPanes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === targetId) {
                pane.classList.add('active');
            }
        });
    }

    // Check for tab in URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || urlParams.get('target');
    if (initialTab) {
        // Map common tab names to element IDs
        const tabMap = {
            'orders': 'my-orders',
            'profile': 'profile-info',
            'purchased': 'purchased-books-pane',
            'wishlist': 'wishlist',
            'password': 'change-password'
        };
        const targetId = tabMap[initialTab] || initialTab;
        switchTab(targetId);
    }

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
            // Clear local storage for the user session
            localStorage.removeItem('user');
            // Redirect to home
            window.location.href = config.homeUrl || '/';
        });
    }

    // --- Purchased Books Logic ---
    const purchasedList = document.getElementById('purchased-books-list');
    const purchasedEmpty = document.getElementById('purchased-books-empty');

    function fetchPurchasedBooks() {
        if (!purchasedList) return;

        fetch(`/api/purchased-books?userID=${userID}`)
            .then(res => res.json())
            .then(books => {
                purchasedList.innerHTML = '';
                
                if (!books || books.length === 0) {
                    if (purchasedEmpty) purchasedEmpty.style.display = 'block';
                    purchasedList.style.display = 'none';
                    return;
                }

                if (purchasedEmpty) purchasedEmpty.style.display = 'none';
                purchasedList.style.display = 'flex';

                books.forEach(book => {
                    const card = document.createElement('div');
                    card.className = 'col-6 col-md-4 col-lg-3 mb-4';
                    
                    const orderDate = new Date(book.order_date).toLocaleDateString('vi-VN');
                    
                    card.innerHTML = `
                        <div class="purchased-book-card">
                            <div class="p-book-image-wrapper">
                                <img src="${book.image || 'https://fakeimg.pl/200x300/f0f0f0/909090?text=No+Image'}" 
                                     class="p-book-image" alt="${book.title}">
                            </div>
                            <div class="p-book-info">
                                <a href="/book-details?id=${book.bookID}" class="p-book-title" title="${book.title}">${book.title}</a>
                                <div class="p-book-author">${book.author || 'Đang cập nhật'}</div>
                                <div class="p-book-date">
                                    <i class="far fa-calendar-alt"></i>
                                    Mua ngày: ${orderDate}
                                </div>
                                <div class="p-book-actions">
                                    <a href="/book-details?id=${book.bookID}" class="btn btn-main btn-read-now">Mua lại</a>
                                </div>
                            </div>
                        </div>
                    `;
                    purchasedList.appendChild(card);
                });
            })
            .catch(err => {
                console.error('Error fetching purchased books:', err);
                if (purchasedList) purchasedList.innerHTML = '<p class="text-center text-danger">Lỗi khi tải danh sách sách.</p>';
            });
    }

    // Call it after user data is fetched or on init
    fetchPurchasedBooks();
});
