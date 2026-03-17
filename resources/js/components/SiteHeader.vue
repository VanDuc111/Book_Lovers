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
import { onMounted, computed, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import SearchBox from './SearchBox.vue';

// Import Services
import CategoryService from '@/services/CategoryService';
import CartService from '@/services/CartService';
import AuthService from '@/services/AuthService';

const logoSrc = '/assets/images/logo-full.svg';
const categoryIconSrc = '/assets/icons/category.svg';
const cartIconSrc = '/assets/icons/shopping-cart.svg';
const userIconSrc = '/assets/icons/user.svg';

const user = ref(null);

// 1. Fetch Danh mục với Vue Query
const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getCategories(),
    initialData: () => CategoryService.getCachedCategories(),
    staleTime: 1000 * 60 * 30,
});

const categories = computed(() => categoriesQuery.data.value || []);
const loadingCategories = computed(() => categoriesQuery.isLoading.value && categories.value.length === 0);

// 2. Fetch Giỏ hàng với Vue Query
const cartQuery = useQuery({
    queryKey: computed(() => ['cart', user.value?.userID]),
    queryFn: async () => {
        if (user.value?.userID) {
            return await CartService.getCart(user.value.userID);
        }
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },
    initialData: () => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser?.userID) return CartService.getCachedCart(currentUser.userID);
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },
    staleTime: 1000 * 60 * 5, // Cache 5 phút
});

const cartCount = computed(() => {
    const data = cartQuery.data.value;
    return Array.isArray(data) ? data.length : 0;
});

onMounted(() => {
    checkUser();
    // Listen for cart updates
    window.addEventListener('cart-updated', () => cartQuery.refetch());
    // Listen for user updates
    window.addEventListener('user-updated', () => {
        checkUser();
        cartQuery.refetch();
    });
});

const checkUser = () => {
    user.value = AuthService.getCurrentUser();
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
  gap: var(--header-gap);
  padding: var(--header-padding);
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
  height: var(--logo-height);
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
  min-width: var(--min-btn-size);
  min-height: var(--min-btn-size);
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
  width: var(--cat-menu-width);
  font-size: var(--fs-sm);
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
  background-color: var(--cat-hover-bg);
}

.category-content li:hover a.category-link {
  color: var(--black);
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
    height: var(--logo-height-mobile);
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
