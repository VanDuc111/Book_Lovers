<template>
    <tr class="cart-item-row">
        <td>
            <input 
                type="checkbox" 
                class="select-item" 
                :checked="isSelected"
                @change="$emit('toggle-select', item.cartItemID)"
            >
        </td>
        <td>
            <div class="d-flex align-items-center">
                <a :href="'/book-details?id=' + item.bookID" class="me-3 shrink-0">
                    <img 
                        :src="item.image || 'https://fakeimg.pl/100x150/f0f0f0/909090?text=No+Image'" 
                        class="cart-item-image" 
                        :alt="item.title"
                    >
                </a>
                <a :href="'/book-details?id=' + item.bookID" class="cart-item-title">{{ item.title }}</a>
            </div>
        </td>
        <td class="cart-item-price">
            <span class="mobile-label d-lg-none">Giá gốc:</span>
            {{ formatCurrency(item.bookPrice) }}
        </td>
        <td>
            <div class="d-flex justify-content-between align-items-center w-100 d-lg-block">
                <span class="mobile-label d-lg-none">Số lượng:</span>
                <quantity-selector 
                    :modelValue="item.quantity"
                    @update:modelValue="$emit('update-qty', { item, delta: $event - item.quantity })"
                    :min="1"
                    :max="item.stock"
                />
            </div>
        </td>
        <td class="cart-item-subtotal">
            <span class="mobile-label d-lg-none">Thành tiền:</span>
            {{ formatCurrency(item.bookPrice * item.quantity) }}
        </td>
        <td>
            <div class="cart-actions text-center">
                <base-button variant="danger" size="sm" @click="$emit('remove', item.cartItemID)" title="Xóa" class="btn-remove-item">
                    <i class="fas fa-trash"></i>
                    <span class="d-lg-none ms-2">Xóa khỏi giỏ</span>
                </base-button>
            </div>
        </td>
    </tr>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters';
import QuantitySelector from '@/components/common/QuantitySelector.vue';

defineProps({
    item: Object,
    isSelected: Boolean
});

defineEmits(['toggle-select', 'update-qty', 'remove']);
</script>

<style scoped>
.cart-item-image {
    width: 80px;
    height: 110px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-light);
}

.cart-item-title {
    color: var(--black);
    font-weight: 600;
    font-size: 1.5rem;
    text-decoration: none;
    transition: var(--transition-fast);
}

.cart-item-title:hover {
    color: var(--orange);
}

.cart-item-price {
    font-weight: 600;
    color: var(--light-color);
    font-size: 1.6rem;
}

.cart-item-subtotal {
    font-weight: 700;
    color: var(--orange);
    font-size: 1.6rem;
}

.select-item {
    width: 22px;
    height: 22px;
    cursor: pointer;
    accent-color: var(--orange);
}

.mobile-label {
    font-weight: 600;
    color: #888;
}

@media (max-width: 991px) {
    .cart-item-row {
        display: block;
        background: var(--white);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: var(--shadow-light);
        position: relative;
        border: 1px solid var(--border-color-light);
    }

    .cart-item-row td {
        display: block;
        width: 100%;
        padding: 1rem 0;
        border: none;
        border-bottom: 1px dashed #eee;
    }

    .cart-item-row td:first-child {
        position: absolute;
        top: 1.5rem;
        left: 1.5rem;
        border: none;
        width: auto;
        padding: 0;
        z-index: 2;
    }

    .cart-item-row td:nth-child(2) {
        padding: 0;
        margin-bottom: 1.5rem;
    }

    .cart-item-row td:nth-child(2) .d-flex {
        padding-left: 3.5rem;
    }

    .cart-item-row td:last-child {
        border: none;
        padding-bottom: 0;
    }

    .btn-remove-item {
        width: 100%;
        padding: 1rem;
        border-radius: 50px;
        background: #fff5f5;
        border: 1px solid #feb2b2;
        color: #f56565;
    }
}
</style>
