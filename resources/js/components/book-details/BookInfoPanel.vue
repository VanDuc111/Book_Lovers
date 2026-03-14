<template>
    <div>
        <div class="row info-meta mb-4">
            <div class="col-sm-6">
                <p class="mb-2 text-muted" style="font-size: var(--fs-base);">Tác giả: <span class="text-dark fw-bold">{{ book.author || 'Đang cập nhật' }}</span></p>
                <p class="mb-2 text-muted" style="font-size: var(--fs-base);">Nhà xuất bản: <span class="text-dark fw-bold">{{ book.publisher || 'Đang cập nhật' }}</span></p>
            </div>
            <div class="col-sm-6">
                <p class="mb-2 text-muted" style="font-size: var(--fs-base);">Thể loại: <span class="text-dark fw-bold text-orange">{{ book.categoryName }}</span></p>
                <p class="mb-2 text-muted" style="font-size: var(--fs-base);">Trạng thái: 
                    <span v-if="book.stock > 0" class="text-success fw-bold">Còn hàng</span>
                    <span v-else class="text-danger fw-bold">Hết hàng</span>
                </p>
            </div>
        </div>

        <div class="price-section py-4 px-4 rounded mb-5 bg-light-orange">
            <div class="d-flex align-items-center flex-wrap gap-3">
                <span class="current-price text-orange fw-bold display-5">{{ formatCurrency(book.bookPrice) }}</span>
            </div>
        </div>

        <div class="shipping-info mb-5 p-3 border-dashed rounded">
            <p class="mb-2 fw-bold text-uppercase text-muted" style="font-size: var(--fs-sm);">Thông tin vận chuyển</p>
            <div class="d-flex align-items-center gap-2" style="font-size: var(--fs-base);">
                <i class="fas fa-truck text-orange"></i>
                <span>Giao hàng tiêu chuẩn - Dự kiến giao hàng sau 2-3 ngày</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters';

defineProps({
    book: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
.text-orange { color: var(--orange); }
.bg-light-orange { background: #fffaf9; }
.border-dashed { border: 1px dashed #dee2e6 !important; }
.current-price { color: var(--orange); }
</style>
