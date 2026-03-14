<template>
    <div class="content-pane glass active">
        <div class="content-header">
            <h2>Thư viện của tôi</h2>
            <p>Xem toàn bộ các cuốn sách bạn đã mua và sở hữu</p>
        </div>
        
        <!-- Skeleton Loading State -->
        <div v-if="loading" class="row g-4">
            <div v-for="i in 4" :key="i" class="col-6 col-md-4 col-lg-3 mb-4">
                <div class="purchased-book-card">
                    <div class="p-book-image-wrapper">
                        <div class="skeleton-loader"></div>
                    </div>
                    <div class="p-book-info">
                        <div class="skeleton-loader mb-2" style="height: 20px; width: 80%;"></div>
                        <div class="skeleton-loader mb-3" style="height: 15px; width: 60%;"></div>
                        <div class="skeleton-loader mt-auto" style="height: 35px; border-radius: 8px;"></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="books.length === 0" class="text-center py-5">
            <i class="fas fa-book-reader fa-4x mb-3 text-muted" style="opacity: 0.3;"></i>
            <p class="text-muted">Xem tủ sách cá nhân của bạn để bắt đầu đọc.</p>
            <base-button href="/book-list" variant="primary" class="mt-3" @click="goToBooks">Đi tới thư viện</base-button>
        </div>

        <div v-else class="row g-4">
            <div v-for="book in books" :key="book.bookID" class="col-6 col-md-4 col-lg-3 mb-4">
                <div class="purchased-book-card">
                    <div class="p-book-image-wrapper">
                        <img :src="book.image || 'https://fakeimg.pl/200x300/f0f0f0/909090?text=No+Image'" 
                             class="p-book-image" :alt="book.title">
                    </div>
                    <div class="p-book-info">
                        <a :href="'/book-details?id=' + book.bookID" class="p-book-title" :title="book.title">
                            {{ book.title }}
                        </a>
                        <div class="p-book-author">{{ book.author || 'Đang cập nhật' }}</div>
                        <div class="p-book-price price">
                            {{ formatCurrency(book.purchase_price) }}
                        </div>
                        <div class="p-book-date">
                            <i class="far fa-calendar-alt"></i>
                            Mua ngày: {{ formatDateShort(book.order_date) }}
                        </div>
                        <div class="p-book-actions">
                            <base-button variant="primary" size="sm" class="w-100" @click="viewDetails(book.bookID)">Mua lại</base-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency, formatDateShort } from '@/utils/formatters';

defineProps({
    books: Array,
    loading: Boolean
});

const goToBooks = () => {
    window.location.href = '/book-list';
};

const viewDetails = (id) => {
    window.location.href = '/book-details?id=' + id;
};
</script>

<style scoped>
.content-pane {
    padding: 4rem;
    background: rgba(255, 255, 255, 0.95) !important;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-medium);
    animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.content-header { margin-bottom: 2.5rem; }
.content-header h2 { font-size: var(--fs-h2); color: var(--black); text-align: left; margin-bottom: 0.5rem; font-weight: 700; }
.content-header p { font-size: var(--fs-sm); color: var(--light-color); }

.purchased-book-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-color);
    transition: var(--transition);
    box-shadow: var(--shadow-light);
}

.purchased-book-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-premium); border-color: var(--orange); }

.p-book-image-wrapper { position: relative; width: 100%; aspect-ratio: 2/3; margin-bottom: 1.5rem; border-radius: var(--radius-md); overflow: hidden; background: #f8f9fa; }
.p-book-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.p-book-info { text-align: left; display: flex; flex-direction: column; height: 100%; }
.p-book-title { font-size: var(--fs-base); font-weight: 700; color: var(--black); margin-bottom: 0.5rem; text-decoration: none; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.p-book-author { font-size: var(--fs-sm); color: var(--light-color); margin-bottom: 0.5rem; }
.p-book-price { font-size: var(--fs-sm); font-weight: 700; color: var(--orange); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.6rem; }
.p-book-date { margin-top: auto; font-size: var(--fs-xs); padding-top: 1rem; border-top: 1px solid var(--border-color-light); color: var(--muted-color); display: flex; align-items: center; gap: 0.6rem; }
.p-book-date i { font-size: 1.1rem; color: #bbb; }
.p-book-actions { margin-top: 1.5rem; display: flex; gap: 1rem; }

@media (max-width: 991px) {
    .content-pane { padding: 2rem; }
}
</style>
