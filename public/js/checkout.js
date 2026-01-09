import { getUserId } from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
    const userId = getUserId();
    
    if (!userId) {
        showToast("Vui lòng đăng nhập để thanh toán", "warning");
        setTimeout(() => {
            window.location.href = "/login";
        }, 1500);
        return;
    }

    // Get cart items from URL params (passed from cart page)
    const urlParams = new URLSearchParams(window.location.search);
    const cartItemIDs = urlParams.get('items')?.split(',') || [];

    if (cartItemIDs.length === 0) {
        showToast("Không có sản phẩm nào để thanh toán", "warning");
        setTimeout(() => {
            window.location.href = "/cart";
        }, 1500);
        return;
    }

    // Load user info and cart items
    loadUserInfo();
    loadOrderItems(cartItemIDs);

    // Province/District/Ward cascading
    setupLocationSelectors();

    // Place order button
    document.getElementById('place-order-btn').addEventListener('click', handlePlaceOrder);
});

// Load user information
async function loadUserInfo() {
    const userId = getUserId();
    try {
        const response = await fetch(`/api/users/${userId}`);
        const user = await response.json();
        
        if (user) {
            document.getElementById('fullName').value = user.name || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('address').value = user.address || '';
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

// Load order items
async function loadOrderItems(cartItemIDs) {
    const userId = getUserId();
    const orderItemsContainer = document.getElementById('order-items');
    
    try {
        const response = await fetch(`/api/cart?userID=${userId}`);
        const allCartItems = await response.json();
        
        // Filter only selected items
        const selectedItems = allCartItems.filter(item => 
            cartItemIDs.includes(item.cartItemID.toString())
        );

        if (selectedItems.length === 0) {
            orderItemsContainer.innerHTML = '<p class="text-center">Không có sản phẩm nào</p>';
            return;
        }

        // Render items
        let itemsHTML = '';
        let subtotal = 0;

        selectedItems.forEach(item => {
            const itemTotal = item.bookPrice * item.quantity;
            subtotal += itemTotal;

            itemsHTML += `
                <div class="order-item">
                    <img src="${item.image || '/assets/images/default.jpg'}" alt="${item.title}" class="item-image">
                    <div class="item-details">
                        <div class="item-title">${item.title}</div>
                        <div class="item-meta">Số lượng: ${item.quantity}</div>
                        <div class="item-price">${Number(itemTotal).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} ₫</div>
                    </div>
                </div>
            `;
        });

        orderItemsContainer.innerHTML = itemsHTML;

        // Update summary
        const shippingFee = 30000;
        const discount = 0;
        const total = subtotal + shippingFee - discount;

        document.getElementById('subtotal').textContent = Number(subtotal).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' ₫';
        document.getElementById('shipping-fee').textContent = Number(shippingFee).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' ₫';
        document.getElementById('discount').textContent = '- ' + Number(discount).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' ₫';
        document.getElementById('total-amount').textContent = Number(total).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' ₫';

        // Store for later use
        window.checkoutData = {
            items: selectedItems,
            subtotal,
            shippingFee,
            discount,
            total
        };

    } catch (error) {
        console.error('Error loading order items:', error);
        orderItemsContainer.innerHTML = '<p class="text-center text-danger">Lỗi khi tải sản phẩm</p>';
    }
}

// Setup location selectors (Province/District/Ward)
function setupLocationSelectors() {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');

    // Mock data for demo (in production, use real API)
    const locations = {
        hanoi: {
            name: 'Hà Nội',
            districts: {
                'ba-dinh': { name: 'Ba Đình', wards: ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc', 'Cống Vị'] },
                'hoan-kiem': { name: 'Hoàn Kiếm', wards: ['Phúc Tân', 'Đồng Xuân', 'Hàng Mã', 'Hàng Buồm'] },
                'dong-da': { name: 'Đống Đa', wards: ['Cát Linh', 'Văn Miếu', 'Quốc Tử Giám', 'Láng Thượng'] }
            }
        },
        hcm: {
            name: 'TP. Hồ Chí Minh',
            districts: {
                'q1': { name: 'Quận 1', wards: ['Bến Nghé', 'Bến Thành', 'Nguyễn Thái Bình', 'Phạm Ngũ Lão'] },
                'q3': { name: 'Quận 3', wards: ['Võ Thị Sáu', 'Phường 1', 'Phường 2', 'Phường 3'] },
                'thu-duc': { name: 'Thủ Đức', wards: ['Linh Xuân', 'Bình Chiểu', 'Linh Trung', 'Tam Bình'] }
            }
        }
    };

    provinceSelect.addEventListener('change', function() {
        const provinceCode = this.value;
        districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';
        wardSelect.innerHTML = '<option value="">-- Chọn Phường/Xã --</option>';

        if (provinceCode && locations[provinceCode]) {
            const districts = locations[provinceCode].districts;
            for (const [code, data] of Object.entries(districts)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = data.name;
                districtSelect.appendChild(option);
            }
        }
    });

    districtSelect.addEventListener('change', function() {
        const provinceCode = provinceSelect.value;
        const districtCode = this.value;
        wardSelect.innerHTML = '<option value="">-- Chọn Phường/Xã --</option>';

        if (provinceCode && districtCode && locations[provinceCode]?.districts[districtCode]) {
            const wards = locations[provinceCode].districts[districtCode].wards;
            wards.forEach(ward => {
                const option = document.createElement('option');
                option.value = ward;
                option.textContent = ward;
                wardSelect.appendChild(option);
            });
        }
    });
}

// Handle place order
async function handlePlaceOrder() {
    // Validate form
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const province = document.getElementById('province').value;
    const district = document.getElementById('district').value;
    const ward = document.getElementById('ward').value;
    const address = document.getElementById('address').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

    if (!fullName || !phone || !province || !district || !ward || !address) {
        showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'warning');
        return;
    }

    if (!paymentMethod) {
        showToast('Vui lòng chọn phương thức thanh toán', 'warning');
        return;
    }

    // Phone validation
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(phone)) {
        showToast('Số điện thoại không hợp lệ', 'warning');
        return;
    }

    // Build full address
    const provinceText = document.getElementById('province').selectedOptions[0].text;
    const districtText = document.getElementById('district').selectedOptions[0].text;
    const wardText = document.getElementById('ward').selectedOptions[0].text;
    const fullAddress = `${address}, ${wardText}, ${districtText}, ${provinceText}`;

    const note = document.getElementById('note').value.trim();

    // Prepare order data
    const userId = getUserId();
    const urlParams = new URLSearchParams(window.location.search);
    const cartItemIDs = urlParams.get('items')?.split(',').map(id => parseInt(id)) || [];

    const orderData = {
        userID: userId,
        cartItemIDs: cartItemIDs,
        shipping_address: fullAddress,
        payment_method: paymentMethod,
        note: note,
        receiver_name: fullName,
        receiver_phone: phone
    };

    // Disable button
    const placeOrderBtn = document.getElementById('place-order-btn');
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (data.success || data.orderID) {
            showToast('Đặt hàng thành công!', 'success');
            
            // Redirect to order success page or profile
            setTimeout(() => {
                window.location.href = `/profile?userID=${userId}&tab=orders`;
            }, 1500);
        } else {
            showToast(data.error || 'Có lỗi xảy ra khi đặt hàng', 'danger');
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Đặt hàng';
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showToast('Có lỗi xảy ra khi đặt hàng', 'danger');
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Đặt hàng';
    }
}
