<template>
    <div class="checkout-card">
        <div class="card-header">
            <i class="fas fa-credit-card"></i>
            <h3>Phương thức thanh toán</h3>
        </div>
        <div class="card-body">
            <div class="payment-methods">
                <label v-for="method in methods" :key="method.id" class="payment-option">
                    <input type="radio" :checked="modelValue === method.id" @change="$emit('update:modelValue', method.id)" :value="method.id">
                    <div class="payment-content">
                        <div class="payment-icon">
                            <i :class="method.icon"></i>
                        </div>
                        <div class="payment-info">
                            <h4>{{ method.title }}</h4>
                            <p>{{ method.desc }}</p>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: String,
    methods: Array
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.checkout-card { background: var(--white); border-radius: var(--radius-lg); box-shadow: var(--shadow-premium); margin-bottom: 2rem; overflow: hidden; }
.checkout-card .card-header { display: flex; align-items: center; gap: 1rem; padding: 2rem; border-bottom: var(--border); background: linear-gradient(135deg, var(--white) 0%, var(--bg-light) 100%); }
.checkout-card .card-header i { font-size: 2rem; color: var(--orange); }
.checkout-card .card-header h3 { font-size: 1.6rem; font-weight: 600; color: var(--black); margin: 0; }
.checkout-card .card-body { padding: 2.5rem; }

.payment-methods { display: flex; flex-direction: column; gap: 1.2rem; }
.payment-option { position: relative; display: block; cursor: pointer; }
.payment-option input[type="radio"] { position: absolute; opacity: 0; }
.payment-content { display: flex; align-items: center; gap: 1.5rem; padding: 1.8rem; border: 2px solid var(--border-color); border-radius: var(--radius-lg); background: var(--white); transition: var(--transition); }
.payment-option input[type="radio"]:checked + .payment-content { border-color: var(--orange); background: rgba(255, 99, 71, 0.05); box-shadow: 0 4px 12px rgba(255, 99, 71, 0.15); }
.payment-option:hover .payment-content { border-color: var(--orange); transform: translateY(-2px); }
.payment-icon { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #fff5f3 0%, #ffe8e5 100%); border-radius: 10px; flex-shrink: 0; }
.payment-icon i { font-size: 2.2rem; color: var(--orange); }
.payment-info h4 { font-size: 1.5rem; font-weight: 600; color: var(--black); margin-bottom: 0.3rem; }
.payment-info p { font-size: 1.3rem; color: #6c757d; margin: 0; }

@media (max-width: 768px) {
    .payment-content { padding: 1.5rem; }
    .payment-icon { width: 45px; height: 45px; }
}
</style>
