<template>
    <section class="home" id="home">
        <div class="row align-items-center">
            <div class="col-lg-5 content">
                <h3>Ưu đãi lên đến 30%!</h3>
                <p>Danh sách nổi bật</p>
                <base-button href="/book-list" variant="primary" size="lg" class="mt-3">Mua ngay!</base-button>
            </div>

            <div class="col-lg-7">
                <div class="swiper home-books-list" ref="heroSwiperRef">
                    <div class="swiper-wrapper">
                        <div v-if="loading" class="swiper-slide loading-message">
                            Đang tải danh sách nổi bật...
                        </div>
                        <div v-for="book in books" :key="book.id" class="swiper-slide">
                            <a :href="'/book-details?id=' + book.id">
                                <img :src="book.image || '/assets/images/placeholder.jpg'" :alt="book.title">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
    books: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: true,
    },
});

const heroSwiperRef = ref(null);

watch(() => props.books, (newBooks) => {
    if (newBooks.length > 0) {
        nextTick(() => initSwiper());
    }
});

const initSwiper = () => {
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
</script>

<style scoped>
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
  height: var(--hero-height);
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

/* ---- Responsive ---- */
@media (max-width: 991px) {
  .home {
      background-position: center !important;
  }
  .home .row .content,
  .home .row .home-books-list { flex: 1 1 100%; width: 100%; }
  .home .row .home-books-list { 
      margin-top: 0; 
      height: var(--hero-height-mobile);
      -webkit-mask-image: none;
      mask-image: none;
  }
  .home .row .content h3 { font-size: var(--fs-h2); }
  .home .row .content p { padding: 0.2rem 0; font-size: var(--fs-sm); }
}

@media (max-width: 768px) {
  .home .row .content h3 { font-size: 3.5rem; }
  .home .row .content { text-align: center; }
  .home .row .content p { padding: 0.5rem 0; }
}
</style>
