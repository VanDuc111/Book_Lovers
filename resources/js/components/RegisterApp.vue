<template>
    <div class="form-container glass">
        <h2>ĐĂNG KÝ</h2>
        <form @submit.prevent="handleRegister">
            <div class="form-group mb-4">
                <label for="username" class="form-label">Tên Người Dùng: <span class="required">*</span></label>
                <input 
                    type="text" 
                    id="username" 
                    v-model="username" 
                    class="form-control custom-input"
                    placeholder="Nhập tên đăng nhập..."
                    required
                >
            </div>

            <div class="form-group mb-4">
                <label for="email" class="form-label">Email: <span class="required">*</span></label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="email" 
                    class="form-control custom-input"
                    placeholder="VD: example@mail.com"
                    autocapitalize="off" 
                    autocorrect="off" 
                    spellcheck="false" 
                    required
                >
            </div>
            
            <password-field 
                id="password"
                v-model="password"
                label="Mật Khẩu"
                placeholder="Nhập mật khẩu..."
                required
            />

            <password-field 
                id="confirmPassword"
                v-model="confirmPassword"
                label="Xác Nhận Mật Khẩu"
                placeholder="Nhập lại mật khẩu..."
                required
            />
            
            <base-button type="submit" variant="primary" size="lg" class="w-100" :loading="loading">
                Đăng Ký
            </base-button>
        </form>

        <p class="mt-4 text-center">
            <a href="/login">Đã Có Tài Khoản? Đăng Nhập</a>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AuthService from '@/services/AuthService';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

const handleRegister = async () => {
    if (!username.value.trim()) {
        if (window.showToast) window.showToast("Vui lòng nhập tên người dùng.", "warning");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        if (window.showToast) window.showToast("Email không đúng định dạng chuẩn (Ví dụ: ten@example.com).", "warning");
        return;
    }

    if (password.value !== confirmPassword.value) {
        if (window.showToast) window.showToast("Mật khẩu xác nhận không khớp.", "warning");
        return;
    }

    loading.value = true;
    try {
        const data = await AuthService.register({
            name: username.value,
            email: email.value,
            password: password.value,
        });
        
        if (data.success) {
            if (window.showToast) window.showToast("Đăng ký thành công! Đang chuyển hướng...", "success");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        }
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
/* ============================================================
   RegisterApp — Form Container
   (merged from form.css & auth.css)
   ============================================================ */

.form-container {
    width: var(--form-width);
    max-width: 90%;
    margin: 5rem auto;
    padding: var(--form-padding);
    border: var(--border);
    border-radius: var(--radius-md);
    background: var(--white);
    box-shadow: var(--box-shadow);
}

.form-container h2 {
    text-align: center;
    color: var(--black);
    text-transform: uppercase;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    font-weight: 700;
}

.form-container label {
    display: block;
    margin-bottom: 0.8rem;
    font-size: var(--fs-sm);
    color: var(--black);
    font-weight: 500;
}

.form-container input[type="email"],
.form-container input[type="text"],
.form-container input[type="password"] {
    width: 100%;
    padding: 1.2rem;
    margin-bottom: 1.5rem;
    border: var(--border);
    border-radius: var(--radius-sm);
    font-size: var(--fs-base);
    color: var(--black);
    transition: var(--transition);
}

.form-container input:focus {
    border-color: var(--orange);
    box-shadow: var(--focus-shadow);
    outline: none;
}



.form-container p {
    text-align: center;
    margin-top: 2rem;
    font-size: var(--fs-sm);
    color: var(--light-color);
}

.form-container p a {
    color: var(--orange);
    font-weight: 600;
    text-decoration: none;
}

.form-container p a:hover {
    text-decoration: underline;
}

.required {
    color: var(--error, #e74c3c);
    font-weight: bold;
    margin-left: 2px;
}
</style>
