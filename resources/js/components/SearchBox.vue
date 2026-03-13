<template>
    <div class="search-wrapper">
        <form @submit.prevent="handleSearch" class="search-form-container" id="search-form" autocomplete="off" role="search">
            <div class="input-group-custom">
                <i class="fas fa-search search-icon"></i>
                <input 
                    type="search" 
                    v-model="query" 
                    placeholder="Tìm kiếm sách bạn yêu thích..." 
                    id="search-input" 
                    autocomplete="off"
                    @input="handleInput"
                    @focus="showSuggestions = true"
                >
            </div>
            
            <!-- Result Suggestions -->
            <div v-if="showSuggestions && suggestions.length > 0" class="search-suggestions shadow-sm">
                <div 
                    v-for="s in suggestions" 
                    :key="s.bookID" 
                    class="suggestion-item"
                    @click="goToBook(s.bookID)"
                >
                    <div class="suggestion-thumb">
                        <img :src="s.image || 'https://fakeimg.pl/100x150/f0f0f0/909090?text=No+Image'" alt="">
                    </div>
                    <div class="s-info">
                        <div class="s-title">{{ s.title }}</div>
                        <div class="s-meta">
                            <span class="s-price">{{ formatPrice(s.bookPrice) }}</span>
                            <span class="s-author" v-if="s.author"> • {{ s.author }}</span>
                        </div>
                    </div>
                </div>
                <div class="suggestion-footer" @click="handleSearch">
                    Xem tất cả kết quả cho "{{ query }}"
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const query = ref('');
const suggestions = ref([]);
const showSuggestions = ref(false);

const handleSearch = () => {
    const q = query.value.trim();
    if (q) {
        window.location.href = `/book-list?search=${encodeURIComponent(q)}`;
    }
};

const handleInput = async () => {
    const q = query.value.trim();
    if (q.length < 2) {
        suggestions.value = [];
        showSuggestions.value = false;
        return;
    }

    try {
        const res = await fetch(`/api/books?search=${encodeURIComponent(q)}`);
        const data = await res.json();
        suggestions.value = data.slice(0, 5);
        showSuggestions.value = true;
    } catch (e) {
        console.error(e);
    }
};

const goToBook = (id) => {
    window.location.href = `/book-details?id=${id}`;
};

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND', 
    maximumFractionDigits: 0 
}).format(p);

// Close suggestions on click outside
const closeSuggestions = (e) => {
    if (!e.target.closest('.search-form-container')) {
        showSuggestions.value = false;
    }
};

onMounted(() => {
    window.addEventListener('click', closeSuggestions);
});

onUnmounted(() => {
    window.removeEventListener('click', closeSuggestions);
});
</script>

<style scoped>
.search-wrapper {
    flex: 1;
    max-width: 50rem;
    margin: 0 2rem;
}

.search-form-container {
    position: relative;
    width: 100%;
}

.input-group-custom {
    display: flex;
    align-items: center;
    background: #f1f3f5;
    border: 2px solid transparent;
    border-radius: 50px;
    padding: 0.2rem 1.8rem;
    height: 4.5rem;
    transition: all 0.3s ease;
}

.input-group-custom:focus-within {
    background: #fff;
    border-color: #ff6347;
    box-shadow: 0 0 0 4px rgba(255, 99, 71, 0.1);
}

.search-icon {
    color: #888;
    font-size: 1.6rem;
    margin-right: 1.2rem;
}

.input-group-custom:focus-within .search-icon {
    color: #ff6347;
}

#search-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 1.5rem;
    color: #333;
    width: 100%;
    height: 100%;
}

#search-input:focus {
    outline: none !important;
    box-shadow: none !important;
}

/* Remove default browser clear icon (X) on search inputs */
#search-input::-webkit-search-decoration,
#search-input::-webkit-search-cancel-button,
#search-input::-webkit-search-results-button,
#search-input::-webkit-search-results-decoration {
  -webkit-appearance: none;
}

#search-input::placeholder {
    color: #999;
}

.search-suggestions {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    background: white;
    z-index: 1000;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #eee;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.suggestion-item {
    display: flex;
    padding: 1.2rem;
    gap: 1.2rem;
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid #f8f9fa;
}

.suggestion-item:last-of-type {
    border-bottom: none;
}

.suggestion-item:hover {
    background: #fff5f3;
}

.suggestion-thumb img {
    width: 45px;
    height: 65px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.s-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
}

.s-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #2c3e50;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.3rem;
}

.s-meta {
    font-size: 1.2rem;
}

.s-price {
    color: #ff6347;
    font-weight: 700;
}

.s-author {
    color: #888;
}

.suggestion-footer {
    padding: 1rem;
    text-align: center;
    background: #f8f9fa;
    font-size: 1.25rem;
    color: #ff6347;
    font-weight: 600;
    cursor: pointer;
}

.suggestion-footer:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .search-wrapper {
        margin: 0;
        max-width: 100%;
    }
    .input-group-custom {
        height: 4rem;
    }
    #search-input {
        font-size: 1.25rem;
    }
    #search-input::placeholder {
        font-size: 1.25rem;
    }
}
</style>
