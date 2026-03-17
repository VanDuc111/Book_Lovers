<template>
  <div class="checkout-container">
    <!-- Skeleton Loading State -->
    <div v-if="loading" class="checkout-wrapper">
      <div class="checkout-form-section">
        <div class="checkout-header">
          <div class="skeleton-loader mb-2" style="width: 200px; height: 35px;"></div>
          <div class="skeleton-loader" style="width: 300px; height: 20px;"></div>
        </div>
        <!-- Form Skeleton -->
        <div class="p-4 bg-white rounded shadow-sm mb-4">
          <div v-for="i in 4" :key="i" class="mb-4">
            <div class="skeleton-loader mb-2" style="width: 120px; height: 20px;"></div>
            <div class="skeleton-loader" style="width: 100%; height: 45px; border-radius: 8px;"></div>
          </div>
        </div>
        <!-- Payment Methods Skeleton -->
        <div class="p-4 bg-white rounded shadow-sm">
          <div class="skeleton-loader mb-3" style="width: 150px; height: 24px;"></div>
          <div v-for="i in 3" :key="i" class="d-flex align-items-center mb-3 p-3 border rounded">
            <div class="skeleton-loader me-3" style="width: 20px; height: 20px; border-radius: 50%;"></div>
            <div class="skeleton-loader" style="width: 200px; height: 20px;"></div>
          </div>
        </div>
      </div>
      <div class="checkout-summary-section">
        <div class="p-4 bg-white rounded shadow-sm border">
          <div class="skeleton-loader mb-4" style="width: 150px; height: 24px;"></div>
          <div v-for="i in 3" :key="i" class="d-flex justify-content-between mb-3 pb-3 border-bottom">
            <div class="skeleton-loader" style="width: 150px; height: 18px;"></div>
            <div class="skeleton-loader" style="width: 80px; height: 18px;"></div>
          </div>
          <div class="mt-4 pt-4">
            <div class="d-flex justify-content-between mb-4">
              <div class="skeleton-loader" style="width: 120px; height: 24px;"></div>
              <div class="skeleton-loader" style="width: 100px; height: 24px;"></div>
            </div>
            <div class="skeleton-loader w-100" style="height: 50px; border-radius: 50px;"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="checkout-wrapper">
      <!-- Left Column: Form -->
      <div class="checkout-form-section">
        <div class="checkout-header">
          <h1>Thanh toán</h1>
          <p class="text-muted">Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng</p>
        </div>

        <shipping-form 
          v-model:form="form"
          :locations="locations"
          :default-address="defaultAddressDisplay"
        />

        <payment-methods 
          v-model="form.payment"
          :methods="paymentMethodsList"
        />
      </div>

      <!-- Right Column: Summary -->
      <div class="checkout-summary-section">
        <checkout-summary 
          :cart-items="cartItems"
          :subtotal="subtotal"
          :shipping-fee="shippingFee"
          :discount="discount"
          :total="total"
          :loading="placing"
          @place-order="handlePlaceOrder"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import ShippingForm from './checkout/ShippingForm.vue';
import PaymentMethods from './checkout/PaymentMethods.vue';
import CheckoutSummary from './checkout/CheckoutSummary.vue';

// Import Services
import OrderService from '@/services/OrderService';
import UserService from '@/services/UserService';
import CartService from '@/services/CartService';
import AuthService from '@/services/AuthService';

const queryClient = useQueryClient();
const userId = ref(null);

const form = ref({
  fullName: '',
  phone: '',
  email: '',
  addressType: 'default',
  province: '',
  district: '',
  ward: '',
  address: '',
  note: '',
  payment: 'cod'
});

// 1. Query User Info
const userQuery = useQuery({
    queryKey: computed(() => ['user-profile', userId.value]),
    queryFn: () => UserService.getUserById(userId.value),
    enabled: computed(() => !!userId.value),
    staleTime: 1000 * 60 * 15,
});

watch(() => userQuery.data.value, (data) => {
    if (data) {
        form.value.fullName = data.name || '';
        form.value.phone = data.phone || '';
        form.value.email = data.email || '';
        if (!data.address) form.value.addressType = 'new';
    }
}, { immediate: true });

// 2. Query Cart Items for Checkout
const urlParams = new URLSearchParams(window.location.search);
const itemIdsStr = urlParams.get('items') || '';
const itemIds = itemIdsStr.split(',');

const cartQuery = useQuery({
    queryKey: computed(() => ['cart', userId.value]),
    queryFn: () => CartService.getCart(userId.value),
    enabled: computed(() => !!userId.value),
});

const cartItems = computed(() => {
    const all = cartQuery.data.value || [];
    return all.filter(i => itemIds.includes(i.cartItemID.toString()));
});

const loading = computed(() => userQuery.isLoading.value || cartQuery.isLoading.value);

const locations = {
    hanoi: {
        name: 'Hà Nội',
        districts: {
            'ba-dinh': { name: 'Ba Đình', wards: ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc', 'Cống Vị'] },
            'hoan-kiem': { name: 'Hoàn Kiếm', wards: ['Phúc Tân', 'Đồng Xuân', 'Hàng Mã', 'Hàng Buồm'] },
            'dong-da': { name: 'Đống Đa', wards: ['Cát Linh', 'Văn Miếu', 'Quốc Tử Giám', 'Láng Thượng'] }
        }
    },
    hcm: {
        name: 'TP. Hồ Chí Minh',
        districts: {
            'q1': { name: 'Quận 1', wards: ['Bến Nghé', 'Bến Thành', 'Nguyễn Thái Bình', 'Phạm Ngũ Lão'] },
            'q3': { name: 'Quận 3', wards: ['Võ Thị Sáu', 'Phường 1', 'Phường 2', 'Phường 3'] },
            'thu-duc': { name: 'Thủ Đức', wards: ['Linh Xuân', 'Bình Chiểu', 'Linh Trung', 'Tam Bình'] }
        }
    }
};

const paymentMethodsList = [
  { id: 'cod', title: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi nhận hàng', icon: 'fas fa-money-bill-wave' },
];

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + (item.bookPrice * item.quantity), 0));
const shippingFee = ref(0);
const discount = ref(0);
const total = computed(() => subtotal.value + shippingFee.value - discount.value);

const defaultAddressDisplay = computed(() => {
    if (userQuery.data.value?.address) return userQuery.data.value.address;
    return 'Chưa có địa chỉ mặc định';
});

// Mutation Place Order
const checkoutMutation = useMutation({
    mutationFn: (data) => OrderService.checkout(data),
    onSuccess: (data) => {
        if (data.success || data.orderID) {
            if (window.showToast) window.showToast('Đặt hàng thành công!', 'success');
            queryClient.invalidateQueries({ queryKey: ['cart', userId.value] });
            setTimeout(() => {
                window.location.href = `/profile?tab=my-orders`;
            }, 1500);
        }
    }
});

const placing = computed(() => checkoutMutation.isPending.value);

const handlePlaceOrder = async () => {
    const userData = userQuery.data.value;
    if (!form.value.fullName || !form.value.phone || !form.value.email) {
        if (window.showToast) window.showToast('Vui lòng điền đủ họ tên, số điện thoại và email', 'warning');
        return;
    }

    if (form.value.email.toLowerCase() !== userData.email.toLowerCase()) {
        if (window.showToast) window.showToast('Email không trùng khớp với tài khoản đăng nhập', 'warning');
        return;
    }

    const phoneRegex = /^(0)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(form.value.phone)) {
        if (window.showToast) window.showToast('Số điện thoại không đúng định dạng (VD: 0912345678)', 'warning');
        return;
    }

    let finalAddress = userData?.address;
    if (form.value.addressType === 'new') {
        if (!form.value.province || !form.value.district || !form.value.ward || !form.value.address) {
            if (window.showToast) window.showToast('Vui lòng điền đầy đủ địa chỉ giao hàng', 'warning');
            return;
        }
        const p = locations[form.value.province].name;
        const d = locations[form.value.province].districts[form.value.district].name;
        finalAddress = `${form.value.address}, ${form.value.ward}, ${d}, ${p}`;
    } else if (!finalAddress) {
        if (window.showToast) window.showToast('Bạn chưa có địa chỉ mặc định, vui lòng chọn Địa chỉ mới', 'warning');
        return;
    }

    // Prepare data
    const orderData = {
        userID: userId.value,
        cartItemIDs: cartItems.value.map(i => i.cartItemID),
        shipping_address: finalAddress,
        payment_method: form.value.payment,
        note: form.value.note,
        receiver_name: form.value.fullName,
        receiver_phone: form.value.phone
    };

    checkoutMutation.mutate(orderData);
};

onMounted(() => {
    userId.value = AuthService.getCurrentUser()?.userID || null;
    if (!userId.value) {
        window.location.href = '/login';
        return;
    }
    if (!itemIdsStr) {
        window.location.href = '/cart';
    }
});
</script>

<style scoped>
.checkout-container {
    min-height: 100vh;
    background: var(--bg-light);
    padding: 3rem 0;
}

.checkout-wrapper {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 3rem;
    align-items: start;
}

.checkout-header { margin-bottom: 3rem; }
.checkout-header h1 { font-size: var(--fs-xl); font-weight: 700; color: var(--black); margin-bottom: 0.5rem; }
.checkout-header .text-muted { font-size: var(--fs-sm); color: var(--muted-color); }

@media (max-width: 992px) {
    .checkout-wrapper { grid-template-columns: 1fr; gap: 2rem; }
}

@media (max-width: 768px) {
    .checkout-container { padding: 2rem 0; }
    .checkout-header h1 { font-size: 2.2rem; }
}
</style>
