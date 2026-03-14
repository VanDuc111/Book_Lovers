<template>
    <div class="description-section mb-5">
        <h3 class="fw-bold mb-3 fs-4">Mô tả sản phẩm:</h3>
        <div 
            class="description-text text-muted lh-lg" 
            style="font-size: var(--fs-large);"
            v-html="displayDescription"
        ></div>
        <a v-if="shouldShowToggle" 
           href="#" 
           @click.prevent="isExpanded = !isExpanded" 
           class="text-orange fw-bold text-decoration-none d-inline-block mt-2">
           {{ isExpanded ? 'Ẩn bớt' : 'Xem thêm' }}
        </a>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    description: {
        type: String,
        default: '',
    },
    charLimit: {
        type: Number,
        default: 350,
    },
});

const isExpanded = ref(false);

const displayDescription = computed(() => {
    if (!props.description) return "Chưa có mô tả cho cuốn sách này.";
    if (isExpanded.value || props.description.length <= props.charLimit) {
        return props.description;
    }
    return props.description.substring(0, props.charLimit) + "...";
});

const shouldShowToggle = computed(() => {
    return props.description && props.description.length > props.charLimit;
});
</script>

<style scoped>
.text-orange { color: var(--orange); }
</style>
