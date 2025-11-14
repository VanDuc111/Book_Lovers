document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('#sidebar .nav-link');
    const contentArea = document.getElementById('content-area');

    function loadContent(section) {
        contentArea.innerHTML = '<p>Đang tải...</p>';

        switch (section) {
            case 'dashboard':
                contentArea.innerHTML = '<h2>Dashboard</h2><p>Thông tin tổng quan về website.</p>';
                break;
            case 'manage-books':
                loadBooksManagement();
                break;
            case 'manage-users':
                loadUsersManagement();
                break;
            case 'manage-categories':
                loadCategoriesManagement();
                break;
            case 'manage-orders':
                loadOrdersManagement();
                break;
            case 'manage-reviews':
                loadReviewsManagement();
                break;
            default:
                contentArea.innerHTML = '<p>Nội dung không tồn tại.</p>';
        }

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const section = link.getAttribute('data-section');
            if (section) {
                loadContent(section);
            }
        });
    });

    loadContent('dashboard');

    // Các hàm để tải nội dung quản lý cho từng phần
    function loadBooksManagement() {
        contentArea.innerHTML = `
            <h2>Quản lý Sách</h2>
            <button class="btn btn-primary mb-2" id="addBookBtn">Thêm Sách</button>
            <div id="bookListContainer">
                <p>Đang tải danh sách sách...</p>
            </div>
            <div id="bookFormContainer" style="display: none;">
                <h3>Thêm/Sửa Sách</h3>
                <form id="bookForm">
                    <input type="hidden" id="bookID" name="bookID">
                    <div class="form-group">
                        <label for="title">Tiêu đề</label>
                        <input type="text" class="form-control" id="title" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="author">Tác giả</label>
                        <input type="text" class="form-control" id="author" name="author">
                    </div>
                    <div class="form-group">
                        <label for="publisher">Nhà xuất bản</label>
                        <input type="text" class="form-control" id="publisher" name="publisher">
                    </div>
                    <div class="form-group">
                        <label for="categoryName">Thể loại</label>
                        <input type="text" class="form-control" id="categoryName" name="categoryName" required>
                    </div>
                    <div class="form-group">
                        <label for="bookPrice">Giá</label>
                        <input type="number" step="0.01" class="form-control" id="bookPrice" name="bookPrice" required>
                    </div>
                    <div class="form-group">
                        <label for="stock">Số lượng trong kho</label>
                        <input type="number" class="form-control" id="stock" name="stock" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Mô tả</label>
                        <textarea class="form-control" id="description" name="description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="image">URL Hình ảnh</label>
                        <input type="text" class="form-control" id="image" name="image">
                    </div>
                    <button type="submit" class="btn btn-success" id="saveBookBtn">Lưu</button>
                    <button type="button" class="btn btn-secondary ml-2" id="cancelBookBtn">Hủy</button>
                </form>
            </div>
        `;

        const bookListContainer = document.getElementById('bookListContainer');
        const addBookBtn = document.getElementById('addBookBtn');
        const bookFormContainer = document.getElementById('bookFormContainer');
        const bookForm = document.getElementById('bookForm');
        const saveBookBtn = document.getElementById('saveBookBtn');
        const cancelBookBtn = document.getElementById('cancelBookBtn');
        const bookIdInput = document.getElementById('bookID');

        let booksData = [];

        function fetchBooks() {
            fetch('../api/api.php?endpoint=books')
                .then(response => response.json())
                .then(data => {
                    booksData = data;
                    renderBookTable();
                })
                .catch(error => {
                    bookListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu sách.</div>`;
                    console.error('Lỗi tải dữ liệu sách:', error);
                });
        }

        function renderBookTable() {
            if (!booksData || booksData.length === 0) {
                bookListContainer.innerHTML = '<p>Chưa có sách nào.</p>';
                return;
            }

            let tableHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu đề</th>
                            <th>Tác giả</th>
                            <th>Nhà xuất bản</th>
                            <th>Thể loại</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>`;

            booksData.forEach(book => {
                tableHTML += `
                    <tr>
                        <td>${book.bookID}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.publisher}</td>
                        <td>${book.categoryName}</td>
                        <td>${book.bookPrice}</td>
                        <td>${book.stock}</td>
                        <td>
                            <button class="btn btn-sm btn-primary editBookBtn" data-id="${book.bookID}">Sửa</button>
                            <button class="btn btn-sm btn-danger ml-1 deleteBookBtn" data-id="${book.bookID}">Xóa</button>
                        </td>
                    </tr>`;
            });

            tableHTML += `</tbody></table>`;
            bookListContainer.innerHTML = tableHTML;

            document.querySelectorAll('.editBookBtn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const bookId = this.dataset.id;
                    populateBookForm(bookId);
                    showBookForm();
                });
            });

            document.querySelectorAll('.deleteBookBtn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const bookId = this.dataset.id;
                    if (confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) {
                        deleteBook(bookId);
                    }
                });
            });
        }

        function populateBookForm(bookIdToEdit) {
            const book = booksData.find(book => book.bookID == bookIdToEdit);
            if (book) {
                bookIdInput.value = book.bookID;
                document.getElementById('title').value = book.title;
                document.getElementById('author').value = book.author;
                document.getElementById('publisher').value = book.publisher;
                document.getElementById('categoryName').value = book.categoryName;
                document.getElementById('bookPrice').value = book.bookPrice;
                document.getElementById('stock').value = book.stock;
                document.getElementById('description').value = book.description || '';
                document.getElementById('image').value = book.image || '';

                console.log('bookIdInput.value:', bookIdInput.value); // Kiểm tra giá trị bookIdInput.value

                showBookForm();
            } else {
                alert('Không tìm thấy thông tin sách.');
            }
        }

        function showBookForm() {
            bookFormContainer.style.display = 'block';
            bookListContainer.style.display = 'none';
        }

        function hideBookForm() {
            bookFormContainer.style.display = 'none';
            bookListContainer.style.display = 'block';
            bookForm.reset();
            bookIdInput.value = '';
        }

        addBookBtn.addEventListener('click', showBookForm);
        cancelBookBtn.addEventListener('click', hideBookForm);

        function addBook(bookData) {
            const url = '../api/api.php?endpoint=books';
            delete bookData.bookID; // Loại bỏ bookID khi thêm mới

            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Thêm thành công!'));
                    fetchBooks();
                    hideBookForm();
                })
                .catch(error => {
                    console.error('Lỗi khi thêm sách:', error);
                    alert('Có lỗi xảy ra khi thêm sách.');
                });
        }

        function updateBook(bookData) {
            const url = '../api/api.php?endpoint=books';
            console.log('Update Book Data:', bookData);

            fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Cập nhật thành công!'));
                    fetchBooks();
                    hideBookForm();
                })
                .catch(error => {
                    console.error('Lỗi khi cập nhật sách:', error);
                    alert('Có lỗi xảy ra khi cập nhật sách.');
                });
        }

        bookForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(this);

            console.log('bookIdInput.value before FormData:', bookIdInput.value); // Kiểm tra giá trị trước FormData

            const bookData = {
                bookID: formData.get('bookID'),
                title: formData.get('title'),
                author: formData.get('author'),
                publisher: formData.get('publisher'),
                categoryName: formData.get('categoryName'),
                bookPrice: formData.get('bookPrice'),
                stock: parseInt(formData.get('stock')),
                description: formData.get('description'),
                image: formData.get('image')
            };

            console.log('bookData before PUT:', bookData); // Kiểm tra bookData trước PUT

            if (bookIdInput.value) {
                updateBook(bookData);
            } else {
                addBook(bookData);
            }
        });

        function deleteBook(bookId) {
            fetch(`../api/api.php?endpoint=books&id=${bookId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Xóa thành công!'));
                    fetchBooks();
                })
                .catch(error => {
                    console.error('Lỗi khi xóa sách:', error);
                    alert('Có lỗi xảy ra khi xóa sách.');
                });
        }

        fetchBooks();
    }

    function loadUsersManagement() {
        contentArea.innerHTML = `
            <h2>Quản lý Người dùng</h2>
            <button class="btn btn-primary mb-2" id="addUserBtn">Thêm Người dùng</button>
            <div id="userListContainer">
                <p>Đang tải danh sách người dùng...</p>
            </div>
            <div id="userFormContainer" style="display: none;">
                <h3>Thêm/Sửa Người dùng</h3>
                <form id="userForm">
                    <input type="hidden" id="userId" name="userId">
                    <div class="form-group">
                        <label for="name">Tên</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Mật khẩu</label>
                        <input type="password" class="form-control" id="password" name="password">
                        <small class="form-text text-muted">Để trống nếu không muốn thay đổi.</small>
                    </div>
                    <div class="form-group">
                        <label for="role">Vai trò</label>
                        <select class="form-control" id="role" name="role" required>
                            <option value="client">Khách hàng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="address">Địa chỉ</label>
                        <input type="text" class="form-control" id="address" name="address">
                    </div>
                    <div class="form-group">
                        <label for="phone">Số điện thoại</label>
                        <input type="text" class="form-control" id="phone" name="phone">
                    </div>
                    <button type="submit" class="btn btn-success" id="saveUserBtn">Lưu</button>
                    <button type="button" class="btn btn-secondary ml-2" id="cancelUserBtn">Hủy</button>
                </form>
            </div>
        `;

        const userListContainer = document.getElementById('userListContainer');
        const addUserBtn = document.getElementById('addUserBtn');
        const userFormContainer = document.getElementById('userFormContainer');
        const userForm = document.getElementById('userForm');
        const saveUserBtn = document.getElementById('saveUserBtn');
        const cancelUserBtn = document.getElementById('cancelUserBtn');
        const userIdInput = document.getElementById('userId');

        let usersData = [];

        function fetchUsers() {
            fetch('../api/api.php?endpoint=users')
                .then(response => response.json())
                .then(data => {
                    usersData = data;
                    renderUserTable();
                })
                .catch(error => {
                    userListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu người dùng.</div>`;
                    console.error('Lỗi tải dữ liệu người dùng:', error);
                });
        }

        function renderUserTable() {
            if (!usersData || usersData.length === 0) {
                userListContainer.innerHTML = '<p>Chưa có người dùng nào.</p>';
                return;
            }

            let tableHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>`;

            usersData.forEach(user => {
                tableHTML += `
                    <tr>
                        <td>${user.userID}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button class="btn btn-sm btn-primary editUserBtn" data-id="${user.userID}">Sửa</button>
                            <button class="btn btn-sm btn-danger ml-1 deleteUserBtn" data-id="${user.userID}">Xóa</button>
                        </td>
                    </tr>`;
            });

            tableHTML += `</tbody></table>`;
            userListContainer.innerHTML = tableHTML;

            document.querySelectorAll('.editUserBtn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const userId = this.dataset.id;
                    populateUserForm(userId);
                    showUserForm();
                });
            });

            document.querySelectorAll('.deleteUserBtn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const userId = this.dataset.id;
                    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                        deleteUser(userId);
                    }
                });
            });
        }

        function populateUserForm(userIdToEdit) {
            const user = usersData.find(user => user.userID == userIdToEdit);
            if (user) {
                userIdInput.value = user.userID;
                document.getElementById('name').value = user.name;
                document.getElementById('email').value = user.email;
                document.getElementById('role').value = user.role;
                document.getElementById('address').value = user.address || '';
                document.getElementById('phone').value = user.phone || '';
                showUserForm();
            } else {
                alert('Không tìm thấy thông tin người dùng.');
            }
        }

        function showUserForm() {
            userFormContainer.style.display = 'block';
            userListContainer.style.display = 'none';
        }

        function hideUserForm() {
            userFormContainer.style.display = 'none';
            userListContainer.style.display = 'block';
            userForm.reset();
            userIdInput.value = '';
        }

        addUserBtn.addEventListener('click', showUserForm);
        cancelUserBtn.addEventListener('click', hideUserForm);

        userForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(this);
            const userData = {
                userID: formData.get('userId'),
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role'),
                address: formData.get('address'),
                phone: formData.get('phone')
            };
            const method = userData.userID ? 'PUT' : 'POST';
            const url = '../api/api.php?endpoint=users';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Thao tác thành công!'));
                    fetchUsers();
                    hideUserForm();
                })
                .catch(error => {
                    console.error('Lỗi khi lưu người dùng:', error);
                    alert('Có lỗi xảy ra khi lưu người dùng.');
                });
        });

        function deleteUser(userId) {
            fetch(`../api/api.php?endpoint=users&id=${userId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Xóa thành công!'));
                    fetchUsers();
                })
                .catch(error => {
                    console.error('Lỗi khi xóa người dùng:', error);
                    alert('Có lỗi xảy ra khi xóa người dùng.');
                });
        }

        fetchUsers();
    }

    // ... (các hàm loadContent và các hàm khác trong admin.js)

    function loadCategoriesManagement() {
        contentArea.innerHTML = `
        <h2>Quản lý Thể loại</h2>
        <button class="btn btn-primary mb-2" id="addCategoryBtn">Thêm Thể loại</button>
        <div id="categoryListContainer">
            <p>Đang tải danh sách thể loại...</p>
        </div>
        <div id="categoryFormContainer" style="display: none;">
            <h3>Thêm/Sửa Thể loại</h3>
            <form id="categoryForm">
                <input type="hidden" id="categoryId" name="categoryId">
                <div class="form-group">
                    <label for="categoryName">Tên Thể loại</label>
                    <input type="text" class="form-control" id="categoryName" name="categoryName" required>
                </div>
                <div class="form-group">
                    <label for="description">Mô tả</label>
                    <textarea class="form-control" id="description" name="description"></textarea>
                </div>
                <button type="submit" class="btn btn-success" id="saveCategoryBtn">Lưu</button>
                <button type="button" class="btn btn-secondary ml-2" id="cancelCategoryBtn">Hủy</button>
            </form>
        </div>
    `;

        const categoryListContainer = document.getElementById('categoryListContainer');
        const addCategoryBtn = document.getElementById('addCategoryBtn');
        const categoryFormContainer = document.getElementById('categoryFormContainer');
        const categoryForm = document.getElementById('categoryForm');
        const saveCategoryBtn = document.getElementById('saveCategoryBtn');
        const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
        const categoryIdInput = document.getElementById('categoryId');

        let categoriesData = [];

        function fetchCategories() {
            fetch('../api/api.php?endpoint=categories')
                .then(response => response.json())
                .then(data => {
                    categoriesData = data;
                    renderCategoryTable();
                })
                .catch(error => {
                    categoryListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu thể loại.</div>`;
                    console.error('Lỗi tải dữ liệu thể loại:', error);
                });
        }

        function renderCategoryTable() {
            if (!categoriesData || categoriesData.length === 0) {
                categoryListContainer.innerHTML = '<p>Chưa có thể loại nào.</p>';
                return;
            }

            let tableHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Thể loại</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>`;

            categoriesData.forEach(category => {
                tableHTML += `
                <tr>
                    <td>${category.categoryID}</td>
                    <td>${category.categoryName}</td>
                    <td>${category.description || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-primary editCategoryBtn" data-id="${category.categoryID}">Sửa</button>
                        <button class="btn btn-sm btn-danger ml-1 deleteCategoryBtn" data-id="${category.categoryID}">Xóa</button>
                    </td>
                </tr>`;
            });

            tableHTML += `</tbody></table>`;
            categoryListContainer.innerHTML = tableHTML;

            document.querySelectorAll('.editCategoryBtn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const categoryId = this.dataset.id;
                    populateCategoryForm(categoryId);
                    showCategoryForm();
                });
            });

            document.querySelectorAll('.deleteCategoryBtn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const categoryId = this.dataset.id;
                    if (confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
                        deleteCategory(categoryId);
                    }
                });
            });
        }

        function populateCategoryForm(categoryIdToEdit) {
            const category = categoriesData.find(category => category.categoryID == categoryIdToEdit);
            if (category) {
                categoryIdInput.value = category.categoryID;
                document.getElementById('categoryName').value = category.categoryName;
                document.getElementById('description').value = category.description || '';
                showCategoryForm();
            } else {
                alert('Không tìm thấy thông tin thể loại.');
            }
        }

        function showCategoryForm() {
            categoryFormContainer.style.display = 'block';
            categoryListContainer.style.display = 'none';
        }

        function hideCategoryForm() {
            categoryFormContainer.style.display = 'none';
            categoryListContainer.style.display = 'block';
            categoryForm.reset();
            categoryIdInput.value = '';
        }

        addCategoryBtn.addEventListener('click', showCategoryForm);
        cancelCategoryBtn.addEventListener('click', hideCategoryForm);

        categoryForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(this);
            const categoryData = {
                categoryID: formData.get('categoryId'),
                categoryName: formData.get('categoryName'),
                description: formData.get('description')
            };
            const method = categoryData.categoryID ? 'PUT' : 'POST';
            const url = '../api/api.php?endpoint=categories';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Thao tác thành công!'));
                    fetchCategories();
                    hideCategoryForm();
                })
                .catch(error => {
                    console.error('Lỗi khi lưu thể loại:', error);
                    alert('Có lỗi xảy ra khi lưu thể loại.');
                });
        });

        function deleteCategory(categoryId) {
            fetch(`../api/api.php?endpoint=categories&id=${categoryId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Xóa thành công!'));
                    fetchCategories();
                })
                .catch(error => {
                    console.error('Lỗi khi xóa thể loại:', error);
                    alert('Có lỗi xảy ra khi xóa thể loại.');
                });
        }

        fetchCategories();
    }

    // Hàm loadOrdersManagement quản lý đơn hàng
    function loadOrdersManagement() {
        contentArea.innerHTML = `
            <h2>Quản lý Đơn hàng</h2>
            <div id="orderListContainer">
                <p>Đang tải danh sách đơn hàng...</p>
            </div>
        `;

        const orderListContainer = document.getElementById('orderListContainer');

        let ordersData = [];

        function fetchOrders() {
            fetch('../api/api.php?endpoint=order')
                .then(response => response.json())
                .then(data => {
                    ordersData = data;
                    renderOrderTable();
                })
                .catch(error => {
                    orderListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu đơn hàng.</div>`;
                    console.error('Lỗi tải dữ liệu đơn hàng:', error);
                });
        }

        function renderOrderTable() {
            if (!ordersData || ordersData.length === 0) {
                orderListContainer.innerHTML = '<p>Chưa có đơn hàng nào.</p>';
                return;
            }

            let tableHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người dùng (ID)</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Địa chỉ giao hàng</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>`;

            ordersData.forEach(order => {
                tableHTML += `
                    <tr>
                        <td>${order.orderID}</td>
                        <td>${order.userID}</td>
                        <td>${new Date(order.order_date).toLocaleString()}</td>
                        <td>${order.total_amount}</td>
                        <td>${order.shipping_address || ''}</td>
                        <td>
                            <select class="form-control order-status-select" data-order-id="${order.orderID}">
                                <option value="Pending" ${order.order_status === 'Pending' ? 'selected' : ''}>Đang chờ xử lý</option>
                                <option value="Processing" ${order.order_status === 'Processing' ? 'selected' : ''}>Đang xử lý</option>
                                <option value="Shipped" ${order.order_status === 'Shipped' ? 'selected' : ''}>Đã giao</option>
                                <option value="Delivered" ${order.order_status === 'Delivered' ? 'selected' : ''}>Đã hoàn thành</option>
                                <option value="Cancelled" ${order.order_status === 'Cancelled' ? 'selected' : ''}>Đã hủy</option>
                            </select>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-info viewOrderDetailsBtn" data-order-id="${order.orderID}">Xem chi tiết</button>
                        </td>
                    </tr>`;
            });

            tableHTML += `</tbody></table>`;
            orderListContainer.innerHTML = tableHTML;

            document.querySelectorAll('.order-status-select').forEach(select => {
                select.addEventListener('change', function () {
                    const orderId = this.dataset.orderId;
                    const newStatus = this.value;
                    updateOrderStatus(orderId, newStatus);
                });
            });

            document.querySelectorAll('.viewOrderDetailsBtn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const orderId = this.dataset.orderId;
                    alert(`Xem chi tiết đơn hàng ID: ${orderId}`); // Bạn có thể triển khai logic xem chi tiết ở đây
                });
            });
        }

        function updateOrderStatus(orderId, newStatus) {
            fetch('../api/api.php?endpoint=order', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderID: orderId, order_status: newStatus }),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Cập nhật trạng thái thành công!'));
                    fetchOrders();
                })
                .catch(error => {
                    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
                    alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
                });
        }

        fetchOrders();
    }
    // Hàm loadReviewsManagement quản lý đánh giá
    function loadReviewsManagement() {
        contentArea.innerHTML = `
            <h2>Quản lý Đánh giá</h2>
            <div id="reviewListContainer">
                <p>Đang tải danh sách đánh giá...</p>
            </div>
        `;

        const reviewListContainer = document.getElementById('reviewListContainer');

        let reviewsData = [];

        function fetchReviews() {
            fetch('../api/api.php?endpoint=review')
                .then(response => response.json())
                .then(data => {
                    reviewsData = data;
                    renderReviewTable();
                })
                .catch(error => {
                    reviewListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu đánh giá.</div>`;
                    console.error('Lỗi tải dữ liệu đánh giá:', error);
                });
        }

        function renderReviewTable() {
            if (!reviewsData || reviewsData.length === 0) {
                reviewListContainer.innerHTML = '<p>Chưa có đánh giá nào.</p>';
                return;
            }

            let tableHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sách (ID)</th>
                            <th>Người dùng (ID)</th>
                            <th>Điểm</th>
                            <th>Bình luận</th>
                            <th>Thời gian tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>`;

            reviewsData.forEach(review => {
                tableHTML += `
                    <tr>
                        <td>${review.reviewID}</td>
                        <td>${review.bookID}</td>
                        <td>${review.userID}</td>
                        <td>${review.rating}</td>
                        <td>${review.comment || ''}</td>
                        <td>${new Date(review.created_at).toLocaleString()}</td>
                        <td>
                            <button class="btn btn-sm btn-danger deleteReviewBtn" data-id="${review.reviewID}">Xóa</button>
                        </td>
                    </tr>`;
            });

            tableHTML += `</tbody></table>`;
            reviewListContainer.innerHTML = tableHTML;

            document.querySelectorAll('.deleteReviewBtn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const reviewId = this.dataset.id;
                    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
                        deleteReview(reviewId);
                    }
                });
            });
        }

        function deleteReview(reviewId) {
            fetch(`../api/api.php?endpoint=review&id=${reviewId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Xóa thành công!'));
                    fetchReviews();
                })
                .catch(error => {
                    console.error('Lỗi khi xóa đánh giá:', error);
                    alert('Có lỗi xảy ra khi xóa đánh giá.');
                });
        }

        fetchReviews();
    }
});