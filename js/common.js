
export async function addHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            attachSearchHandler();
            const categoryListInHeader = document.getElementById('header-category-list');
            if (categoryListInHeader) {
                window.categoryListFromHeader = categoryListInHeader;
                fetchAndDisplayHeaderCategories(categoryListInHeader);
            } else {
                console.error('Không tìm thấy header-category-list trong header.html');
            }

            // Dispatch an event so other scripts can know the header has been loaded
            try {
                document.dispatchEvent(new CustomEvent('headerLoaded'));
            } catch (e) {
                // fallback for very old browsers
                const evt = document.createEvent('Event');
                evt.initEvent('headerLoaded', true, true);
                document.dispatchEvent(evt);
            }

            // Tạo MutationObserver để theo dõi việc thêm header.html
            const observer = new MutationObserver(() => {
                const welcomeMessage = document.getElementById('welcome-message');
                const logoutButton = document.getElementById('logout-btn');

                if (welcomeMessage && logoutButton) {
                    // header.html đã được thêm vào DOM, chạy login.js
                    observer.disconnect(); // Dừng theo dõi thay đổi
                    runLoginJS();
                }
            });

            // Bắt đầu theo dõi thay đổi trong body
            observer.observe(document.body, { childList: true, subtree: true });
        })
        .catch(error => console.error('Lỗi khi tải header:', error));
}

async function fetchAndDisplayHeaderCategories(container) {
    try {
        const response = await fetch('../api/api.php?endpoint=categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();

        container.innerHTML = ''; // Clear existing items

        if (categories.length === 0) {
            container.innerHTML = '<li><a href="#">Không có thể loại nào</a></li>';
            return;
        }

        categories.forEach(category => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `book-list.html?category=${encodeURIComponent(category.categoryName)}`;
            a.textContent = category.categoryName;
            li.appendChild(a);
            container.appendChild(li);
        });
    } catch (error) {
        console.error('Lỗi khi tải danh mục cho header:', error);
        container.innerHTML = '<li><a href="#">Lỗi tải danh mục</a></li>';
    }
}

export async function addFooter() {
    try {
        const response = await fetch('footer.html');
        const footerHtml = await response.text();
        const footer = document.createElement('footer');
        footer.innerHTML = footerHtml;
        document.body.append(footer);
    } catch (error) {
        console.error('Lỗi khi tải footer:', error);
        // Hiển thị thông báo lỗi cho người dùng (nếu cần)
    }
}

function attachSearchHandler() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `book-list.html?search=${searchTerm}`;
            }
        });
    } else {
        console.warn('Không tìm thấy form tìm kiếm trong header.');
    }
}

function updateCartIcon() {
    try {
        let cart = JSON.parse(localStorage.getItem('cart'));
        if (cart) {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            const cartIcon = document.querySelector('.fa-shopping-cart');
            if (cartIcon) {
                let cartCountSpan = cartIcon.querySelector('.cart-count');
                if (!cartCountSpan) {
                    cartCountSpan = document.createElement('span');
                    cartCountSpan.className = 'cart-count';
                    cartIcon.parentNode.appendChild(cartCountSpan);
                }
                cartCountSpan.textContent = cartCount;
            }
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
    }
}

// Hàm lấy userID từ localStorage
export function getUserId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.userID : null;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
});