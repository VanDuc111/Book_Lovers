<template>
    <section class="profile-section">
        <div class="container profile-wrapper">
            <!-- Sidebar Navigation -->
            <profile-sidebar 
                :user-name="user.name"
                :user-email="user.email"
                :avatar="user.avatar"
                :active-tab="activeTab"
                :nav-items="navItems"
                @switch-tab="switchTab"
                @logout="logout"
                @avatar-selected="handleAvatarSelected"
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

        <!-- Avatar Cropper Modal-->
        <Teleport to="body">
            <div v-if="showCropper" class="avatar-edit-modal-overlay">
                <div class="avatar-edit-modal">
                    <div class="modal-header">
                        <button class="back-btn" @click="closeCropper"><i class="fas fa-chevron-left"></i></button>
                        <h3>Cập nhật ảnh đại diện</h3>
                        <button class="close-btn" @click="closeCropper">&times;</button>
                    </div>
                    <div class="cropper-container">
                        <cropper
                            ref="cropperRef"
                            class="advanced-cropper"
                            :src="cropperSrc"
                            :stencil-component="CircleStencil"
                            :stencil-props="{
                                aspectRatio: 1/1
                            }"
                        />
                    </div>
                    <div class="zoom-wrapper">
                        <i class="fas fa-minus"></i>
                        <input 
                            type="range" 
                            v-model="zoomLevel" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            @input="onZoomLevelChange"
                            class="zoom-slider"
                        >
                        <i class="fas fa-plus"></i>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel" @click="closeCropper">Hủy</button>
                        <button class="btn-update" @click="handleConfirmCrop" :disabled="savingAvatar">
                            {{ savingAvatar ? 'Đang lưu...' : 'Cập nhật' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
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
import MSG from '@/constants/messages';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps(['config']);
const queryClient = useQueryClient();
const userId = ref(null);
const activeTab = ref('profile-info');

const user = reactive({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
});

// Cropper refs & state
const showCropper = ref(false);
const cropperRef = ref(null);
const cropperSrc = ref('');
const zoomLevel = ref(0); 
let lastZoom = 0;

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
            if (window.showToast) window.showToast(MSG.AUTH.PROFILE_UPDATE_SUCCESS, 'success');
            queryClient.invalidateQueries({ queryKey: ['user-profile', userId.value] });
        }
    }
});

const updatePasswordMutation = useMutation({
    mutationFn: (data) => UserService.updatePassword(userId.value, data),
    onSuccess: (data) => {
         if (data.success || !data.error) {
            if (window.showToast) window.showToast(MSG.AUTH.PASSWORD_UPDATE_SUCCESS, 'success');
            setTimeout(() => logout(), 2000);
        } else {
             if (window.showToast) window.showToast(data.error || MSG.ERROR.GENERAL, 'danger');
        }
    }
});

const saving = computed(() => updateProfileMutation.isPending.value);
const savingPassword = computed(() => updatePasswordMutation.isPending.value);

const updateAvatarMutation = useMutation({
    mutationFn: (file) => UserService.updateAvatar(userId.value, file),
    onSuccess: (data) => {
        if (data.success || !data.error) {
            if (window.showToast) window.showToast("Cập nhật ảnh đại diện thành công!", 'success');
            queryClient.invalidateQueries({ queryKey: ['user-profile', userId.value] });
            closeCropper();
            // Emit to sync in other places if needed
            window.dispatchEvent(new Event('user-updated'));
        } else {
             if (window.showToast) window.showToast(data.error || "Lỗi cập nhật ảnh.", 'danger');
        }
    }
});
const savingAvatar = computed(() => updateAvatarMutation.isPending.value);

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
        if (window.showToast) window.showToast(MSG.AUTH.PHONE_INVALID, 'warning');
        return;
    }
    updateProfileMutation.mutate(updatedData);
};

const updatePassword = (passwords) => {
    if (passwords.new.length < 8) {
        if (window.showToast) window.showToast(MSG.AUTH.PASSWORD_MIN_LENGTH, 'warning');
        return;
    }
    if (passwords.new !== passwords.confirmation) {
        if (window.showToast) window.showToast(MSG.AUTH.PASSWORD_MISMATCH, 'warning');
        return;
    }
    updatePasswordMutation.mutate({
        current_password: passwords.current,
        password: passwords.new
    });
};

const handleAvatarSelected = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        cropperSrc.value = e.target.result;
        showCropper.value = true;
    };
    reader.readAsDataURL(file);
};

const onZoomLevelChange = () => {
    if (!cropperRef.value) return;
    const factor = zoomLevel.value - lastZoom;
    cropperRef.value.zoom(1 + factor);
    lastZoom = zoomLevel.value;
};

const closeCropper = () => {
    showCropper.value = false;
    cropperSrc.value = '';
    zoomLevel.value = 0;
    lastZoom = 0;
};

const handleConfirmCrop = () => {
    if (!cropperRef.value) return;
    
    // Lấy kết quả cắt
    const { canvas } = cropperRef.value.getResult();
    if (canvas) {
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
                updateAvatarMutation.mutate(file);
            }
        }, 'image/jpeg', 0.9);
    }
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
    .profile-section { padding: 1.5rem; }
    .profile-wrapper { flex-direction: column; }
    .content-pane { padding: 2rem; }
}
</style>

<!-- CSS Toàn cục cho Modal (vì dùng Teleport nên ko dùng scoped được) -->
<style>
.avatar-edit-modal-overlay {
    position: fixed;
    top: 0; left: 0; 
    width: 100vw !important; 
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.4) !important; /* Nền tối nhẹ kiểu Facebook/Instagram */
    display: flex !important; 
    align-items: center !important; 
    justify-content: center !important;
    z-index: 2147483647 !important;
    backdrop-filter: blur(8px);
}

.avatar-edit-modal {
    background: #ffffff !important;
    width: 95% !important; 
    max-width: 500px !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    border: 1px solid #e1e4e8 !important;
}

.modal-header {
    padding: 1.2rem 1.5rem !important; 
    border-bottom: 1px solid #f1f1f1 !important;
    display: flex !important; 
    justify-content: space-between !important; 
    align-items: center !important;
    color: #333 !important;
    background: #fff !important;
}

.modal-header h3 { 
    font-size: 1.6rem !important; 
    font-weight: 600 !important; 
    margin: 0 !important; 
    color: #222 !important; 
    text-align: center;
    flex: 1;
}

.back-btn, .close-btn { 
    background: none !important; 
    border: none !important; 
    color: #666 !important; 
    font-size: 1.8rem !important;
    cursor: pointer !important;
}
.back-btn:hover, .close-btn:hover { color: #000; }

.cropper-container {
    width: 100% !important;
    height: 420px !important; 
    background: #f8f9fa !important;
    overflow: hidden !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Đảm bảo cropper lấp đầy container */
.advanced-cropper {
    max-height: 100%;
    width: 100%;
}

/* Biến khung cắt thành hình tròn */
.avatar-edit-modal .vue-circle-stencil {
    border: 3px solid #ffffff;
    box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.8) !important; /* Làm mờ phần ngoài vòng tròn */
}

.zoom-wrapper {
    padding: 1.5rem 3rem !important;
    display: flex !important;
    align-items: center !important;
    gap: 1.5rem !important;
    background: #fff !important;
    border-top: 1px solid #f1f1f1 !important;
}

.zoom-slider {
    flex: 1;
    height: 6px !important;
    background: #e1e4e8 !important;
    accent-color: #ff6347 !important; /* Màu cam thương hiệu */
    cursor: pointer;
}

.modal-footer {
    padding: 1.2rem 2rem !important; 
    border-top: 1px solid #f1f1f1 !important;
    display: flex !important; 
    justify-content: flex-end !important; 
    gap: 1.2rem !important;
    background: #fff !important;
}

.btn-cancel {
    background: #f1f2f4 !important;
    border: none !important;
    color: #4b4f56 !important;
    padding: 0.8rem 2.2rem !important;
    border-radius: 6px !important;
    font-weight: 600 !important;
    cursor: pointer;
}

.btn-update {
    background: #ff6347 !important;
    border: none !important;
    color: white !important;
    padding: 0.8rem 2.5rem !important;
    border-radius: 6px !important;
    font-weight: 600 !important;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(255, 99, 71, 0.2);
}
.btn-update:hover { background: #e5533d !important; }
.btn-update:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
