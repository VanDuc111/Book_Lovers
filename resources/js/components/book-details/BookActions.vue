<template>
    <div class="action-section border-top pt-5">
        <div class="d-flex align-items-center gap-4 mb-5 flex-wrap">
            <div class="d-flex align-items-center gap-3">
                <label class="fw-bold">Số lượng:</label>
                <quantity-selector 
                    :modelValue="quantity"
                    @update:modelValue="$emit('update:quantity', $event)"
                    :min="1"
                    :max="stock"
                />
            </div>
            <span class="text-muted fw-medium" style="font-size: var(--fs-base);">{{ stock }} sản phẩm có sẵn</span>
        </div>

        <div class="row g-3">
            <div class="col-md-6">
                <base-button 
                    variant="primary" 
                    size="lg" 
                    class="w-100"
                    :disabled="stock <= 0 || loading"
                    :loading="loading"
                    @click="$emit('add-to-cart')"
                >
                    <i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ hàng
                </base-button>
            </div>
            <div class="col-md-6">
                <base-button 
                    variant="primary" 
                    size="lg" 
                    class="w-100"
                    :disabled="stock <= 0"
                    @click="$emit('buy-now')"
                >
                    Mua ngay
                </base-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import QuantitySelector from '@/components/common/QuantitySelector.vue';

defineProps({
    quantity: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['update:quantity', 'add-to-cart', 'buy-now']);
</script>
