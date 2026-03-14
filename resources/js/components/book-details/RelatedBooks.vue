<template>
    <div v-if="books.length > 0" class="related-books-wrapper p-4 bg-white rounded shadow-sm">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold mb-0">Sách cùng thể loại</h3>
            <a :href="'/book-list?category=' + encodeURIComponent(categoryName)" 
               class="link-orange fw-bold">Xem tất cả <i class="fas fa-arrow-right ms-1"></i></a>
        </div>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div v-for="relBook in books" :key="relBook.bookID" class="col">
                <book-card :book="relBook" />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    books: {
        type: Array,
        default: () => [],
    },
    categoryName: {
        type: String,
        default: '',
    },
});
</script>

<style scoped>
.related-books-wrapper {
    margin-top: 3rem;
    padding: 2.5rem;
    background: var(--white);
    border: var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--box-shadow);
}

.link-orange {
    color: var(--orange);
    text-decoration: none;
    font-size: 1.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: opacity 0.2s, transform 0.2s;
}
.link-orange:hover {
    color: #e6563e;
    text-decoration: none;
    transform: translateX(3px);
}
</style>
