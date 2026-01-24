<template>
    <header class="header">
        <div class="header-1">
            <a href="/" class="logo-brand" id="logo" aria-label="BookLovers">
                <img :src="logoSrc" alt="BookLovers Logo" class="brand-logo">
            </a>

            <!-- Category -->
            <nav class="category">
                <button class="category-bars btn" aria-label="Mở danh mục">
                    <img :src="categoryIconSrc" alt="Category" class="category-icon">
                </button>
                <div class="category-content">
                    <ul class="category-list">
                        <li v-if="categories.length === 0">
                            <a href="#">{{ loadingCategories ? 'Đang tải...' : 'Không có thể loại nào' }}</a>
                        </li>
                        <li v-for="cat in categories" :key="cat.categoryID">
                            <a :href="'/book-list?category=' + encodeURIComponent(cat.categoryName)">
                                {{ cat.categoryName }}
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <search-box />

            <div class="icons">
                <a href="/cart" class="cart-link" style="position: relative;">
                    <img :src="cartIconSrc" alt="Cart" class="navbar-icon">
                    <span v-if="cartCount > 0" class="cart-count-badge">{{ cartCount }}</span>
                </a>
                <a :href="userLink" id="login-btn" class="user-info">
                    <img :src="userIconSrc" alt="User" class="navbar-icon">
                    <span id="welcome-message">{{ welcomeMessage }}</span>
                </a>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

import SearchBox from './SearchBox.vue';

const logoSrc = '/assets/images/logo-full.svg';
const categoryIconSrc = '/assets/icons/category.svg';
const cartIconSrc = '/assets/icons/shopping-cart.svg';
const userIconSrc = '/assets/icons/user.svg';

const categories = ref([]);
const loadingCategories = ref(false);
const cartCount = ref(0);
const user = ref(null);

onMounted(() => {
    fetchCategories();
    updateCartIcon();
    checkUser();

    // Listen for cart updates
    window.addEventListener('cart-updated', updateCartIcon);
    // Listen for user updates (login/logout)
    window.addEventListener('user-updated', checkUser);
});

const fetchCategories = async () => {
    loadingCategories.value = true;
    try {
        const response = await fetch('/api/categories');
        categories.value = await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
    } finally {
        loadingCategories.value = false;
    }
};

const updateCartIcon = () => {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cartCount.value = cart.reduce((total, item) => total + item.quantity, 0);
    } catch (e) {
        cartCount.value = 0;
    }
};

const checkUser = () => {
    try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            user.value = storedUser;
        } else {
            user.value = null;
        }
    } catch (e) {
        user.value = null;
    }
};

const welcomeMessage = computed(() => {
    if (user.value && user.value.name) {
        return `Chào, ${user.value.name.split(' ').pop()}`;
    }
    return '';
});

const userLink = computed(() => {
    return user.value ? '/profile' : '/login';
});
</script>

<style scoped>
.cart-count-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: var(--brand-orange);
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: bold;
    min-width: 18px;
    text-align: center;
}

#welcome-message {
    margin-left: 8px;
    font-size: 1.4rem;
    color: var(--light-color);
    font-weight: 500;
}

@media (max-width: 768px) {
    #welcome-message {
        display: none;
    }
}
</style>
