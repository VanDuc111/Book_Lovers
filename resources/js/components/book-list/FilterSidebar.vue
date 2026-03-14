<template>
    <div class="filter-sidebar p-4 border rounded mb-4 bg-white shadow-sm">
        <h4 class="filter-title mb-4" style="font-size: 1.6rem; font-weight: 700; color: var(--black);"><i class="fas fa-filter"></i> Bộ lọc</h4>
        
        <!-- Lọc theo Danh mục -->
        <div class="filter-group mb-4 pb-3 border-bottom">
            <h5 class="filter-subtitle mb-3" style="font-size: 1.4rem; font-weight: 600; color: var(--black);">Danh mục</h5>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="categoryFilter" id="cat-all" value="all" v-model="localCategory" @change="emitChange">
                <label class="form-check-label" for="cat-all" style="font-size: 1.3rem; color: var(--light-color); cursor: pointer;">Tất cả ({{ totalCount }})</label>
            </div>
            <div class="form-check mb-2" v-for="cat in categories" :key="cat.name">
                <input class="form-check-input" type="radio" name="categoryFilter" :id="'cat-'+cat.name" :value="cat.name" v-model="localCategory" @change="emitChange">
                <label class="form-check-label" :for="'cat-'+cat.name" style="font-size: 1.3rem; color: var(--light-color); cursor: pointer;">{{ cat.name }} ({{ cat.count }})</label>
            </div>
        </div>

        <!-- Lọc theo Giá -->
        <div class="filter-group mb-4 pb-3 border-bottom">
            <h5 class="filter-subtitle mb-3" style="font-size: 1.4rem; font-weight: 600; color: var(--black);">Giá (VNĐ)</h5>
            <div class="d-flex align-items-center mb-2">
                <input type="number" class="form-control form-control-sm text-center" placeholder="TỪ" v-model="localMinPrice" style="font-size: 1.2rem; padding: 0.5rem; border-radius: 4px;">
                <span class="mx-2" style="font-size: 1.2rem; color: var(--light-color);">-</span>
                <input type="number" class="form-control form-control-sm text-center" placeholder="ĐẾN" v-model="localMaxPrice" style="font-size: 1.2rem; padding: 0.5rem; border-radius: 4px;">
            </div>
            <base-button 
                variant="outline" 
                size="sm" 
                class="w-100 mt-2" 
                @click="emitChange"
            >
                Áp dụng giá
            </base-button>
        </div>

        <!-- Lọc theo NXB -->
        <div class="filter-group mb-4 pb-2">
            <h5 class="filter-subtitle mb-3" style="font-size: 1.4rem; font-weight: 600; color: var(--black);">Nhà phát hành</h5>
            <div class="form-check mb-2" v-for="pub in publishers" :key="pub.name">
                <input class="form-check-input" type="checkbox" :id="'pub-'+pub.name" :value="pub.name" v-model="localPublishers" @change="emitChange">
                <label class="form-check-label" :for="'pub-'+pub.name" style="font-size: 1.3rem; color: var(--light-color); cursor: pointer;">{{ pub.name }} ({{ pub.count }})</label>
            </div>
        </div>

        <base-button 
            variant="primary" 
            size="md" 
            class="w-100 mt-2" 
            @click="resetFilters"
        >
            Xóa bộ lọc
        </base-button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    categories: {
        type: Array,
        default: () => [],
    },
    publishers: {
        type: Array,
        default: () => [],
    },
    totalCount: {
        type: Number,
        default: 0,
    },
    currentCategory: {
        type: String,
        default: 'all',
    },
    filters: {
        type: Object,
        default: () => ({ minPrice: '', maxPrice: '', publishers: [] }),
    },
});

const emit = defineEmits(['filter-changed', 'reset']);

// Local copies of filter state
const localCategory = ref(props.currentCategory);
const localMinPrice = ref(props.filters.minPrice);
const localMaxPrice = ref(props.filters.maxPrice);
const localPublishers = ref([...props.filters.publishers]);

// Watch for external changes (e.g. URL params)
watch(() => props.currentCategory, (val) => { localCategory.value = val; });
watch(() => props.filters, (val) => {
    localMinPrice.value = val.minPrice;
    localMaxPrice.value = val.maxPrice;
    localPublishers.value = [...val.publishers];
}, { deep: true });

const emitChange = () => {
    emit('filter-changed', {
        category: localCategory.value,
        minPrice: localMinPrice.value,
        maxPrice: localMaxPrice.value,
        publishers: localPublishers.value,
    });
};

const resetFilters = () => {
    localCategory.value = 'all';
    localMinPrice.value = '';
    localMaxPrice.value = '';
    localPublishers.value = [];
    emit('reset');
};
</script>

<style scoped>
.filter-sidebar {
    position: sticky;
    top: 8rem;
}
</style>
