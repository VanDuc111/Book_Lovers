<template>
  <div class="container cart-container">
    <h1 class="cart-title">Giỏ hàng của bạn</h1>

    <!-- Skeleton Loading State -->
    <div v-if="loading" class="row g-4">
      <div class="col-lg-8">
        <div class="cart-table-wrapper shadow-sm">
          <div class="table-responsive">
            <table class="table cart-table">
              <thead>
                <tr>
                  <th style="width: 50px;"><div class="skeleton-loader" style="width: 20px; height: 20px;"></div></th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 3" :key="i">
                  <td><div class="skeleton-loader" style="width: 20px; height: 20px;"></div></td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="skeleton-loader me-3" style="width: 80px; height: 110px; border-radius: 8px;"></div>
                      <div class="skeleton-loader" style="width: 150px; height: 20px;"></div>
                    </div>
                  </td>
                  <td><div class="skeleton-loader" style="width: 80px; height: 20px;"></div></td>
                  <td><div class="skeleton-loader" style="width: 100px; height: 40px; border-radius: 20px;"></div></td>
                  <td><div class="skeleton-loader" style="width: 80px; height: 20px;"></div></td>
                  <td><div class="skeleton-loader" style="width: 40px; height: 40px; border-radius: 50%; margin: 0 auto;"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="p-4 bg-white rounded shadow-sm border">
          <div class="skeleton-loader mb-4" style="width: 150px; height: 24px;"></div>
          <div class="d-flex justify-content-between mb-3">
            <div class="skeleton-loader" style="width: 100px; height: 18px;"></div>
            <div class="skeleton-loader" style="width: 80px; height: 18px;"></div>
          </div>
          <div class="d-flex justify-content-between mb-4 mt-4 pt-4 border-top">
            <div class="skeleton-loader" style="width: 120px; height: 24px;"></div>
            <div class="skeleton-loader" style="width: 100px; height: 24px;"></div>
          </div>
          <div class="skeleton-loader w-100" style="height: 50px; border-radius: 50px;"></div>
        </div>
      </div>
    </div>

    <!-- Auth Check -->
    <div v-else-if="!userId" class="text-center py-5">
      <div class="empty-cart-icon mb-3"><i class="fas fa-user-lock fa-3x"></i></div>
      <p style="font-size: 1.6rem;">Vui lòng đăng nhập để xem giỏ hàng.</p>
      <base-button variant="primary" size="lg" class="mt-3" @click="goToLogin">Đăng nhập ngay</base-button>
    </div>

    <!-- Empty Cart -->
    <div v-else-if="items.length === 0" class="text-center py-5">
      <div class="empty-cart-icon mb-3"><i class="fas fa-shopping-cart fa-3x" style="opacity: 0.2;"></i></div>
      <p style="font-size: 1.6rem;">Giỏ hàng của bạn đang trống.</p>
      <base-button variant="primary" size="lg" class="mt-3" @click="goToBooks">Tiếp tục mua sắm</base-button>
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
                <cart-item 
                  v-for="item in items" 
                  :key="item.cartItemID"
                  :item="item"
                  :is-selected="selectedIds.includes(item.cartItemID)"
                  @toggle-select="handleToggleSelect"
                  @update-qty="handleUpdateQty"
                  @remove="removeItem"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Side: Order Summary -->
      <div class="col-lg-4">
        <cart-summary 
          :selected-count="selectedIds.length"
          :total-price="totalPrice"
          @checkout="checkout"
        />
      </div>
    </div>

    <!-- Removal Confirmation Modal -->
    <div v-if="showConfirmModal" class="confirm-modal-overlay" @click.self="cancelRemove">
      <div class="confirm-modal">
        <div class="modal-icon">
          <i class="fas fa-trash-alt"></i>
        </div>
        <div class="modal-content">
          <h3>Xác nhận xóa?</h3>
          <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
        </div>
        <div class="modal-actions">
          <base-button variant="secondary" @click="cancelRemove">Hủy</base-button>
          <base-button variant="primary" @click="confirmRemove">Xác nhận xóa</base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import CartItem from './cart/CartItem.vue';
import CartSummary from './cart/CartSummary.vue';

// Import Services
import CartService from '@/services/CartService';
import AuthService from '@/services/AuthService';

const queryClient = useQueryClient();
const selectedIds = ref([]);
const userId = ref(null);

const showConfirmModal = ref(false);
const itemToRemove = ref(null);

// 1. Fetch Giỏ hàng với Vue Query
const cartQuery = useQuery({
    queryKey: computed(() => ['cart', userId.value]),
    queryFn: () => CartService.getCart(userId.value),
    enabled: computed(() => !!userId.value),
    staleTime: 1000 * 60 * 5,
});

const items = computed(() => cartQuery.data.value || []);
const loading = computed(() => cartQuery.isLoading.value);

// Mutations cho việc cập nhật/xóa
const updateQtyMutation = useMutation({
    mutationFn: ({ id, qty }) => CartService.updateQuantity(id, qty),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
});

const removeMutation = useMutation({
    mutationFn: (id) => CartService.removeFromCart(id),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        window.dispatchEvent(new Event('cart-updated'));
    }
});

const isAllSelected = computed(() => {
  return items.value.length > 0 && selectedIds.value.length === items.value.length;
});

const totalPrice = computed(() => {
  return items.value
    .filter(item => selectedIds.value.includes(item.cartItemID))
    .reduce((sum, item) => sum + (item.bookPrice * item.quantity), 0);
});

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedIds.value = items.value.map(i => i.cartItemID);
  } else {
    selectedIds.value = [];
  }
};

const handleToggleSelect = (id) => {
    const index = selectedIds.value.indexOf(id);
    if (index > -1) {
        selectedIds.value.splice(index, 1);
    } else {
        selectedIds.value.push(id);
    }
};

const handleUpdateQty = async ({ item, delta }) => {
  const newQty = item.quantity + delta;
  if (newQty < 1) return;
  
  if (delta > 0 && newQty > item.stock) {
    if (window.showToast) window.showToast(`Chỉ còn ${item.stock} sản phẩm trong kho.`, "warning");
    return;
  }

  updateQtyMutation.mutate({ id: item.cartItemID, qty: newQty });
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
  removeMutation.mutate(itemToRemove.value);
  selectedIds.value = selectedIds.value.filter(sid => sid !== itemToRemove.value);
  showConfirmModal.value = false;
  itemToRemove.value = null;
};

const checkout = () => {
  if (selectedIds.value.length === 0) return;
  window.location.href = `/checkout?items=${selectedIds.value.join(',')}`;
};

const goToLogin = () => window.location.href = '/login';
const goToBooks = () => window.location.href = '/book-list';

onMounted(() => {
  userId.value = AuthService.getCurrentUser()?.userID || null;
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

.select-item {
    width: 22px;
    height: 22px;
    cursor: pointer;
    accent-color: var(--orange);
}

.empty-cart-icon {
    font-size: 5rem;
    color: #eee;
    margin-bottom: 2rem;
}

.confirm-modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.confirm-modal {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-icon {
    width: 60px; height: 60px;
    background: #fff5f5; color: #f56565;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; margin: 0 auto 2rem;
}

.modal-content h3 { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--black); }
.modal-content p { font-size: 1.4rem; color: #666; margin-bottom: 2.5rem; line-height: 1.5; }
.modal-actions { display: flex; gap: 1.5rem; justify-content: center; }

@media (max-width: 991px) {
    .cart-container { padding-bottom: 120px; }
    .cart-table-wrapper { background: transparent; box-shadow: none; border: none; }
    .cart-table thead { display: none; }
}
</style>
