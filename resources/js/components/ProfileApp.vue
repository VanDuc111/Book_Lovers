<template>
    <section class="profile-section">
        <div class="container profile-wrapper">
            <!-- Sidebar Navigation -->
            <aside class="profile-sidebar glass">
                <div class="user-profile-header">
                    <div class="avatar-container">
                        <img :src="avatarUrl" id="profile-avatar-img" alt="Avatar">
                        <div class="edit-avatar">
                            <i class="fas fa-camera"></i>
                        </div>
                    </div>
                    <h3 id="sidebar-name">{{ user.name || 'Người dùng' }}</h3>
                    <p id="sidebar-email">{{ user.email || 'email@example.com' }}</p>
                </div>

                <nav class="profile-nav">
                    <div 
                        v-for="item in navItems" 
                        :key="item.id"
                        class="profile-nav-item" 
                        :class="{ active: activeTab === item.id }"
                        @click="switchTab(item.id)"
                    >
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                    </div>
                    <a href="#" @click.prevent="logout" class="profile-nav-item" style="color: #e74c3c;">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Đăng xuất</span>
                    </a>
                </nav>
            </aside>

            <!-- Main Content Area -->
            <main class="profile-content">
                <!-- Profile Info Pane -->
                <div v-show="activeTab === 'profile-info'" class="content-pane glass active">
                    <div class="content-header">
                        <h2>Cài đặt hồ sơ</h2>
                        <p>Quản lý thông tin cá nhân và cài đặt tài khoản của bạn</p>
                    </div>

                    <div class="profile-form-grid">
                        <div class="form-group full-width">
                            <label for="name">Họ và tên</label>
                            <input type="text" v-model="user.name" id="name" placeholder="Nhập họ tên của bạn">
                        </div>

                        <div class="form-group">
                            <label for="email">Địa chỉ Email</label>
                            <input type="email" v-model="user.email" id="email" readonly>
                        </div>

                        <div class="form-group">
                            <label for="phone">Số điện thoại</label>
                            <input type="tel" v-model="user.phone" id="phone" placeholder="Nhập số điện thoại">
                        </div>

                        <div class="form-group full-width">
                            <label for="address">Địa chỉ giao hàng</label>
                            <input type="text" v-model="user.address" id="address" placeholder="Nhập địa chỉ của bạn">
                        </div>
                    </div>

                    <button type="button" class="btn-main save-profile-btn mt-4" @click="updateProfile" :disabled="saving">
                        <i class="fas" :class="saving ? 'fa-spinner fa-spin' : 'fa-save'"></i>
                        <span class="ms-2">{{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
                    </button>
                </div>

                <!-- Orders Pane -->
                <div v-show="activeTab === 'my-orders'" class="content-pane glass active">
                    <div class="content-header">
                        <h2>Lịch sử đơn hàng</h2>
                        <p>Theo dõi trạng thái và quản lý các đơn hàng bạn đã đặt</p>
                    </div>
                    
                    <div v-if="loadingOrders" class="text-center py-5">
                        <i class="fas fa-spinner fa-spin fa-3x text-muted"></i>
                        <p class="mt-3">Đang tải đơn hàng...</p>
                    </div>
                    
                    <div v-else-if="orders.length === 0" class="text-center py-5">
                        <i class="fas fa-shopping-bag fa-4x mb-3 text-muted" style="opacity: 0.3;"></i>
                        <p class="text-muted">Bạn chưa có đơn hàng nào.</p>
                        <a href="/book-list" class="btn mt-3">Mua sắm ngay</a>
                    </div>

                    <div v-else class="orders-container">
                        <div v-for="order in orders" :key="order.orderID" class="order-card">
                            <div class="order-header">
                                <div class="order-id">
                                    <i class="fas fa-receipt"></i>
                                    <span>Đơn hàng #{{ order.orderID }}</span>
                                </div>
                                <span class="order-status" :class="getStatusClass(order.order_status)">
                                    {{ order.order_status }}
                                </span>
                            </div>
                            <div class="order-body">
                                <div class="order-info-row">
                                    <i class="far fa-calendar-alt"></i>
                                    <span>{{ formatOrderDate(order.order_date) }}</span>
                                </div>
                                <div class="order-info-row">
                                    <i class="fas fa-money-bill-wave"></i>
                                    <span class="price">{{ formatCurrency(order.total_amount) }}</span>
                                </div>
                                <div class="order-info-row">
                                    <i class="fas fa-credit-card"></i>
                                    <span>{{ order.payment_method || 'COD' }}</span>
                                </div>
                                <div v-if="order.shipping_address" class="order-info-row">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>{{ order.shipping_address }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                 <!-- Purchased Books Pane -->
                <div v-show="activeTab === 'purchased-books-pane'" class="content-pane glass active">
                    <div class="content-header">
                        <h2>Thư viện của tôi</h2>
                        <p>Xem toàn bộ các cuốn sách bạn đã mua và sở hữu</p>
                    </div>
                    
                    <div v-if="loadingPurchased" class="text-center py-5">
                        <i class="fas fa-spinner fa-spin fa-3x text-muted"></i>
                        <p class="mt-3">Đang tải tủ sách...</p>
                    </div>

                    <div v-else-if="purchasedBooks.length === 0" class="text-center py-5">
                        <i class="fas fa-book-reader fa-4x mb-3 text-muted" style="opacity: 0.3;"></i>
                        <p class="text-muted">Xem tủ sách cá nhân của bạn để bắt đầu đọc.</p>
                        <a href="/book-list" class="btn btn-main mt-3">Đi tới thư viện</a>
                    </div>

                    <div v-else class="row g-4">
                        <div v-for="book in purchasedBooks" :key="book.bookID" class="col-6 col-md-4 col-lg-3 mb-4">
                            <div class="purchased-book-card">
                                <div class="p-book-image-wrapper">
                                    <img :src="book.image || 'https://fakeimg.pl/200x300/f0f0f0/909090?text=No+Image'" 
                                         class="p-book-image" :alt="book.title">
                                </div>
                                <div class="p-book-info">
                                    <a :href="'/book-details?id=' + book.bookID" class="p-book-title" :title="book.title">
                                        {{ book.title }}
                                    </a>
                                    <div class="p-book-author">{{ book.author || 'Đang cập nhật' }}</div>
                                    <div class="p-book-price price">
                                        {{ formatCurrency(book.purchase_price) }}
                                    </div>
                                    <div class="p-book-date">
                                        <i class="far fa-calendar-alt"></i>
                                        Mua ngày: {{ formatDateShort(book.order_date) }}
                                    </div>
                                    <div class="p-book-actions">
                                        <a :href="'/book-details?id=' + book.bookID" class="btn btn-main btn-read-now">Mua lại</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Wishlist Pane -->
                <div v-show="activeTab === 'wishlist'" class="content-pane glass active">
                    <div class="content-header">
                        <h2>Danh sách yêu thích</h2>
                        <p>Những cuốn sách bạn đã lưu để xem sau</p>
                    </div>
                    <div class="text-center py-5">
                        <i class="fas fa-heart fa-4x mb-3 text-muted" style="opacity: 0.3;"></i>
                        <p class="text-muted">Danh sách yêu thích của bạn đang trống.</p>
                    </div>
                </div>

                <!-- Change Password Pane -->
                <div v-show="activeTab === 'change-password'" class="content-pane glass active">
                    <div class="content-header">
                        <h2>Đổi mật khẩu</h2>
                        <p>Đảm bảo an toàn cho tài khoản của bạn</p>
                    </div>

                    <div style="max-width: 45rem;">
                        <div class="form-group">
                            <label for="current_password">Mật khẩu hiện tại</label>
                            <div class="password-wrapper">
                                <input type="password" v-model="passwords.current" placeholder="Nhập mật khẩu hiện tại">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="new_password">Mật khẩu mới</label>
                            <div class="password-wrapper">
                                <input type="password" v-model="passwords.new" placeholder="Nhập mật khẩu mới">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="new_password_confirmation">Xác nhận mật khẩu mới</label>
                            <input type="password" v-model="passwords.confirmation" placeholder="Xác nhận mật khẩu mới">
                        </div>

                        <button type="button" class="btn-main save-password-btn mt-3" @click="updatePassword" :disabled="savingPassword">
                            <i class="fas" :class="savingPassword ? 'fa-spinner fa-spin' : 'fa-key'"></i>
                            <span class="ms-2">{{ savingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu' }}</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

const props = defineProps(['config']);

const user = reactive({
    userID: null,
    name: '',
    email: '',
    phone: '',
    address: ''
});

const activeTab = ref('profile-info');
const orders = ref([]);
const purchasedBooks = ref([]);
const loadingOrders = ref(false);
const loadingPurchased = ref(false);
const saving = ref(false);
const savingPassword = ref(false);

const passwords = reactive({
    current: '',
    new: '',
    confirmation: ''
});

const navItems = [
    { id: 'profile-info', label: 'Thông tin cá nhân', icon: 'fas fa-user-circle' },
    { id: 'my-orders', label: 'Đơn hàng của tôi', icon: 'fas fa-box-open' },
    { id: 'purchased-books-pane', label: 'Sách đã mua', icon: 'fas fa-book' },
    { id: 'wishlist', label: 'Danh sách yêu thích', icon: 'fas fa-heart' },
    { id: 'change-password', label: 'Đổi mật khẩu', icon: 'fas fa-shield-alt' }
];

// Fallback to window.profileConfig if props.config is not provided
const safeConfig = computed(() => props.config || window.profileConfig || {});

const avatarUrl = computed(() => {
    const name = user.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff6347&color=fff&size=128`;
});

const tabMap = {
    'orders': 'my-orders',
    'profile': 'profile-info',
    'purchased': 'purchased-books-pane',
    'wishlist': 'wishlist',
    'password': 'change-password'
};

onMounted(() => {
    initUser();
    handleUrlParams();
    fetchUserData();
    fetchOrders();
    fetchPurchasedBooks();
});

const initUser = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let userID = urlParams.get('userID');
    
    if (!userID) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        userID = storedUser ? storedUser.userID : null;
    }
    
    if (!userID) {
        window.location.href = safeConfig.value.loginUrl || '/login';
        return;
    }
    
    user.userID = userID;
};

const handleUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || urlParams.get('target');
    if (initialTab) {
        activeTab.value = tabMap[initialTab] || initialTab;
    }
};

const fetchUserData = async () => {
    if (!safeConfig.value.apiUrl) return;
    try {
        const response = await fetch(`${safeConfig.value.apiUrl}/${user.userID}`);
        const data = await response.json();
        if (data) {
            Object.assign(user, data);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

const fetchOrders = async () => {
    loadingOrders.value = true;
    try {
        const response = await fetch(`/api/orders?userID=${user.userID}`);
        orders.value = await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
    } finally {
        loadingOrders.value = false;
    }
};

const fetchPurchasedBooks = async () => {
    loadingPurchased.value = true;
    try {
        const response = await fetch(`/api/purchased-books?userID=${user.userID}`);
        purchasedBooks.value = await response.json();
    } catch (error) {
        console.error('Error fetching purchased books:', error);
    } finally {
        loadingPurchased.value = false;
    }
};

const switchTab = (tabId) => {
    activeTab.value = tabId;
    // Update URL without reloading
    const url = new URL(window.location);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
};

const updateProfile = async () => {
    saving.value = true;
    try {
        const response = await fetch(`${safeConfig.value.apiUrl}/${user.userID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': safeConfig.value.csrfToken
            },
            body: JSON.stringify({
                name: user.name,
                phone: user.phone,
                address: user.address
            })
        });
        const result = await response.json();
        if (result.success || !result.error) {
            alert('Cập nhật hồ sơ thành công!');
        } else {
            alert('Lỗi: ' + (result.error || result.message));
        }
    } catch (error) {
        alert('Đã xảy ra lỗi khi kết nối server.');
    } finally {
        saving.value = false;
    }
};

const updatePassword = async () => {
    if (!passwords.current || !passwords.new) {
        alert('Vui lòng điền đầy đủ các thông tin mật khẩu.');
        return;
    }

    if (passwords.new !== passwords.confirmation) {
        alert('Xác nhận mật khẩu mới không khớp.');
        return;
    }

    savingPassword.value = true;
    try {
        const response = await fetch(`${safeConfig.value.apiUrl}/${user.userID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': safeConfig.value.csrfToken
            },
            body: JSON.stringify({
                current_password: passwords.current,
                password: passwords.new
            })
        });
        const result = await response.json();
        if (result.success || !result.error) {
            alert('Đổi mật khẩu thành công!');
            passwords.current = '';
            passwords.new = '';
            passwords.confirmation = '';
        } else {
            alert('Lỗi: ' + (result.error || result.message));
        }
    } catch (error) {
        alert('Đã xảy ra lỗi khi kết nối server.');
    } finally {
        savingPassword.value = false;
    }
};

const logout = () => {
    localStorage.removeItem('user');
    window.location.href = safeConfig.value.homeUrl || '/';
};

const formatCurrency = (value) => {
    if (!value) return '0 ₫';
    return Number(value).toLocaleString('vi-VN') + ' ₫';
};

const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
};

const getStatusClass = (status) => {
    const map = {
        'Pending': 'badge-warning',
        'Processing': 'badge-info',
        'Shipped': 'badge-primary',
        'Delivered': 'badge-success',
        'Cancelled': 'badge-danger'
    };
    return map[status] || 'badge-secondary';
};
</script>

<style scoped>
.badge-warning { background-color: #ffc107; color: #000; }
.badge-info { background-color: #17a2b8; color: #fff; }
.badge-primary { background-color: #007bff; color: #fff; }
.badge-success { background-color: #28a745; color: #fff; }
.badge-danger { background-color: #dc3545; color: #fff; }
.badge-secondary { background-color: #6c757d; color: #fff; }

.order-status {
    padding: 0.25rem 0.6rem;
    border-radius: 50rem;
    font-size: 0.85rem;
    font-weight: 500;
}
</style>
