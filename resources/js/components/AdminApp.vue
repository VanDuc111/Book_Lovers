<template>
  <div v-if="checkAuth()" class="admin-wrapper">
    <!-- Top Loading Bar -->
    <div id="top-loading-bar" :class="{ 'loading': isLoading, 'finish': isFinish, 'hide': isHide }"></div>

    <div 
      v-if="isSidebarActive" 
      class="sidebar-overlay active" 
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <admin-sidebar 
        :active="isSidebarActive"
        :current-section="currentSection"
        :nav-items="navItems"
        @set-section="handleSetSection"
        @logout="logout"
    />

    <!-- Main Content -->
    <div id="main-content">
      <admin-topbar 
        :title="currentTitle"
        @toggle-sidebar="toggleSidebar"
        @logout="logout"
      />

      <div class="container-fluid py-5">
        <div id="content-area">
            <!-- DASHBOARD SECTION -->
            <dashboard-section 
                v-if="currentSection === 'dashboard'"
                :counts="counts"
                :cards="summaryCards"
            />

            <!-- BOOKS MANAGEMENT SECTION -->
            <book-management 
                v-else-if="currentSection === 'manage-books'"
                :books="books"
                :categories="categories"
                :loading="loadingBooks"
                v-model:searchQuery="bookSearchQuery"
                :selected-id="selectedBookId"
                :form-visible="isBookFormVisible"
                :form-data="bookFormData"
                :submitting="submitting"
                :filtered-books="filteredBooks"
                @toggle-select="toggleBookSelection"
                @show-form="showBookForm"
                @edit="editBook"
                @delete="confirmDeleteBook"
                @save="saveBook"
                @cancel="isBookFormVisible = false"
                @image-change="handleImageChange"
            />

            <!-- USERS MANAGEMENT SECTION -->
            <user-management 
                v-else-if="currentSection === 'manage-users'"
                :users="users"
                :loading="loadingUsers"
                v-model:searchQuery="userSearchQuery"
                :filtered-users="filteredUsers"
            />

            <!-- CATEGORIES MANAGEMENT SECTION -->
            <category-management 
                v-else-if="currentSection === 'manage-categories'"
                :categories="categories"
                :books="books"
                :loading="loadingCategories"
                v-model:searchQuery="categorySearchQuery"
                :selected-id="selectedCategoryId"
                :form-visible="isCategoryFormVisible"
                :form-data="categoryFormData"
                :submitting="submitting"
                :filtered-categories="filteredCategories"
                @toggle-select="toggleCategorySelection"
                @show-form="showCategoryForm"
                @edit="editCategory"
                @delete="confirmDeleteCategory"
                @save="saveCategory"
                @cancel="isCategoryFormVisible = false"
            />

            <!-- ORDERS MANAGEMENT SECTION -->
            <order-management 
                v-else-if="currentSection === 'manage-orders'"
                :orders="orders"
                :loading="loadingOrders"
                v-model:searchQuery="orderSearchQuery"
                v-model:statusFilter="orderStatusFilter"
                v-model:dateFilter="orderDateFilter"
                :selected-id="selectedOrderId"
                :filtered-orders="filteredOrders"
                @toggle-select="toggleOrderSelection"
                @view-details="viewOrderDetails"
                @update-status="updateOrderStatus"
            />

            <!-- REVIEWS MANAGEMENT SECTION -->
            <review-management 
                v-else-if="currentSection === 'manage-reviews'"
                :reviews="reviews"
                :loading="loadingReviews"
                v-model:searchQuery="reviewSearchQuery"
                :selected-id="selectedReviewId"
                :filtered-reviews="filteredReviews"
                @toggle-select="toggleReviewSelection"
                @delete="confirmDeleteReview"
            />
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <order-details-modal 
        :visible="isOrderDetailsModalVisible"
        :order="detailedOrder"
        @close="isOrderDetailsModalVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import AdminSidebar from './admin/AdminSidebar.vue';
import AdminTopbar from './admin/AdminTopbar.vue';
import DashboardSection from './admin/DashboardSection.vue';
import BookManagement from './admin/BookManagement.vue';
import UserManagement from './admin/UserManagement.vue';
import CategoryManagement from './admin/CategoryManagement.vue';
import OrderManagement from './admin/OrderManagement.vue';
import ReviewManagement from './admin/ReviewManagement.vue';
import OrderDetailsModal from './admin/OrderDetailsModal.vue';

// Import Services
import BookService from '@/services/BookService';
import UserService from '@/services/UserService';
import OrderService from '@/services/OrderService';
import ReviewService from '@/services/ReviewService';
import CategoryService from '@/services/CategoryService';
import AuthService from '@/services/AuthService';

const isSidebarActive = ref(false);
const currentSection = ref('dashboard');
const currentTitle = ref('Dashboard');
const isLoading = ref(false);
const isFinish = ref(false);
const isHide = ref(false);
const submitting = ref(false);

const navItems = [
  { section: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { section: 'manage-books', label: 'Quản lý Sách', icon: 'book-1' },
  { section: 'manage-users', label: 'Quản lý Người dùng', icon: 'people' },
  { section: 'manage-categories', label: 'Quản lý Thể loại', icon: 'category' },
  { section: 'manage-orders', label: 'Quản lý Đơn hàng', icon: 'shopping-cart' },
  { section: 'manage-reviews', label: 'Quản lý Đánh giá', icon: 'star' },
];

const summaryCards = [
  { id: 1, key: 'users', label: 'Người dùng', icon: '/assets/icons/people.svg', colorClass: 'text-primary' },
  { id: 2, key: 'books', label: 'Sách', icon: '/assets/icons/book-1.svg', colorClass: 'text-success', iconStyle: 'filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(130deg) brightness(95%) contrast(101%);' },
  { id: 3, key: 'orders', label: 'Đơn hàng', icon: '/assets/icons/shopping-cart.svg', colorClass: 'text-warning', iconStyle: 'filter: invert(76%) sepia(87%) saturate(354%) hue-rotate(352deg) brightness(101%) contrast(102%);' },
  { id: 4, key: 'reviews', label: 'Đánh giá', icon: '/assets/icons/star.svg', colorClass: 'text-danger', iconStyle: 'filter: invert(34%) sepia(93%) saturate(1633%) hue-rotate(338deg) brightness(97%) contrast(92%);' },
];

// DATA STATE
const counts = ref({ users: 0, books: 0, orders: 0, reviews: 0 });
const books = ref([]);
const users = ref([]);
const categories = ref([]);
const orders = ref([]);
const reviews = ref([]);

// LOADING STATE
const loadingBooks = ref(false);
const loadingUsers = ref(false);
const loadingCategories = ref(false);
const loadingOrders = ref(false);
const loadingReviews = ref(false);

// SEARCH/FILTER STATE
const bookSearchQuery = ref('');
const userSearchQuery = ref('');
const categorySearchQuery = ref('');
const orderSearchQuery = ref('');
const orderStatusFilter = ref('');
const orderDateFilter = ref('');
const reviewSearchQuery = ref('');

// SELECTION STATE
const selectedBookId = ref(null);
const selectedCategoryId = ref(null);
const selectedOrderId = ref(null);
const selectedReviewId = ref(null);

// FORM STATE
const isBookFormVisible = ref(false);
const bookFormData = ref({ bookID: '', title: '', author: '', publisher: '', categoryName: '', bookPrice: 0, stock: 0, description: '', image: null });

const isCategoryFormVisible = ref(false);
const categoryFormData = ref({ categoryID: '', categoryName: '', description: '' });

// MODAL STATE
const isOrderDetailsModalVisible = ref(false);
const detailedOrder = ref({});

// ACTIONS & UTILS
const toggleSidebar = () => isSidebarActive.value = !isSidebarActive.value;

const startLoading = () => { isHide.value = false; isFinish.value = false; isLoading.value = true; };
const stopLoading = () => { isFinish.value = true; setTimeout(() => { isHide.value = true; setTimeout(() => { isLoading.value = false; isFinish.value = false; isHide.value = false; }, 500); }, 300); };

const handleSetSection = (item) => {
  currentSection.value = item.section;
  currentTitle.value = item.label;
  
  clearSelections();
  if (item.section === 'dashboard') fetchAdminCounts();
  if (item.section === 'manage-books') fetchBooks();
  if (item.section === 'manage-users') fetchUsers();
  if (item.section === 'manage-categories') fetchCategories();
  if (item.section === 'manage-orders') fetchOrders();
  if (item.section === 'manage-reviews') fetchReviews();

  if (window.innerWidth <= 991) isSidebarActive.value = false;
};

const clearSelections = () => {
    selectedBookId.value = null;
    selectedCategoryId.value = null;
    selectedOrderId.value = null;
    selectedReviewId.value = null;
    isBookFormVisible.value = false;
    isCategoryFormVisible.value = false;
};

const showToast = (message, type) => {
    if (window.showToast) window.showToast(message, type);
    else alert(message);
};

// FETCH FUNCTIONS
const fetchAdminCounts = async () => {
    startLoading();
    try {
        const [u, b, o, r] = await Promise.all([
            UserService.getUsers(),
            BookService.fetchBooks(),
            OrderService.getMyOrders('all'), // Server should handle 'all' or no param for admin
            ReviewService.getAll()
        ]);
        counts.value.users = Array.isArray(u) ? u.length : 0;
        counts.value.books = Array.isArray(b) ? b.length : 0;
        counts.value.orders = Array.isArray(o) ? o.length : 0;
        counts.value.reviews = Array.isArray(r) ? r.length : 0;
    } finally { stopLoading(); }
};

const fetchBooks = async () => {
    startLoading();
    loadingBooks.value = true;
    try {
        books.value = await BookService.fetchBooks();
        categories.value = await CategoryService.getCategories();
    } finally { stopLoading(); loadingBooks.value = false; }
};

const fetchUsers = async () => {
    startLoading();
    loadingUsers.value = true;
    try { users.value = await UserService.getUsers(); }
    finally { stopLoading(); loadingUsers.value = false; }
};

const fetchCategories = async () => {
    startLoading();
    loadingCategories.value = true;
    try { 
        const [cats, bks] = await Promise.all([
            CategoryService.getCategories(),
            BookService.fetchBooks()
        ]);
        categories.value = cats;
        books.value = bks;
    }
    finally { stopLoading(); loadingCategories.value = false; }
};

const fetchOrders = async () => {
    startLoading();
    loadingOrders.value = true;
    try { orders.value = await OrderService.getAll(); }
    finally { stopLoading(); loadingOrders.value = false; }
};

const fetchReviews = async () => {
    startLoading();
    loadingReviews.value = true;
    try { reviews.value = await ReviewService.getAll(); }
    finally { stopLoading(); loadingReviews.value = false; }
};

// FILTERED DATA
const filteredBooks = computed(() => {
    const q = bookSearchQuery.value.trim().toLowerCase();
    return books.value.filter(b => !q || String(b.bookID).toLowerCase().includes(q) || (b.title && b.title.toLowerCase().includes(q)));
});

const filteredUsers = computed(() => {
    const q = userSearchQuery.value.trim().toLowerCase();
    return users.value.filter(u => !q || String(u.userID).toLowerCase().includes(q) || (u.name && u.name.toLowerCase().includes(q)));
});

const filteredCategories = computed(() => {
    const q = categorySearchQuery.value.trim().toLowerCase();
    return categories.value.filter(c => !q || String(c.categoryID).toLowerCase().includes(q) || (c.categoryName && c.categoryName.toLowerCase().includes(q)));
});

const filteredOrders = computed(() => {
    const q = orderSearchQuery.value.trim().toLowerCase();
    const st = orderStatusFilter.value;
    const dt = orderDateFilter.value;

    return orders.value.filter(o => {
        const matchesSearch = !q || String(o.orderID).includes(q) || String(o.userID).includes(q) || (o.receiver_name && o.receiver_name.toLowerCase().includes(q)) || (o.receiver_phone && o.receiver_phone.includes(q));
        const matchesStatus = !st || o.order_status === st;
        const matchesDate = !dt || (new Date(o.order_date).toISOString().split('T')[0] === dt);
        return matchesSearch && matchesStatus && matchesDate;
    });
});

const filteredReviews = computed(() => {
    const q = reviewSearchQuery.value.trim().toLowerCase();
    return reviews.value.filter(r => !q || String(r.reviewID).includes(q) || String(r.bookID).includes(q) || String(r.userID).includes(q));
});

// HANDLERS
const toggleBookSelection = (id) => selectedBookId.value = selectedBookId.value === id ? null : id;
const toggleCategorySelection = (id) => selectedCategoryId.value = selectedCategoryId.value === id ? null : id;
const toggleOrderSelection = (id) => selectedOrderId.value = selectedOrderId.value === id ? null : id;
const toggleReviewSelection = (id) => selectedReviewId.value = selectedReviewId.value === id ? null : id;

const showBookForm = () => {
    bookFormData.value = { bookID: '', title: '', author: '', publisher: '', categoryName: '', bookPrice: 0, stock: 0, description: '', image: null };
    isBookFormVisible.value = true;
};

const editBook = () => {
    const b = books.value.find(x => x.bookID == selectedBookId.value);
    if (!b) return;
    bookFormData.value = { ...b, image: null };
    isBookFormVisible.value = true;
};

const handleImageChange = (e) => { bookFormData.value.image = e.target.files[0]; };

const saveBook = async (data) => {
    submitting.value = true;
    const formData = new FormData();
    Object.keys(data).forEach(k => { if(data[k] !== null) formData.append(k, data[k]); });
    
    try {
        const res = await BookService.saveBook(formData);
        showToast(res.message || "Thao tác thành công!", "success");
        isBookFormVisible.value = false; 
        fetchBooks();
    } catch (e) {
        // Error handling is already in BaseApiService
    } finally { 
        submitting.value = false; 
    }
};

const confirmDeleteBook = async (id) => {
    if(!confirm("Bạn có chắc chắn muốn xóa cuốn sách này?")) return;
    try {
        const res = await BookService.deleteBook(id);
        showToast(res.message || "Xóa thành công!", "success");
        selectedBookId.value = null; 
        fetchBooks();
    } catch (e) { }
};

const showCategoryForm = () => {
    categoryFormData.value = { categoryID: '', categoryName: '', description: '' };
    isCategoryFormVisible.value = true;
};

const editCategory = () => {
    const c = categories.value.find(x => x.categoryID == selectedCategoryId.value);
    if (!c) return;
    categoryFormData.value = { ...c };
    isCategoryFormVisible.value = true;
};

const saveCategory = async (data) => {
    submitting.value = true;
    try {
        const res = await CategoryService.saveCategory(data);
        showToast(res.message || "Thao tác thành công!", "success");
        isCategoryFormVisible.value = false; 
        fetchCategories();
    } catch (e) { }
    finally { submitting.value = false; }
};

const confirmDeleteCategory = async (id) => {
    if(!confirm("Bạn có chắc chắn muốn xóa thể loại này?")) return;
    try {
        const res = await CategoryService.deleteCategory(id);
        showToast(res.message || "Xóa thành công!", "success");
        selectedCategoryId.value = null; 
        fetchCategories();
    } catch (e) { }
};

const updateOrderStatus = async ({ id, status }) => {
    try {
        const res = await OrderService.updateStatus(id, status);
        showToast(res.message || "Cập nhật trạng thái thành công!", "success");
        fetchOrders();
    } catch (e) { }
};

const viewOrderDetails = () => {
    detailedOrder.value = orders.value.find(o => o.orderID == selectedOrderId.value);
    isOrderDetailsModalVisible.value = true;
};

const confirmDeleteReview = async (id) => {
    if(!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
        const res = await ReviewService.deleteReview(id);
        showToast(res.message || "Xóa thành công!", "success");
        selectedReviewId.value = null; 
        fetchReviews();
    } catch (e) { }
};

const logout = () => { AuthService.logout(); };

const checkAuth = () => {
    const user = AuthService.getCurrentUser();
    return user && user.role && user.role.toLowerCase() === 'admin';
};

onMounted(() => {
    if (!checkAuth()) {
        window.location.href = '/login';
        return;
    }
    fetchAdminCounts();
});
</script>

<style scoped>
.admin-wrapper {
    background: var(--admin-bg);
    min-height: 100vh;
}

#main-content {
    margin-left: var(--admin-sidebar-width);
    min-height: 100vh;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    z-index: 1000;
}

@media (max-width: 991px) {
    #main-content { margin-left: 0; }
}

/* Loading Bar */
#top-loading-bar {
    position: fixed;
    top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #ff6347, #ff9f43);
    z-index: 9999;
    width: 0;
    transition: width 0.3s ease;
}
#top-loading-bar.loading { width: 70%; animation: pulse 2s infinite; }
#top-loading-bar.finish { width: 100%; }
#top-loading-bar.hide { opacity: 0; }

/* Global Admin Element Scaling */
:deep(.form-control), :deep(select.form-control) {
    padding: 1.2rem 1.8rem !important;
    font-size: var(--fs-base) !important;
    min-height: var(--admin-input-height) !important;
    border-radius: var(--radius-md) !important;
}

:deep(.table) {
    font-size: 1.6rem !important;
    border-collapse: separate !important;
    border-spacing: 0 0.8rem !important;
}

:deep(.table thead th) {
    background: var(--admin-table-head-bg) !important;
    padding: var(--admin-table-padding-head) !important;
    font-weight: 700 !important;
    border-bottom: var(--admin-table-border, 2px solid #eee) !important;
    text-transform: uppercase;
    font-size: 1.3rem;
    letter-spacing: 1px;
    color: var(--light-color);
}

:deep(.table tbody tr) {
    background: var(--white);
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    transition: all 0.3s ease;
}

:deep(.table tbody tr:hover) {
    background-color: var(--admin-hover-bg) !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

:deep(.table tr.table-active) {
    background-color: var(--admin-active-bg) !important;
    box-shadow: inset 4px 0 0 0 var(--orange) !important;
}

:deep(.table tr.table-active td) {
    color: var(--orange) !important;
}

:deep(.table td) {
    padding: var(--admin-table-padding-rows) !important;
    vertical-align: middle !important;
    border-top: none !important;
}

:deep(.section-header-sticky h2) {
    font-size: var(--admin-header-fs) !important;
    font-weight: 800 !important;
    margin-bottom: 2rem !important;
    color: var(--black);
}

:deep(.btn) {
    padding: 1rem 2rem !important;
    font-size: 1.5rem !important;
    font-weight: 600 !important;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
</style>
