<template>
  <div class="book-list-app">
    <!-- Breadcrumb -->
    <div class="container mt-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="/">Trang Chủ</a></li>
          <li class="breadcrumb-item"><a href="/book-list" @click.prevent="filterByCategory('all')">Sách</a></li>
          <li class="breadcrumb-item active" aria-current="page">{{ currentTitle }}</li>
        </ol>
      </nav>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3 col-lg-2">
          <!-- Sidebar -->
          <div class="filter-sidebar p-4 border rounded mb-4 bg-white shadow-sm">
            <h4 class="filter-title mb-4" style="font-size: 1.6rem; font-weight: 700; color: var(--black);"><i class="fas fa-filter"></i> Bộ lọc</h4>
            
            <!-- Lọc theo Danh mục -->
            <div class="filter-group mb-4 pb-3 border-bottom">
              <h5 class="filter-subtitle mb-3" style="font-size: 1.4rem; font-weight: 600; color: var(--black);">Danh mục</h5>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="categoryFilter" id="cat-all" value="all" v-model="currentCategory" @change="applyFilters">
                <label class="form-check-label" for="cat-all" style="font-size: 1.3rem; color: var(--light-color); cursor: pointer;">Tất cả</label>
              </div>
              <div class="form-check mb-2" v-for="cat in availableCategories" :key="cat">
                <input class="form-check-input" type="radio" name="categoryFilter" :id="'cat-'+cat" :value="cat" v-model="currentCategory" @change="applyFilters">
                <label class="form-check-label" :for="'cat-'+cat" style="font-size: 1.3rem; color: var(--light-color); cursor: pointer;">{{ cat }}</label>
              </div>
            </div>

            <!-- Lọc theo Giá -->
            <div class="filter-group mb-4 pb-3 border-bottom">
              <h5 class="filter-subtitle mb-3" style="font-size: 1.4rem; font-weight: 600; color: var(--black);">Giá (VNĐ)</h5>
              <div class="d-flex align-items-center mb-2">
                <input type="number" class="form-control form-control-sm text-center" placeholder="TỪ" v-model="filters.minPrice" style="font-size: 1.2rem; padding: 0.5rem; border-radius: 4px;">
                <span class="mx-2" style="font-size: 1.2rem; color: var(--light-color);">-</span>
                <input type="number" class="form-control form-control-sm text-center" placeholder="ĐẾN" v-model="filters.maxPrice" style="font-size: 1.2rem; padding: 0.5rem; border-radius: 4px;">
              </div>
              <button class="btn w-100 mt-2 filter-btn" @click="applyFilters" style="font-size: 1.2rem; border: 1px solid var(--orange); color: var(--orange); background: transparent; border-radius: .5rem; transition: .2s;">Áp dụng giá</button>
            </div>

            <!-- Lọc theo NXB -->
            <div class="filter-group mb-4 pb-2">
              <h5 class="filter-subtitle mb-3" style="font-size: 1.4rem; font-weight: 600; color: var(--black);">Nhà phát hành</h5>
              <div class="form-check mb-2" v-for="pub in availablePublishers" :key="pub">
                <input class="form-check-input" type="checkbox" :id="'pub-'+pub" :value="pub" v-model="filters.publishers" @change="applyFilters">
                <label class="form-check-label" :for="'pub-'+pub" style="font-size: 1.3rem; color: var(--light-color); cursor: pointer;">{{ pub }}</label>
              </div>
            </div>

            <button class="btn w-100 mt-2 filter-reset-btn" @click="resetFilters" style="font-size: 1.3rem; font-weight: 600; padding: 0.8rem; background: var(--orange); color: white; border-radius: .5rem; border: none; transition: .2s;">Xóa bộ lọc</button>
          </div>
        </div>
        <div class="col-md-9 col-lg-10">
          <!-- Main Book List -->
          <div v-if="loading" class="row">
            <div v-for="i in 8" :key="i" class="col-6 col-md-4 col-lg-3 mb-4">
              <div class="card h-100 border-0 shadow-sm">
                <!-- Image skeleton -->
                <div class="skeleton p-3" style="height: 250px; border-radius: 8px 8px 0 0;"></div>
                <div class="card-body">
                  <!-- Title skeleton -->
                  <div class="skeleton mb-3" style="height: 20px; width: 100%;"></div>
                  <div class="skeleton mb-3" style="height: 20px; width: 80%;"></div>
                  <!-- Category/Author skeleton -->
                  <div class="skeleton mb-3" style="height: 15px; width: 60%;"></div>
                  <!-- Price skeleton -->
                  <div class="skeleton mb-3" style="height: 24px; width: 50%;"></div>
                  <!-- Button skeleton -->
                  <div class="skeleton mt-auto" style="height: 38px; width: 100%; border-radius: 4px;"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="row book-list">
            <template v-if="books.length > 0">
              <div v-for="book in books" :key="book.bookID" class="col-6 col-md-4 col-lg-3 mb-4">
                <book-card :book="book" />
              </div>
            </template>

            <!-- Empty State -->
            <div v-else class="empty-results py-5 text-center w-100">
              <i class="fas fa-search-minus" style="font-size: 6rem; color: var(--muted-color); opacity: 0.3; margin-bottom: 2rem;"></i>
              <p style="font-size: 1.8rem; color: var(--light-color);" v-html="emptyMessage"></p>
            </div>
          </div>

          <!-- Suggested Books Section -->
          <div v-if="!loading && books.length === 0 && suggestions.length > 0" class="suggested-section mt-5 pt-4 border-top">
            <h3 class="suggested-title mb-4" style="font-size: 2rem; font-weight: 700; color: var(--black);">Sách gợi ý cho bạn</h3>
            <div class="row">
              <div v-for="book in suggestions" :key="book.bookID" class="col-6 col-md-4 col-lg-3 mb-4">
                <book-card :book="book" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import BookCard from './BookCard.vue';

const books = ref([]);
const suggestions = ref([]);
const loading = ref(true);
const currentCategory = ref('all');
const currentSearch = ref('');

const availableCategories = ref([]);
const availablePublishers = ref([]);
const filters = ref({
  minPrice: '',
  maxPrice: '',
  publishers: []
});

// Computed title for breadcrumb
const currentTitle = computed(() => {
  if (currentSearch.value) return `Kết quả cho: "${currentSearch.value}"`;
  if (currentCategory.value !== 'all') return currentCategory.value;
  return 'Tất cả sách';
});

// Message when no results
const emptyMessage = computed(() => {
  if (currentSearch.value) {
    return `Rất tiếc, không tìm thấy kết quả nào cho từ khóa "<strong>${currentSearch.value}</strong>".`;
  }
  return 'Xin lỗi, chúng tôi không tìm thấy sách phù hợp.';
});

const fetchBooks = async () => {
  loading.value = true;
  let url = '/api/books';
  const params = new URLSearchParams();
  
  if (currentCategory.value !== 'all') {
    params.append('category', currentCategory.value);
  }
  if (currentSearch.value) {
    params.append('search', currentSearch.value);
  }
  if (filters.value.minPrice) {
    params.append('minPrice', filters.value.minPrice);
  }
  if (filters.value.maxPrice) {
    params.append('maxPrice', filters.value.maxPrice);
  }
  if (filters.value.publishers && filters.value.publishers.length > 0) {
    params.append('publishers', filters.value.publishers.join(','));
  }
  
  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  try {
    const response = await fetch(url);
    books.value = await response.json();
    
    if (books.value.length === 0) {
      await fetchSuggestions();
    }
  } catch (error) {
    console.error('Lỗi khi tải sách:', error);
  } finally {
    loading.value = false;
  }
};

const fetchSuggestions = async () => {
  try {
    const response = await fetch('/api/books');
    const all = await response.json();
    suggestions.value = all.sort(() => 0.5 - Math.random()).slice(0, 4);
  } catch (error) {
    console.error('Lỗi khi tải gợi ý:', error);
  }
};

const filterByCategory = (category) => {
  currentCategory.value = category;
  currentSearch.value = '';
  applyFilters();
};

const applyFilters = () => {
  const url = new URL(window.location);
  url.searchParams.set('category', currentCategory.value);
  url.searchParams.delete('search');
  window.history.pushState({}, '', url);
  fetchBooks();
};

const resetFilters = () => {
  currentCategory.value = 'all';
  filters.value.minPrice = '';
  filters.value.maxPrice = '';
  filters.value.publishers = [];
  applyFilters();
};

const fetchMetadata = async () => {
    try {
        const [catRes, bookRes] = await Promise.all([
            fetch('/api/categories'),
            fetch('/api/books')
        ]);
        const categories = await catRes.json();
        availableCategories.value = categories.map(c => c.categoryName);
        
        const allBooks = await bookRes.json();
        const pubs = new Set(allBooks.map(b => b.publisher).filter(p => p));
        availablePublishers.value = Array.from(pubs);
    } catch (e) {
        console.error('Lỗi khi tải dữ liệu lọc', e);
    }
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  currentCategory.value = params.get('category') || 'all';
  currentSearch.value = params.get('search') || '';
  
  fetchMetadata();
  fetchBooks();

  // Listen for category selection from header (Manual event if needed)
  window.addEventListener('categoryChanged', (e) => {
    currentCategory.value = e.detail.category;
    currentSearch.value = '';
    fetchBooks();
  });
});
</script>

<style scoped>
/* ============================================================
   BookListApp — Scoped Styles
   Merged from: book-list.css
   ============================================================ */

/* ---- Book List Layout ---- */
.book-list {
    padding: 1rem;
    min-height: 40rem;
}

.book-list p {
    font-size: var(--fs-md);
    color: var(--light-color);
    text-align: center;
    width: 100%;
    margin-top: 5rem;
}

/* ---- Card ---- */
.card {
    height: 100%;
    border: none;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--white);
    box-shadow: var(--shadow-light);
    transition: var(--transition);
    cursor: pointer;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-premium);
}

.card-img-top {
    height: 24rem;
    object-fit: contain;
    padding: 1rem;
    background: var(--bg-light);
    transition: var(--transition);
}

.card:hover .card-img-top {
    transform: scale(1.05);
}

.card-body {
    padding: 1.5rem 1.2rem;
    display: flex;
    flex-direction: column;
}

.card-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
    color: var(--black);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    height: 4.2rem;
}

.card-text {
    font-size: 1.3rem;
    color: var(--light-color);
    margin-bottom: 0.5rem;
}

/* ---- Breadcrumb ---- */
.breadcrumb {
    background: transparent;
    padding: 1rem 0;
    margin-bottom: 0;
}

.breadcrumb-item a {
    color: var(--light-color);
    text-decoration: none;
    font-size: 1.4rem;
}

.breadcrumb-item.active {
    color: var(--orange);
    font-weight: 600;
    font-size: 1.4rem;
}

/* ---- Filter Sidebar ---- */
.filter-sidebar {
    position: sticky;
    top: 8rem;
}

.filter-btn:hover {
    background: var(--orange) !important;
    color: white !important;
}

.filter-reset-btn:hover {
    background: var(--black) !important;
}

.suggested-section {
    border-top: var(--border);
}

/* ---- Skeleton Loading ---- */
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
}

@keyframes loading {
    to { background-position: -200% 0; }
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
    .book-list { padding: 0.5rem; }
    .card-img-top { height: 18rem; }
    .card-body { padding: 1rem 0.8rem; }
    .card-title { font-size: 1.3rem; height: 3.6rem; margin-bottom: 0.5rem; }
    .card-text { font-size: 1.1rem; }
}

@media (max-width: 480px) {
    .card-img-top { height: 16rem; }
}
</style>
