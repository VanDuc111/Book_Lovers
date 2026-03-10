<template>
    <div class="form-container glass">
        <h2>ĐĂNG KÝ</h2>
        <form @submit.prevent="handleRegister">
            <div class="form-group mb-4">
                <label for="username" class="form-label">Tên Người Dùng:</label>
                <input 
                    type="text" 
                    id="username" 
                    v-model="username" 
                    class="form-control custom-input"
                    required
                >
            </div>

            <div class="form-group mb-4">
                <label for="email" class="form-label">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="email" 
                    class="form-control custom-input"
                    autocapitalize="off" 
                    autocorrect="off" 
                    spellcheck="false" 
                    required
                >
            </div>
            
            <div class="form-group mb-4">
                <label for="password" class="form-label">Mật Khẩu:</label>
                <div class="password-wrapper">
                    <input 
                        type="password" 
                        id="password" 
                        v-model="password" 
                        class="form-control custom-input"
                        required
                    >
                </div>
            </div>

            <div class="form-group mb-4">
                <label for="confirmPassword" class="form-label">Xác Nhận Mật Khẩu:</label>
                <div class="password-wrapper">
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        v-model="confirmPassword" 
                        class="form-control custom-input"
                        required
                    >
                </div>
            </div>
            
            <button type="submit" class="btn-main w-100 py-3" :disabled="loading">
                <i v-if="loading" class="fas fa-spinner fa-spin me-2"></i>
                {{ loading ? 'Đang Đăng Ký...' : 'Đăng Ký' }}
            </button>
        </form>

        <p class="mt-4 text-center">
            <a href="/login">Đã Có Tài Khoản? Đăng Nhập</a>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        if (window.showToast) window.showToast("Mật khẩu xác nhận không khớp.", "warning");
        else alert("Mật khẩu xác nhận không khớp.");
        return;
    }

    if (!username.value.trim()) {
        if (window.showToast) window.showToast("Vui lòng nhập tên người dùng.", "warning");
        else alert("Vui lòng nhập tên người dùng.");
        return;
    }

    loading.value = true;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                name: username.value,
                email: email.value,
                password: password.value,
            }),
        });
        const data = await response.json();
        
        if (data.success) {
            if (window.showToast) window.showToast("Đăng ký thành công! Đang chuyển hướng...", "success");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        } else {
            if (window.showToast) window.showToast("Đăng ký thất bại: " + data.message, "danger");
            else alert("Đăng ký thất bại: " + data.message);
        }
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        if (window.showToast) window.showToast('Đã xảy ra lỗi khi đăng ký.', "danger");
        else alert('Đã xảy ra lỗi khi đăng ký.');
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
    width: 40rem;
    max-width: 90%;
    margin: 5rem auto;
    padding: 2.5rem;
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

.form-container button[type="submit"],
.form-container .btn-main {
    width: 100%;
    text-align: center;
    padding: 1.2rem;
    background-color: var(--orange);
    color: #fff;
    border: none;
    border-radius: var(--btn-radius, var(--radius-md));
    cursor: pointer;
    font-size: 1.6rem;
    font-weight: 600;
    box-shadow: var(--btn-shadow);
    transition: var(--transition);
}

.form-container button[type="submit"]:hover,
.form-container .btn-main:hover {
    background-color: var(--dark-color);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 99, 71, 0.3);
}

.form-container button[type="submit"]:disabled,
.form-container .btn-main:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
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

.password-wrapper {
    position: relative;
    width: 100%;
}
</style>
