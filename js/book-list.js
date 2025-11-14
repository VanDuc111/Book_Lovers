document.addEventListener('DOMContentLoaded', async function () {
    const bookListContainer = document.querySelector('.book-list');
    const breadcrumbCurrentCategory = document.getElementById('breadcrumb-current-category');
    const breadcrumbSachsLink = document.querySelector('.breadcrumb-item:nth-child(2) a');
    const searchParams = new URLSearchParams(window.location.search);
    const searchTerm = searchParams.get('search');

    // Chờ cho header được tải và categoryListFromHeader được thiết lập
    await new Promise(resolve => {
        const checkInterval = setInterval(() => {
            if (window.categoryListFromHeader) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
        // Đặt timeout nếu sau một thời gian vẫn chưa tìm thấy
        setTimeout(() => {
            clearInterval(checkInterval);
            resolve();
            console.error('Không thể truy cập categoryListFromHeader sau một khoảng thời gian.');
        }, 5000); // 5 giây
    });

    const categoryFilter = window.categoryListFromHeader;
    if (!categoryFilter) {
        console.error('Không tìm thấy categoryFilter. Hãy đảm bảo common.js đã chạy và gán window.categoryListFromHeader.');
        return;
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
            const response = await fetch('../api/api.php?endpoint=categories');
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
        let url = '../api/api.php?endpoint=books';
        if (categoryId !== 'all') {
            url += `&category=${categoryId}`;
        }
        if (searchTerm) {
            url += `&search=${encodeURIComponent(searchTerm)}`; // Thêm tham số search vào API
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
                    <img src="${book.image ?? 'default-image.jpg'}" class="card-img-top" alt="${book.title ?? 'Không có tiêu đề'}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title ?? 'Không có tiêu đề'}</h5>
                        <p class="card-text">Tác giả: ${book.author ?? 'Không có tác giả'}</p>
                        <p class="card-text">Giá: ${book.bookPrice ? book.bookPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Chưa rõ'}</p>
                    </div>
                </div>
            `;

            bookCard.addEventListener('click', function () {
                window.location.href = `book-details.html?id=${book.bookID}`;
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
});