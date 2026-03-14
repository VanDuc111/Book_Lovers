<template>
    <div class="row admin-cards mt-4">
        <div v-for="card in cards" :key="card.id" class="col-12 col-sm-6 col-md-3 mb-4">
            <div class="card card-summary shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="summary-label">{{ card.label }}</div>
                            <div class="summary-number">{{ counts[card.key] }}</div>
                        </div>
                        <div class="icon-wrap" :class="card.colorClass">
                            <img :src="card.icon" :style="card.iconStyle" alt="icon">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    counts: Object,
    cards: Array
});
</script>

<style scoped>
.card-summary {
    border: none;
    border-radius: var(--radius-md);
    transition: transform 0.3s ease;
}

.card-summary:hover { transform: translateY(-5px); }

.summary-label { font-size: 1.3rem; color: var(--gray-light); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; }
.summary-number { font-size: 2.8rem; font-weight: 800; color: var(--black); }

.icon-wrap { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.icon-wrap img { width: 24px; height: 24px; }

.text-primary { background: rgba(52, 152, 219, 0.1); }
.text-success { background: rgba(46, 204, 113, 0.1); }
.text-warning { background: rgba(241, 196, 15, 0.1); }
.text-danger { background: rgba(231, 76, 60, 0.1); }
</style>
