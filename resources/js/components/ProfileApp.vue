<template>
    <section class="profile-section">
        <div class="container profile-wrapper">
            <!-- Sidebar Navigation -->
            <profile-sidebar 
                :user-name="user.name"
                :user-email="user.email"
                :active-tab="activeTab"
                :nav-items="navItems"
                @switch-tab="switchTab"
                @logout="logout"
            />

            <!-- Main Content Area -->
            <main class="profile-content">
                <!-- Profile Info Pane -->
                <profile-info-pane 
                    v-show="activeTab === 'profile-info'"
                    :user="user"
                    :loading="saving"
                    @update-profile="updateProfile"
                />

                <!-- Orders Pane -->
                <order-history 
                    v-show="activeTab === 'my-orders'"
                    :orders="orders"
                    :loading="loadingOrders"
                />

                <!-- Purchased Books Pane -->
                <purchased-books 
                    v-show="activeTab === 'purchased-books-pane'"
                    :books="purchasedBooks"
                    :loading="loadingPurchased"
                />

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
                <change-password 
                    v-show="activeTab === 'change-password'"
                    :loading="savingPassword"
                    @update-password="updatePassword"
                />
            </main>
        </div>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import ProfileSidebar from './profile/ProfileSidebar.vue';
import ProfileInfoPane from './profile/ProfileInfoPane.vue';
import OrderHistory from './profile/OrderHistory.vue';
import PurchasedBooks from './profile/PurchasedBooks.vue';
import ChangePassword from './profile/ChangePassword.vue';

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

const navItems = [
    { id: 'profile-info', label: 'Thông tin cá nhân', icon: 'fas fa-user-circle' },
    { id: 'my-orders', label: 'Đơn hàng của tôi', icon: 'fas fa-box-open' },
    { id: 'purchased-books-pane', label: 'Sách đã mua', icon: 'fas fa-book' },
    { id: 'wishlist', label: 'Danh sách yêu thích', icon: 'fas fa-heart' },
    { id: 'change-password', label: 'Đổi mật khẩu', icon: 'fas fa-shield-alt' }
];

const safeConfig = computed(() => props.config || window.profileConfig || {});

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
    const url = new URL(window.location);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
};

const updateProfile = async (updatedData) => {
    // Validate phone number format (Vietnamese mobile standard: 10 digits, starts with 03, 05, 07, 08, 09)
    if (updatedData.phone) {
        const phoneRegex = /^(0)(3|5|7|8|9)[0-9]{8}$/;
        if (!phoneRegex.test(updatedData.phone)) {
            if (window.showToast) window.showToast('Số điện thoại không đúng định dạng (VD: 0912345678)', 'warning');
            else alert('Số điện thoại không đúng định dạng');
            return;
        }
    }

    saving.value = true;
    try {
        const response = await fetch(`${safeConfig.value.apiUrl}/${user.userID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': safeConfig.value.csrfToken
            },
            body: JSON.stringify({
                name: updatedData.name,
                phone: updatedData.phone,
                address: updatedData.address
            })
        });
        const result = await response.json();
        if (result.success || !result.error) {
            if (window.showToast) window.showToast('Cập nhật hồ sơ thành công!', 'success');
            else alert('Cập nhật hồ sơ thành công!');
            Object.assign(user, updatedData);
        } else {
            if (window.showToast) window.showToast('Lỗi: ' + (result.error || result.message), 'danger');
            else alert('Lỗi: ' + (result.error || result.message));
        }
    } catch (error) {
        if (window.showToast) window.showToast('Đã xảy ra lỗi khi kết nối server.', 'danger');
        else alert('Đã xảy ra lỗi khi kết nối server.');
    } finally {
        saving.value = false;
    }
};

const updatePassword = async (passwords) => {
    if (!passwords.current || !passwords.new) {
        if (window.showToast) window.showToast('Vui lòng điền đầy đủ các thông tin mật khẩu.', 'warning');
        return;
    }

    if (passwords.new.length < 8) {
        if (window.showToast) window.showToast('Mật khẩu mới phải có ít nhất 8 ký tự.', 'warning');
        return;
    }

    if (passwords.new !== passwords.confirmation) {
        if (window.showToast) window.showToast('Xác nhận mật khẩu mới không khớp.', 'warning');
        return;
    }

    if (passwords.new === passwords.current) {
        if (window.showToast) window.showToast('Mật khẩu mới không được trùng với mật khẩu hiện tại.', 'warning');
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
            if (window.showToast) window.showToast('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', 'success');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            const errorMsg = result.error || result.message || 'Lỗi không xác định';
            if (window.showToast) window.showToast(errorMsg, 'danger');
            else alert('Lỗi: ' + errorMsg);
        }
    } catch (error) {
        if (window.showToast) window.showToast('Đã xảy ra lỗi khi kết nối server.', 'danger');
    } finally {
        savingPassword.value = false;
    }
};

const logout = () => {
    localStorage.removeItem('user');
    window.location.href = safeConfig.value.homeUrl || '/';
};
</script>

<style scoped>
.profile-section {
    padding: 3rem 0;
    min-height: 80vh;
    background: url('/assets/icons/profile-background.avif') center/cover no-repeat fixed,
                var(--grad-profile);
    position: relative;
}

.profile-wrapper {
    display: flex;
    gap: 3rem;
    align-items: flex-start;
    position: relative;
    z-index: 2;
}

.profile-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(5px);
    z-index: 1;
}

.profile-content { flex: 1; }

.content-pane {
    padding: 4rem;
    background: rgba(255, 255, 255, 0.95) !important;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-medium);
    animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.content-header { margin-bottom: 2.5rem; }
.content-header h2 { font-size: var(--fs-h2); color: var(--black); text-align: left; margin-bottom: 0.5rem; font-weight: 700; }
.content-header p { font-size: var(--fs-sm); color: var(--light-color); }

@media (max-width: 991px) {
    .profile-wrapper { flex-direction: column; }
    .content-pane { padding: 2rem; }
}
</style>
