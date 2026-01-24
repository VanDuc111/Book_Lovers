<template>
    <div class="checkout-container">
        <div v-if="loading" class="text-center py-5">
            <i class="fas fa-spinner fa-spin fa-3x text-muted"></i>
            <p class="mt-3">Đang chuẩn bị đơn hàng...</p>
        </div>

        <div v-else class="checkout-wrapper">
            <!-- Left Column: Form -->
            <div class="checkout-form-section">
                <div class="checkout-header">
                    <h1>Thanh toán</h1>
                    <p class="text-muted">Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng</p>
                </div>

                <!-- Shipping Address -->
                <div class="checkout-card">
                    <div class="card-header">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>Địa chỉ giao hàng</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="fullName">Họ và tên <span class="required">*</span></label>
                            <input type="text" v-model="form.fullName" class="form-control" placeholder="Nguyễn Văn A">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="phone">Số điện thoại <span class="required">*</span></label>
                                <input type="tel" v-model="form.phone" class="form-control" placeholder="0912345678">
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" v-model="form.email" class="form-control" placeholder="example@email.com">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Chọn địa chỉ giao hàng <span class="required">*</span></label>
                            <div class="address-options">
                                <label class="address-option">
                                    <input type="radio" v-model="form.addressType" value="default">
                                    <div class="address-option-content">
                                        <div class="address-option-title">Địa chỉ mặc định</div>
                                        <div class="address-option-desc">{{ defaultAddressDisplay }}</div>
                                    </div>
                                </label>
                                <label class="address-option">
                                    <input type="radio" v-model="form.addressType" value="new">
                                    <div class="address-option-content">
                                        <div class="address-option-title">Địa chỉ mới</div>
                                        <div class="address-option-desc">Nhập địa chỉ giao hàng mới</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div v-if="form.addressType === 'new'" id="newAddressFields">
                            <div class="form-group">
                                <label for="province">Tỉnh/Thành phố <span class="required">*</span></label>
                                <select v-model="form.province" @change="handleProvinceChange" class="form-control">
                                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                    <option v-for="(p, key) in locations" :key="key" :value="key">{{ p.name }}</option>
                                </select>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="district">Quận/Huyện <span class="required">*</span></label>
                                    <select v-model="form.district" @change="handleDistrictChange" class="form-control">
                                        <option value="">-- Chọn Quận/Huyện --</option>
                                        <option v-for="(d, key) in currentDistricts" :key="key" :value="key">{{ d.name }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="ward">Phường/Xã <span class="required">*</span></label>
                                    <select v-model="form.ward" class="form-control">
                                        <option value="">-- Chọn Phường/Xã --</option>
                                        <option v-for="w in currentWards" :key="w" :value="w">{{ w }}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="address">Địa chỉ cụ thể <span class="required">*</span></label>
                                <input type="text" v-model="form.address" class="form-control" placeholder="Số nhà, tên đường...">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="note">Ghi chú đơn hàng</label>
                            <textarea v-model="form.note" class="form-control" rows="3" placeholder="Ghi chú thêm (tùy chọn)..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Payment Method -->
                <div class="checkout-card">
                    <div class="card-header">
                        <i class="fas fa-credit-card"></i>
                        <h3>Phương thức thanh toán</h3>
                    </div>
                    <div class="card-body">
                        <div class="payment-methods">
                            <label v-for="method in paymentMethods" :key="method.id" class="payment-option">
                                <input type="radio" v-model="form.payment" :value="method.id">
                                <div class="payment-content">
                                    <div class="payment-icon">
                                        <i :class="method.icon"></i>
                                    </div>
                                    <div class="payment-info">
                                        <h4>{{ method.title }}</h4>
                                        <p>{{ method.desc }}</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Order Summary -->
            <div class="checkout-summary-section">
                <div class="summary-sticky">
                    <div class="checkout-card">
                        <div class="card-header">
                            <i class="fas fa-shopping-bag"></i>
                            <h3>Đơn hàng của bạn</h3>
                        </div>
                        <div class="card-body">
                            <div class="order-items">
                                <div v-for="item in cartItems" :key="item.cartItemID" class="order-item">
                                    <img :src="item.image || '/assets/images/placeholder.jpg'" :alt="item.title" class="item-image">
                                    <div class="item-details">
                                        <div class="item-title">{{ item.title }}</div>
                                        <div class="item-meta">Số lượng: {{ item.quantity }}</div>
                                        <div class="item-price">{{ formatPrice(item.bookPrice * item.quantity) }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="order-summary">
                                <div class="summary-row">
                                    <span>Tạm tính</span>
                                    <span>{{ formatPrice(subtotal) }}</span>
                                </div>
                                <div class="summary-row">
                                    <span>Phí vận chuyển</span>
                                    <span>{{ formatPrice(shippingFee) }}</span>
                                </div>
                                <div class="summary-row discount">
                                    <span>Giảm giá</span>
                                    <span>- {{ formatPrice(discount) }}</span>
                                </div>
                                <div class="summary-divider"></div>
                                <div class="summary-row total">
                                    <span>Tổng cộng</span>
                                    <span>{{ formatPrice(total) }}</span>
                                </div>
                            </div>

                            <button @click="handlePlaceOrder" class="btn-checkout" :disabled="placing">
                                <i v-if="placing" class="fas fa-spinner fa-spin me-2"></i>
                                <span v-else><i class="fas fa-lock me-2"></i> Đặt hàng</span>
                            </button>

                            <div class="security-badges">
                                <div class="badge-item">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>Bảo mật thanh toán</span>
                                </div>
                                <div class="badge-item">
                                    <i class="fas fa-truck"></i>
                                    <span>Giao hàng toàn quốc</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a href="/cart" class="back-to-cart">
                        <i class="fas fa-arrow-left"></i>
                        Quay lại giỏ hàng
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

const loading = ref(true);
const placing = ref(false);
const cartItems = ref([]);
const userData = ref(null);
const userId = ref(null);

const form = reactive({
    fullName: '',
    phone: '',
    email: '',
    addressType: 'default',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: '',
    payment: 'cod'
});

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

const paymentMethods = [
    { id: 'cod', title: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi nhận hàng', icon: 'fas fa-money-bill-wave' },
    { id: 'bank', title: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua VietQR hoặc số tài khoản', icon: 'fas fa-university' },
    { id: 'momo', title: 'Ví điện tử MoMo', desc: 'Thanh toán qua ví MoMo', icon: 'fas fa-wallet' }
];

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + (item.bookPrice * item.quantity), 0));
const shippingFee = ref(30000);
const discount = ref(0);
const total = computed(() => subtotal.value + shippingFee.value - discount.value);

const currentDistricts = computed(() => form.province ? locations[form.province].districts : {});
const currentWards = computed(() => (form.province && form.district) ? locations[form.province].districts[form.district].wards : []);

const defaultAddressDisplay = computed(() => {
    if (userData.value?.address) return userData.value.address;
    return 'Chưa có địa chỉ mặc định';
});

onMounted(async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login';
        return;
    }
    userId.value = user.userID;

    const urlParams = new URLSearchParams(window.location.search);
    const itemIds = urlParams.get('items')?.split(',') || [];
    
    if (itemIds.length === 0) {
        window.location.href = '/cart';
        return;
    }

    await Promise.all([fetchUserInfo(), fetchCartItems(itemIds)]);
    loading.value = false;
});

const fetchUserInfo = async () => {
    try {
        const res = await fetch(`/api/users/${userId.value}`);
        const data = await res.json();
        userData.value = data;
        form.fullName = data.name || '';
        form.phone = data.phone || '';
        form.email = data.email || '';
        if (!data.address) {
            form.addressType = 'new';
        }
    } catch (e) { console.error(e); }
};

const fetchCartItems = async (ids) => {
    try {
        const res = await fetch(`/api/cart?userID=${userId.value}`);
        const all = await res.json();
        cartItems.value = all.filter(i => ids.includes(i.cartItemID.toString()));
    } catch (e) { console.error(e); }
};

const handleProvinceChange = () => { form.district = ''; form.ward = ''; };
const handleDistrictChange = () => { form.ward = ''; };

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(p);

const handlePlaceOrder = async () => {
    if (!form.fullName || !form.phone) {
        alert('Vui lòng điền đủ họ tên và số điện thoại');
        return;
    }

    let finalAddress = userData.value?.address;
    if (form.addressType === 'new') {
        if (!form.province || !form.district || !form.ward || !form.address) {
            alert('Vui lòng điền đầy đủ địa chỉ giao hàng');
            return;
        }
        const p = locations[form.province].name;
        const d = locations[form.province].districts[form.district].name;
        finalAddress = `${form.address}, ${form.ward}, ${d}, ${p}`;
    } else if (!finalAddress) {
        alert('Bạn chưa có địa chỉ mặc định, vui lòng chọn Địa chỉ mới');
        return;
    }

    placing.value = true;
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userID: userId.value,
                cartItemIDs: cartItems.value.map(i => i.cartItemID),
                shipping_address: finalAddress,
                payment_method: form.payment,
                note: form.note,
                receiver_name: form.fullName,
                receiver_phone: form.phone
            })
        });
        const data = await response.json();
        if (data.success || data.orderID) {
            if (window.showToast) window.showToast('Đặt hàng thành công!', 'success');
            setTimeout(() => {
                window.location.href = `/profile?tab=my-orders`;
            }, 1500);
        } else {
            alert(data.error || 'Có lỗi xảy ra khi đặt hàng');
            placing.value = false;
        }
    } catch (e) {
        alert('Lỗi kết nối server');
        placing.value = false;
    }
};
</script>

<style scoped>
/* Inherit styles from checkout.css if needed, 
   but adding specific scoped styles here for structure */
.address-option {
    display: flex;
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 10px;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s;
}
.address-option:hover { background: #f9f9f9; }
.address-option input:checked + .address-option-content { font-weight: bold; }

.payment-methods {
    display: grid;
    gap: 1.5rem;
}
.payment-option {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
}
.payment-option:hover { border-color: var(--brand-orange); }
.payment-info h4 { font-size: 1.4rem; margin-bottom: 0.2rem; }
.payment-info p { font-size: 1.1rem; color: #777; margin: 0; }
.payment-icon { font-size: 2rem; margin: 0 1.5rem; color: var(--brand-orange); }

.required { color: red; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media (max-width: 576px) { .form-row { grid-template-columns: 1fr; } }
</style>
