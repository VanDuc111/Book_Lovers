<template>
  <div id="book-details-app" class="container mt-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="mb-5">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item"><a href="/book-list">Sách</a></li>
        <li v-if="book" class="breadcrumb-item breadcrumb-active" aria-current="page">{{ book.categoryName }}</li>
        <li v-else-if="loading" class="breadcrumb-item breadcrumb-active" aria-current="page">...</li>
      </ol>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="row g-4">
       <div class="col-lg-4 col-md-5">
         <div class="skeleton shadow-sm p-5" style="height: 450px;"></div>
       </div>
       <div class="col-lg-8 col-md-7">
         <div class="skeleton shadow-sm p-4 w-100 mb-3" style="height: 60px;"></div>
         <div class="skeleton shadow-sm p-4 w-75 mb-3" style="height: 20px;"></div>
         <div class="skeleton shadow-sm p-4 w-50" style="height: 20px;"></div>
       </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="book" class="row g-4">
      <!-- Left: Image Section -->
      <div class="col-lg-4 col-md-5">
        <div class="book-details-image-section bg-white p-3 rounded shadow-sm text-center" style="z-index: 10;">
          <img :src="book.image || 'https://fakeimg.pl/450x600/f0f0f0/909090?text=No+Image'" 
               class="img-fluid rounded shadow-img" 
               :alt="book.title">
        </div>
      </div>

      <!-- Right: Info Section -->
      <div class="col-lg-8 col-md-7">
        <div class="book-details-info-section bg-white p-4 rounded shadow-sm h-100">
          <h1 class="book-title text-capitalize mb-3">{{ book.title }}</h1>
          
          <!-- Book Info Panel (meta, price, shipping) -->
          <book-info-panel :book="book" />

          <!-- Description -->
          <book-description :description="book.description" :char-limit="350" />

          <!-- Actions (quantity, add to cart, buy now) -->
          <book-actions 
              :quantity="quantity"
              :stock="book.stock || 0"
              :loading="cartLoading"
              @update:quantity="quantity = $event"
              @add-to-cart="handleCartAction(false)"
              @buy-now="handleCartAction(true)"
          />
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <section v-if="book" class="mt-5 mb-5 pb-5">
        <book-reviews :book-id="bookId" />
    </section>

    <!-- Related Books Section -->
    <section v-if="book" class="mt-5 mb-5">
        <related-books :books="relatedBooks" :category-name="book.categoryName" />
    </section>

    <!-- Error State -->
    <div v-if="!loading && !book" class="text-center py-5">
       <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
       <p class="fs-4">Rất tiếc, thông tin sách không khả dụng hoặc đã bị xóa.</p>
       <base-button href="/book-list" variant="primary" class="mt-3">Quay lại danh sách</base-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import BookReviews from './BookReviews.vue';
import BookCard from './BookCard.vue';
import BookInfoPanel from './book-details/BookInfoPanel.vue';
import BookDescription from './book-details/BookDescription.vue';
import BookActions from './book-details/BookActions.vue';
import RelatedBooks from './book-details/RelatedBooks.vue';

// Import Services
import BookService from '@/services/BookService';
import CartService from '@/services/CartService';
import AuthService from '@/services/AuthService';

const cartLoading = ref(false);
const bookId = ref(null);
const quantity = ref(1);
const userId = ref(null);

// Lấy bookId từ URL
const params = new URLSearchParams(window.location.search);
bookId.value = params.get('id');

// 1. Fetch Chi tiết sách
const bookQuery = useQuery({
    queryKey: computed(() => ['book', bookId.value]),
    queryFn: () => BookService.getBookDetails(bookId.value),
    enabled: computed(() => !!bookId.value),
});

const book = computed(() => bookQuery.data.value);
const loading = computed(() => bookQuery.isLoading.value);

// 2. Fetch Sách liên quan (chỉ chạy khi có dữ liệu book)
const relatedQuery = useQuery({
    queryKey: computed(() => ['books-related', book.value?.categoryName, bookId.value]),
    queryFn: () => BookService.getRelatedBooks(book.value.categoryName, bookId.value),
    enabled: computed(() => !!book.value?.categoryName),
});

const relatedBooks = computed(() => relatedQuery.data.value || []);

const handleCartAction = async (isBuyNow) => {
  if (!userId.value) {
    if (window.showToast) window.showToast("Vui lòng đăng nhập để tiếp tục.", "warning");
    setTimeout(() => window.location.href = "/login", 1500);
    return;
  }

  cartLoading.value = true;
  try {
    const data = await CartService.addToCart(bookId.value, userId.value, quantity.value);
    
    if (!data.error) {
       if (isBuyNow) {
         window.location.href = `/checkout?items=${data.id}`;
       } else {
         if (window.showToast) window.showToast("Đã thêm vào giỏ hàng!", "success");
         window.dispatchEvent(new Event('cart-updated'));
       }
    }
  } catch (err) {
    console.error('Lỗi thêm vào giỏ:', err);
  } finally {
    cartLoading.value = false;
  }
};

onMounted(() => {
  userId.value = AuthService.getCurrentUser()?.id || null;
});
</script>

<style scoped>
/* ============================================================
   BookDetailsApp — Scoped Styles
   ============================================================ */

/* ---- Breadcrumb ---- */
.breadcrumb {
    background: transparent;
    padding: 0;
    margin-bottom: 2rem;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0;
}

.breadcrumb-item,
.breadcrumb-item a,
.breadcrumb-item.breadcrumb-active {
    font-size: 1.4rem !important;
    line-height: 1.5;
    vertical-align: middle;
}

.breadcrumb-item a {
    color: var(--orange);
    text-decoration: none;
    font-weight: 500;
}

.breadcrumb-item a:hover { text-decoration: underline; }

.breadcrumb-item.breadcrumb-active {
    color: var(--muted-color);
    font-weight: 400;
}

/* ---- Image & Info Sections ---- */
.book-details-image-section,
.book-details-info-section {
    border: var(--border);
    transition: var(--transition);
    background: var(--white);
}

.shadow-img {
    box-shadow: var(--shadow-img);
    transition: transform 0.4s ease;
}
.shadow-img:hover { transform: scale(1.02); }

.book-title {
    line-height: 1.3;
    margin-top: 0;
    font-size: var(--fs-h3);
    font-weight: 600;
    color: var(--black);
}

/* ---- Skeleton Loading ---- */
.skeleton {
    background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%);
    background-size: 200% 100%;
    animation: var(--skeleton-animation);
    border-radius: var(--radius-md);
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* ---- Animations ---- */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in-up { opacity: 0; animation: fadeInUp 0.6s ease forwards; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }

/* ---- Responsive ---- */
@media (max-width: 768px) {
    .book-title { font-size: var(--fs-md) !important; }
    .book-details-image-section img {
        max-height: 280px !important;
        width: auto !important;
        object-fit: contain !important;
    }
}
</style>
