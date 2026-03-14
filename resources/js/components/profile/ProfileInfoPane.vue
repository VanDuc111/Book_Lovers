<template>
    <div class="content-pane glass active">
        <div class="content-header">
            <h2>Cài đặt hồ sơ</h2>
            <p>Quản lý thông tin cá nhân và cài đặt tài khoản của bạn</p>
        </div>

        <div class="profile-form-grid">
            <div class="form-group full-width">
                <label for="name">Họ và tên</label>
                <input type="text" v-model="localUser.name" id="name" placeholder="Nhập họ tên của bạn">
            </div>

            <div class="form-group">
                <label for="email">Địa chỉ Email</label>
                <input type="email" v-model="localUser.email" id="email" readonly>
            </div>

            <div class="form-group">
                <label for="phone">Số điện thoại</label>
                <input type="tel" v-model="localUser.phone" id="phone" placeholder="Nhập số điện thoại">
            </div>

            <div class="form-group full-width">
                <label for="address">Địa chỉ giao hàng</label>
                <input type="text" v-model="localUser.address" id="address" placeholder="Nhập địa chỉ của bạn">
            </div>
        </div>

        <base-button 
            variant="primary" 
            class="mt-4" 
            @click="$emit('update-profile', localUser)" 
            :loading="loading"
        >
            <i class="fas fa-save me-2"></i>
            Lưu thay đổi
        </base-button>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
    user: Object,
    loading: Boolean
});

const emit = defineEmits(['update-profile']);

const localUser = reactive({ ...props.user });

watch(() => props.user, (newVal) => {
    Object.assign(localUser, newVal);
}, { deep: true });
</script>

<style scoped>
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

.profile-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.form-group { margin-bottom: 2rem; }
.form-group.full-width { grid-column: span 2; }
.form-group label { display: block; font-size: 1.4rem; font-weight: 600; margin-bottom: 0.8rem; color: var(--black); }

.form-group input {
    width: 100%;
    padding: 1.2rem 1.5rem;
    border-radius: var(--radius-md);
    border: var(--border);
    font-size: 1.5rem;
    background: rgba(255,255,255,0.8);
    transition: var(--transition);
}

.form-group input:focus { border-color: var(--orange); background: var(--white); box-shadow: var(--focus-shadow); outline: none; }
.form-group input[readonly] { background: rgba(0,0,0,0.03); cursor: not-allowed; }

@media (max-width: 991px) {
    .content-pane { padding: 2rem; }
}

@media (max-width: 768px) {
    .profile-form-grid { grid-template-columns: 1fr; }
    .form-group.full-width { grid-column: span 1; }
}
</style>
