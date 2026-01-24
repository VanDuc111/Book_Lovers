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
        <div class="col-md-2">
          <!-- Sidebar có thể thêm tại đây -->
        </div>
        <div class="col-md-10">
          <!-- Main Book List -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Đang tải danh sách sách...</p>
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
  // Cập nhật URL mà không reload trang (tùy chọn)
  const url = new URL(window.location);
  url.searchParams.set('category', category);
  url.searchParams.delete('search');
  window.history.pushState({}, '', url);
  fetchBooks();
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  currentCategory.value = params.get('category') || 'all';
  currentSearch.value = params.get('search') || '';
  
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
.suggested-section {
    border-top: var(--border);
}
</style>
