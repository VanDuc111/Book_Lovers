<template>
    <header class="admin-topbar">
        <div class="topbar-left">
            <button id="sidebar-toggle" class="sidebar-toggle" @click="$emit('toggle-sidebar')">
                <i class="fas fa-bars"></i>
            </button>
            <div class="breadcrumb-nav">
                <span class="breadcrumb-item">Admin</span>
                <span class="breadcrumb-sep">/</span>
                <h1 id="section-title">{{ title }}</h1>
            </div>
        </div>
        <div class="admin-profile" @click="$emit('logout')" title="Click to logout">
            <div class="profile-info">
                <span class="admin-name">Administrator</span>
            </div>
            <div class="avatar-box">
                <img src="https://ui-avatars.com/api/?name=Admin&background=ff6347&color=fff&bold=true" alt="Admin" class="admin-avatar">
                <div class="online-indicator"></div>
            </div>
        </div>
    </header>
</template>

<script setup>
defineProps({
    title: String
});

defineEmits(['toggle-sidebar', 'logout']);
</script>

<style scoped>
.admin-topbar {
    height: var(--admin-topbar-height);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--admin-spacing-lg);
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid var(--border-color);
}

.topbar-left { display: flex; align-items: center; gap: var(--admin-spacing-md); }

.sidebar-toggle {
    background: var(--admin-bg);
    border: none;
    width: 40px; height: 40px;
    border-radius: 10px;
    display: none;
    align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 1.8rem;
    color: var(--light-color);
    transition: 0.3s;
}

@media (max-width: 991px) {
    .sidebar-toggle { display: flex; } /* Show on mobile */
}

.sidebar-toggle:hover { background: var(--orange); color: var(--white); }

.breadcrumb-nav { display: flex; align-items: center; gap: 1rem; }
.breadcrumb-item { font-size: 1.4rem; color: var(--gray-light); font-weight: 500; }
.breadcrumb-sep { font-size: 1.2rem; color: #ddd; }
#section-title { font-size: 1.8rem; font-weight: 700; color: var(--black); margin: 0; }

.admin-profile { display: flex; align-items: center; gap: 1.5rem; cursor: pointer; padding: 0.5rem 1rem; border-radius: 50px; transition: 0.3s; }
.admin-profile:hover { background: rgba(0,0,0,0.03); }

.profile-info { text-align: right; }
.admin-name { display: block; font-size: 1.4rem; font-weight: 700; color: var(--black); }

.avatar-box { position: relative; width: 42px; height: 42px; }
.admin-avatar { width: 100%; height: 100%; border-radius: 50%; border: 2px solid var(--white); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.online-indicator { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; background: #2ecc71; border: 2px solid var(--white); border-radius: 50%; }

@media (max-width: 576px) {
    .profile-info { display: none; }
}
</style>
