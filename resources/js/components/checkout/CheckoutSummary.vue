<template>
    <div class="summary-sticky">
        <div class="checkout-card">
            <div class="card-header">
                <i class="fas fa-shopping-bag"></i>
                <h3>Đơn hàng của bạn</h3>
            </div>
            <div class="card-body">
                <div class="order-items">
                    <div v-for="item in cartItems" :key="item.cartItemID" class="order-item">
                        <img :src="item.image || 'https://fakeimg.pl/100x150/f0f0f0/909090?text=No+Image'" :alt="item.title" class="item-image">
                        <div class="item-details">
                            <div class="item-title">{{ item.title }}</div>
                            <div class="item-meta">Số lượng: {{ item.quantity }}</div>
                            <div class="item-price">{{ formatCurrency(item.bookPrice * item.quantity) }}</div>
                        </div>
                    </div>
                </div>

                <div class="order-summary">
                    <div class="summary-row">
                        <span>Tạm tính</span>
                        <span>{{ formatCurrency(subtotal) }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Phí vận chuyển</span>
                        <span>{{ formatCurrency(shippingFee) }}</span>
                    </div>
                    <div v-if="discount > 0" class="summary-row discount">
                        <span>Giảm giá</span>
                        <span>- {{ formatCurrency(discount) }}</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row total">
                        <span>Tổng cộng</span>
                        <span>{{ formatCurrency(total) }}</span>
                    </div>
                </div>

                <base-button 
                    variant="primary" 
                    size="lg" 
                    class="w-100" 
                    :loading="loading"
                    @click="$emit('place-order')"
                >
                    <i class="fas fa-lock me-2"></i> Đặt hàng
                </base-button>

                <div class="security-badges">
                    <div class="badge-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>Bảo mật thanh toán</span>
                    </div>
                    <div class="badge-item">
                        <i class="fas fa-truck"></i>
                        <span>Giao hàng toàn quốc</span>
                    </div>
                </div>
            </div>
        </div>

        <a href="/cart" class="back-to-cart">
            <i class="fas fa-arrow-left"></i>
            Quay lại giỏ hàng
        </a>
    </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters';

defineProps({
    cartItems: Array,
    subtotal: Number,
    shippingFee: Number,
    discount: Number,
    total: Number,
    loading: Boolean
});

defineEmits(['place-order']);
</script>

<style scoped>
.checkout-card { background: var(--white); border-radius: var(--radius-lg); box-shadow: var(--shadow-premium); overflow: hidden; }
.checkout-card .card-header { display: flex; align-items: center; gap: 1rem; padding: 2rem; border-bottom: var(--border); background: linear-gradient(135deg, var(--white) 0%, var(--bg-light) 100%); }
.checkout-card .card-header i { font-size: 2rem; color: var(--orange); }
.checkout-card .card-header h3 { font-size: 1.6rem; font-weight: 600; color: var(--black); margin: 0; }
.checkout-card .card-body { padding: 2.5rem; }

.summary-sticky { position: sticky; top: 2rem; }
.order-items { max-height: 300px; overflow-y: auto; margin-bottom: 2rem; }

.order-item { display: flex; gap: 1.5rem; padding: 1.5rem 0; border-bottom: var(--border); }
.order-item:last-child { border-bottom: none; }
.item-image { width: 70px; height: 95px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
.item-details { flex: 1; }
.item-title { font-size: 1.4rem; font-weight: 600; color: var(--black); margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.item-meta { font-size: 1.2rem; color: #6c757d; margin-bottom: 0.5rem; }
.item-price { font-size: 1.4rem; font-weight: 700; color: var(--orange); }

.order-summary { padding: 2rem 0; }
.summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; font-size: 1.4rem; }
.summary-row span:first-child { color: #6c757d; }
.summary-row span:last-child { font-weight: 600; color: var(--black); }
.summary-row.discount span:last-child { color: var(--success, #28a745); }
.summary-divider { height: 1px; background: var(--border-color-light); margin: 1.5rem 0; }
.summary-row.total { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid var(--border-color-light); }
.summary-row.total span { font-size: 1.6rem; font-weight: 700; }
.summary-row.total span:last-child { color: var(--orange); }

.security-badges { display: flex; gap: 1.5rem; margin-top: 2rem; padding-top: 2rem; border-top: var(--border); }
.badge-item { display: flex; align-items: center; gap: 0.8rem; font-size: 1.2rem; color: #6c757d; }
.badge-item i { font-size: 1.6rem; color: var(--success, #28a745); }

.back-to-cart { display: inline-flex; align-items: center; gap: 0.8rem; margin-top: 1.5rem; padding: 1rem 1.5rem; font-size: 1.4rem; font-weight: 600; color: var(--orange); text-decoration: none; border-radius: 8px; transition: all 0.3s ease; }
.back-to-cart:hover { background: rgba(255, 99, 71, 0.1); transform: translateX(-5px); }

@media (max-width: 992px) {
    .summary-sticky { position: static; }
}
</style>
