<template>
    <aside class="profile-sidebar glass">
        <div class="user-profile-header">
            <div class="avatar-container" @click="triggerFileInput">
                <img :src="avatarUrl" id="profile-avatar-img" alt="Avatar">
                <div class="edit-avatar">
                    <i class="fas fa-camera"></i>
                </div>
                <!-- Input file ẩn -->
                <input 
                    type="file" 
                    ref="fileInput" 
                    style="display: none" 
                    accept="image/*"
                    @change="handleFileChange"
                >
            </div>
            <h3 id="sidebar-name">{{ userName || 'Người dùng' }}</h3>
            <p id="sidebar-email">{{ userEmail || 'email@example.com' }}</p>
        </div>

        <nav class="profile-nav">
            <div 
                v-for="item in navItems" 
                :key="item.id"
                class="profile-nav-item" 
                :class="{ active: activeTab === item.id }"
                @click="$emit('switch-tab', item.id)"
            >
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
            </div>
            <a href="#" @click.prevent="$emit('logout')" class="profile-nav-item logout-item">
                <i class="fas fa-sign-out-alt"></i>
                <span>Đăng xuất</span>
            </a>
        </nav>
    </aside>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    userName: String,
    userEmail: String,
    avatar: String, // Nhận avatar từ user object
    activeTab: String,
    navItems: Array
});

const emit = defineEmits(['switch-tab', 'logout', 'avatar-selected']);
const fileInput = ref(null);

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        emit('avatar-selected', file);
        // Reset input để có thể chọn lại cùng 1 file
        e.target.value = '';
    }
};

const avatarUrl = computed(() => {
    if (props.avatar) {
        // Nếu đã có đường dẫn avatar thì trả về, có thể là link Cloudinary hoặc storage local
        return props.avatar;
    }
    const name = props.userName || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff6347&color=fff&size=256`;
});
</script>

<style scoped>
.profile-sidebar {
    flex: 0 0 30rem;
    padding: 2.5rem;
    position: sticky;
    top: 10rem;
    background: var(--bg-glass) !important;
    backdrop-filter: blur(15px);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-medium);
}

.user-profile-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.6);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255,255,255,0.8);
}

.avatar-container {
    position: relative;
    width: 10rem;
    height: 10rem;
    margin: 0 auto 1.5rem;
}

.avatar-container img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--white);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.edit-avatar {
    position: absolute;
    bottom: 0; right: 0;
    background: var(--orange);
    width: 3rem; height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    border: 2px solid #fff;
}

.user-profile-header h3 { font-size: var(--fs-md); font-weight: 700; color: var(--black); margin-bottom: 0.5rem; }
.user-profile-header p { font-size: var(--fs-sm); color: var(--light-color); }

.profile-nav { display: flex; flex-direction: column; gap: 0.5rem; }

.profile-nav-item {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1.2rem 1.5rem;
    border-radius: var(--radius-md);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--black);
    background: rgba(255, 255, 255, 0.5);
    margin-bottom: 0.8rem;
    transition: var(--transition);
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.3);
    text-decoration: none;
}

.profile-nav-item i { width: 2.5rem; text-align: center; font-size: 1.8rem; color: var(--orange); }
.profile-nav-item:hover { background: rgba(255, 255, 255, 0.9); color: var(--orange); transform: translateX(5px); }
.profile-nav-item.active { background: var(--orange); color: var(--white); box-shadow: 0 4px 15px rgba(255, 99, 71, 0.3); }
.profile-nav-item.active i { color: #fff; }

.logout-item { color: #e74c3c; }

@media (max-width: 991px) {
    .profile-sidebar { flex: 1; width: 100%; position: static; margin-bottom: 2rem; }
    .profile-nav { flex-direction: row; overflow-x: auto; padding-bottom: 1rem; }
    .profile-nav-item { white-space: nowrap; }
}
</style>
