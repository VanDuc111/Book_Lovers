<template>
    <div>
        <!-- Hero Section -->
        <section class="home" id="home">
            <div class="row align-items-center">
                <div class="col-lg-5 content">
                    <h3>Ưu đãi lên đến 30%!</h3>
                    <p>Danh sách nổi bật</p>
                    <a href="/book-list" class="btn">Mua ngay!</a>
                </div>

                <div class="col-lg-7">
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
                    <div class="card h-100">
                        <img :src="review.bookImage || '/assets/images/placeholder.png'" class="card-img-top" :alt="review.bookTitle">
                        <div class="card-body">
                            <h5 class="card-title">{{ review.bookTitle || '---' }}</h5>
                            <div class="text-muted mb-2">
                                <i class="fas fa-user me-1"></i> {{ review.userName }}
                            </div>
                            <p class="card-text">
                                "{{ review.comment || 'Không có bình luận.' }}"
                            </p>
                            <div class="rating">
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
                0: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 30 },
            },
        });
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
/* ==========================
    HomeApp — Scoped Styles
    Merged from: home.css, books.css, reviews.css
   ========================== */

/* ---- Loading ---- */
.loading-message {
    padding: 3rem;
    font-size: 1.5rem;
    color: var(--light-color);
}

/* ---- Hero Section ---- */
.home {
  background: url('/assets/images/hero-bg.svg') no-repeat center right;
  background-size: cover;
  height: 57.2rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 0 9%;
}

.home::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0.95) 20%, rgba(255,255,255,0.2) 100%);
  z-index: 1;
}

.home .row {
  position: relative;
  z-index: 2;
  width: 100%;
}

.home .row .content {
  flex: 1 1 42rem;
  padding: 1rem 0;
}

.home .row .content h3 {
  color: var(--black);
  font-size: var(--fs-h1);
}

.home .row .content p {
  color: var(--light-color);
  font-size: var(--fs-md);
  line-height: 2;
  padding: 1rem 0;
}

.home .row .content .btn {
  margin-top: 1rem;
  padding: 1.2rem 3.5rem;
  font-size: 1.8rem;
  border-radius: var(--radius-pill);
  box-shadow: var(--btn-shadow);
  background: var(--orange);
  color: var(--white);
  border: none;
  text-decoration: none;
  display: inline-block;
  transition: var(--transition);
}

.home .row .content .btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-premium);
  background: var(--dark-color);
}

.home .row .home-books-list {
  padding: 0 1rem;
  margin-top: 4rem;
  flex: 1 1 42rem;
  text-align: center;
  overflow: hidden;
  height: 40rem;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 100%);
  mask-image: linear-gradient(to right, transparent 0%, black 15%, black 100%);
}

.home .row .home-books-list .swiper-slide {
  transition: transform 0.5s ease, opacity 0.5s ease;
  transform: scale(0.85);
  opacity: 0.6;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 2rem;
}

.home .row .home-books-list .swiper-slide-active {
  transform: scale(1.15);
  opacity: 1;
  z-index: 10;
}

.home .row .home-books-list a img {
  height: 32rem;
  width: auto;
  max-width: 100%;
  box-shadow: var(--shadow-premium);
  border-radius: var(--radius-sm);
  display: block;
  object-fit: contain;
  background: transparent;
}

/* ---- Section Headings ---- */
.heading {
    text-align: left;
    margin-bottom: 4rem;
    margin-top: 8.5rem;
    position: relative;
    display: flex;
    align-items: center;
}

.heading::before {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 0;
    width: 100%;
    height: 6px;
    background: rgba(255, 99, 71, 0.05);
    z-index: 0;
    border-radius: 10px;
}

.heading span {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, var(--orange) 0%, var(--dark-color) 100%);
    padding: 0.7rem 2rem;
    border-radius: 12px 35px 12px 5px;
    display: inline-block;
    position: relative;
    z-index: 1;
    box-shadow: 0 8px 15px rgba(255, 99, 71, 0.2);
    text-transform: capitalize;
    letter-spacing: 0.5px;
    border: none;
    transition: var(--transition);
}

.heading span:hover {
    transform: translateX(10px);
    box-shadow: 0 12px 25px rgba(255, 99, 71, 0.3);
}

/* ---- Swiper Controls ---- */
.swiper-button-next,
.swiper-button-prev {
  width: 4.8rem;
  height: 4.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--white);
  color: var(--blue);
  box-shadow: var(--shadow-premium);
  border: var(--border);
  z-index: 2000;
  transition: var(--transition);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 1.6rem;
  color: currentColor;
}

.swiper-button-prev { left: 1rem; }
.swiper-button-next { right: 1rem; }

.swiper-button-next:hover,
.swiper-button-prev:hover,
.swiper-button-next:focus,
.swiper-button-prev:focus {
  background: var(--blue);
  color: var(--white);
  transform: translateY(-50%) scale(1.06);
}

/* ---- Book Slider Boxes ---- */
.sach-van-hoc .swiper-wrapper { align-items: stretch; }
.sach-van-hoc .swiper-slide { display: flex; align-items: stretch; height: auto; }

.box {
    cursor: pointer;
    transition: var(--transition);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-light);
    border: var(--border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 42rem;
    width: 25rem;
    margin: 2rem 0;
    background: var(--white);
}

.box:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-premium);
}

.box .image {
  padding: 0;
  height: 26rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
}

.box .image img {
  width: auto;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 320ms ease;
}

.box:hover .image img { transform: scale(1.04); }

.box .content {
  padding: 1.6rem;
  border-top: var(--border);
}

.box .content h3 {
  font-size: 1.15rem;
  color: var(--black);
  margin-bottom: 0.8rem;
}

.box .content .price { padding-top: 0.5rem; }

/* ---- Reviews Section ---- */
.reviews { padding-top: 5rem; padding-bottom: 5rem; }

.reviews .row {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
}

.reviews .col-md-4 { display: flex; width: 25rem; flex: 0 0 auto; }

.reviews .card {
    flex: 1 1 auto;
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-premium);
    border: var(--border);
    display: flex;
    flex-direction: column;
}

.reviews .card-img-top {
    width: 100%;
    height: 200px;
    object-fit: contain;
    padding: 1rem;
    background: var(--bg-light);
}

.reviews .card-body {
    padding: 1.4rem 1.6rem;
    text-align: center;
    background: var(--white);
    flex: 1;
}

.reviews .card-title { font-size: var(--fs-base); color: var(--black); margin-bottom: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.reviews .card-text { font-size: var(--fs-sm); color: var(--light-color); font-style: italic; }
.reviews .rating { display: inline-block; margin-top: 0.6rem; color: var(--rating-star, #ffb400); font-size: var(--fs-base); }

/* ---- Responsive ---- */
@media (max-width: 991px) {
  .home .row .content,
  .home .row .home-books-list { flex: 1 1 100%; width: 100%; }
  .home .row .home-books-list { margin-top: 2rem; }
  .box { width: 17rem; min-height: auto; margin: 1rem 0; }
  .box .image { height: 18rem; }
  .box .content { padding: 1rem; }
  .reviews .col-md-4 { width: 14.5rem; }
  .reviews .card-img-top { height: 15rem; }
  .reviews .card-title { font-size: 1.1rem; }
  .reviews .card-text { font-size: 1rem; }
}

@media (max-width: 768px) {
  .home .row .content h3 { font-size: 3.5rem; }
  .home .row .content { text-align: center; }
  .heading { margin-bottom: 3rem; padding-left: 1rem; }
  .heading span { font-size: 1.8rem; padding: 0.8rem 2rem; }
}

@media (max-width: 500px) {
  .reviews .col-md-4 { max-width: 90%; flex: 0 0 auto; }
}

@media (max-width: 450px) {
  .box { width: 14.5rem; }
  .box .image { height: 15rem; }
  .box .content h3 { font-size: 1.05rem; height: 3rem; overflow: hidden; }
}
</style>
