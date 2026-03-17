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
          <!-- Filter Sidebar -->
          <filter-sidebar
              :categories="availableCategories"
              :publishers="availablePublishers"
              :total-count="totalBooksCount"
              :current-category="currentCategory"
              :filters="filters"
              @filter-changed="onFilterChanged"
              @reset="resetFilters"
          />
        </div>
        <div class="col-md-9 col-lg-10">
          <!-- Loading Skeleton -->
          <div v-if="loading" class="row">
            <div v-for="i in 8" :key="i" class="col-6 col-md-4 col-lg-3 mb-4">
              <div class="card h-100 border-0 shadow-sm">
                <div class="skeleton p-3" style="height: 250px; border-radius: 8px 8px 0 0;"></div>
                <div class="card-body">
                  <div class="skeleton mb-3" style="height: 20px; width: 100%;"></div>
                  <div class="skeleton mb-3" style="height: 20px; width: 80%;"></div>
                  <div class="skeleton mb-3" style="height: 15px; width: 60%;"></div>
                  <div class="skeleton mb-3" style="height: 24px; width: 50%;"></div>
                  <div class="skeleton mt-auto" style="height: 38px; width: 100%; border-radius: 4px;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Book Grid -->
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
          <div v-if="!loading && books.length === 0" class="suggested-section mt-5 pt-4 border-top">
            <div class="d-flex justify-content-between align-items-center mb-4">
               <h3 v-if="suggestions.length > 0 || loadingSuggestions" class="suggested-title m-0" style="font-size: 2rem; font-weight: 700; color: var(--black);">Có thể bạn sẽ thích</h3>
            </div>
            
            <div v-if="loadingSuggestions" class="row">
               <div v-for="i in 4" :key="i" class="col-6 col-md-4 col-lg-3 mb-4">
                  <div class="skeleton" style="height: 350px; border-radius: 12px;"></div>
               </div>
            </div>

            <div v-else-if="suggestions.length > 0" class="row">
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
import { useQuery } from '@tanstack/vue-query';
import BookCard from './BookCard.vue';
import FilterSidebar from './book-list/FilterSidebar.vue';

// Import Services
import BookService from '@/services/BookService';
import CategoryService from '@/services/CategoryService';

const currentCategory = ref('all');
const currentSearch = ref('');

const filters = ref({
  minPrice: '',
  maxPrice: '',
  publishers: []
});

// Reacting to URL params on load
const initFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    currentCategory.value = params.get('category') || 'all';
    currentSearch.value = params.get('search') || '';
};

// 1. Fetch Danh sách sách chính với Vue Query
const booksQuery = useQuery({
    queryKey: computed(() => ['books', { 
        category: currentCategory.value, 
        search: currentSearch.value,
        ...filters.value 
    }]),
    queryFn: () => BookService.fetchBooks({
        category: currentCategory.value !== 'all' ? currentCategory.value : undefined,
        search: currentSearch.value || undefined,
        minPrice: filters.value.minPrice || undefined,
        maxPrice: filters.value.maxPrice || undefined,
        publishers: filters.value.publishers.length > 0 ? filters.value.publishers.join(',') : undefined
    }),
});

const books = computed(() => booksQuery.data.value || []);
const loading = computed(() => booksQuery.isLoading.value);

// 3. Query Gợi ý (khi ko có kết quả)
const suggestionQuery = useQuery({
    queryKey: ['book-suggestions-list'],
    queryFn: () => BookService.fetchBooks({ limit: 8, random: true }),
    enabled: computed(() => !loading.value && books.value.length === 0),
});

const suggestions = computed(() => suggestionQuery.data.value ? suggestionQuery.data.value.slice(0, 8) : []);
const loadingSuggestions = computed(() => suggestionQuery.isLoading.value);

// 2. Fetch Metadata (Categories & Publishers)
const metadataQuery = useQuery({
    queryKey: ['books-metadata'],
    queryFn: async () => {
        const [categories, allBooks] = await Promise.all([
            CategoryService.getCategories(),
            BookService.fetchBooks()
        ]);
        
        const availableCategories = categories.map(c => ({
            name: c.categoryName,
            count: allBooks.filter(b => b.categoryName === c.categoryName).length
        }));

        const pubMap = {};
        allBooks.forEach(b => {
            if (b.publisher) pubMap[b.publisher] = (pubMap[b.publisher] || 0) + 1;
        });
        const availablePublishers = Object.entries(pubMap).map(([name, count]) => ({ name, count }));

        return {
            availableCategories,
            availablePublishers,
            totalCount: allBooks.length
        };
    },
});

const availableCategories = computed(() => metadataQuery.data.value?.availableCategories || []);
const availablePublishers = computed(() => metadataQuery.data.value?.availablePublishers || []);
const totalBooksCount = computed(() => metadataQuery.data.value?.totalCount || 0);

const currentTitle = computed(() => {
  if (currentSearch.value) return `Kết quả cho: "${currentSearch.value}"`;
  if (currentCategory.value !== 'all') return currentCategory.value;
  return 'Tất cả sách';
});

const emptyMessage = computed(() => {
  if (currentSearch.value) {
    return `Rất tiếc, không tìm thấy kết quả nào cho từ khóa "<strong>${currentSearch.value}</strong>".`;
  }
  return 'Xin lỗi, chúng tôi không tìm thấy sách phù hợp.';
});

const applyFilters = () => {
  const url = new URL(window.location);
  url.searchParams.set('category', currentCategory.value);
  if (currentSearch.value) url.searchParams.set('search', currentSearch.value);
  else url.searchParams.delete('search');
  window.history.pushState({}, '', url);
};

const filterByCategory = (category) => {
  currentCategory.value = category;
  currentSearch.value = '';
  applyFilters();
};

const onFilterChanged = (filterData) => {
  currentCategory.value = filterData.category;
  filters.value.minPrice = filterData.minPrice;
  filters.value.maxPrice = filterData.maxPrice;
  filters.value.publishers = filterData.publishers;
  applyFilters();
};

const resetFilters = () => {
  currentCategory.value = 'all';
  filters.value.minPrice = '';
  filters.value.maxPrice = '';
  filters.value.publishers = [];
  applyFilters();
};

onMounted(() => {
  initFromUrl();
  window.addEventListener('categoryChanged', (e) => {
    currentCategory.value = e.detail.category;
    currentSearch.value = '';
    applyFilters();
  });
});
</script>

<style scoped>
/* ============================================================
   BookListApp — Scoped Styles
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
