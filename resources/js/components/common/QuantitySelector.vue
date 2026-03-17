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
    gap: 0.8rem;
    width: fit-content;
    background: transparent;
}

.qty-btn {
    background: var(--bg-gray);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0;
    width: 3.6rem;
    height: 3.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 500;
    color: var(--black);
    cursor: pointer;
    transition: var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
    background: var(--border-color-light);
    border-color: var(--muted-color);
}

.qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.qty-input {
    width: 4.5rem;
    height: 3.6rem;
    text-align: center;
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--white);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--black);
    outline: none;
    transition: var(--transition-fast);
    -moz-appearance: textfield;
}

.qty-input:focus {
    border-color: var(--orange);
    box-shadow: var(--focus-shadow);
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
