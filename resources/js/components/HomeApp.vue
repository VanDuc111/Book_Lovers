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
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import HeroSection from './home/HeroSection.vue';
import BookSlider from './home/BookSlider.vue';
import RecentReviews from './home/RecentReviews.vue';

// Import Services
import BookService from '@/services/BookService';
import ReviewService from '@/services/ReviewService';

// 1. Fetch toàn bộ sách (cho Hero và Gợi ý)
const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: () => BookService.fetchBooks(),
});

// 2. Fetch sách Văn học
const vanHocQuery = useQuery({
    queryKey: ['books', { category: 'Văn học' }],
    queryFn: () => BookService.fetchBooks({ category: 'Văn học' }),
});

// 3. Fetch reviews gần đây
const reviewsQuery = useQuery({
    queryKey: ['reviews', 'recent'],
    queryFn: async () => {
        const data = await ReviewService.getAll();
        return Array.isArray(data) ? data.slice(0, 3) : [];
    },
});

// Logic biến đổi dữ liệu (Dùng .value vì useQuery trả về các ref)
const allBooks = computed(() => booksQuery.data.value || []);
const vanHocBooks = computed(() => vanHocQuery.data.value || []);
const reviews = computed(() => reviewsQuery.data.value || []);

const featuredBooks = computed(() => {
    const featured = allBooks.value.filter(b => b.isFeatured || b.featured === 1).slice(0, 6);
    return featured.length > 0 ? featured : allBooks.value.slice(0, 6);
});

const recommendedBooks = computed(() => {
    return [...allBooks.value].sort(() => 0.5 - Math.random()).slice(0, 7);
});

const loadingFeatured = computed(() => booksQuery.isLoading.value);
const loadingVanHoc = computed(() => vanHocQuery.isLoading.value);
const loadingRecommended = computed(() => booksQuery.isLoading.value);
const loadingReviews = computed(() => reviewsQuery.isLoading.value);
</script>
