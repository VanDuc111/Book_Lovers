<template>
    <section class="reviews container" id="recent-reviews">
        <div class="heading"><span>Đánh giá gần đây</span></div>
        <div class="row">
            <div v-if="loading" class="col-12 text-center py-5">
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
</template>

<script setup>
defineProps({
    reviews: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: true,
    },
});
</script>

<style scoped>
/* ---- Heading (duplicated here for scoped isolation) ---- */
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

/* ---- Reviews Section ---- */
.reviews { padding-top: 5rem; padding-bottom: 5rem; }

.reviews .row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -1rem;
}

.reviews .col-md-4 {
    padding: 0 1rem;
}

.reviews .card {
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-premium);
    border: var(--border);
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
}

.reviews .card-title { font-size: var(--fs-base); color: var(--black); margin-bottom: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.reviews .card-text { font-size: var(--fs-sm); color: var(--light-color); font-style: italic; }
.reviews .rating { display: inline-block; margin-top: 0.6rem; color: var(--rating-star, #ffb400); font-size: var(--fs-base); }

/* ---- Responsive ---- */
@media (max-width: 991px) {
    .heading { margin-top: 3rem; margin-bottom: 2rem; }
}
@media (max-width: 768px) {
    .heading { margin-top: 2rem; margin-bottom: 2rem; padding-left: 1rem; }
    .heading span { font-size: 1.8rem; padding: 0.8rem 2rem; }
}
</style>
