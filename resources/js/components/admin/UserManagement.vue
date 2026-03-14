<template>
    <div>
        <div class="section-header-sticky">
            <h2 class="mb-4">Quản lý Người dùng</h2>
            <div class="search-wrap mb-4">
                <input 
                    :value="searchQuery" 
                    @input="$emit('update:searchQuery', $event.target.value)" 
                    class="form-control" 
                    placeholder="Tìm theo ID hoặc tên..."
                >
            </div>
        </div>
        <div class="table-responsive">
            <table class="table hover-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading" v-for="i in 5" :key="i">
                        <td v-for="j in 4" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                    </tr>
                    <tr v-else v-for="user in filteredUsers" :key="user.userID">
                        <td>{{ user.userID }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span :class="roleBadgeClass(user.role)">{{ user.role }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
defineProps({
    users: Array,
    loading: Boolean,
    searchQuery: String,
    filteredUsers: Array
});

defineEmits(['update:searchQuery']);

const roleBadgeClass = (role) => {
    return {
        'badge bg-danger': role === 'Admin',
        'badge bg-primary': role === 'User'
    };
};
</script>

<style scoped>
.section-header-sticky { position: sticky; top: var(--admin-topbar-height); background: var(--admin-bg); z-index: 10; padding: 1rem 0; margin-bottom: 2rem; }
</style>
