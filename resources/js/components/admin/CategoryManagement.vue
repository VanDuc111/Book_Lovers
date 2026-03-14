<template>
    <div>
        <div class="section-header-sticky">
            <h2 class="mb-4">Quản lý Thể loại</h2>
            <div class="mb-4 d-flex gap-3 flex-wrap">
                <base-button variant="primary" @click="emit('show-form')">Thêm Thể loại</base-button>
                <base-button variant="info" :disabled="!selectedId" @click="emit('edit')">Sửa</base-button>
                <base-button variant="danger" :disabled="!selectedId" @click="emit('delete', selectedId)">Xóa</base-button>
            </div>
            <div v-if="!formVisible" class="search-wrap mb-4">
                <input 
                    :value="searchQuery" 
                    @input="emit('update:searchQuery', $event.target.value)" 
                    class="form-control" 
                    placeholder="Tìm theo ID hoặc tên thể loại..."
                >
            </div>
        </div>

        <div v-if="!formVisible">
            <div class="table-responsive">
                <table class="table hover-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Thể loại</th>
                            <th class="text-center">Số lượng sách</th>
                            <th>Mô tả</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading" v-for="i in 5" :key="i">
                            <td v-for="j in 4" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                        </tr>
                        <tr v-else v-for="cat in filteredCategories" 
                            :key="cat.categoryID" 
                            :class="{ 'table-active': selectedId === cat.categoryID }"
                            @click="emit('toggle-select', cat.categoryID)">
                            <td>{{ cat.categoryID }}</td>
                            <td>{{ cat.categoryName }}</td>
                            <td class="text-center">
                                <span class="badge rounded-pill bg-light text-dark border">
                                    {{ getBookCount(cat.categoryName) }}
                                </span>
                            </td>
                            <td>{{ cat.description }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Category Form -->
        <div v-else class="card p-4 shadow-sm border-0">
            <h3>{{ formData.categoryID ? 'Sửa Thể loại' : 'Thêm Thể loại mới' }}</h3>
            <form @submit.prevent="emit('save', formData)" class="mt-4">
                <div class="form-group mb-3">
                    <label class="form-label fw-bold">Tên Thể loại</label>
                    <input v-model="formData.categoryName" class="form-control" required>
                </div>
                <div class="form-group mb-3">
                    <label class="form-label fw-bold">Mô tả</label>
                    <textarea v-model="formData.description" class="form-control" rows="3"></textarea>
                </div>
                <div class="d-flex gap-2 mt-4">
                    <base-button variant="primary" type="submit" :loading="submitting">Lưu</base-button>
                    <base-button variant="info" @click="emit('cancel')">Hủy</base-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    categories: Array,
    books: Array,
    loading: Boolean,
    searchQuery: String,
    selectedId: [Number, String],
    formVisible: Boolean,
    formData: Object,
    submitting: Boolean,
    filteredCategories: Array
});

const emit = defineEmits(['update:searchQuery', 'toggle-select', 'show-form', 'edit', 'delete', 'save', 'cancel']);

const getBookCount = (categoryName) => {
    return props.books.filter(b => b.categoryName === categoryName).length;
};
</script>

<style scoped>
.section-header-sticky { position: sticky; top: var(--admin-topbar-height); background: var(--admin-bg); z-index: 10; padding: 1rem 0; margin-bottom: 2rem; }
</style>
