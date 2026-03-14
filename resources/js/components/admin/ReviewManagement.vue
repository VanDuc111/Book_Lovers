<template>
    <div>
        <div class="section-header-sticky">
            <h2 class="mb-4">Quản lý Đánh giá</h2>
            <div class="mb-4 d-flex gap-3">
                <base-button variant="danger" :disabled="!selectedId" @click="$emit('delete', selectedId)">Xóa Đánh giá</base-button>
            </div>
            <div class="search-wrap mb-4">
                <input 
                    :value="searchQuery" 
                    @input="$emit('update:searchQuery', $event.target.value)" 
                    class="form-control" 
                    placeholder="Tìm ID sách hoặc người dùng..."
                >
            </div>
        </div>
        <div class="table-responsive">
            <table class="table hover-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sách (ID)</th>
                        <th>Người dùng (ID)</th>
                        <th>Điểm</th>
                        <th>Bình luận</th>
                        <th>Thời gian tạo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading" v-for="i in 5" :key="i">
                        <td v-for="j in 6" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                    </tr>
                    <tr v-else v-for="review in filteredReviews" 
                        :key="review.reviewID" 
                        :class="{ 'table-active': selectedId === review.reviewID }"
                        @click="$emit('toggle-select', review.reviewID)">
                        <td>{{ review.reviewID }}</td>
                        <td>{{ review.bookID }}</td>
                        <td>{{ review.userID }}</td>
                        <td>
                            <div class="text-warning">
                                <i v-for="n in 5" :key="n" class="fa-star" :class="n <= review.rating ? 'fas' : 'far'"></i>
                            </div>
                        </td>
                        <td>{{ review.comment }}</td>
                        <td>{{ formatDateTime(review.created_at) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { formatDateTime } from '@/utils/formatters';

defineProps({
    reviews: Array,
    loading: Boolean,
    searchQuery: String,
    selectedId: [Number, String],
    filteredReviews: Array
});

defineEmits(['update:searchQuery', 'toggle-select', 'delete']);
</script>

<style scoped>
.section-header-sticky { position: sticky; top: var(--admin-topbar-height); background: var(--admin-bg); z-index: 10; padding: 1rem 0; margin-bottom: 2rem; }
</style>
