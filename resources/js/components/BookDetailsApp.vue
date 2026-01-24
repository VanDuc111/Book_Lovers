<template>
  <div id="book-details-app" class="container mt-4">
    <!-- Breadcrumb -->
    <nav v-if="book" aria-label="breadcrumb" class="mb-5">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item"><a href="/book-list">Sách</a></li>
        <li class="breadcrumb-item active" aria-current="page">{{ book.categoryName }}</li>
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
        <div class="book-details-image-section bg-white p-3 rounded shadow-sm text-center sticky-top" style="top: 100px; z-index: 10;">
          <img :src="book.image || 'https://fakeimg.pl/450x600/f0f0f0/909090?text=No+Image'" 
               class="img-fluid rounded shadow-img" 
               :alt="book.title">
        </div>
      </div>

      <!-- Right: Info Section -->
      <div class="col-lg-8 col-md-7">
        <div class="book-details-info-section bg-white p-4 rounded shadow-sm h-100">
          <h1 class="book-title text-capitalize mb-3">{{ book.title }}</h1>
          
          <div class="row info-meta mb-4">
            <div class="col-sm-6">
              <p class="mb-2 text-muted">Tác giả: <span class="text-dark fw-bold">{{ book.author || 'Đang cập nhật' }}</span></p>
              <p class="mb-2 text-muted">Nhà xuất bản: <span class="text-dark fw-bold">{{ book.publisher || 'Đang cập nhật' }}</span></p>
            </div>
            <div class="col-sm-6">
              <p class="mb-2 text-muted">Thể loại: <span class="text-dark fw-bold text-orange">{{ book.categoryName }}</span></p>
              <p class="mb-2 text-muted">Trạng thái: 
                 <span v-if="book.stock > 0" class="text-success fw-bold">Còn hàng</span>
                 <span v-else class="text-danger fw-bold">Hết hàng</span>
              </p>
            </div>
          </div>

          <div class="price-section py-4 px-4 rounded mb-5 bg-light-orange">
            <div class="d-flex align-items-center flex-wrap gap-3">
              <span class="current-price text-orange fw-bold display-5">{{ formatCurrency(book.bookPrice) }}</span>
            </div>
          </div>

          <div class="shipping-info mb-5 p-3 border-dashed rounded">
            <p class="mb-2 fw-bold text-uppercase small text-muted">Thông tin vận chuyển</p>
            <div class="d-flex align-items-center gap-2">
              <i class="fas fa-truck text-orange"></i>
              <span>Giao hàng tiêu chuẩn - Dự kiến giao hàng sau 2-3 ngày</span>
            </div>
          </div>

          <div class="description-section mb-5">
            <h3 class="fw-bold mb-3 fs-4">Mô tả sản phẩm:</h3>
            <div 
                class="description-text text-muted lh-lg" 
                style="font-size: 1.5rem;"
                v-html="displayDescription"
            ></div>
            <a v-if="shouldShowToggle" 
               href="#" 
               @click.prevent="isExpanded = !isExpanded" 
               class="text-orange fw-bold text-decoration-none d-inline-block mt-2">
               {{ isExpanded ? 'Ẩn bớt' : 'Xem thêm' }}
            </a>
          </div>

          <div class="action-section border-top pt-5">
            <div class="d-flex align-items-center gap-4 mb-5 flex-wrap">
              <div class="d-flex align-items-center gap-3">
                <label class="fw-bold">Số lượng:</label>
                <div class="quantity-selector d-flex align-items-center border rounded">
                  <button class="btn btn-link py-2 px-3 text-dark text-decoration-none" 
                          @click="updateQuantity(-1)"
                          :disabled="quantity <= 1">-</button>
                  <input type="number" 
                         class="form-control text-center border-0 fw-bold" 
                         v-model.number="quantity" 
                         @change="validateQuantity"
                         style="width: 60px; font-size: 1.6rem; background: transparent;">
                  <button class="btn btn-link py-2 px-3 text-dark text-decoration-none" 
                          @click="updateQuantity(1)"
                          :disabled="quantity >= book.stock">+</button>
                </div>
              </div>
              <span class="text-muted small">{{ book.stock }} sản phẩm có sẵn</span>
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <button @click="handleCartAction(false)" 
                        class="btn btn-outline-orange w-100 py-3 fw-bold fs-5 hvr-grow"
                        :disabled="book.stock <= 0 || cartLoading">
                  <template v-if="!cartLoading">
                    <i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ hàng
                  </template>
                  <i v-else class="fas fa-spinner fa-spin"></i>
                </button>
              </div>
              <div class="col-md-6">
                <button @click="handleCartAction(true)" 
                        class="btn btn-orange w-100 py-3 fw-bold fs-5 hvr-grow"
                        :disabled="book.stock <= 0">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <section v-if="book" class="mt-5 mb-5 pb-5">
        <book-reviews :book-id="bookId" />
    </section>

    <!-- Related Books Section -->
    <section v-if="book && relatedBooks.length > 0" class="mt-5 mb-5">
      <div class="related-books-wrapper p-4 bg-white rounded shadow-sm">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold mb-0">Sách cùng thể loại</h3>
          <a :href="'/book-list?category=' + encodeURIComponent(book.categoryName)" 
             class="btn btn-link text-orange fw-bold text-decoration-none">Xem tất cả <i class="fas fa-arrow-right ms-1"></i></a>
        </div>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
           <div v-for="relBook in relatedBooks" :key="relBook.bookID" class="col">
             <book-card :book="relBook" />
           </div>
        </div>
      </div>
    </section>

    <!-- Error State -->
    <div v-if="!loading && !book" class="text-center py-5">
       <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
       <p class="fs-4">Rất tiếc, thông tin sách không khả dụng hoặc đã bị xóa.</p>
       <a href="/book-list" class="btn btn-main mt-3">Quay lại danh sách</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import BookReviews from './BookReviews.vue';
import BookCard from './BookCard.vue';

const book = ref(null);
const loading = ref(true);
const cartLoading = ref(false);
const bookId = ref(null);
const quantity = ref(1);
const isExpanded = ref(false);
const relatedBooks = ref([]);
const userId = ref(null);

const charLimit = 350;

const displayDescription = computed(() => {
  if (!book.value?.description) return "Chưa có mô tả cho cuốn sách này.";
  if (isExpanded.value || book.value.description.length <= charLimit) {
    return book.value.description;
  }
  return book.value.description.substring(0, charLimit) + "...";
});

const shouldShowToggle = computed(() => {
  return book.value?.description && book.value.description.length > charLimit;
});

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(val || 0);
};

const fetchData = async () => {
  const params = new URLSearchParams(window.location.search);
  bookId.value = params.get('id');
  if (!bookId.value) {
    loading.value = false;
    return;
  }

  try {
    const res = await fetch(`/api/books/${bookId.value}`);
    book.value = await res.json();
    if (book.value && book.value.categoryName) {
      fetchRelated(book.value.categoryName);
    }
  } catch (err) {
    console.error('Lỗi tải chi tiết sách:', err);
  } finally {
    loading.value = false;
  }
};

const fetchRelated = async (category) => {
  try {
    const res = await fetch(`/api/books?category=${encodeURIComponent(category)}`);
    const all = await res.json();
    relatedBooks.value = all.filter(b => b.bookID != bookId.value).slice(0, 8);
  } catch (err) {
      console.error('Lỗi tải sách liên quan:', err);
  }
};

const updateQuantity = (delta) => {
  const newQ = quantity.value + delta;
  if (newQ >= 1 && newQ <= (book.value?.stock || 1)) {
    quantity.value = newQ;
  }
};

const validateQuantity = () => {
  if (quantity.value < 1) quantity.value = 1;
  const max = book.value?.stock || 1;
  if (quantity.value > max) {
    quantity.value = max;
    if (window.showToast) window.showToast(`Chỉ còn ${max} sản phẩm có sẵn.`, 'warning');
  }
};

const handleCartAction = async (isBuyNow) => {
  if (!userId.value) {
    if (window.showToast) window.showToast("Vui lòng đăng nhập để tiếp tục.", "warning");
    setTimeout(() => window.location.href = "/login", 1500);
    return;
  }

  cartLoading.value = true;
  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookID: bookId.value,
        quantity: quantity.value,
        userID: userId.value,
      }),
    });
    const data = await res.json();
    if (data.error) {
       if (window.showToast) window.showToast(data.error, "danger");
    } else {
       if (isBuyNow) {
         window.location.href = "/cart";
       } else {
         if (window.showToast) window.showToast("Đã thêm vào giỏ hàng!", "success");
         // Tùy chọn: update icon giỏ hàng ở đây
       }
    }
  } catch (err) {
    console.error('Lỗi thêm vào giỏ:', err);
  } finally {
    cartLoading.value = false;
  }
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  userId.value = user ? user.userID : null;
  fetchData();
});
</script>

<script>
// Thêm style global hỗ trợ trong file vue
</script>

<style scoped>
.text-orange { color: var(--orange); }
.bg-light-orange { background: #fffaf9; }
.border-dashed { border: 1px dashed #dee2e6 !important; }

.shadow-img {
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: transform 0.4s ease;
}
.shadow-img:hover {
    transform: scale(1.02);
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
}

@keyframes loading {
    to { background-position: -200% 0; }
}

.btn-orange {
    background: var(--orange);
    color: white;
    border: none;
    transition: all 0.3s;
}
.btn-orange:hover {
    background: #e6563e;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 99, 71, 0.3);
}

.btn-outline-orange {
    border: 2px solid var(--orange);
    color: var(--orange);
    background: transparent;
    transition: all 0.3s;
}
.btn-outline-orange:hover {
    background: rgba(255, 99, 71, 0.05);
    color: #e6563e;
    border-color: #e6563e;
    transform: translateY(-2px);
}

.hvr-grow {
    transition: transform 0.2s;
}
.hvr-grow:active {
    transform: scale(0.98);
}

.quantity-selector button:disabled {
    opacity: 0.3;
    pointer-events: none;
}
</style>
