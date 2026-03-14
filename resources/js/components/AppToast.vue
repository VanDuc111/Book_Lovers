<template>
    <div class="toast-wrapper">
        <TransitionGroup name="toast-list">
            <div 
                v-for="toast in toasts" 
                :key="toast.id" 
                class="custom-toast" 
                :class="toast.type"
            >
                <div class="toast-content">
                    <i :class="getIcon(toast.type)" class="toast-icon"></i>
                    <span class="toast-message">{{ toast.message }}</span>
                </div>
                <button class="toast-close" @click="remove(toast.id)">&times;</button>
                <div class="toast-progress" :style="{ animationDuration: toast.duration + 'ms' }"></div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const toasts = ref([]);
let count = 0;

const add = (message, type = 'info', duration = 3000) => {
    const id = count++;
    toasts.value.push({ id, message, type, duration });
    setTimeout(() => remove(id), duration);
};

const remove = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
};

const getIcon = (type) => {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'danger': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        default: return 'fas fa-info-circle';
    }
};

// Expose to global window so legacy or other components can use it
onMounted(() => {
    window.showToast = (message, type, duration) => {
        add(message, type, duration);
    };
});
</script>

<style scoped>
.toast-wrapper {
    position: fixed;
    top: var(--toast-top);
    right: var(--toast-right);
    z-index: var(--toast-z-index);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    pointer-events: none;
}

.custom-toast {
    pointer-events: auto;
    min-width: 300px;
    max-width: 450px;
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 1.2rem;
}

.toast-icon {
    font-size: 2rem;
}

.toast-message {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--black);
}

.toast-close {
    background: none;
    border: none;
    font-size: 2rem;
    color: #ccc;
    cursor: pointer;
    transition: color 0.2s;
}

.toast-close:hover { color: #333; }

/* Types */
.success .toast-icon { color: #2ecc71; }
.danger .toast-icon { color: #e74c3c; }
.warning .toast-icon { color: #f1c40f; }
.info .toast-icon { color: #3498db; }

.toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: rgba(0,0,0,0.1);
    width: 100%;
    transform-origin: left;
    animation: progress linear forwards;
}

.success .toast-progress { background: #2ecc71; }
.danger .toast-progress { background: #e74c3c; }

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes progress {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
}

/* Vue Transitions */
.toast-list-enter-active, .toast-list-leave-active {
    transition: all 0.3s ease;
}
.toast-list-enter-from {
    transform: translateX(100%);
    opacity: 0;
}
.toast-list-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
