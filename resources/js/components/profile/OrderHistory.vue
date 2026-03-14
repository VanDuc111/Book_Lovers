<template>
    <div class="content-pane glass active">
        <div class="content-header">
            <h2>Lịch sử đơn hàng</h2>
            <p>Theo dõi trạng thái và quản lý các đơn hàng bạn đã đặt</p>
        </div>
        
        <!-- Skeleton Loading State -->
        <div v-if="loading" class="orders-container">
            <div v-for="i in 3" :key="i" class="order-card">
                <div class="order-header">
                    <div class="skeleton-loader" style="width: 150px; height: 24px;"></div>
                    <div class="skeleton-loader" style="width: 100px; height: 24px; border-radius: 20px;"></div>
                </div>
                <div class="order-body">
                    <div v-for="j in 3" :key="j" class="skeleton-loader" style="width: 200px; height: 18px; margin-bottom: 0.8rem;"></div>
                    <div class="skeleton-loader" style="width: 100%; height: 18px;"></div>
                </div>
            </div>
        </div>
        
        <div v-else-if="orders.length === 0" class="text-center py-5">
            <i class="fas fa-shopping-bag fa-4x mb-3 text-muted" style="opacity: 0.3;"></i>
            <p class="text-muted">Bạn chưa có đơn hàng nào.</p>
            <base-button href="/book-list" variant="primary" class="mt-3" @click="goToBooks">Mua sắm ngay</base-button>
        </div>

        <div v-else class="orders-container">
            <div v-for="order in orders" :key="order.orderID" class="order-card">
                <div class="order-header">
                    <div class="order-id">
                        <i class="fas fa-receipt"></i>
                        <span>Đơn hàng #{{ order.orderID }}</span>
                    </div>
                    <span class="order-status" :class="getStatusClass(order.order_status)">
                        {{ order.order_status }}
                    </span>
                </div>
                <div class="order-body">
                    <div class="order-info-row">
                        <i class="far fa-calendar-alt"></i>
                        <span>{{ formatDateTime(order.order_date) }}</span>
                    </div>
                    <div class="order-info-row">
                        <i class="fas fa-money-bill-wave"></i>
                        <span class="price">{{ formatCurrency(order.total_amount) }}</span>
                    </div>
                    <div class="order-info-row">
                        <i class="fas fa-credit-card"></i>
                        <span>{{ order.payment_method || 'COD' }}</span>
                    </div>
                    <div v-if="order.shipping_address" class="order-info-row">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>{{ order.shipping_address }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency, formatDateTime } from '@/utils/formatters';

defineProps({
    orders: Array,
    loading: Boolean
});

const getStatusClass = (status) => {
    const map = {
        'Pending': 'badge-warning',
        'Processing': 'badge-info',
        'Shipped': 'badge-primary',
        'Delivered': 'badge-success',
        'Cancelled': 'badge-danger'
    };
    return map[status] || 'badge-secondary';
};

const goToBooks = () => {
    window.location.href = '/book-list';
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

.orders-container { display: grid; gap: 1.5rem; margin-top: 2rem; }

.order-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 2rem;
    border: 1px solid var(--border-color);
    transition: var(--transition);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.order-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-premium); border-color: var(--orange); }

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--border-color-light);
}

.order-id { display: flex; align-items: center; gap: 1rem; font-size: 1.6rem; font-weight: 700; color: var(--black); }
.order-id i { color: var(--orange); font-size: 1.8rem; }

.order-status {
    padding: 0.6rem 1.2rem;
    border-radius: 20px;
    font-size: var(--fs-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.badge-warning { background: #fff3cd; color: #856404; }
.badge-info { background: #d1ecf1; color: #0c5460; }
.badge-primary { background: #cce5ff; color: #004085; }
.badge-success { background: #d4edda; color: var(--success, #28a745); }
.badge-danger { background: #f8d7da; color: var(--error, #dc3545); }
.badge-secondary { background: #e2e3e5; color: #383d41; }

.order-body { display: grid; gap: 1rem; }

.order-info-row { display: flex; align-items: flex-start; gap: 1rem; font-size: 1.4rem; color: #555; }
.order-info-row i { width: 2rem; text-align: center; color: var(--orange); margin-top: 0.2rem; flex-shrink: 0; }
.order-info-row span { flex: 1; line-height: 1.6; }

.price { color: var(--orange); font-weight: 700; }

@media (max-width: 991px) {
    .content-pane { padding: 2rem; }
}

@media (max-width: 768px) {
    .order-card { padding: 1.5rem; }
    .order-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
    .order-status { align-self: flex-start; }
}
</style>
