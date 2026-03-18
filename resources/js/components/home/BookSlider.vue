<template>
    <section class="container book-slider" :id="sectionId">
        <div class="heading"><span>{{ title }}</span></div>
        <div class="swiper" ref="swiperRef">
            <div class="swiper-wrapper">
                <div v-if="loading" class="swiper-slide loading-message text-center w-100">
                    {{ loadingText }}
                </div>
                <div v-for="book in books" :key="book.id" class="swiper-slide">
                    <book-card :book="book" />
                </div>
            </div>
            <!-- Swiper Controls -->
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    </section>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    sectionId: {
        type: String,
        default: '',
    },
    books: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: true,
    },
    loadingText: {
        type: String,
        default: 'Đang tải sách...',
    },
    autoplayDelay: {
        type: Number,
        default: 8500,
    },
});

const swiperRef = ref(null);

watch(() => props.books, (newBooks) => {
    if (newBooks.length > 0) {
        nextTick(() => initSwiper());
    }
});

const initSwiper = () => {
    if (swiperRef.value && typeof window.Swiper !== 'undefined') {
        new window.Swiper(swiperRef.value, {
            spaceBetween: 20,
            loop: true,
            autoplay: { delay: props.autoplayDelay, disableOnInteraction: false },
            navigation: {
                nextEl: swiperRef.value.querySelector('.swiper-button-next'),
                prevEl: swiperRef.value.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                0: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
            },
        });
    }
};
</script>

<style scoped>
.loading-message {
    padding: 3rem;
    font-size: 1.5rem;
    color: var(--light-color);
}

/* ---- Section Headings ---- */
.heading {
    text-align: left;
    margin-bottom: var(--heading-margin-bottom);
    margin-top: var(--heading-margin-top);
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
    color: var(--white);
    background: var(--heading-bg);
    padding: 0.7rem 2rem;
    border-radius: var(--heading-radius);
    display: inline-block;
    position: relative;
    z-index: 1;
    box-shadow: var(--heading-shadow);
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
  width: 3.5rem;
  height: 3.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--white);
  color: var(--blue);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border: var(--border);
  z-index: 10;
  transition: all 0.3s ease;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: var(--blue);
  color: var(--white);
  box-shadow: 0 8px 20px rgba(94, 94, 249, 0.4);
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 1.2rem;
  font-weight: bold;
  color: currentColor;
}

.swiper-button-prev { left: 0.5rem; }
.swiper-button-next { right: 0.5rem; }

/* ---- Sections ---- */
.book-slider {
    padding-bottom: 3rem;
}

.swiper-slide {
    height: auto;
}

/* ---- Responsive ---- */
@media (max-width: 991px) {
    .heading { margin-top: 3rem; margin-bottom: 2rem; }
}

@media (max-width: 768px) {
    .heading { margin-top: 2rem; margin-bottom: 2rem; padding-left: 1rem; }
    .heading span { font-size: 1.8rem; padding: 0.8rem 2rem; }

    .swiper-button-next, .swiper-button-prev {
        width: 3.2rem;
        height: 3.2rem;
    }
    .swiper-button-prev { left: 0; }
    .swiper-button-next { right: 0; }
}
</style>
