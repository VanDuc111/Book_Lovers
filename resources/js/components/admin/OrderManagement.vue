<template>
    <div>
        <div class="section-header-sticky">
            <h2 class="mb-4">Quản lý Đơn hàng</h2>
            <div class="mb-4 d-flex gap-3 flex-wrap align-items-center">
                <base-button variant="info" :disabled="!selectedId" @click="$emit('view-details')">Chi tiết</base-button>
                <select 
                    :value="statusFilter" 
                    @change="$emit('update:statusFilter', $event.target.value)" 
                    class="form-control" 
                    style="width: auto;"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option v-for="st in statuses" :key="st" :value="st">{{ st }}</option>
                </select>
                <div class="date-filter-wrapper shadow-sm" @click="openPicker">
                    <span class="date-placeholder" v-if="!dateFilter">Ngày</span>
                    <span class="date-text" v-else>{{ formatDateForDisplay(dateFilter) }}</span>
                    <input 
                        type="date" 
                        ref="dateInput" 
                        :value="dateFilter" 
                        @input="$emit('update:dateFilter', $event.target.value)" 
                        class="form-control date-input-field"
                    >
                </div>
            </div>
            <div class="search-wrap mb-4">
                <input 
                    :value="searchQuery" 
                    @input="$emit('update:searchQuery', $event.target.value)" 
                    class="form-control" 
                    placeholder="Tìm ID, Tên, SĐT..."
                >
            </div>
        </div>

        <div class="table-responsive">
            <table class="table hover-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Ngày</th>
                        <th>Tiền</th>
                        <th>Địa chỉ</th>
                        <th>Người nhận</th>
                        <th>SĐT</th>
                        <th>TT</th>
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading" v-for="i in 5" :key="i">
                        <td v-for="j in 10" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                    </tr>
                    <tr v-else v-for="order in filteredOrders" 
                        :key="order.id" 
                        :class="{ 'table-active': selectedId === order.id }"
                        @click="$emit('toggle-select', order.id)">
                        <td>{{ order.id }}</td>
                        <td>{{ order.user_id }}</td>
                        <td>{{ formatDateTime(order.created_at || order.order_date) }}</td>
                        <td class="text-end">{{ formatCurrency(order.total_amount) }}</td>
                        <td :title="order.shipping_address">{{ truncate(order.shipping_address, 25) }}</td>
                        <td :title="order.receiver_name">{{ truncate(order.receiver_name, 15) }}</td>
                        <td>{{ order.receiver_phone }}</td>
                        <td>{{ order.payment_method || 'COD' }}</td>
                        <td :title="order.note">{{ truncate(order.note, 15) }}</td>
                        <td>
                            <select class="form-control order-status-select" 
                                    :value="order.status || order.order_status"
                                    @change.stop="$emit('update-status', { id: order.id, status: $event.target.value })"
                                    @click.stop>
                                <option v-for="st in statuses" :key="st" :value="st.toLowerCase()">{{ st }}</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

const props = defineProps({
    orders: Array,
    loading: Boolean,
    searchQuery: String,
    statusFilter: String,
    dateFilter: String,
    selectedId: [Number, String],
    filteredOrders: Array
});

const emit = defineEmits(['update:searchQuery', 'update:statusFilter', 'update:dateFilter', 'toggle-select', 'view-details', 'update-status']);

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const dateInput = ref(null);
const openPicker = () => { if (dateInput.value && dateInput.value.showPicker) dateInput.value.showPicker(); };

const truncate = (t, l) => (t && t.length > l) ? t.substring(0, l) + '...' : (t || '');
const formatDateForDisplay = (ds) => {
    if(!ds) return '';
    const [y, m, d] = ds.split('-');
    return `${d}/${m}/${y}`;
};
</script>

<style scoped>
.section-header-sticky { position: sticky; top: var(--admin-topbar-height); background: var(--admin-bg); z-index: 10; padding: 1rem 0; margin-bottom: 2rem; }

.date-filter-wrapper { position: relative; width: auto; min-width: 120px; border: 1px solid #ced4da; border-radius: 4px; padding: 8px 12px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #fff; }
.date-input-field { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.order-status-select { font-size: 1.2rem; padding: 4px 8px; font-weight: 600; border-radius: 6px; }
</style>
