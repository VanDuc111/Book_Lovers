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
                            <a :href="'/book-list?category=' + encodeURIComponent(cat.categoryName)" class="category-link">
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
/* ==========================
    Header / Navigation Styles
   ========================== */

.header-1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  padding: 1.5rem 5%;
  background: var(--white);
  box-shadow: var(--shadow-light);
  position: relative;
  z-index: 1001;
}

.logo-brand {
  text-decoration: none !important;
  display: flex !important;
  align-items: center;
  transition: transform var(--transition, 0.3s ease);
}

.logo-brand:hover {
  transform: translateY(-1px);
}

.brand-logo {
  height: 4.5rem;
  width: auto;
  display: block;
}

/* Category Dropdown */
.category {
  position: relative;
}

.category .category-bars.btn {
  background: var(--orange) !important;
  color: var(--white) !important;
  border-radius: var(--radius-md);
  padding: 0.8rem;
  font-size: 2.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.4rem;
  min-height: 4.4rem;
  border: none !important;
}

.category .category-bars.btn img.category-icon {
  width: 2.4rem;
  height: 2.4rem;
  filter: brightness(0) invert(1);
}

.category .category-bars.btn:hover {
  background: var(--dark-color) !important;
}

.category-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--white);
  border: var(--border);
  box-shadow: var(--shadow-medium);
  z-index: 2000;
  width: 25rem;
  font-size: 1.5rem;
}

.category-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-content li {
  padding: 0;
  text-align: left;
}

.category-content a.category-link {
  display: block;
  padding: 1.2rem 1.5rem;
  text-decoration: none;
  color: #333;
  width: 100%;
}

.category:hover .category-content {
  display: block;
}

.category-content li:hover {
  background-color: rgb(163, 238, 238);
}

/* Icons area */
.icons {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 0 0 auto;
}

.icons a {
  display: flex;
  align-items: center;
  color: var(--black);
  cursor: pointer;
  margin-left: 1rem;
}

.navbar-icon {
  width: 2.6rem;
  height: 2.6rem;
  object-fit: contain;
  filter: brightness(0) grayscale(1);
  transition: var(--transition);
}

.icons a:hover .navbar-icon {
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(341deg) brightness(102%) contrast(101%);
}

.user-info {
  text-decoration: none !important;
  font-size: 1.8rem;
  color: var(--black);
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.user-info:hover,
.user-info:hover #welcome-message {
  color: var(--orange) !important;
}

/* Cart Badge */
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
  transition: color 0.3s ease;
}

/* ==========================
    Mobile Responsive Header
   ========================== */

@media (max-width: 991px) {
  .header-1 { padding: 2rem; }
}

@media (max-width: 768px) {
  .header-1 {
    background: var(--white) !important;
    padding: 1.2rem 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      "logo logo icons"
      "cat search search";
    gap: 1.2rem 1.6rem;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    border-bottom: 1px solid #eee;
  }

  .logo-brand {
    grid-area: logo;
    justify-self: start;
  }

  .brand-logo {
    height: 3.2rem;
  }

  .category {
    grid-area: cat;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 4rem;
  }

  .category .category-bars.btn {
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0;
    min-width: unset !important;
    min-height: unset !important;
  }

  .category .category-bars.btn img.category-icon {
    width: 2.6rem;
    height: 2.6rem;
    filter: none;
  }

  .category-content {
    position: absolute;
    top: calc(100% + 1rem);
    left: 0;
    z-index: 1000;
    background: var(--white);
    box-shadow: var(--shadow-medium);
    min-width: 20rem;
    display: none;
  }

  .icons {
    grid-area: icons;
    gap: 1.2rem;
    justify-content: flex-end;
  }

  .icons .navbar-icon {
    width: 2.4rem;
    height: 2.4rem;
    filter: none;
  }

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

@media (max-width: 450px) {
  .header-1 {
    grid-template-columns: auto 1fr auto;
    gap: 0.8rem 1rem;
  }
}
</style>
