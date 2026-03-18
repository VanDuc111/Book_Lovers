<template>
  <div class="book-card" @click="goToDetails">
    <div class="image">
      <img :src="book.image || '/assets/images/placeholder.jpg'" :alt="book.title">
    </div>
    <div class="content">
      <h3 class="title">{{ book.title }}</h3>
      <div class="price">{{ formatCurrency(book.price) }}</div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters';

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});

const goToDetails = () => {
  if (props.book.id) {
    window.location.href = `/book-details?id=${props.book.id}`;
  }
};
</script>

<style scoped>
.book-card {
    cursor: pointer;
    transition: var(--transition);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-light);
    border: var(--border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: var(--card-height);
    background: var(--white);
    width: var(--card-width);
}

.book-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-premium, 0 10px 25px rgba(0,0,0,0.1));
}

.book-card .image {
  padding: 1rem;
  height: var(--card-img-height);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
}

.book-card .image img {
  width: auto;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.5s ease;
}

.book-card:hover .image img { 
  transform: scale(1.05); 
}

.book-card .content {
  padding: 1.5rem;
  border-top: var(--border, 1px solid #eee);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-card .content .title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--black, #333);
  margin-bottom: 1rem;
  line-height: 1.4;
  height: 4rem; /* 2 lines max */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-card .content .price {
  font-size: 1.6rem;
  color: var(--orange, #ff6347);
  font-weight: 700;
  margin-top: auto;
}

@media (max-width: 768px) {
    .book-card .image {
        height: var(--card-img-height-mobile);
    }
    .book-card .content .title {
        font-size: var(--fs-xs);
    }
}
</style>
