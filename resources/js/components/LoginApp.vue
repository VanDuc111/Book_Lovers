<template>
    <div class="form-container glass">
        <h2>ĐĂNG NHẬP</h2>
        <form @submit.prevent="handleLogin">
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
                v-model="password"
                label="Mật Khẩu"
                placeholder="Nhập mật khẩu của bạn..."
                required
            />
            
            <base-button type="submit" variant="primary" size="lg" class="w-100" :loading="loading">
                Đăng Nhập
            </base-button>
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        if (window.showToast) window.showToast('Email không đúng định dạng chuẩn (Ví dụ: ten@example.com)', 'warning');
        else alert('Email không đúng định dạng chuẩn');
        return;
    }

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

            const role = data.user.role ? data.user.role.toLowerCase() : '';
            if (role === 'admin') {
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
/* ============================================================
   LoginApp — Form Container
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

</style>
