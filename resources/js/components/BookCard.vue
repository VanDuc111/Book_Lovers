<template>
  <div class="book-card-wrapper" @click="goToDetails">
    <div class="card h-100">
      <div class="image-container">
        <img 
          :src="book.image || '/assets/images/default.jpg'" 
          class="card-img-top" 
          :alt="book.title || 'Không có tiêu đề'"
        >
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ book.title || 'Không có tiêu đề' }}</h5>
        <p class="card-text author text-muted">{{ book.author || 'Không có tác giả' }}</p>
        <p class="card-text price mt-auto">
          {{ formatPrice(book.bookPrice) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * BookCard Component
 * Hiển thị thông tin cơ bản của một cuốn sách
 */

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});

const formatPrice = (price) => {
  if (!price) return 'Chưa rõ';
  return Number(price).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  });
};

const goToDetails = () => {
  if (props.book.bookID) {
    window.location.href = `/book-details?id=${props.book.bookID}`;
  }
};
</script>

<style scoped>
.book-card-wrapper {
  cursor: pointer;
  transition: transform 0.3s ease;
  height: 100%;
}

.book-card-wrapper:hover {
  transform: translateY(-6px);
}

.card {
  border: var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-light);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.book-card-wrapper:hover .card {
  box-shadow: var(--shadow-premium);
}

.image-container {
  height: 220px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
}

.image-container img {
  width: auto;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.book-card-wrapper:hover img {
  transform: scale(1.05);
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3.6rem;
}

.author {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--orange);
}
</style>
