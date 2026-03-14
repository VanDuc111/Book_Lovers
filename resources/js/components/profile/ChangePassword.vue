<template>
    <div class="content-pane glass active">
        <div class="content-header">
            <h2>Đổi mật khẩu</h2>
            <p>Đảm bảo an toàn cho tài khoản của bạn</p>
        </div>

        <div style="max-width: 45rem;">
            <password-field 
                id="current_password"
                v-model="pass.current"
                label="Mật khẩu hiện tại"
                placeholder="Nhập mật khẩu hiện tại"
                required
            />

            <password-field 
                id="new_password"
                v-model="pass.new"
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                required
            />

            <password-field 
                id="new_password_confirmation"
                v-model="pass.confirmation"
                label="Xác nhận mật khẩu mới"
                placeholder="Xác nhận mật khẩu mới"
                required
            />

            <base-button 
                variant="primary" 
                class="mt-3" 
                @click="submit" 
                :loading="loading"
            >
                <i class="fas fa-key me-2"></i>
                Cập nhật mật khẩu
            </base-button>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
    loading: Boolean
});

const emit = defineEmits(['update-password']);

const pass = reactive({
    current: '',
    new: '',
    confirmation: ''
});

const submit = () => {
    emit('update-password', { ...pass });
    // Clear form only on success (controlled by parent usually, but we clear it here as well)
    // Actually better to let parent decide, but for now we reset.
};
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

.form-group { margin-bottom: 2rem; }
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

@media (max-width: 991px) {
    .content-pane { padding: 2rem; }
}
</style>
