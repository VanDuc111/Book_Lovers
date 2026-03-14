<template>
    <div class="quantity-selector">
        <button 
            class="qty-btn minus" 
            @click="decrease"
            :disabled="modelValue <= min"
            type="button"
        >-</button>
        <input 
            type="number" 
            class="qty-input" 
            :value="modelValue" 
            :readonly="readonly"
            @change="onInput"
        >
        <button 
            class="qty-btn plus" 
            @click="increase"
            :disabled="modelValue >= max"
            type="button"
        >+</button>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Number,
        default: 1,
    },
    min: {
        type: Number,
        default: 1,
    },
    max: {
        type: Number,
        default: 999,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);

const decrease = () => {
    if (props.modelValue > props.min) {
        emit('update:modelValue', props.modelValue - 1);
    }
};

const increase = () => {
    if (props.modelValue < props.max) {
        emit('update:modelValue', props.modelValue + 1);
    }
};

const onInput = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < props.min) val = props.min;
    if (val > props.max) val = props.max;
    emit('update:modelValue', val);
};
</script>

<style scoped>
.quantity-selector {
    display: flex;
    align-items: center;
    border: 1.5px solid #e0e0e0;
    border-radius: 6px;
    width: fit-content;
    background: var(--white);
    overflow: hidden;
}

.qty-btn {
    background: #f8f8f8;
    border: none;
    padding: 0.4rem 1.2rem;
    font-size: 1.8rem;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    min-width: 3.6rem;
    line-height: 1;
    transition: background 0.15s;
}

.qty-btn:hover:not(:disabled) {
    background: #ececec;
}

.qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.qty-input {
    width: 5rem;
    text-align: center;
    border: none;
    border-left: 1.5px solid #e0e0e0;
    border-right: 1.5px solid #e0e0e0;
    background: var(--white);
    font-size: 1.6rem;
    font-weight: 600;
    padding: 0.3rem 0;
    outline: none;
    -moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
