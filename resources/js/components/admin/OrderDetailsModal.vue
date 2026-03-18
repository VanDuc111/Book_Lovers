<template>
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Chi tiết đơn hàng {{ order.order_code || '#' + order.id }}</h3>
                <button @click="$emit('close')" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="detail-grid">
                    <div class="detail-item"><strong>Ngày đặt:</strong> {{ formatDateTime(order.created_at || order.order_date) }}</div>
                    <div class="detail-item"><strong>Trạng thái:</strong> <span class="status-text">{{ order.status || order.order_status }}</span></div>
                    <div class="detail-item"><strong>Tổng tiền:</strong> <span class="price-text">{{ formatCurrency(order.total_amount) }}</span></div>
                    <div class="divider grid-span-all"></div>
                    <div class="detail-item"><strong>Người nhận:</strong> {{ order.receiver_name || 'N/A' }}</div>
                    <div class="detail-item"><strong>Số điện thoại:</strong> {{ order.receiver_phone || 'N/A' }}</div>
                    <div class="detail-item grid-span-all"><strong>Địa chỉ giao hàng:</strong> {{ order.shipping_address || 'N/A' }}</div>
                    <div class="detail-item"><strong>Phương thức thanh toán:</strong> {{ order.payment_method || 'COD' }}</div>
                    <div v-if="order.note" class="detail-item grid-span-all"><strong>Ghi chú:</strong> {{ order.note }}</div>
                    <div class="divider grid-span-all"></div>
                    <div class="detail-item"><strong>Khách hàng ID:</strong> {{ order.user_id }}</div>
                </div>
            </div>
            <div class="modal-footer">
                <base-button variant="secondary" @click="$emit('close')">Đóng</base-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency, formatDateTime } from '@/utils/formatters';

defineProps({
    visible: Boolean,
    order: Object
});

defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000;
}

.modal-content {
    background: var(--white);
    width: 90%;
    max-width: 650px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.modal-header {
    padding: 2rem;
    background: var(--admin-bg);
    border-bottom: 1px solid var(--border-color);
    display: flex; justify-content: space-between; align-items: center;
}

.modal-header h3 { font-size: 1.8rem; font-weight: 700; margin: 0; }
.close-btn { background: none; border: none; font-size: 2.5rem; cursor: pointer; color: #999; }

.modal-body { padding: 2.5rem; }

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.detail-item { font-size: 1.4rem; color: #444; }
.grid-span-all { grid-column: span 2; }

.divider { height: 1px; background: #eee; margin: 1rem 0; }
.status-text { color: var(--orange); font-weight: 700; }
.price-text { color: var(--success, #2ecc71); font-weight: 700; }

.modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #eee;
    text-align: right;
}
</style>
