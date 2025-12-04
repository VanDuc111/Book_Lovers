
export async function addHeader() {
    try {
        // Avoid inserting header more than once
        if (document.getElementById('site-header')) return;

        const res = await fetch('header.html');
        const text = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Copy stylesheet links from the fragment's head to the current document head (avoid duplicates)
        const links = doc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(l => {
            const href = l.getAttribute('href');
            if (href && !Array.from(document.head.querySelectorAll('link')).some(existing => existing.getAttribute('href') === href)) {
                const newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.href = href;
                document.head.appendChild(newLink);
            }
        });

        // Extract the header element and bottom-navbar if present
        const headerEl = doc.querySelector('header');
        const bottomNav = doc.querySelector('.bottom-navbar');

        const wrapper = document.createElement('div');
        wrapper.id = 'site-header';

        if (headerEl) wrapper.appendChild(headerEl.cloneNode(true));
        if (bottomNav) wrapper.appendChild(bottomNav.cloneNode(true));

        // Insert at top of body
        document.body.insertAdjacentElement('afterbegin', wrapper);

        // Attach handlers after insertion
        attachSearchHandler();

        const categoryListInHeader = document.getElementById('header-category-list');
        if (categoryListInHeader) {
            window.categoryListFromHeader = categoryListInHeader;
            fetchAndDisplayHeaderCategories(categoryListInHeader);
        } else {
            console.error('Không tìm thấy header-category-list trong header fragment');
        }

        // Notify other scripts
        document.dispatchEvent(new CustomEvent('headerLoaded'));

        // Attempt to run login.js logic if available
        if (typeof runLoginJS === 'function') runLoginJS();

    } catch (error) {
        console.error('Lỗi khi tải header:', error);
    }
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
        // Avoid duplicate footers
        if (document.getElementById('site-footer')) return;

        const response = await fetch('footer.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Copy stylesheet links from footer fragment if any
        const links = doc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(l => {
            const href = l.getAttribute('href');
            if (href && !Array.from(document.head.querySelectorAll('link')).some(existing => existing.getAttribute('href') === href)) {
                const newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.href = href;
                document.head.appendChild(newLink);
            }
        });

        // Extract main footer content (look for .footer-section or footer element)
        const footerSection = doc.querySelector('.footer-section') || doc.querySelector('footer') || doc.body;
        const wrapper = document.createElement('div');
        wrapper.id = 'site-footer';
        wrapper.appendChild(footerSection.cloneNode(true));

        document.body.append(wrapper);
    } catch (error) {
        console.error('Lỗi khi tải footer:', error);
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