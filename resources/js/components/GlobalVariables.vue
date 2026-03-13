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
  --focus-shadow: 0 0 0 4px rgba(255, 99, 71, 0.1);

  /* ---- Border Radius ---- */
  --radius-sm: 0.5rem;
  --radius-md: 0.8rem;
  --radius-lg: 1.2rem;
  --radius-xl: 1.5rem;
  --radius-pill: 50px;

  /* ---- Typography / Font Sizes ---- */
  --fs-xs: 1.2rem;
  --fs-sm: 1.4rem;
  --fs-base: 1.5rem;
  --fs-large: 1.6rem;
  --fs-md: 1.8rem;
  --fs-lg: 2.2rem;
  --fs-xl: 2.8rem;
  --fs-h1: 4.5rem;
  --fs-h2: 3rem;
  --fs-h3: 2.4rem;

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
  transition: var(--transition);
}

html {
  font-size: 62.5%; /* Changes 1rem to 10px for easier calculation */
  overflow-x: hidden;
  scroll-padding-top: 5rem;
  scroll-behavior: smooth;
}

body {
  background: var(--bg-light);
  line-height: 1.6;
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
</style>