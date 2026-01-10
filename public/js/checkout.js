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

    // Address type selection
    setupAddressSelection();

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
            // Store user data globally
            window.userData = user;
            
            // Fill form fields
            document.getElementById('fullName').value = user.name || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('email').value = user.email || '';
            
            // Show default address preview if exists
            const defaultAddressPreview = document.getElementById('defaultAddressPreview');
            if (user.address && user.phone) {
                defaultAddressPreview.textContent = `${user.address} - ${user.phone}`;
            } else if (user.address) {
                defaultAddressPreview.textContent = user.address;
            } else {
                defaultAddressPreview.textContent = 'Chưa có địa chỉ mặc định';
                // Auto select new address if no default
                document.querySelector('input[name="addressType"][value="new"]').checked = true;
                document.getElementById('newAddressFields').style.display = 'block';
            }
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

// Setup address selection (default vs new)
function setupAddressSelection() {
    const addressTypeRadios = document.querySelectorAll('input[name="addressType"]');
    const newAddressFields = document.getElementById('newAddressFields');
    
    addressTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'new') {
                newAddressFields.style.display = 'block';
            } else {
                newAddressFields.style.display = 'none';
            }
        });
    });
}

// Handle place order
async function handlePlaceOrder() {
    // Get address type
    const addressType = document.querySelector('input[name="addressType"]:checked')?.value;
    
    // Validate form
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    
    let fullAddress;
    let receiverPhone;
    
    if (addressType === 'default') {
        // Use default address from user data
        if (!window.userData || !window.userData.address) {
            showToast('Bạn chưa có địa chỉ mặc định. Vui lòng chọn "Địa chỉ mới"', 'warning');
            return;
        }
        fullAddress = window.userData.address;
        receiverPhone = window.userData.phone || phone;
    } else {
        // Use new address from form
        const province = document.getElementById('province').value;
        const district = document.getElementById('district').value;
        const ward = document.getElementById('ward').value;
        const address = document.getElementById('address').value.trim();
        
        if (!province || !district || !ward || !address) {
            showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'warning');
            return;
        }
        
        // Build full address
        const provinceText = document.getElementById('province').selectedOptions[0].text;
        const districtText = document.getElementById('district').selectedOptions[0].text;
        const wardText = document.getElementById('ward').selectedOptions[0].text;
        fullAddress = `${address}, ${wardText}, ${districtText}, ${provinceText}`;
        receiverPhone = phone;
    }
    
    if (!fullName || !receiverPhone) {
        showToast('Vui lòng điền đầy đủ thông tin người nhận', 'warning');
        return;
    }

    if (!paymentMethod) {
        showToast('Vui lòng chọn phương thức thanh toán', 'warning');
        return;
    }

    // Phone validation
    const phoneRegex = /^(0|\\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(receiverPhone)) {
        showToast('Số điện thoại không hợp lệ', 'warning');
        return;
    }



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
        receiver_phone: receiverPhone
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
            // Save default address if using new address
            if (addressType === 'new') {
                await saveDefaultUserInfo(userId, fullAddress, receiverPhone);
            }

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

// Save default user info (address and phone)
async function saveDefaultUserInfo(userId, address, phone) {
    try {
        await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: address,
                phone: phone
            })
        });
    } catch (error) {
        console.error('Error saving default user info:', error);
    }
}
