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

const updateCartIcon = async () => {
    try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.userID) {
            // Fetch from API for logged-in users
            const response = await fetch(`/api/cart?userID=${storedUser.userID}`);
            const cartItems = await response.json();
            cartCount.value = Array.isArray(cartItems) ? cartItems.length : 0;
        } else {
            // Fetch from LocalStorage for guests
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cartCount.value = cart.length; // Count unique items (lines), not total quantity
        }
    } catch (e) {
        console.error('Error updating cart count:', e);
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
    top: -8px;
    right: -10px;
    background-color: var(--orange);
    color: white;
    border-radius: 50%;
    padding: 2px 5px;
    font-size: 1.1rem;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(255, 99, 71, 0.4);
    border: 2px solid white;
    z-index: 10;
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
    .cart-count-badge {
        top: -5px;
        right: -5px;
        font-size: 0.9rem;
        min-width: 15px;
        height: 15px;
    }
}
</style>
