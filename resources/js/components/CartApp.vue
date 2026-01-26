<template>
  <div class="container cart-container">
    <h1 class="cart-title">Giỏ hàng của bạn</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải giỏ hàng...</p>
    </div>

    <!-- Auth Check -->
    <div v-else-if="!userId" class="text-center py-5">
      <div class="empty-cart-icon mb-3"><i class="fas fa-user-lock fa-3x"></i></div>
      <p style="font-size: 1.6rem;">Vui lòng đăng nhập để xem giỏ hàng.</p>
      <a href="/login" class="btn btn-main mt-3">Đăng nhập ngay</a>
    </div>

    <!-- Empty Cart -->
    <div v-else-if="items.length === 0" class="text-center py-5">
      <div class="empty-cart-icon mb-3"><i class="fas fa-shopping-cart fa-3x" style="opacity: 0.2;"></i></div>
      <p style="font-size: 1.6rem;">Giỏ hàng của bạn đang trống.</p>
      <a href="/book-list" class="btn btn-main mt-3">Tiếp tục mua sắm</a>
    </div>

    <!-- Cart Content -->
    <div v-else class="row g-4">
      <!-- Mobile Select All Bar -->
      <div class="cart-mobile-controls d-lg-none mb-3">
        <div class="p-3 bg-white rounded shadow-sm d-flex align-items-center">
          <input 
            type="checkbox" 
            id="select-all-mobile" 
            class="select-item me-2"
            :checked="isAllSelected"
            @change="toggleSelectAll"
          >
          <label for="select-all-mobile" class="fw-bold mb-0" style="font-size: 1.1rem;">Chọn tất cả</label>
        </div>
      </div>

      <!-- Left Side: List of items -->
      <div class="col-lg-8">
        <div class="cart-table-wrapper shadow-sm">
          <div class="table-responsive">
            <table class="table cart-table">
              <thead>
                <tr>
                  <th style="width: 50px;">
                    <input 
                      type="checkbox" 
                      class="select-item"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                    >
                  </th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.cartItemID">
                  <td>
                    <input 
                      type="checkbox" 
                      class="select-item" 
                      v-model="selectedIds" 
                      :value="item.cartItemID"
                    >
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <a :href="'/book-details?id=' + item.bookID" class="me-3 flex-shrink-0">
                        <img 
                          :src="item.image || 'https://fakeimg.pl/100x150/f0f0f0/909090?text=No+Image'" 
                          class="cart-item-image" 
                          :alt="item.title"
                        >
                      </a>
                      <a :href="'/book-details?id=' + item.bookID" class="cart-item-title">{{ item.title }}</a>
                    </div>
                  </td>
                  <td class="cart-item-price">{{ formatPrice(item.bookPrice) }}</td>
                  <td>
                    <div class="quantity-control px-1">
                      <button 
                        class="quantity-btn minus" 
                        @click="updateQty(item, -1)"
                        :disabled="item.quantity <= 1"
                      >-</button>
                      <input type="number" class="quantity-input" :value="item.quantity" readonly>
                      <button 
                        class="quantity-btn plus" 
                        @click="updateQty(item, 1)"
                      >+</button>
                    </div>
                  </td>
                  <td class="cart-item-subtotal">{{ formatPrice(item.bookPrice * item.quantity) }}</td>
                  <td>
                    <div class="cart-actions">
                      <button class="btn btn-remove btn-sm" @click="removeItem(item.cartItemID)" title="Xóa">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Side: Order Summary -->
      <div class="col-lg-4">
        <div class="cart-summary-card shadow-sm">
          <h3 class="summary-title text-uppercase">Tóm tắt đơn hàng</h3>
          <div class="summary-row">
            <span>Sản phẩm đã chọn:</span>
            <span class="fw-bold">{{ selectedIds.length }}</span>
          </div>
          <div class="summary-row">
            <span>Giao hàng:</span>
            <span class="text-success fw-bold">Miễn phí</span>
          </div>
          <div class="summary-row summary-total border-top pt-3 mt-3">
            <span>Tổng thanh toán:</span>
            <span class="text-orange" style="font-size: 1.8rem;">{{ formatPrice(totalPrice) }}</span>
          </div>
          
          <button 
            class="btn btn-main w-100 py-3 mt-4 btn-checkout-all"
            @click="checkout"
            :disabled="selectedIds.length === 0"
          >
            ĐẶT HÀNG NGAY ({{ selectedIds.length }})
          </button>
          
          <div class="mt-4 p-3 bg-light rounded" style="font-size: 1.2rem; color: #777;">
            <p class="mb-2"><i class="fas fa-shield-alt me-2 text-primary"></i> Đảm bảo thanh toán an toàn</p>
            <p class="mb-0"><i class="fas fa-undo me-2 text-warning"></i> Đổi trả dễ dàng trong 7 ngày</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="confirm-modal-overlay" @click.self="cancelRemove">
      <div class="confirm-modal">
        <div class="modal-icon">
          <i class="fas fa-trash-alt"></i>
        </div>
        <div class="modal-content">
          <h3>Xác nhận xóa?</h3>
          <p>Bạn có chắc chắn muốn xóa cuốn sách này khỏi giỏ hàng?</p>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="cancelRemove">Hủy</button>
          <button class="btn-confirm" @click="confirmRemove">Xác nhận xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const items = ref([]);
const selectedIds = ref([]);
const loading = ref(true);
const userId = ref(null);

// Modal state
const showConfirmModal = ref(false);
const itemToRemove = ref(null);

const isAllSelected = computed(() => {
  return items.value.length > 0 && selectedIds.value.length === items.value.length;
});

const totalPrice = computed(() => {
  return items.value
    .filter(item => selectedIds.value.includes(item.cartItemID))
    .reduce((sum, item) => sum + (item.bookPrice * item.quantity), 0);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(price || 0);
};

const fetchCart = async () => {
  if (!userId.value) return;
  try {
    const res = await fetch(`/api/cart?userID=${userId.value}`);
    items.value = await res.json();
  } catch (err) {
    console.error('Lỗi tải giỏ hàng:', err);
  } finally {
    loading.value = false;
  }
};

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedIds.value = items.value.map(i => i.cartItemID);
  } else {
    selectedIds.value = [];
  }
};

const updateQty = async (item, delta) => {
  const newQty = item.quantity + delta;
  if (newQty < 1) return;
  
  if (delta > 0 && newQty > item.stock) {
    if (window.showToast) window.showToast(`Chỉ còn ${item.stock} sản phẩm trong kho.`, "warning");
    return;
  }

  // Optimistic update
  const originalQty = item.quantity;
  item.quantity = newQty;

  try {
    const res = await fetch(`/api/cart/${item.cartItemID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    });
    const data = await res.json();
    if (data.error) {
       item.quantity = originalQty;
       if (window.showToast) window.showToast(data.error, "danger");
    }
  } catch (err) {
    item.quantity = originalQty;
    console.error('Lỗi cập nhật số lượng:', err);
  }
};

const removeItem = (id) => {
  itemToRemove.value = id;
  showConfirmModal.value = true;
};

const cancelRemove = () => {
  showConfirmModal.value = false;
  itemToRemove.value = null;
};

const confirmRemove = async () => {
  if (!itemToRemove.value) return;
  
  const id = itemToRemove.value;
  try {
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    items.value = items.value.filter(i => i.cartItemID !== id);
    selectedIds.value = selectedIds.value.filter(sid => sid !== id);
    if (window.showToast) window.showToast("Đã xóa sản phẩm", "success");
    window.dispatchEvent(new Event('cart-updated')); // Cập nhật lại badge trên header
  } catch (err) {
    console.error('Lỗi xóa sản phẩm:', err);
  } finally {
    showConfirmModal.value = false;
    itemToRemove.value = null;
  }
};

const checkout = () => {
  if (selectedIds.value.length === 0) return;
  window.location.href = `/checkout?items=${selectedIds.value.join(',')}`;
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  userId.value = user ? user.userID : null;
  
  if (userId.value) {
    fetchCart();
  } else {
    loading.value = false;
  }
});
</script>

<style scoped>
.cart-container {
    padding-top: 2rem;
    padding-bottom: 5rem;
}

.cart-title {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 3rem;
    color: var(--black);
}

.text-orange {
  color: var(--orange);
}

/* Table Design */
.cart-table-wrapper {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-light);
    overflow: hidden;
    border: 1px solid var(--border-color-light);
}

.cart-table thead th {
    background: #f8f9fa;
    padding: 1.5rem 1rem;
    font-size: 1.3rem;
    color: var(--light-color);
    font-weight: 600;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border-color-light);
}

.cart-table tbody td {
    padding: 2rem 1rem;
    vertical-align: middle;
    border-bottom: 1px solid var(--border-color-light);
}

.cart-item-image {
    width: 80px;
    height: 110px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-light);
}

.cart-item-title {
    color: var(--black);
    font-weight: 600;
    font-size: 1.5rem;
    text-decoration: none;
    transition: var(--transition-fast);
}

.cart-item-title:hover {
    color: var(--orange);
}

.cart-item-price {
    font-weight: 600;
    color: var(--light-color);
}

.cart-item-subtotal {
    font-weight: 700;
    color: var(--orange);
    font-size: 1.6rem;
}

/* Custom checkbox */
.select-item {
    width: 22px;
    height: 22px;
    cursor: pointer;
    accent-color: var(--orange);
}

/* Quantity controls */
.quantity-control {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: var(--radius-sm);
    width: fit-content;
    background: #fff;
}

.quantity-btn {
    background: none;
    border: none;
    padding: 5px 12px;
    font-size: 1.8rem;
    color: var(--black);
    cursor: pointer;
}

.quantity-btn:disabled {
    color: #ccc;
    cursor: not-allowed;
}

.quantity-input {
    width: 45px;
    text-align: center;
    border: none;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    font-weight: 700;
    font-size: 1.4rem;
}

/* Summary Card */
.cart-summary-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-premium);
    padding: 2.5rem;
    position: sticky;
    top: 100px;
    border: 1px solid var(--border-color-light);
}

.summary-title {
    font-size: 1.6rem;
    font-weight: 800;
    margin-bottom: 2rem;
    color: var(--black);
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 1rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
}

.summary-total {
    border-top: 1px dashed #ddd;
    padding-top: 1.5rem;
    margin-top: 1.5rem;
    font-weight: 800;
}

.btn-main {
    background: var(--orange);
    color: white;
    border: none;
    font-weight: 700;
    border-radius: var(--radius-md);
    transition: all 0.3s;
}

.btn-main:hover:not(:disabled) {
    background: #e6563e;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 99, 71, 0.3);
}

/* Responsive for Mobile */
@media (max-width: 991px) {
    .cart-container {
        padding-bottom: 120px; /* Space for sticky summary */
    }

    .cart-table-wrapper {
        background: transparent;
        box-shadow: none;
        border: none;
    }

    .cart-table thead {
        display: none;
    }

    .cart-table, .cart-table tbody, .cart-table tr, .cart-table td {
        display: block;
        width: 100%;
    }

    .cart-table tr {
        background: var(--white);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: var(--shadow-light);
        position: relative;
        border: 1px solid var(--border-color-light);
    }

    .cart-table td:nth-child(1) {
        position: absolute;
        top: 1.5rem;
        left: 1.5rem;
        padding: 0;
        z-index: 2;
    }

    .cart-table td:nth-child(2) {
        padding: 0;
        margin-bottom: 1.5rem;
    }

    .cart-table td:nth-child(2) .d-flex {
        padding-left: 3rem;
    }

    .cart-table td:nth-child(3),
    .cart-table td:nth-child(4),
    .cart-table td:nth-child(5) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px dashed #eee;
        font-size: 1.4rem;
    }

    .cart-table td:nth-child(3)::before { content: "Giá gốc:"; font-weight: 600; color: #888; }
    .cart-table td:nth-child(4)::before { content: "Số lượng:"; font-weight: 600; color: #888; }
    .cart-table td:nth-child(5)::before { content: "Thành tiền:"; font-weight: 600; color: #888; }

    .cart-table td:nth-child(6) {
        border: none;
        padding-top: 1rem;
        text-align: center;
    }

    .btn-remove {
        width: 100%;
        padding: 1rem;
        border-radius: 50px;
        background: #fff5f5;
        border: 1px solid #feb2b2;
        color: #f56565;
    }

    /* Sticky Mobile Footer */
    .cart-summary-card {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        top: auto !important;
        border-radius: 20px 20px 0 0 !important;
        padding: 1.5rem 2rem !important;
        margin: 0 !important;
        z-index: 1000 !important;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        /* Force visibility of button which might be hidden by external cart.css */
        display: flex !important; 
    }

    .summary-title, .summary-row:not(.summary-total), .mt-4-dist, .summary-card-extra {
        display: none !important;
    }

    .summary-total {
        border-top: none;
        padding-top: 0;
        margin-top: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .summary-total span:first-child {
        font-size: 1.4rem;
        color: var(--black);
    }

    .btn-checkout-all {
        margin-top: 0 !important;
        padding: 1.2rem !important;
        font-size: 1.4rem !important;
        display: block !important; /* Ensure it is visible */
        visibility: visible !important;
    }
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Utility to fix potential display:none from external css for the checkout button */
.btn-checkout-all {
    display: block !important;
}

.empty-cart-icon {
    font-size: 5rem;
    color: #eee;
    margin-bottom: 2rem;
}

.empty-cart-icon i {
    opacity: 0.5;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.cart-table tr {
    animation: fadeIn 0.4s ease-out backwards;
}

.cart-table tr:nth-child(n) {
    animation-delay: calc(n * 0.05s);
}

/* Custom Confirmation Modal */
.confirm-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeInModal 0.3s ease;
}

.confirm-modal {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
    animation: slideUpModal 0.3s ease;
}

.modal-icon {
    width: 60px;
    height: 60px;
    background: #fff5f5;
    color: #f56565;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    margin: 0 auto 2rem;
}

.modal-content h3 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--black);
}

.modal-content p {
    font-size: 1.4rem;
    color: #666;
    margin-bottom: 2.5rem;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    gap: 1.5rem;
}

.modal-actions button {
    flex: 1;
    padding: 1.2rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1.4rem;
    transition: all 0.2s;
    border: none;
}

.btn-cancel {
    background: #f3f4f6;
    color: #4b5563;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-confirm {
    background: #f56565;
    color: white;
}

.btn-confirm:hover {
    background: #e53e3e;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(245, 101, 101, 0.4);
}

@keyframes fadeInModal {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUpModal {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 576px) {
    .confirm-modal {
        padding: 2.5rem 2rem;
    }
    .modal-actions {
        flex-direction: column-reverse;
    }
}
</style>
