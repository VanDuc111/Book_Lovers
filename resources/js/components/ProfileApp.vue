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
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import ProfileSidebar from './profile/ProfileSidebar.vue';
import ProfileInfoPane from './profile/ProfileInfoPane.vue';
import OrderHistory from './profile/OrderHistory.vue';
import PurchasedBooks from './profile/PurchasedBooks.vue';
import ChangePassword from './profile/ChangePassword.vue';

// Import Services
import UserService from '@/services/UserService';
import OrderService from '@/services/OrderService';
import AuthService from '@/services/AuthService';

const props = defineProps(['config']);
const queryClient = useQueryClient();
const userId = ref(null);
const activeTab = ref('profile-info');

const user = reactive({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: ''
});

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

// 1. Query User Info
const userQuery = useQuery({
    queryKey: computed(() => ['user-profile', userId.value]),
    queryFn: () => UserService.getUserById(userId.value),
    enabled: computed(() => !!userId.value),
});

watch(() => userQuery.data.value, (newData) => {
    if (newData) Object.assign(user, newData);
}, { immediate: true });

// 2. Query Orders
const ordersQuery = useQuery({
    queryKey: computed(() => ['user-orders', userId.value]),
    queryFn: () => OrderService.getMyOrders(userId.value),
    enabled: computed(() => !!userId.value),
});

const orders = computed(() => ordersQuery.data.value || []);
const loadingOrders = computed(() => ordersQuery.isLoading.value);

// 3. Query Purchased Books
const purchasedQuery = useQuery({
    queryKey: computed(() => ['purchased-books', userId.value]),
    queryFn: () => OrderService.getPurchasedBooks(userId.value),
    enabled: computed(() => !!userId.value),
});

const purchasedBooks = computed(() => purchasedQuery.data.value || []);
const loadingPurchased = computed(() => purchasedQuery.isLoading.value);

// Mutations
const updateProfileMutation = useMutation({
    mutationFn: (data) => UserService.updateProfile(userId.value, data),
    onSuccess: (data) => {
        if (data.success || !data.error) {
            if (window.showToast) window.showToast('Cập nhật hồ sơ thành công!', 'success');
            queryClient.invalidateQueries({ queryKey: ['user-profile', userId.value] });
        }
    }
});

const updatePasswordMutation = useMutation({
    mutationFn: (data) => UserService.updatePassword(userId.value, data),
    onSuccess: (data) => {
         if (data.success || !data.error) {
            if (window.showToast) window.showToast('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', 'success');
            setTimeout(() => logout(), 2000);
        } else {
             if (window.showToast) window.showToast(data.error || 'Lỗi đổi mật khẩu', 'danger');
        }
    }
});

const saving = computed(() => updateProfileMutation.isPending.value);
const savingPassword = computed(() => updatePasswordMutation.isPending.value);

onMounted(() => {
    const storedUser = AuthService.getCurrentUser();
    if (!storedUser) {
        window.location.href = '/login';
        return;
    }
    userId.value = storedUser.id;
    
    // Handle URL Params
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || urlParams.get('target');
    if (initialTab) activeTab.value = tabMap[initialTab] || initialTab;
});

const switchTab = (tabId) => {
    activeTab.value = tabId;
    const url = new URL(window.location);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
};

const updateProfile = (updatedData) => {
    // Basic phone validation
    if (updatedData.phone && !/^(0)(3|5|7|8|9)[0-9]{8}$/.test(updatedData.phone)) {
        if (window.showToast) window.showToast('Số điện thoại không đúng định dạng', 'warning');
        return;
    }
    updateProfileMutation.mutate(updatedData);
};

const updatePassword = (passwords) => {
    if (passwords.new.length < 8) {
        if (window.showToast) window.showToast('Mật khẩu mới phải có ít nhất 8 ký tự.', 'warning');
        return;
    }
    if (passwords.new !== passwords.confirmation) {
        if (window.showToast) window.showToast('Xác nhận mật khẩu mới không khớp.', 'warning');
        return;
    }
    updatePasswordMutation.mutate({
        current_password: passwords.current,
        password: passwords.new
    });
};

const logout = () => AuthService.logout();
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
