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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const items = ref([]);
const selectedIds = ref([]);
const loading = ref(true);
const userId = ref(null);

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

const removeItem = async (id) => {
  if (!confirm("Xóa sản phẩm này khỏi giỏ hàng?")) return;

  try {
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    items.value = items.value.filter(i => i.cartItemID !== id);
    selectedIds.value = selectedIds.value.filter(sid => sid !== id);
    if (window.showToast) window.showToast("Đã xóa sản phẩm", "success");
  } catch (err) {
    console.error('Lỗi xóa sản phẩm:', err);
  }
};

const checkout = () => {
  if (selectedIds.value.length === 0) return;
  window.location.href = `/checkout?items=${selectedIds.value.join(',')}`;
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  userId.value = user ? user.userID : null;
  fetchCart();
});
</script>

<style scoped>
.text-orange {
  color: var(--orange);
}
.cart-item-image {
  max-width: 80px;
  border-radius: var(--radius-sm);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
