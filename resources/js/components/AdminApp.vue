<template>
  <div class="admin-wrapper">
    <!-- Top Loading Bar -->
    <div id="top-loading-bar" :class="{ 'loading': isLoading, 'finish': isFinish, 'hide': isHide }"></div>

    <!-- Sidebar Overlay for mobile -->
    <div 
      v-if="isSidebarActive" 
      id="sidebar-overlay" 
      class="sidebar-overlay active" 
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <nav id="sidebar" :class="{ 'active': isSidebarActive }">
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
            @click.prevent="setSection(item.section, item.label)"
          >
            <img :src="`/assets/icons/${item.icon}.svg`" class="nav-icon" :alt="item.label">
            <span>{{ item.label }}</span>
          </a>
        </li>
      </ul>

      <div class="sidebar-footer">
        <button id="admin-logout-btn" class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div id="main-content">
      <header class="admin-topbar">
        <div class="topbar-left">
          <button id="sidebar-toggle" class="sidebar-toggle" @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>
          <div class="breadcrumb-nav">
             <span class="breadcrumb-item">Admin</span>
             <span class="breadcrumb-sep">/</span>
             <h1 id="section-title">{{ currentTitle }}</h1>
          </div>
        </div>
        <div class="admin-profile" @click="logout" title="Click to logout">
          <div class="profile-info">
            <span class="admin-name">Administrator</span>
          </div>
          <div class="avatar-box">
             <img src="https://ui-avatars.com/api/?name=Admin&background=ff6347&color=fff&bold=true" alt="Admin" class="admin-avatar">
             <div class="online-indicator"></div>
          </div>
        </div>
      </header>

      <div class="container-fluid py-5">
        <div id="content-area">
            <!-- DASHBOARD SECTION -->
            <div v-if="currentSection === 'dashboard'">

               
               <div class="row admin-cards mt-4">
                 <div v-for="card in summaryCards" :key="card.id" class="col-12 col-sm-6 col-md-3 mb-4">
                   <div class="card card-summary">
                     <div class="card-body">
                       <div class="d-flex justify-content-between align-items-center">
                         <div>
                           <div class="summary-label">{{ card.label }}</div>
                           <div class="summary-number">{{ counts[card.key] }}</div>
                         </div>
                         <div class="icon-wrap" :class="card.colorClass">
                           <img :src="card.icon" :style="card.iconStyle">
                         </div>
                       </div>

                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <!-- BOOKS MANAGEMENT SECTION -->
            <div v-else-if="currentSection === 'manage-books'">
                <div class="section-header-sticky">
                    <h2>Quản lý Sách</h2>
                    <div class="mb-3 d-flex gap-2 flex-wrap">
                        <base-button variant="primary" @click="showBookForm()">Thêm Sách</base-button>
                        <base-button variant="secondary" :disabled="!selectedBookId" @click="editBook()">Sửa</base-button>
                        <base-button variant="danger" :disabled="!selectedBookId" @click="confirmDeleteBook()">Xóa</base-button>
                    </div>
                    <div v-if="!isBookFormVisible" class="mb-2">
                        <input v-model="bookSearchQuery" class="form-control" placeholder="Tìm theo ID hoặc tiêu đề...">
                    </div>
                </div>

                <div v-if="!isBookFormVisible">
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
                            <tbody id="book-table-body">
                                <tr v-if="loadingBooks" v-for="i in 5" :key="i">
                                    <td v-for="j in 8" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                                </tr>
                                <tr v-else v-for="book in filteredBooks" 
                                    :key="book.bookID" 
                                    :class="{ 'table-active': selectedBookId === book.bookID }"
                                    @click="toggleBookSelection(book.bookID)">
                                    <td>{{ book.bookID }}</td>
                                    <td>
                                        <img :src="book.image || '/assets/images/default-book.png'" alt="book" class="book-thumbnail">
                                    </td>
                                    <td>{{ book.title }}</td>
                                    <td>{{ book.author }}</td>
                                    <td>{{ book.publisher }}</td>
                                    <td>{{ book.categoryName }}</td>
                                    <td>{{ book.bookPrice }}</td>
                                    <td>{{ book.stock }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Book Form Container -->
                <div v-else id="bookFormContainer" class="card p-4 shadow-sm border-0">
                    <h3>Thêm/Sửa Sách</h3>
                    <form @submit.prevent="saveBook" class="row g-3 mt-2">
                        <div class="col-md-6 form-group">
                            <label class="form-label fw-bold">Tiêu đề</label>
                            <input v-model="bookFormData.title" class="form-control" required>
                        </div>
                        <div class="col-md-6 form-group">
                            <label class="form-label fw-bold">Tác giả</label>
                            <input v-model="bookFormData.author" class="form-control">
                        </div>
                        <div class="col-md-6 form-group">
                            <label class="form-label fw-bold">Nhà xuất bản</label>
                            <input v-model="bookFormData.publisher" class="form-control">
                        </div>
                        <div class="col-md-6 form-group">
                            <label class="form-label fw-bold">Thể loại</label>
                            <select v-model="bookFormData.categoryName" class="form-control" required>
                                <option value="">-- Chọn thể loại --</option>
                                <option v-for="cat in categories" :key="cat.categoryID" :value="cat.categoryName">
                                    {{ cat.categoryName }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6 form-group">
                            <label class="form-label fw-bold">Giá</label>
                            <input v-model.number="bookFormData.bookPrice" type="number" step="0.01" class="form-control" required>
                        </div>
                        <div class="col-md-6 form-group">
                            <label class="form-label fw-bold">Số lượng trong kho</label>
                            <input v-model.number="bookFormData.stock" type="number" class="form-control" required>
                        </div>
                        <div class="col-12 form-group">
                            <label class="form-label fw-bold">Mô tả</label>
                            <textarea v-model="bookFormData.description" class="form-control" rows="3"></textarea>
                        </div>
                        <div class="col-12 form-group">
                            <label class="form-label fw-bold">Hình ảnh</label>
                            <input type="file" @change="handleImageChange" class="form-control file-input" accept="image/*">
                        </div>
                        <div class="col-12 mt-4 d-flex gap-2">
                            <base-button variant="primary" type="submit" :loading="submitting">Lưu</base-button>
                            <base-button variant="secondary" @click="isBookFormVisible = false">Hủy</base-button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- USERS MANAGEMENT SECTION -->
            <div v-else-if="currentSection === 'manage-users'">
               <div class="section-header-sticky">
                   <h2>Quản lý Người dùng</h2>
                   <div class="mb-3">
                       <input v-model="userSearchQuery" class="form-control" placeholder="Tìm theo ID hoặc tên...">
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
                            <tr v-if="loadingUsers" v-for="i in 5" :key="i">
                                <td v-for="j in 4" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                            </tr>
                            <tr v-else v-for="user in filteredUsers" :key="user.userID">
                                <td>{{ user.userID }}</td>
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.role }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- CATEGORIES MANAGEMENT SECTION -->
            <div v-else-if="currentSection === 'manage-categories'">
                <div class="section-header-sticky">
                    <h2>Quản lý Thể loại</h2>
                    <div class="mb-3 d-flex gap-2 flex-wrap">
                        <base-button variant="primary" @click="showCategoryForm()">Thêm Thể loại</base-button>
                        <base-button variant="secondary" :disabled="!selectedCategoryId" @click="editCategory()">Sửa</base-button>
                        <base-button variant="danger" :disabled="!selectedCategoryId" @click="confirmDeleteCategory()">Xóa</base-button>
                    </div>
                    <div v-if="!isCategoryFormVisible" class="mb-2">
                        <input v-model="categorySearchQuery" class="form-control" placeholder="Tìm theo ID hoặc tên thể loại...">
                    </div>
                </div>

                <div v-if="!isCategoryFormVisible">
                    <div class="table-responsive">
                        <table class="table hover-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên Thể loại</th>
                                    <th class="text-center">Số lượng sách</th>
                                    <th>Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="loadingCategories" v-for="i in 5" :key="i">
                                    <td v-for="j in 4" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                                </tr>
                                <tr v-else v-for="cat in filteredCategories" 
                                    :key="cat.categoryID" 
                                    :class="{ 'table-active': selectedCategoryId === cat.categoryID }"
                                    @click="toggleCategorySelection(cat.categoryID)">
                                    <td>{{ cat.categoryID }}</td>
                                    <td>{{ cat.categoryName }}</td>
                                    <td class="text-center">
                                        <span class="badge rounded-pill bg-light text-dark border">
                                            {{ getBookCountByCategory(cat.categoryName) }}
                                        </span>
                                    </td>
                                    <td>{{ cat.description }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Category Form -->
                <div v-else id="categoryFormContainer" class="card p-4 shadow-sm border-0">
                    <h3>Thêm/Sửa Thể loại</h3>
                    <form @submit.prevent="saveCategory" class="mt-4">
                        <div class="form-group mb-3">
                            <label class="form-label fw-bold">Tên Thể loại</label>
                            <input v-model="categoryFormData.categoryName" class="form-control" required>
                        </div>
                        <div class="form-group mb-3">
                            <label class="form-label fw-bold">Mô tả</label>
                            <textarea v-model="categoryFormData.description" class="form-control" rows="3"></textarea>
                        </div>
                        <div class="d-flex gap-2 mt-4">
                            <base-button variant="primary" type="submit" :loading="submitting">Lưu</base-button>
                            <base-button variant="secondary" @click="isCategoryFormVisible = false">Hủy</base-button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- ORDERS MANAGEMENT SECTION -->
            <div v-else-if="currentSection === 'manage-orders'">
                <div class="section-header-sticky">
                    <h2>Quản lý Đơn hàng</h2>
                    <div class="mb-3 d-flex gap-2 flex-wrap align-items-center">
                        <base-button variant="info" :disabled="!selectedOrderId" @click="viewOrderDetails()">Chi tiết</base-button>
                        <select v-model="orderStatusFilter" class="form-control" style="width: auto;">
                            <option value="">Tất cả trạng thái</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <div class="date-filter-wrapper" @click="openDatePicker">
                            <span class="date-placeholder" v-if="!orderDateFilter">Ngày</span>
                            <span class="date-text" v-else>{{ formatDateForDisplay(orderDateFilter) }}</span>
                            <input type="date" ref="dateInput" v-model="orderDateFilter" class="form-control date-input-field">
                        </div>
                    </div>
                    <div class="mb-3">
                        <input v-model="orderSearchQuery" class="form-control" placeholder="Tìm ID, Tên, SĐT...">
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
                            <tr v-if="loadingOrders" v-for="i in 5" :key="i">
                                <td v-for="j in 10" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                            </tr>
                            <tr v-else v-for="order in filteredOrders" 
                                :key="order.orderID" 
                                :class="{ 'table-active': selectedOrderId === order.orderID }"
                                @click="toggleOrderSelection(order.orderID)">
                                <td>{{ order.orderID }}</td>
                                <td>{{ order.userID }}</td>
                                <td>{{ formatOrderDate(order.order_date) }}</td>
                                <td class="text-end">{{ formatCurrency(order.total_amount) }}</td>
                                <td :title="order.shipping_address">{{ truncateText(order.shipping_address, 25) }}</td>
                                <td :title="order.receiver_name">{{ truncateText(order.receiver_name, 15) }}</td>
                                <td>{{ order.receiver_phone }}</td>
                                <td>{{ order.payment_method || 'COD' }}</td>
                                <td :title="order.note">{{ truncateText(order.note, 15) }}</td>
                                <td>
                                    <select class="form-control order-status-select" 
                                            :value="order.order_status"
                                            @change.stop="updateOrderStatus(order.orderID, $event.target.value)">
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- REVIEWS MANAGEMENT SECTION -->
            <div v-else-if="currentSection === 'manage-reviews'">
                <div class="section-header-sticky">
                    <h2>Quản lý Đánh giá</h2>
                    <div class="mb-3 d-flex gap-2">
                        <base-button variant="danger" :disabled="!selectedReviewId" @click="confirmDeleteReview()">Xóa</base-button>
                    </div>
                    <div class="mb-3">
                        <input v-model="reviewSearchQuery" class="form-control" placeholder="Tìm ID sách hoặc người dùng...">
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table hover-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Sách (ID)</th>
                                <th>Người dùng (ID)</th>
                                <th>Điểm</th>
                                <th>Bình luận</th>
                                <th>Thời gian tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loadingReviews" v-for="i in 5" :key="i">
                                <td v-for="j in 6" :key="j"><div class="skeleton-loader skeleton-text"></div></td>
                            </tr>
                            <tr v-else v-for="review in filteredReviews" 
                                :key="review.reviewID" 
                                :class="{ 'table-active': selectedReviewId === review.reviewID }"
                                @click="toggleReviewSelection(review.reviewID)">
                                <td>{{ review.reviewID }}</td>
                                <td>{{ review.bookID }}</td>
                                <td>{{ review.userID }}</td>
                                <td>{{ review.rating }}</td>
                                <td>{{ review.comment }}</td>
                                <td>{{ new Date(review.created_at).toLocaleString('vi-VN') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="isOrderDetailsModalVisible" class="modal-overlay" @click.self="isOrderDetailsModalVisible = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Chi tiết đơn hàng #{{ detailedOrder.orderID }}</h3>
          <button @click="isOrderDetailsModalVisible = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div><strong>Ngày đặt:</strong> {{ formatOrderDate(detailedOrder.order_date) }}</div>
            <div><strong>Trạng thái:</strong> <span class="text-orange">{{ detailedOrder.order_status }}</span></div>
            <div><strong>Tổng tiền:</strong> {{ formatCurrency(detailedOrder.total_amount) }} ₫</div>
            <hr class="grid-span-all">
            <div><strong>Người nhận:</strong> {{ detailedOrder.receiver_name || 'N/A' }}</div>
            <div><strong>Số điện thoại:</strong> {{ detailedOrder.receiver_phone || 'N/A' }}</div>
            <div><strong>Địa chỉ giao hàng:</strong> {{ detailedOrder.shipping_address || 'N/A' }}</div>
            <div><strong>Phương thức thanh toán:</strong> {{ detailedOrder.payment_method || 'COD' }}</div>
            <div v-if="detailedOrder.note" class="grid-span-all"><strong>Ghi chú:</strong> {{ detailedOrder.note }}</div>
            <hr class="grid-span-all">
            <div><strong>Khách hàng ID:</strong> {{ detailedOrder.userID }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <base-button variant="secondary" @click="isOrderDetailsModalVisible = false">Đóng</base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

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
const loadingCounts = ref(false);
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
const dateInput = ref(null);

// ACTIONS & UTILS
const toggleSidebar = () => isSidebarActive.value = !isSidebarActive.value;

const startLoading = () => { isHide.value = false; isFinish.value = false; isLoading.value = true; };
const stopLoading = () => { isFinish.value = true; setTimeout(() => { isHide.value = true; setTimeout(() => { isLoading.value = false; isFinish.value = false; isHide.value = false; }, 500); }, 300); };
const openDatePicker = () => { if (dateInput.value && dateInput.value.showPicker) dateInput.value.showPicker(); };

const setSection = (section, title) => {
  currentSection.value = section;
  currentTitle.value = title;
  
  clearSelections();
  if (section === 'dashboard') fetchAdminCounts();
  if (section === 'manage-books') fetchBooks();
  if (section === 'manage-users') fetchUsers();
  if (section === 'manage-categories') fetchCategories();
  if (section === 'manage-orders') fetchOrders();
  if (section === 'manage-reviews') fetchReviews();

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
            fetch('/api/users').then(res => res.json()),
            fetch('/api/books').then(res => res.json()),
            fetch('/api/orders').then(res => res.json()),
            fetch('/api/reviews').then(res => res.json())
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
        books.value = await fetch('/api/books').then(res => res.json());
        categories.value = await fetch('/api/categories').then(res => res.json());
    } finally { stopLoading(); loadingBooks.value = false; }
};

const fetchUsers = async () => {
    startLoading();
    loadingUsers.value = true;
    try { users.value = await fetch('/api/users').then(res => res.json()); }
    finally { stopLoading(); loadingUsers.value = false; }
};

const fetchCategories = async () => {
    startLoading();
    loadingCategories.value = true;
    try { 
        const [cats, bks] = await Promise.all([
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/books').then(res => res.json())
        ]);
        categories.value = cats;
        books.value = bks;
    }
    finally { stopLoading(); loadingCategories.value = false; }
};

const getBookCountByCategory = (categoryName) => {
    return books.value.filter(b => b.categoryName === categoryName).length;
};

const fetchOrders = async () => {
    startLoading();
    loadingOrders.value = true;
    try { orders.value = await fetch('/api/orders').then(res => res.json()); }
    finally { stopLoading(); loadingOrders.value = false; }
};

const fetchReviews = async () => {
    startLoading();
    loadingReviews.value = true;
    try { reviews.value = await fetch('/api/reviews').then(res => res.json()); }
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

const saveBook = async () => {
    submitting.value = true;
    const formData = new FormData();
    Object.keys(bookFormData.value).forEach(k => { if(bookFormData.value[k] !== null) formData.append(k, bookFormData.value[k]); });
    
    const isEditing = !!bookFormData.value.bookID;
    const url = isEditing ? `/api/books/${bookFormData.value.bookID}` : '/api/books';
    if(isEditing) formData.append('_method', 'PUT');

    try {
        const res = await fetch(url, { method: 'POST', body: formData }).then(r => r.json());
        showToast(res.message || (res.error ? "Lỗi: " + res.error : (isEditing ? "Cập nhật thành công!" : "Thêm thành công!")), res.error ? "danger" : "success");
        if(!res.error) { isBookFormVisible.value = false; fetchBooks(); }
    } catch (e) { showToast("Lỗi kết nối", "danger"); }
    finally { submitting.value = false; }
};

const confirmDeleteBook = async () => {
    if(!confirm("Bạn có chắc chắn muốn xóa cuốn sách này?")) return;
    try {
        const res = await fetch(`/api/books/${selectedBookId.value}`, { method: 'DELETE' }).then(r => r.json());
        showToast(res.message || (res.error ? "Lỗi: " + res.error : "Xóa thành công!"), res.error ? "danger" : "success");
        if(!res.error) { selectedBookId.value = null; fetchBooks(); }
    } catch (e) { showToast("Lỗi kết nối", "danger"); }
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

const saveCategory = async () => {
    submitting.value = true;
    const isEditing = !!categoryFormData.value.categoryID;
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/categories/${categoryFormData.value.categoryID}` : "/api/categories";

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryFormData.value)
        }).then(r => r.json());
        showToast(res.message || (res.error ? "Lỗi: " + res.error : "Thao tác thành công!"), res.error ? "danger" : "success");
        if(!res.error) { isCategoryFormVisible.value = false; fetchCategories(); }
    } catch (e) { showToast("Lỗi kết nối", "danger"); }
    finally { submitting.value = false; }
};

const confirmDeleteCategory = async () => {
    if(!confirm("Bạn có chắc chắn muốn xóa thể loại này?")) return;
    try {
        const res = await fetch(`/api/categories/${selectedCategoryId.value}`, { method: 'DELETE' }).then(r => r.json());
        showToast(res.message || (res.error ? "Lỗi: " + res.error : "Xóa thành công!"), res.error ? "danger" : "success");
        if(!res.error) { selectedCategoryId.value = null; fetchCategories(); }
    } catch (e) { showToast("Lỗi kết nối", "danger"); }
};

const updateOrderStatus = async (id, status) => {
    try {
        const res = await fetch(`/api/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: id, order_status: status })
        }).then(r => r.json());
        showToast(res.message || (res.error ? "Lỗi: " + res.error : "Cập nhật trạng thái thành công!"), res.error ? "danger" : "success");
        fetchOrders();
    } catch (e) { showToast("Lỗi kết nối", "danger"); }
};

const viewOrderDetails = () => {
    detailedOrder.value = orders.value.find(o => o.orderID == selectedOrderId.value);
    isOrderDetailsModalVisible.value = true;
};

const confirmDeleteReview = async () => {
    if(!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
        const res = await fetch(`/api/reviews/${selectedReviewId.value}`, { method: 'DELETE' }).then(r => r.json());
        showToast(res.message || (res.error ? "Lỗi: " + res.error : "Xóa thành công!"), res.error ? "danger" : "success");
        if(!res.error) { selectedReviewId.value = null; fetchReviews(); }
    } catch (e) { showToast("Lỗi kết nối", "danger"); }
};

const logout = () => { localStorage.removeItem("user"); window.location.href = "/login"; };

// FORMATTERS
const formatCurrency = (v) => Math.round(v).toLocaleString('vi-VN');
const formatOrderDate = (ds) => {
    const d = new Date(ds);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};
const truncateText = (t, l) => (t && t.length > l) ? t.substring(0, l) + '...' : (t || '');
const formatDateForDisplay = (ds) => {
    if(!ds) return '';
    const [y, m, d] = ds.split('-');
    return `${d}/${m}/${y}`;
};

onMounted(() => fetchAdminCounts());
</script>

<style scoped>
/* Admin Variables - Imported from admin.css */
.admin-wrapper {
    --orange: #ff6347;
    --black: #333333;
    --gray-dark: #555555;
    --gray-mid: #777777;
    --gray-light: #999999;
    --white: #ffffff;
    --admin-bg: #f8f9fa;
    --danger: #e74c3c;
    --border-color: rgba(0,0,0,0.05);
    
    --sidebar-width: 280px;
    --topbar-height: 70px;
    --radius-sm: 0.8rem;
    --radius-md: 1.25rem;
    --spacing-sm: 1.2rem;
    --spacing-md: 1.8rem;
    --spacing-lg: 2.5rem;
    
    --shadow-sm: 0 4px 15px rgba(0,0,0,0.05);
    --shadow-md: 0 8px 30px rgba(0,0,0,0.08);
    --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    display: flex;
    min-height: 100vh;
    background: var(--admin-bg);
    font-size: 1.6rem; 
    color: var(--black);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Sidebar Styling */
#sidebar {
    width: var(--sidebar-width);
    background: var(--white);
    color: var(--black);
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    box-shadow: var(--shadow-sm);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    z-index: 1050; /* Higher than topbar */
    transition: var(--transition);
}

.sidebar-header {
    padding: 1.5rem 1rem;
    display: flex;
    justify-content: center;
}

.brand-logo {
    height: 3.2rem;
    width: auto;
    max-width: 100%;
}

.nav-list {
    list-style: none !important;
    padding: 0 var(--spacing-sm) !important;
    margin: 0 !important;
    flex: 1;
}

.nav-item {
    margin-bottom: 0.2rem !important;
    list-style: none !important;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.2rem;
    border-radius: var(--radius-sm);
    color: var(--gray-dark) !important;
    text-decoration: none !important;
    font-size: 1.35rem !important;
    font-weight: 600;
    transition: var(--transition);
}

.nav-link:hover {
    background: rgba(255, 99, 71, 0.08) !important;
    color: var(--orange) !important;
}

.nav-link.active {
    background: var(--orange) !important;
    color: var(--white) !important;
    box-shadow: 0 4px 12px rgba(255, 99, 71, 0.2);
}

.nav-icon {
    width: 2rem;
    height: 2rem;
    filter: brightness(0) opacity(0.5); 
    transition: var(--transition);
}

.nav-link:hover .nav-icon {
    filter: brightness(0) opacity(1);
    transform: scale(1.1);
}

.nav-link.active .nav-icon {
    filter: brightness(0) invert(1) !important;
    opacity: 1 !important;
}

.sidebar-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--black);
    font-size: 2.2rem;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 1060; /* Higher than sidebar for mobile visibility */
}

.sidebar-toggle:hover {
    color: var(--orange);
}

.sidebar-footer {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
}

.logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    background: #fff0f0;
    border: none;
    color: var(--danger);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.logout-btn:hover {
    background: var(--danger);
    color: var(--white);
}

/* Main Content */
#main-content {
    margin-left: var(--sidebar-width);
    width: calc(100% - var(--sidebar-width));
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    transition: var(--transition);
}

.admin-topbar {
    height: var(--topbar-height);
    background: var(--white);
    padding: 0 var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 0;
    z-index: 900;
}

.admin-topbar h1 {
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0;
    color: var(--black);
}



/* Tables */
.table-responsive {
    background: var(--white);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
}

.table thead th {
    background: var(--admin-bg) !important;
    border: none !important;
    padding: 0.8rem 0.6rem !important;
    font-size: 1.1rem !important;
    font-weight: 700 !important;
    color: var(--gray-dark) !important;
}

.table tbody td {
    padding: 0.8rem 0.6rem !important;
    font-size: 1.15rem !important;
    border-bottom: 1px solid #f0f0f0 !important;
    vertical-align: middle !important;
}

.table tbody td:first-child {
    border-left: 4px solid transparent !important;
    transition: border-color var(--transition);
}

.table-active {
    background-color: rgba(255, 99, 71, 0.15) !important;
}

.table-active td:first-child {
    border-left-color: var(--orange) !important;
}

.book-thumbnail {
    height: 4.5rem;
    width: auto;
    border-radius: 0.4rem;
    object-fit: cover;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Skeleton */
.skeleton-loader {
    background: #f6f7f8;
    background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
    background-size: 800px 104px;
    animation: shimmer 1.5s infinite linear;
}
@keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
.skeleton-text { height: 1.2rem; width: 100%; border-radius: 4px; }

/* Header & Profile */
.breadcrumb-nav { display: flex; align-items: center; gap: 0.8rem; }
.breadcrumb-item { color: #888; font-size: 1.4rem; }
.breadcrumb-sep { color: #ccc; }

.admin-profile { display: flex; align-items: center; gap: 1.2rem; cursor: pointer; padding: 0.5rem; border-radius: 1rem; transition: 0.2s; }
.admin-profile:hover { background: #f5f5f5; }
.profile-info { display: flex; flex-direction: column; align-items: flex-end; }
.admin-name { font-size: 1.4rem; font-weight: 700; color: #333; line-height: 1.2; }
.avatar-box { position: relative; }
.admin-avatar { width: 4rem; height: 4rem; border-radius: 1rem; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.online-indicator { position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; background: #2ecc71; border: 2px solid #fff; border-radius: 50%; }

/* Dashboard Welcome */
.dashboard-welcome h2 { font-size: 2.4rem; font-weight: 800; margin-bottom: 0.5rem; }

/* Dashboard Cards */
.card-summary {
    background: var(--white);
    border: none;
    border-radius: 1.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    border: 1px solid rgba(0,0,0,0.02);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-summary:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.06);
}

.card-summary .card-body { padding: 2rem; }

.summary-number {
    font-size: 2.8rem;
    font-weight: 850;
    color: var(--black);
    margin-top: 0.5rem;
}

.summary-label {
    font-size: 1.3rem;
    color: #888;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.icon-wrap {
    width: 4.8rem;
    height: 4.8rem;
    border-radius: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-wrap.text-primary { background: rgba(52, 152, 219, 0.1); }
.icon-wrap.text-success { background: rgba(46, 204, 113, 0.1); }
.icon-wrap.text-warning { background: rgba(241, 196, 15, 0.1); }
.icon-wrap.text-danger { background: rgba(231, 76, 60, 0.1); }

.icon-wrap img { width: 2.4rem; height: 2.4rem; }

.card-footer-mini {
    margin-top: 1.5rem;
    padding-top: 1.2rem;
    border-top: 1px solid #f8f9fa;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.2rem;
}

.trend-text { font-weight: 700; }
.since-text { color: #aaa; }

/* Form Controls */
#main-content .form-control {
    font-size: 1.2rem;
    border: 1px solid #ddd;
    border-radius: 0.6rem;
    padding: 0.6rem 1rem;
}

#main-content .form-control:focus {
    border-color: var(--orange) !important;
    box-shadow: 0 0 0 4px rgba(255, 99, 71, 0.1) !important;
    outline: none !important;
}

/* Loading Bar */
#top-loading-bar {
    position: fixed;
    top: 0; left: 0; width: 0; height: 3px;
    background: var(--orange);
    z-index: 1100;
}
#top-loading-bar.loading { width: 70%; transition: width 0.3s; }
#top-loading-bar.finish { width: 100%; transition: width 0.3s; }
#top-loading-bar.hide { opacity: 0; transition: opacity 0.5s; }

/* Specific column widths for orders table */
.table tbody td:nth-child(1), .table thead th:nth-child(1) { width: 40px; max-width: 40px; }
.table tbody td:nth-child(2), .table thead th:nth-child(2) { width: 50px; max-width: 50px; }
.table tbody td:nth-child(3), .table thead th:nth-child(3) { width: 120px; max-width: 120px; }
.table tbody td:nth-child(4), .table thead th:nth-child(4) { width: 90px; max-width: 90px; text-align: right; }
.table tbody td:nth-child(5), .table thead th:nth-child(5) { width: 150px; max-width: 150px; }
.table tbody td:nth-child(6), .table thead th:nth-child(6) { width: 100px; max-width: 100px; }
.table tbody td:nth-child(7), .table thead th:nth-child(7) { width: 100px; max-width: 100px; }
.table tbody td:nth-child(8), .table thead th:nth-child(8) { width: 70px; max-width: 70px; }
.table tbody td:nth-child(9), .table thead th:nth-child(9) { width: 100px; max-width: 100px; }
.table tbody td:nth-child(10), .table thead th:nth-child(10) { width: 130px; max-width: 130px; }

/* Order status select compact styling */
.order-status-select {
    font-size: 1.1rem !important;
    padding: 0.2rem 0.4rem !important;
    height: auto !important;
}

/* Date Filter Custom Styling */
.date-filter-wrapper {
    position: relative;
    width: 160px;
    height: 42px;
}

.date-input-field {
    opacity: 0;
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    z-index: 2;
    cursor: pointer;
    padding: 0;
    margin: 0;
    border: none;
}

.date-placeholder, .date-text {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 0.6rem;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    font-size: 1.2rem;
    color: #333;
    pointer-events: none;
    z-index: 1;
}

.date-placeholder { color: #999; }

.date-filter-wrapper:hover .date-placeholder,
.date-filter-wrapper:hover .date-text {
    border-color: var(--orange);
}

/* Modals */
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(2px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    padding: 2.5rem;
    border-radius: var(--radius-md);
    max-width: 650px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

/* Sidebar Overlay */
.sidebar-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(2px);
    z-index: 1040;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
}

.sidebar-overlay.active {
    opacity: 1;
    visibility: visible;
}

/* Sticky Section Header */
.section-header-sticky {
    position: sticky;
    top: var(--topbar-height);
    background: var(--admin-bg);
    z-index: 100;
    padding-top: 2rem;
    padding-bottom: 0.5rem;
}

@media (max-width: 991px) {
    #sidebar { 
        transform: translateX(-100%); 
        z-index: 1050;
    }
    #sidebar.active { 
        transform: translateX(0); 
    }
    
    #main-content { 
        margin-left: 0 !important; 
        width: 100% !important; 
    }
    
    .sidebar-toggle { display: flex !important; align-items: center; justify-content: center; }

    .breadcrumb-nav { display: none !important; }
    .profile-info { display: none !important; }
    .admin-topbar { padding: 0 1.5rem !important; height: 60px !important; }
    .admin-wrapper { --topbar-height: 60px !important; }
    #section-title { font-size: 1.6rem !important; font-weight: 800; }
    .avatar-box { border-radius: 0.8rem; }
    .admin-avatar { width: 3.2rem; height: 3.2rem; border-radius: 0.8rem; }
    
    .section-header-sticky {
        top: 60px;
        padding-top: 1.5rem;
        padding-bottom: 1rem;
        background: rgba(248, 249, 250, 0.98);
        backdrop-filter: blur(8px);
        margin: 0 -1.5rem 1.5rem -1.5rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    
    .section-header-sticky h2 { font-size: 1.8rem; margin-bottom: 0.8rem; font-weight: 800; }
    .btn { padding: 0.6rem 1.2rem !important; font-size: 1.2rem !important; }
}
</style>
