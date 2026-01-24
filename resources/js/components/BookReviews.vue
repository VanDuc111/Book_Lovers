<template>
  <div class="reviews-section-wrapper">
    <div class="reviews-section">
      <h3 style="margin-bottom: 2rem">Đánh giá sản phẩm</h3>
      
      <div class="row align-items-center mb-4">
        <div class="col-md-4 text-center border-end">
          <div class="avg-rating">
            <span class="display-4 fw-bold text-orange">{{ averageRating.toFixed(1) }}</span>
            <span class="text-muted">/5</span>
          </div>
          <div class="rating-stars static my-2" aria-hidden="true">
            <i v-for="i in 5" :key="i" 
               class="fa fa-star" 
               :style="{ color: i <= Math.round(averageRating) ? '#f4b400' : '#ddd' }"></i>
          </div>
          <div class="text-muted">({{ totalReviews }} đánh giá)</div>
        </div>

        <div class="col-md-8 px-lg-5">
          <!-- Phân bổ sao -->
          <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="d-flex align-items-center mb-1">
            <span class="me-2" style="width: 20px">{{ star }}</span>
            <i class="fa fa-star text-warning me-2 small"></i>
            <div class="progress flex-grow-1" style="height: 8px;">
              <div class="progress-bar bg-orange" role="progressbar" 
                   :style="{ width: getPercentage(star) + '%' }" 
                   :aria-valuenow="getPercentage(star)" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <span class="ms-2 text-muted small" style="width: 35px">{{ getPercentage(star) }}%</span>
          </div>
        </div>
      </div>

      <!-- Review Actions -->
      <div class="d-flex justify-content-between align-items-center border-top pt-4">
        <div class="review-status-note">
          <p v-if="!userId" class="text-muted mb-0">
            Chỉ có thành viên mới có thể viết nhận xét. Vui lòng
            <a href="/login" class="text-orange">đăng nhập</a> hoặc
            <a href="/register" class="text-orange">đăng ký</a>.
          </p>
          <p v-else-if="!hasPurchased" class="text-muted mb-0">
            Bạn cần mua sách này trước để có thể đánh giá.
          </p>
        </div>
        
        <button v-if="userId && hasPurchased && !showForm" 
                @click="showForm = true" class="btn btn-main">
          <i class="fas fa-pen me-2"></i> Viết đánh giá
        </button>
      </div>

      <!-- Write Review Form -->
      <transition name="fade">
        <div v-if="showForm" class="write-review-form mt-4 p-4 bg-light rounded shadow-sm">
          <h4 class="mb-4">Đánh giá của bạn</h4>
          
          <div class="mb-3">
            <label class="form-label d-block fw-bold">Chọn số sao:</label>
            <div class="star-rating-input" style="font-size: 2.5rem; cursor: pointer;">
              <i v-for="i in 5" :key="i"
                 class="fa fa-star"
                 :style="{ color: i <= (hoverRating || newReview.rating) ? '#f4b400' : '#ddd' }"
                 @click="newReview.rating = i"
                 @mouseenter="hoverRating = i"
                 @mouseleave="hoverRating = 0"></i>
            </div>
          </div>

          <div class="mb-3">
            <label for="review-comment" class="form-label fw-bold">Nhận xét của bạn:</label>
            <textarea 
                id="review-comment" 
                class="form-control" 
                rows="4" 
                v-model="newReview.comment"
                placeholder="Chia sẻ trải nghiệm của bạn về cuốn sách này..."
            ></textarea>
          </div>

          <div class="d-flex gap-2">
            <button @click="submitReview" 
                    :disabled="submitting" 
                    class="btn btn-main">
              <i v-if="submitting" class="fas fa-spinner fa-spin me-2"></i>
              <i v-else class="fas fa-paper-plane me-2"></i> 
              Gửi đánh giá
            </button>
            <button @click="showForm = false" class="btn btn-secondary">Hủy</button>
          </div>
        </div>
      </transition>

      <hr class="my-5" />

      <!-- Reviews Tabs -->
      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item">
          <button class="nav-link active" data-bs-toggle="tab">Mới nhất</button>
        </li>
      </ul>

      <!-- Reviews List -->
      <div class="reviews-list">
        <div v-if="loadingReviews" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        
        <template v-else-if="reviews.length > 0">
          <div v-for="review in reviews" :key="review.reviewID" class="review-item d-flex mb-4 pb-4 border-bottom">
            <div class="review-user-info" style="width: 140px;">
              <div class="fw-bold fs-5 text-dark">{{ (review.userName || 'Ẩn danh').split(' ')[0] }}</div>
              <div class="text-muted small">{{ formatDate(review.created_at) }}</div>
            </div>
            <div class="review-content flex-grow-1">
              <div class="stars mb-2">
                <i v-for="i in 5" :key="i" 
                   class="fa fa-star" 
                   :class="i <= review.rating ? 'text-warning' : 'text-light-gray'"></i>
              </div>
              <div class="comment text-dark mb-3" style="font-size: 1.5rem; line-height: 1.6;">
                {{ review.comment }}
              </div>
              <div class="actions text-muted small">
                 <span class="me-3 cursor-pointer hover-orange">
                   <i class="far fa-heart me-1"></i> {{ review.likes || 0 }}
                 </span>
              </div>
            </div>
          </div>
        </template>
        
        <div v-else class="text-center py-4 text-muted">
          Chưa có đánh giá nào cho sản phẩm này.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true
  }
});

const userId = ref(null);
const reviews = ref([]);
const summary = ref(null);
const loadingReviews = ref(true);
const hasPurchased = ref(false);
const showForm = ref(false);
const submitting = ref(false);
const hoverRating = ref(0);

const newReview = ref({
  rating: 0,
  comment: ''
});

const totalReviews = computed(() => summary.value ? parseInt(summary.value.review_count) : 0);
const averageRating = computed(() => summary.value ? parseFloat(summary.value.avg_rating) : 0);

const getPercentage = (star) => {
  if (!summary.value || totalReviews.value === 0) return 0;
  const count = parseInt(summary.value[`c${star}`] || 0);
  return Math.round((count / totalReviews.value) * 100);
};

const fetchData = async () => {
  loadingReviews.value = true;
  try {
    // 1. Fetch Summary
    const sumRes = await fetch(`/api/reviews?summary=1&bookID=${props.bookId}`);
    const sumData = await sumRes.json();
    if (sumData.length > 0) summary.value = sumData[0];

    // 2. Fetch Reviews List
    const listRes = await fetch(`/api/reviews?bookID=${props.bookId}`);
    reviews.value = await listRes.json();

    // 3. Check purchase
    if (userId.value) {
      const purRes = await fetch(`/api/purchased-books?userID=${userId.value}&bookID=${props.bookId}`);
      const purData = await purRes.json();
      hasPurchased.value = purData.length > 0;
    }
  } catch (err) {
    console.error('Lỗi tải đánh giá:', err);
  } finally {
    loadingReviews.value = false;
  }
};

const submitReview = async () => {
  if (newReview.value.rating === 0) {
    if (window.showToast) window.showToast('Vui lòng chọn số sao đánh giá', 'warning');
    return;
  }
  if (!newReview.value.comment.trim()) {
    if (window.showToast) window.showToast('Vui lòng nhập nhận xét', 'warning');
    return;
  }

  submitting.value = true;
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookID: props.bookId,
        userID: userId.value,
        rating: newReview.value.rating,
        comment: newReview.value.comment
      })
    });
    const data = await res.json();
    if (data.success || data.reviewID) {
      if (window.showToast) window.showToast('Gửi đánh giá thành công!', 'success');
      showForm.value = false;
      newReview.value = { rating: 0, comment: '' };
      await fetchData(); // Reload
    } else {
      if (window.showToast) window.showToast(data.error || 'Lỗi gửi đánh giá', 'danger');
    }
  } catch (err) {
    console.error('Lỗi gửi đánh giá:', err);
  } finally {
    submitting.value = false;
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  userId.value = user ? user.userID : null;
  fetchData();
});
</script>

<style scoped>
.text-orange { color: var(--orange); }
.bg-orange { background-color: var(--orange); }
.text-light-gray { color: #ddd; }
.cursor-pointer { cursor: pointer; }
.hover-orange:hover { color: var(--orange); }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
