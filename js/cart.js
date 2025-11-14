import { getUserId } from './common.js';

document.addEventListener('DOMContentLoaded', function () {
    const cartTableBody = document.querySelector('#cart-table tbody');
    const cartTotalElement = document.getElementById('cart-total');

    const userId = getUserId();

    // Gọi API để lấy dữ liệu giỏ hàng
    fetch(`../api/api.php?endpoint=cart&userID=${userId}`)
        .then(response => response.json())
        .then(cartItems => {
            displayCartItems(cartItems);
        })
        .catch(error => {
            console.error('Lỗi khi tải giỏ hàng:', error);
            cartTableBody.innerHTML = '<tr><td colspan="5">Lỗi khi tải giỏ hàng.</td></tr>';
        });

    function displayCartItems(cartItems) {
        let total = 0;
        cartTableBody.innerHTML = '';

        cartItems.forEach(item => {
            const row = document.createElement('tr');
            const subtotal = item.bookPrice * item.quantity;
            total += subtotal;

            row.innerHTML = `
                <td><input type="checkbox" class="select-item" data-cartitemid="${item.cartItemID}"></td>
                <td><img src="${item.image || 'placeholder.jpg'}" alt="${item.title}" style="width: 100px;"></td>
                <td>${item.title}</td>
                <td>${item.bookPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td>${item.quantity}</td>
                <td>${subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-item" data-cartitemid="${item.cartItemID}">Xóa</button>
                    <button class="btn btn-success btn-sm checkout-item" data-cartitemid="${item.cartItemID}">Thanh toán</button>                </td>
            `;

            cartTableBody.appendChild(row);
        });

        cartTotalElement.textContent = total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

        // Thêm sự kiện click cho nút "Xóa"
        document.querySelectorAll('.delete-item').forEach(button => {
            button.addEventListener('click', function () {
                const cartItemId = this.dataset.cartitemid;
                deleteCartItem(cartItemId);
            });
        });

        document.querySelectorAll('.checkout-item').forEach(button => {
            button.addEventListener('click', function () {
                const cartItemId = this.dataset.cartitemid;
                checkoutItem(cartItemId);
            });
        });

        // Thêm sự kiện click cho nút "Thanh toán tất cả"
        document.getElementById('checkout-all-btn').addEventListener('click', function () {
            checkoutAllItems();
        });
    }

    function deleteCartItem(cartItemId) {
        fetch(`../api/api.php?endpoint=cart&cartItemID=${cartItemId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Xóa thành công!'));
                // Tải lại giỏ hàng
                fetch(`../api/api.php?endpoint=cart&userID=${userId}`)
                    .then(response => response.json())
                    .then(cartItems => {
                        displayCartItems(cartItems);
                    });
            })
            .catch(error => {
                console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
                alert('Có lỗi xảy ra khi xóa khỏi giỏ hàng.');
            });
    }

    function checkoutItem(cartItemId) {
        fetch('../api/api.php?endpoint=checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemIDs: [cartItemId] }),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Thanh toán thành công!'));
                // Tải lại giỏ hàng
                fetch(`../api/api.php?endpoint=cart&userID=${userId}`)
                    .then(response => response.json())
                    .then(cartItems => {
                        displayCartItems(cartItems);
                    });
            })
            .catch(error => {
                console.error('Lỗi khi thanh toán:', error);
                alert('Có lỗi xảy ra khi thanh toán.');
            });
    }

    function checkoutAllItems() {
        const selectedItems = Array.from(document.querySelectorAll('.select-item:checked')).map(item => item.dataset.cartitemid);
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
            return;
        }

        fetch('../api/api.php?endpoint=checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemIDs: selectedItems }),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || (data.error ? 'Lỗi: ' + data.error : 'Thanh toán thành công!'));
                // Tải lại giỏ hàng
                fetch(`../api/api.php?endpoint=cart&userID=${userId}`)
                    .then(response => response.json())
                    .then(cartItems => {
                        displayCartItems(cartItems);
                    });
            })
            .catch(error => {
                console.error('Lỗi khi thanh toán:', error);
                alert('Có lỗi xảy ra khi thanh toán.');
            });
    }
});