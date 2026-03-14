<template>
  <component 
    :is="tag"
    :href="href"
    class="base-button" 
    :class="[
      `btn-${variant}`, 
      `btn-${size}`, 
      { 'is-loading': loading, 'is-disabled': disabled }
    ]" 
    :disabled="tag === 'button' ? (disabled || loading) : null"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else class="btn-content">
      <slot></slot>
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary' // primary, secondary, danger, info, success, outline
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  href: {
    type: String,
    default: null
  }
});

const tag = computed(() => props.href ? 'a' : 'button');

defineEmits(['click']);
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: 700;
  transition: var(--transition);
  cursor: pointer;
  border: none;
  gap: 0.8rem;
  font-family: inherit;
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;
  text-decoration: none !important;
}

.base-button:active {
  transform: scale(0.96);
}

/* Variants */
.btn-primary {
  background: var(--grad-primary);
  color: var(--white) !important;
  box-shadow: 0 4px 15px rgba(255, 99, 71, 0.3);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 99, 71, 0.4);
}

.btn-secondary {
  background: var(--bg-light);
  color: var(--black) !important;
  border: 1px solid var(--border-color);
}
.btn-secondary:hover:not(:disabled) {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.btn-danger {
  background: var(--error);
  color: var(--white) !important;
}
.btn-danger:hover:not(:disabled) {
  filter: brightness(0.9);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
}

.btn-info {
  background: var(--blue);
  color: var(--white) !important;
}
.btn-info:hover:not(:disabled) {
  filter: brightness(0.9);
}

.btn-success {
  background: var(--success);
  color: var(--white) !important;
}
.btn-success:hover:not(:disabled) {
  filter: brightness(0.9);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color-fade);
  color: var(--black-light);
}
.btn-outline:hover:not(:disabled) {
  background: var(--bg-gray);
  border-color: var(--orange);
  color: var(--orange);
}

/* Sizes */
.btn-sm {
  padding: 0.6rem 1.2rem;
  font-size: var(--fs-xs);
}

.btn-md {
  padding: 0.8rem 1.6rem;
  font-size: var(--fs-sm);
}

.btn-lg {
  padding: 1.2rem 2.4rem;
  font-size: var(--fs-large);
}

/* States */
.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.spinner {
  width: 1.8rem;
  height: 1.8rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: rotate 0.8s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .btn-md {
    padding: 1.2rem 2.2rem;
    font-size: 1.5rem;
  }
  .btn-sm {
    padding: 0.8rem 1.6rem;
    font-size: 1.4rem;
  }
}
</style>
