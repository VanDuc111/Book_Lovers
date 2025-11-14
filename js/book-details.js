import { getUserId } from './common.js';

document.addEventListener('DOMContentLoaded', function () {
    const bookDetailsContainer = document.getElementById('book-details-container'); // Container chính chứa thông tin sách

    if (bookDetailsContainer) {
        // Hàm để lấy ID sách từ URL
        function getBookIdFromUrl() {
            const params = new URLSearchParams(window.location.search);
            return params.get('id');
        }

        const bookId = getBookIdFromUrl();

        if (bookId) {
            // Nếu có ID sách trong URL, gọi API để lấy thông tin chi tiết
            fetch(`../api/api.php?endpoint=books&id=${bookId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(book => {
                    if (book && Object.keys(book).length > 0) {
                        displayBookDetails(book);
                    } else {
                        bookDetailsContainer.innerHTML = '<p class="text-danger">Không tìm thấy thông tin sách.</p>';
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi tải thông tin sách:', error);
                    bookDetailsContainer.innerHTML = `<p class="text-danger">Lỗi khi tải thông tin sách: ${error.message}</p>`;
                });
        } else {
            // Nếu không có ID trong URL, có thể hiển thị thông báo hoặc chuyển hướng
            bookDetailsContainer.innerHTML = '<p class="text-warning">Không có ID sách được chỉ định.</p>';
        }

        // Hàm để hiển thị thông tin sách lên trang
        function displayBookDetails(book) {
            bookDetailsContainer.innerHTML = `
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${book.image || 'placeholder.jpg'}" class="img-fluid rounded-start" alt="${book.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">Tác giả: ${book.author}</p>
                                <p class="card-text">Nhà xuất bản: ${book.publisher}</p>
                                <p class="card-text">Thể loại: ${book.categoryName}</p>
                                <p class="card-text">Giá: ${book.bookPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                <p class="card-text">Số lượng trong kho: ${book.stock}</p>
                                <p class="card-text">Mô tả:</p>
                                <p class="card-text">${book.description || 'Không có mô tả.'}</p>
                                <div class="d-flex align-items-center mb-3">
                                    <label for="quantity" class="me-2">Số lượng:</label>
                                    <button class="btn btn-sm btn-outline-secondary decrease-quantity">-</button>
                                    <input type="number" id="quantity" class="form-control form-control-sm quantity-input" value="1" min="1" max ="100" style="width: 60px;">
                                    <button class="btn btn-sm btn-outline-secondary increase-quantity">+</button>
                                </div>
                                <button id="addToCartBtn" class="btn btn-primary">Thêm vào giỏ hàng</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            // sự kiện click cho nút "Thêm vào giỏ hàng"
            document.getElementById('addToCartBtn').addEventListener('click', function () {
                addToCart(book.bookID);
            });
            // Sự kiện cho nút tăng giảm số lượng
            const decreaseButton = document.querySelector('.decrease-quantity');
            const increaseButton = document.querySelector('.increase-quantity');
            const quantityInput = document.querySelector('.quantity-input');

            if (decreaseButton) {
                decreaseButton.addEventListener('click', function () {
                    let currentValue = parseInt(quantityInput.value);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                    }
                });
            }

            if (increaseButton) {
                increaseButton.addEventListener('click', function () {
                    let currentValue = parseInt(quantityInput.value);
                    if (book.stock > currentValue) {
                        quantityInput.value = currentValue + 1;
                    } else {
                        alert(`Số lượng trong kho chỉ còn ${book.stock}.`);
                    }
                });
            }

            if (quantityInput) {
                quantityInput.addEventListener('change', function () {
                    let currentValue = parseInt(this.value);
                    if (isNaN(currentValue) || currentValue < 1) {
                        this.value = 1;
                    } else if (currentValue > book.stock) {
                        this.value = book.stock;
                        alert(`Số lượng tối đa là ${book.stock}.`);
                    }
                });
            }
        }
        function addToCart(bookId) {
            const userId = getUserId();
            const quantityInput = document.getElementById('quantity');

            if (!quantityInput) {
                console.error('Không tìm thấy input số lượng với ID "quantity".');
                alert('Lỗi: Không thể xác định số lượng.');
                return;
            }

            const quantity = parseInt(quantityInput.value);

            if (!userId) {
                // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
                alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
                window.location.href = 'login.html'; // Thay 'login.html' bằng đường dẫn trang đăng nhập của bạn
                return; // Dừng thực hiện hàm nếu chưa đăng nhập
            }

            fetch('../api/api.php?endpoint=cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookID: bookId, quantity: quantity, userID: userId }),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Thêm vào giỏ hàng thành công!'));
                    window.location.href = 'cart.html';
                })
                .catch(error => {
                    console.error('Lỗi khi thêm vào giỏ hàng:', error);
                    alert('Có lỗi xảy ra khi thêm vào giỏ hàng.');
                });
        }
    }
});