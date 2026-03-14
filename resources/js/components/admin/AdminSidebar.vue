<template>
    <nav id="sidebar" :class="{ 'active': active }">
        <div class="sidebar-header">
            <a href="/" class="logo-brand">
                <img src="/assets/images/logo-full.svg" alt="BookLovers Logo" class="brand-logo">
            </a>
        </div>

        <ul class="nav-list">
            <li v-for="item in navItems" :key="item.section" class="nav-item">
                <a 
                    class="nav-link" 
                    :class="{ 'active': currentSection === item.section }"
                    href="#" 
                    @click.prevent="$emit('set-section', item)"
                >
                    <img :src="`/assets/icons/${item.icon}.svg`" class="nav-icon" :alt="item.label">
                    <span>{{ item.label }}</span>
                </a>
            </li>
        </ul>

        <div class="sidebar-footer">
            <button class="logout-btn" @click="$emit('logout')">
                <i class="fas fa-sign-out-alt"></i>
                <span>Đăng xuất</span>
            </button>
        </div>
    </nav>
</template>

<script setup>
defineProps({
    active: Boolean,
    currentSection: String,
    navItems: Array
});

defineEmits(['set-section', 'logout']);
</script>

<style scoped>
#sidebar {
    width: var(--admin-sidebar-width);
    height: 100vh;
    position: fixed;
    left: 0; top: 0;
    background: var(--white);
    box-shadow: 2px 0 20px rgba(0,0,0,0.05);
    z-index: 1001;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
}

#sidebar.active { left: 0; }

.sidebar-header {
    padding: var(--admin-spacing-lg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.brand-logo { height: 40px; }

.nav-list {
    list-style: none;
    padding: var(--admin-spacing-sm);
    flex-grow: 1;
    overflow-y: auto;
}

.nav-item { margin-bottom: 0.5rem; }

.nav-link {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1.4rem 1.6rem;
    border-radius: var(--admin-radius-md);
    color: var(--light-color);
    text-decoration: none;
    font-weight: 500;
    font-size: 1.5rem;
    transition: all 0.3s ease;
}

.nav-link:hover { background: var(--admin-hover-bg); color: var(--orange); }

.nav-link.active {
    background: var(--orange);
    color: var(--white);
    box-shadow: 0 4px 15px rgba(255, 99, 71, 0.3);
}

.nav-icon {
    width: 22px;
    height: 22px;
    transition: filter 0.3s ease;
}

.nav-link.active .nav-icon { filter: brightness(0) invert(1); }

.sidebar-footer { padding: var(--admin-spacing-sm) var(--admin-spacing-lg); padding-bottom: var(--admin-spacing-lg); border-top: 1px solid var(--border-color); }

.logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1.4rem;
    background: var(--admin-active-bg);
    border: none;
    border-radius: var(--admin-radius-md);
    color: var(--error);
    font-size: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
}

.logout-btn:hover { background: #fee2e2; transform: translateY(-2px); }

@media (max-width: 991px) {
    #sidebar { left: calc(-1 * var(--admin-sidebar-width)); }
}
</style>
