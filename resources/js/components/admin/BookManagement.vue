<template>
    <div>
        <div class="section-header-sticky">
            <h2 class="mb-4">Quản lý Sách</h2>
            <div class="mb-4 d-flex gap-3 flex-wrap">
                <base-button variant="primary" @click="showAddForm">Thêm Sách</base-button>
                <base-button variant="info" :disabled="!selectedId" @click="editBook">Sửa</base-button>
                <base-button variant="danger" :disabled="!selectedId" @click="$emit('delete', selectedId)">Xóa</base-button>
            </div>
            <div v-if="!formVisible" class="search-wrap mb-4">
                <input 
                    :value="searchQuery" 
                    @input="$emit('update:searchQuery', $event.target.value)" 
                    class="form-control" 
                    placeholder="Tìm theo ID hoặc tiêu đề..."
                >
            </div>
        </div>

        <div v-if="!formVisible">
            <div class="table-responsive">
                <table class="table hover-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Hình ảnh</th>
                            <th>Tiêu đề</th>
                            <th>Tác giả</th>
                            <th>Nhà xuất bản</th>
                            <th>Thể loại</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading" v-for="i in 5" :key="i">
                            <td v-for="j in 8" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                        </tr>
                        <tr v-else v-for="book in filteredBooks" 
                            :key="book.id" 
                            :class="{ 'table-active': selectedId === book.id }"
                            @click="$emit('toggle-select', book.id)">
                            <td>{{ book.id }}</td>
                            <td>
                                <img :src="book.image || '/assets/images/default-book.png'" alt="book" class="book-thumbnail">
                            </td>
                            <td>{{ book.title }}</td>
                            <td>{{ book.author }}</td>
                            <td>{{ book.publisher }}</td>
                            <td>{{ book.category_name }}</td>
                            <td>{{ formatCurrency(book.price) }}</td>
                            <td>{{ book.stock }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Book Form -->
        <div v-else class="card p-4 shadow-sm border-0">
            <h3>{{ formData.id ? 'Sửa Sách' : 'Thêm Sách mới' }}</h3>
            <form @submit.prevent="$emit('save', formData)" class="row g-3 mt-2">
                <div class="col-md-6 form-group">
                    <label class="form-label fw-bold">Tiêu đề</label>
                    <input v-model="formData.title" class="form-control" required>
                </div>
                <div class="col-md-6 form-group">
                    <label class="form-label fw-bold">Tác giả</label>
                    <input v-model="formData.author" class="form-control">
                </div>
                <div class="col-md-6 form-group">
                    <label class="form-label fw-bold">Nhà xuất bản</label>
                    <input v-model="formData.publisher" class="form-control">
                </div>
                <div class="col-md-6 form-group">
                    <label class="form-label fw-bold">Thể loại</label>
                    <select v-model="formData.category_id" class="form-control" required>
                        <option value="">-- Chọn thể loại --</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                            {{ cat.name }}
                        </option>
                    </select>
                </div>
                <div class="col-md-6 form-group">
                    <label class="form-label fw-bold">Giá</label>
                    <input v-model.number="formData.price" type="number" step="0.01" class="form-control" required>
                </div>
                <div class="col-md-6 form-group">
                    <label class="form-label fw-bold">Số lượng trong kho</label>
                    <input v-model.number="formData.stock" type="number" class="form-control" required>
                </div>
                <div class="col-12 form-group">
                    <label class="form-label fw-bold">Mô tả</label>
                    <textarea v-model="formData.description" class="form-control" rows="3"></textarea>
                </div>
                <div class="col-12 form-group">
                    <label class="form-label fw-bold">Hình ảnh</label>
                    <input type="file" @change="$emit('image-change', $event)" class="form-control file-input" accept="image/*">
                </div>
                <div class="col-12 mt-4 d-flex gap-2">
                    <base-button variant="primary" type="submit" :loading="submitting">Lưu</base-button>
                    <base-button variant="info" @click="$emit('cancel')">Hủy</base-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters';

const props = defineProps({
    books: Array,
    categories: Array,
    loading: Boolean,
    searchQuery: String,
    selectedId: [Number, String],
    formVisible: Boolean,
    formData: Object,
    submitting: Boolean,
    filteredBooks: Array
});

const emit = defineEmits(['update:searchQuery', 'toggle-select', 'show-form', 'edit', 'delete', 'save', 'cancel', 'image-change']);

const showAddForm = () => emit('show-form');
const editBook = () => emit('edit');
</script>

<style scoped>
.section-header-sticky { position: sticky; top: var(--admin-topbar-height); background: var(--admin-bg); z-index: 10; padding: 1rem 0; margin-bottom: 2rem; }
.book-thumbnail { width: 50px; height: 75px; object-fit: cover; border-radius: var(--admin-radius-sm); border: 1px solid #ddd; }
</style>
