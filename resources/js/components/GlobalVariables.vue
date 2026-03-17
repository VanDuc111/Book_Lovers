<script>
/**
 * Global JavaScript Constants
 */
export const STALE_TIME = 1000 * 60 * 30; // 30 minutes - Single source of truth for caching

export default {
    name: 'GlobalVariables'
}
</script>

<template>
  <!-- GlobalVariables: Render-less component that injects global CSS Custom Properties -->
</template>

<style>
/*
 * =====================================================================
 *   Global Design Tokens — GlobalVariables.vue
 *   Đây là nguồn gốc duy nhất (single source of truth) cho mọi biến CSS
 *   toàn cục của dự án. Chỉnh sửa màu sắc, spacing, shadow ở đây.
 * =====================================================================
 */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");

:root {
  /* ---- Brand Colors ---- */
  --orange: #ff6347;
  --blue: #5e5ef9;
  --dark-color: #ff4500;
  --black: #333;
  --black-light: #444;
  --light-color: #666;
  --muted-color: #888;
  --white: #ffffff;

  /* ---- State Colors ---- */
  --success: #28a745;
  --error: #dc3545;
  --warning: #ffc107;
  --rating-star: #f4b400;

  /* ---- Backgrounds & Borders ---- */
  --bg-light: #f5f7fa;
  --bg-gray: #f8f9fa;
  --bg-glass: rgba(255, 255, 255, 0.9);
  --border-color: #f0f0f0;
  --border-color-light: #f5f5f5;
  --border-color-fade: rgba(0, 0, 0, 0.1);
  --border-field: 1.5px solid #e2e8f0;
  --border: 0.1rem solid var(--border-color-fade);
  --border-hover: 0.2rem solid var(--blue);

  /* ---- Shadows ---- */
  --box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  --shadow-light: 0 4px 6px rgba(0, 0, 0, 0.02);
  --shadow-medium: 0 10px 30px rgba(0, 0, 0, 0.1);
  --shadow-premium: 0 12px 25px rgba(0, 0, 0, 0.08);
  --shadow-img: 0 10px 30px rgba(0, 0, 0, 0.1);
  --focus-shadow: 0 0 0 4px rgba(255, 99, 71, 0.1);
  
  /* ---- Skeleton Loading ---- */
  --skeleton-base: #f0f0f0;
  --skeleton-highlight: #f8f8f8;
  --skeleton-animation: shimmer 1.5s infinite;

  /* ---- Border Radius ---- */
  --radius-sm: 0.5rem;
  --radius-md: 0.8rem;
  --radius-lg: 1.2rem;
  --radius-xl: 1.5rem;
  --radius-pill: 50px;

  /* ---- Typography / Font Sizes ---- */
  --fs-xs: 1.3rem;    
  --fs-sm: 1.5rem;    
  --fs-base: 1.6rem;  
  --fs-large: 1.8rem; 
  --fs-md: 2.0rem;    
  --fs-lg: 2.4rem;    
  --fs-xl: 3.0rem;    
  --fs-h1: 4.8rem;
  --fs-h2: 3.2rem;
  --fs-h3: 2.6rem;

  /* ---- Transitions ---- */
  --transition: all 0.3s ease;
  --transition-fast: all 0.2s ease;

  /* ---- Layout & Sizing ---- */
  --spacing: 1.6rem;
  --card-img-h: 26rem;

  /* ---- Buttons ---- */
  --btn-padding-vertical: 1.2rem;
  --btn-padding-horizontal: 2.8rem;
  --btn-font-size: 1.6rem;
  --btn-radius: var(--radius-pill);
  --btn-shadow: 0 6px 16px rgba(255, 99, 71, 0.3);

  /* ---- Scrollbar ---- */
  --scroll-track: #f3f4f6;
  --scroll-thumb: rgba(94, 94, 249, 0.16);
  --scroll-thumb-hover: rgba(94, 94, 249, 0.28);

  /* ---- Admin Dashboard ---- */
  --admin-sidebar-width: 280px;
  --admin-topbar-height: 70px;
  --admin-bg: #f8f9fa;
  --admin-active-bg: #fff5f2;
  --admin-hover-bg: #fffaf9;
  --admin-radius-sm: 0.8rem;
  --admin-radius-md: 1.25rem;
  --admin-spacing-sm: 1.2rem;
  --admin-spacing-md: 1.8rem;
  --admin-spacing-lg: 2.5rem;

  /* ---- Common Component Tokens ---- */
  --header-height: 8rem;
  --header-height-mobile: 13rem;
  --container-width: 120rem;
  --hero-height: 57.2rem;
  --hero-height-mobile: 35rem;
  
  --card-width: 100%;
  --card-height: 100%;
  --card-img-height: 22rem;
  --card-img-height-mobile: 18rem;
  
  --form-width: 40rem;
  --form-padding: 3rem;
  
  --toast-top: 2rem;
  --toast-right: 2rem;
  --toast-z-index: 9999;
  
  --logo-height: 4.5rem;
  --logo-height-mobile: 3.2rem;
  --search-max-width: 60rem;
  
  /* ---- Sections & Headings ---- */
  --heading-margin-top: 8.5rem;
  --heading-margin-bottom: 4rem;
  --heading-radius: 12px 35px 12px 5px;
  --heading-shadow: 0 8px 15px rgba(255, 99, 71, 0.2);
  --heading-bg: linear-gradient(135deg, var(--orange) 0%, var(--dark-color) 100%);

  /* ---- Header & Nav ---- */
  --header-padding: 1.5rem 5%;
  --header-gap: 3rem;
  --cat-menu-width: 25rem;
  --cat-hover-bg: #a2f0f0;

  /* ---- Admin Table & UI ---- */
  --admin-table-head-bg: #fdfdfd;
  --admin-table-padding-head: 1.8rem 1.5rem;
  --admin-table-padding-rows: 2rem 1.5rem;
  --admin-input-height: 50px;
  --admin-header-fs: 2.8rem;
  
  /* ---- Cart & Sidebar ---- */
  --cart-img-width: 80px;
  --cart-img-height: 110px;

  /* ---- Gradients ---- */
  --grad-profile: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --grad-primary: linear-gradient(135deg, var(--orange) 0%, var(--dark-color) 100%);
}

/* ==========================
    Base / Reset
    ========================== */

* {
  font-family: "Montserrat", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  outline: none;
  border: none;
}

html {
  font-size: 62.5%; /* Changes 1rem to 10px for easier calculation */
  scroll-padding-top: 5rem;
  scroll-behavior: smooth;
}

body {
  background: var(--bg-light);
  line-height: 1.6;
}

/* Global Form Controls */
.form-control, 
input[type="text"], 
input[type="email"], 
input[type="password"], 
input[type="number"], 
input[type="tel"], 
select, 
textarea {
  border: var(--border-field, 1.5px solid #e2e8f0) !important;
  transition: var(--transition) !important;
}

.form-control:focus, 
input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
input[type="number"]:focus,
input[type="tel"]:focus,
select:focus, 
textarea:focus {
  border-color: var(--orange) !important;
  box-shadow: var(--focus-shadow) !important;
  outline: none !important;
  background-color: var(--white) !important;
}

/* Form Check Customization (Checkbox/Radio) */
.form-check-input {
  cursor: pointer;
  border: 1.5px solid var(--border-color-fade) !important;
}

.form-check-input:checked {
  background-color: var(--orange) !important;
  border-color: var(--orange) !important;
}

.form-check-input:focus {
  border-color: var(--orange) !important;
  box-shadow: var(--focus-shadow) !important;
}

/* Global Price Style */
.price {
  font-size: var(--fs-md);
  color: var(--orange);
  font-weight: 700;
}

/* Custom Scrollbar */
html::-webkit-scrollbar {
  width: 12px;
}
html::-webkit-scrollbar-track {
  background: var(--scroll-track);
  border-radius: 12px;
}
html::-webkit-scrollbar-thumb {
  background: var(--scroll-thumb);
  border-radius: 12px;
  border: 3px solid var(--scroll-track);
}
html::-webkit-scrollbar-thumb:hover {
  background: var(--scroll-thumb-hover);
}

html {
  scrollbar-width: thin;
  scrollbar-color: var(--scroll-thumb) var(--scroll-track);
}

/* Utility Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.4) !important;
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-card {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.required {
  color: var(--error);
  font-weight: bold;
  margin-left: 2px;
}

/* Skeleton Loading Animation */
.skeleton-loader {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
  width: 100%;
  height: 100%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```