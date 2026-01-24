<template>
    <div class="form-container glass">
        <h2>ĐĂNG NHẬP</h2>
        <form @submit.prevent="handleLogin">
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
            
            <button type="submit" class="btn-main w-100 py-3" :disabled="loading">
                <i v-if="loading" class="fas fa-spinner fa-spin me-2"></i>
                {{ loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập' }}
            </button>
        </form>

        <p class="mt-4 text-center">
            <a href="/register">Chưa Có Tài Khoản? Click Đây</a>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email.value, password: password.value })
        });
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Notify other components (like SiteHeader)
            window.dispatchEvent(new CustomEvent('user-updated'));

            if (data.user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/';
            }
        } else {
            if (window.showToast) {
                window.showToast(data.message || 'Đăng nhập không thành công', "danger");
            } else {
                alert(data.message || 'Đăng nhập không thành công');
            }
        }
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        if (window.showToast) {
            window.showToast('Đã xảy ra lỗi khi đăng nhập.', "danger");
        } else {
            alert('Đã xảy ra lỗi khi đăng nhập.');
        }
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.form-container {
    max-width: 450px;
    margin: 3rem auto;
    padding: 3rem;
    border-radius: 20px;
}

h2 {
    text-align: center;
    color: var(--black);
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
    font-weight: 700;
}

.custom-input {
    padding: 1.2rem;
    font-size: 1.4rem;
    border-radius: 10px;
    border: 2px solid #eee;
    transition: all 0.3s ease;
}

.custom-input:focus {
    border-color: var(--brand-orange);
    box-shadow: 0 0 10px rgba(255, 99, 71, 0.1);
}

.btn-main {
    background: var(--brand-orange);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.6rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-main:hover {
    background: #e5563f;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 99, 71, 0.3);
}

.btn-main:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

a {
    color: var(--brand-orange);
    font-size: 1.4rem;
    text-decoration: none;
    transition: color 0.3s;
}

a:hover {
    color: #e5563f;
    text-decoration: underline;
}
</style>
