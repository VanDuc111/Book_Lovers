document.addEventListener('DOMContentLoaded', async function () {
    const bookListContainer = document.querySelector('.book-list');
    const breadcrumbCurrentCategory = document.getElementById('breadcrumb-current-category');
    const breadcrumbSachsLink = document.querySelector('.breadcrumb-item:nth-child(2) a');
    const searchParams = new URLSearchParams(window.location.search);
    const searchTerm = searchParams.get('search');

    if (!bookListContainer) {
        return;
    }

    let categoryFilter = window.categoryListFromHeader || document.getElementById('header-category-list');
        if (!categoryFilter) {
        let resolved = false;
        const onHeaderLoaded = () => {
            categoryFilter = window.categoryListFromHeader || document.getElementById('header-category-list');
            resolved = true;
            initAfterHeader();
        };

        document.addEventListener('headerLoaded', onHeaderLoaded);
        setTimeout(() => {
            if (!resolved) {
                document.removeEventListener('headerLoaded', onHeaderLoaded);
                categoryFilter = document.getElementById('header-category-list');
                if (!categoryFilter) {
                    console.error('Không thể truy cập categoryListFromHeader sau một khoảng thời gian.');
                } else {
                    initAfterHeader();
                }
            }
        }, 5000);
    } else {
        initAfterHeader();
    }

    function initAfterHeader() {
        if (!categoryFilter) {
            console.warn('Không tìm thấy categoryFilter. Hãy đảm bảo common.js đã chạy và gán window.categoryListFromHeader.');
                // Check URL param for category even if header isn't available
                const urlParams = new URLSearchParams(window.location.search);
                const initialCategory = urlParams.get('category');
                if (initialCategory) {
                    fetchBooks(initialCategory);
                    if (breadcrumbCurrentCategory) breadcrumbCurrentCategory.textContent = initialCategory;
                } else {
                    fetchBooks('all');
                }
            return;
        }

            // If user navigated here with ?category=... we should honor it on load
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');
            if (categoryParam) {
                // If header is present we can also update breadcrumb
                if (breadcrumbCurrentCategory) breadcrumbCurrentCategory.textContent = categoryParam;
                // fetch and display books for that category
                fetchBooks(categoryParam);
                return; // we've handled initial load
            }

    if (breadcrumbSachsLink) {
        breadcrumbSachsLink.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('selectedCategory');
            console.log('localStorage sau khi remove:', localStorage.getItem('selectedCategory'));
            fetchBooks('all');
            if (breadcrumbCurrentCategory) {
                breadcrumbCurrentCategory.textContent = '';
            }
        });
    }

    async function fetchAndDisplayCategories() {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const categories = await response.json();
            if (categoryFilter) {
                categoryFilter.innerHTML = `<li><a href="#" class="category-item" data-category="all">Tất cả</a></li>`;
                categories.forEach(category => {
                    if (category && category.categoryName) { // Kiểm tra xem đối tượng và thuộc tính có tồn tại
                        const listItem = document.createElement('li');
                        const categoryLink = document.createElement('a');
                        categoryLink.href = '#';
                        categoryLink.className = 'category-item';
                        categoryLink.dataset.category = category.categoryName; // Sử dụng category.categoryName
                        categoryLink.textContent = category.categoryName; // Hiển thị category.categoryName
                        listItem.appendChild(categoryLink);
                        categoryFilter.appendChild(listItem);
                    }
                });
                addCategoryEventListeners();
            } else {
                console.warn('Không tìm thấy phần tử categoryFilter.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu thể loại:', error);
        }
    }

    fetchAndDisplayCategories();

    function addCategoryEventListeners() {
        if (categoryFilter) {
            const categoryItems = categoryFilter.querySelectorAll('.category-item');
            categoryItems.forEach(item => {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    const categoryId = this.dataset.category;
                    const categoryName = this.textContent;

                    if (breadcrumbCurrentCategory) {
                        breadcrumbCurrentCategory.textContent = categoryName;
                    }

                    fetchBooks(categoryId);
                });
            });
        }
    }

    function fetchBooks(categoryId = 'all', searchTerm = null) {
        let url = '/api/books';
        const params = [];
        if (categoryId !== 'all') {
            params.push(`category=${encodeURIComponent(categoryId)}`);
        }
        if (searchTerm) {
            params.push(`search=${encodeURIComponent(searchTerm)}`);
        }
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        fetch(url)
            .then(response => response.json())
            .then(books => displayBooks(books))
            .catch(error => console.error('Lỗi khi lấy dữ liệu sách:', error));
    }

    function displayBooks(books) {
        if (!bookListContainer) return;

        bookListContainer.innerHTML = '';

        if (books.length === 0) {
            bookListContainer.innerHTML = '<p>Không có sách nào trong thể loại này.</p>'; // Cập nhật thông báo
            return;
        }

        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'col-md-3 mb-4 book-card';
            bookCard.dataset.bookid = book.bookID;

            bookCard.innerHTML = `
                <div class="card">
                            <img src="${book.image ? book.image : '/assets/images/default.jpg'}" class="card-img-top" alt="${book.title ?? 'Không có tiêu đề'}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title ?? 'Không có tiêu đề'}</h5>
                        <p class="card-text">Tác giả: ${book.author ?? 'Không có tác giả'}</p>
                        <p class="card-text">Giá: ${book.bookPrice ? book.bookPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Chưa rõ'}</p>
                    </div>
                </div>
            `;

            bookCard.addEventListener('click', function () {
                window.location.href = `/book-details?id=${book.bookID}`;
            });

            bookListContainer.appendChild(bookCard);
        });
    }

    // fetchCategories();

    // Kiểm tra xem có tham số search trong URL không khi trang tải
    if (searchTerm) {
        fetchBooks('all', searchTerm); // Gọi fetchBooks với từ khóa tìm kiếm
        if (breadcrumbCurrentCategory) {
            breadcrumbCurrentCategory.textContent = `Kết quả tìm kiếm cho: "${searchTerm}"`;
        }
    } else {
        fetchBooks('all'); // Nếu không có từ khóa, hiển thị tất cả sách
    }
    }
});