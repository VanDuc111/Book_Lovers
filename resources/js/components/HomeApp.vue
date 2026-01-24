<template>
    <div>
        <!-- Hero Section -->
        <section class="home" id="home">
            <div class="row align-items-center">
                <div class="col-md-5 content">
                    <h3>Ưu đãi lên đến 30%!</h3>
                    <p>Danh sách nổi bật</p>
                    <a href="/book-list" class="btn">Mua ngay!</a>
                </div>

                <div class="col-md-7">
                    <div class="swiper home-books-list" ref="heroSwiperRef">
                        <div class="swiper-wrapper">
                            <div v-if="loadingFeatured" class="swiper-slide loading-message">
                                Đang tải danh sách nổi bật...
                            </div>
                            <div v-for="book in featuredBooks" :key="book.bookID" class="swiper-slide">
                                <a :href="'/book-details?id=' + book.bookID">
                                    <img :src="book.image || '/assets/images/placeholder.jpg'" :alt="book.title">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Category Section (Văn học) -->
        <section class="sach-van-hoc container book-slider" id="sach-van-hoc">
            <div class="heading"><span>Sách Thể Loại Văn Học</span></div>

            <div class="sach-van-hoc-list swiper" ref="vanHocSwiperRef">
                <div class="swiper-wrapper">
                    <div v-if="loadingVanHoc" class="swiper-slide loading-message text-center w-100">
                        Đang tải sách văn học...
                    </div>
                    <div v-for="book in vanHocBooks" :key="book.bookID" class="swiper-slide box sach-van-hoc-slider" @click="goToDetails(book.bookID)">
                        <div class="image">
                            <img :src="book.image || 'default-image.jpg'" :alt="book.title">
                        </div>
                        <div class="content">
                            <h3>{{ book.title }}</h3>
                            <br>
                            <div class="price price">{{ formatCurrency(book.bookPrice) }}</div>
                            <br>
                        </div>
                    </div>
                </div>
                <!-- Swiper Controls -->
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </section>

        <!-- Daily Recommended Section -->
        <section class="daily-recommended container book-slider" id="daily-recommended">
            <div class="heading"><span>Gợi Ý Hôm Nay</span></div>
            <div class="daily-recommended-list swiper" ref="dailySwiperRef">
                <div class="swiper-wrapper">
                    <div v-if="loadingRecommended" class="swiper-slide loading-message text-center w-100">
                        Đang tải sách gợi ý...
                    </div>
                    <div v-for="book in recommendedBooks" :key="book.bookID" class="swiper-slide box daily-recommended-slider" @click="goToDetails(book.bookID)">
                        <div class="image">
                            <img :src="book.image || 'default-image.jpg'" :alt="book.title">
                        </div>
                        <div class="content">
                            <h3>{{ book.title }}</h3>
                            <br>
                            <div class="price price">{{ formatCurrency(book.bookPrice) }}</div>
                            <br>
                        </div>
                    </div>
                </div>
                <!-- Swiper Controls -->
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </section>

        <!-- Recent Reviews Section -->
        <section class="reviews container book-slider" id="recent-reviews">
            <div class="heading"><span>Đánh giá gần đây</span></div>
            <div class="row">
                <div v-if="loadingReviews" class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 text-muted">Đang tải các đánh giá mới nhất...</p>
                </div>
                <div v-else-if="reviews.length === 0" class="col-12 text-center py-5">
                    <p class="text-muted">Chưa có đánh giá nào.</p>
                </div>
                <div v-for="review in reviews" :key="review.reviewID" class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <img :src="review.bookImage || '/assets/images/placeholder.png'" class="card-img-top img-fluid" :alt="review.bookTitle" style="height: 200px; object-fit: contain; padding: 1rem;">
                        <div class="card-body text-center">
                            <h5 class="card-title">{{ review.bookTitle || '---' }}</h5>
                            <div class="text-muted mb-2" style="font-size: 1.1rem;">
                                <i class="fas fa-user me-1"></i> {{ review.userName }}
                            </div>
                            <p class="card-text" style="font-style: italic;">
                                "{{ review.comment || 'Không có bình luận.' }}"
                            </p>
                            <div class="rating text-warning">
                                <template v-for="i in 5" :key="i">
                                    {{ i <= review.rating ? '★' : '☆' }}
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const featuredBooks = ref([]);
const vanHocBooks = ref([]);
const recommendedBooks = ref([]);
const reviews = ref([]);

const loadingFeatured = ref(true);
const loadingVanHoc = ref(true);
const loadingRecommended = ref(true);
const loadingReviews = ref(true);

const heroSwiperRef = ref(null);
const vanHocSwiperRef = ref(null);
const dailySwiperRef = ref(null);

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

        nextTick(() => {
            initHeroSwiper();
            initDailySwiper();
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
};

const fetchVanHocBooks = async () => {
    try {
        const response = await fetch('/api/books?category=' + encodeURIComponent('Văn học'));
        vanHocBooks.value = await response.json();
        loadingVanHoc.value = false;

        nextTick(() => {
            initVanHocSwiper();
        });
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

const initHeroSwiper = () => {
    if (heroSwiperRef.value && typeof window.Swiper !== 'undefined') {
        new window.Swiper(heroSwiperRef.value, {
            loop: true,
            centeredSlides: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            breakpoints: {
                0: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1200: { slidesPerView: 3, spaceBetween: 30 },
            },
        });
    } else if (typeof window.Swiper === 'undefined') {
        console.warn('Swiper not found during hero swiper init');
    }
};

const initVanHocSwiper = () => {
    if (vanHocSwiperRef.value && typeof window.Swiper !== 'undefined') {
        new window.Swiper(vanHocSwiperRef.value, {
            spaceBetween: 10,
            loop: true,
            autoplay: { delay: 8500, disableOnInteraction: false },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                0: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
            },
        });
    }
};

const initDailySwiper = () => {
    if (dailySwiperRef.value && typeof window.Swiper !== 'undefined') {
        new window.Swiper(dailySwiperRef.value, {
            spaceBetween: 20,
            loop: true,
            autoplay: { delay: 6000, disableOnInteraction: false },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                0: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
            },
        });
    }
};

const goToDetails = (id) => {
    window.location.href = `/book-details?id=${id}`;
};

const formatCurrency = (value) => {
    if (!value) return 'Chưa rõ';
    return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
};
</script>

<style scoped>
.loading-message {
    padding: 3rem;
    font-size: 1.5rem;
    color: var(--light-color);
}
.box {
    cursor: pointer;
}
.box:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
}
</style>
