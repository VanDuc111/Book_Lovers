<template>
    <div>
        <!-- Hero Section -->
        <hero-section :books="featuredBooks" :loading="loadingFeatured" />

        <!-- Category Section (Văn học) -->
        <book-slider
            title="Sách Thể Loại Văn Học"
            section-id="sach-van-hoc"
            :books="vanHocBooks"
            :loading="loadingVanHoc"
            loading-text="Đang tải sách văn học..."
            :autoplay-delay="8500"
        />

        <!-- Daily Recommended Section -->
        <book-slider
            title="Gợi Ý Hôm Nay"
            section-id="daily-recommended"
            :books="recommendedBooks"
            :loading="loadingRecommended"
            loading-text="Đang tải sách gợi ý..."
            :autoplay-delay="6000"
        />

        <!-- Recent Reviews Section -->
        <recent-reviews :reviews="reviews" :loading="loadingReviews" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HeroSection from './home/HeroSection.vue';
import BookSlider from './home/BookSlider.vue';
import RecentReviews from './home/RecentReviews.vue';

const featuredBooks = ref([]);
const vanHocBooks = ref([]);
const recommendedBooks = ref([]);
const reviews = ref([]);

const loadingFeatured = ref(true);
const loadingVanHoc = ref(true);
const loadingRecommended = ref(true);
const loadingReviews = ref(true);

onMounted(async () => {
    fetchFeaturedAndRecommended();
    fetchVanHocBooks();
    fetchReviews();
});

const fetchFeaturedAndRecommended = async () => {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();

        featuredBooks.value = books.filter(b => b.isFeatured || b.featured === 1).slice(0, 6);
        if (featuredBooks.value.length === 0) {
            featuredBooks.value = books.slice(0, 6);
        }
        loadingFeatured.value = false;

        recommendedBooks.value = [...books].sort(() => 0.5 - Math.random()).slice(0, 7);
        loadingRecommended.value = false;
    } catch (error) {
        console.error('Error fetching books:', error);
    }
};

const fetchVanHocBooks = async () => {
    try {
        const response = await fetch('/api/books?category=' + encodeURIComponent('Văn học'));
        vanHocBooks.value = await response.json();
        loadingVanHoc.value = false;
    } catch (error) {
        console.error('Error fetching van hoc books:', error);
    }
};

const fetchReviews = async () => {
    try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        reviews.value = Array.isArray(data) ? data.slice(0, 3) : [];
        loadingReviews.value = false;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};
</script>
