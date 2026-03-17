<template>
    <div class="cart-summary-card shadow-sm">
        <h3 class="summary-title text-uppercase">Tóm tắt đơn hàng</h3>
        <div class="summary-row">
            <span>Sản phẩm đã chọn:</span>
            <span class="fw-bold">{{ selectedCount }}</span>
        </div>
        <div class="summary-row">
            <span>Giao hàng:</span>
            <span class="text-success fw-bold">Miễn phí</span>
        </div>
        <div class="summary-row summary-total border-top pt-3 mt-3">
            <span>Tổng thanh toán:</span>
            <span class="text-orange total-price">{{ formatCurrency(totalPrice) }}</span>
        </div>
        
        <base-button 
            variant="primary" 
            size="lg"
            class="w-100 mt-4 checkout-btn"
            @click="$emit('checkout')"
            :disabled="selectedCount === 0"
        >
            ĐẶT HÀNG NGAY ({{ selectedCount }})
        </base-button>
        
        <div class="mt-4 p-3 rounded summary-extra">
            <p class="mb-2"><i class="fas fa-shield-alt me-2 text-primary"></i> Đảm bảo thanh toán an toàn</p>
            <p class="mb-0"><i class="fas fa-undo me-2 text-warning"></i> Đổi trả dễ dàng trong 7 ngày</p>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters';

defineProps({
    selectedCount: Number,
    totalPrice: Number
});

defineEmits(['checkout']);
</script>

<style scoped>
.cart-summary-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-premium);
    padding: 2.5rem;
    border: 1px solid var(--border-color-light);
}

.summary-title {
    font-size: 1.6rem;
    font-weight: 800;
    margin-bottom: 2rem;
    color: var(--black);
    border-bottom: 1.5px solid var(--border-color-light);
    padding-bottom: 1rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
}

.summary-total {
    border-top: 1px dashed var(--border-color-fade);
    padding-top: 1.5rem;
    margin-top: 1.5rem;
    font-weight: 800;
}

.total-price {
    font-size: 1.8rem;
}

.summary-extra {
    background: var(--bg-gray);
    font-size: 1.2rem;
    color: var(--light-color);
    border: 1px solid var(--border-color-light);
}

@media (max-width: 991px) {
    .cart-summary-card {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        top: auto !important;
        border-radius: 20px 20px 0 0 !important;
        padding: 1.5rem 2rem !important;
        margin: 0 !important;
        z-index: 1000 !important;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        box-shadow: 0 -5px 20px rgba(0,0,0,0.1);
    }

    .summary-title, .summary-row:not(.summary-total), .summary-extra {
        display: none !important;
    }

    .summary-total {
        border-top: none;
        padding-top: 0;
        margin-top: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .checkout-btn {
        margin-top: 0.5rem !important;
    }
}
</style>
