<template>
    <div class="checkout-card">
        <div class="card-header">
            <i class="fas fa-map-marker-alt"></i>
            <h3>Địa chỉ giao hàng</h3>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label for="fullName">Họ và tên <span class="required">*</span></label>
                <input type="text" :value="form.fullName" @input="$emit('update:form', { ...form, fullName: $event.target.value })" class="form-control" placeholder="Nguyễn Văn A">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="phone">Số điện thoại <span class="required">*</span></label>
                    <input type="tel" :value="form.phone" @input="$emit('update:form', { ...form, phone: $event.target.value })" class="form-control" placeholder="0912345678">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" :value="form.email" @input="$emit('update:form', { ...form, email: $event.target.value })" class="form-control" placeholder="example@email.com">
                </div>
            </div>

            <div class="form-group">
                <label>Chọn địa chỉ giao hàng <span class="required">*</span></label>
                <div class="address-options">
                    <label class="address-option">
                        <input type="radio" :checked="form.addressType === 'default'" @change="$emit('update:form', { ...form, addressType: 'default' })" value="default">
                        <div class="address-option-content">
                            <div class="address-option-title">Địa chỉ mặc định</div>
                            <div class="address-option-desc">{{ defaultAddress || 'Chưa có địa chỉ mặc định' }}</div>
                        </div>
                    </label>
                    <label class="address-option">
                        <input type="radio" :checked="form.addressType === 'new'" @change="$emit('update:form', { ...form, addressType: 'new' })" value="new">
                        <div class="address-option-content">
                            <div class="address-option-title">Địa chỉ mới</div>
                            <div class="address-option-desc">Nhập địa chỉ giao hàng mới</div>
                        </div>
                    </label>
                </div>
            </div>

            <div v-if="form.addressType === 'new'" id="newAddressFields">
                <div class="form-group">
                    <label for="province">Tỉnh/Thành phố <span class="required">*</span></label>
                    <select :value="form.province" @change="handleProvinceChange" class="form-control">
                        <option value="">-- Chọn Tỉnh/Thành phố --</option>
                        <option v-for="(p, key) in locations" :key="key" :value="key">{{ p.name }}</option>
                    </select>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="district">Quận/Huyện <span class="required">*</span></label>
                        <select :value="form.district" @change="handleDistrictChange" class="form-control">
                            <option value="">-- Chọn Quận/Huyện --</option>
                            <option v-for="(d, key) in currentDistricts" :key="key" :value="key">{{ d.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="ward">Phường/Xã <span class="required">*</span></label>
                        <select :value="form.ward" @change="$emit('update:form', { ...form, ward: $event.target.value })" class="form-control">
                            <option value="">-- Chọn Phường/Xã --</option>
                            <option v-for="w in currentWards" :key="w" :value="w">{{ w }}</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="address">Địa chỉ cụ thể <span class="required">*</span></label>
                    <input type="text" :value="form.address" @input="$emit('update:form', { ...form, address: $event.target.value })" class="form-control" placeholder="Số nhà, tên đường...">
                </div>
            </div>

            <div class="form-group">
                <label for="note">Ghi chú đơn hàng</label>
                <textarea :value="form.note" @input="$emit('update:form', { ...form, note: $event.target.value })" class="form-control" rows="3" placeholder="Ghi chú thêm (tùy chọn)..."></textarea>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    form: Object,
    locations: Object,
    defaultAddress: String
});

const emit = defineEmits(['update:form']);

const currentDistricts = computed(() => props.form.province ? props.locations[props.form.province].districts : {});
const currentWards = computed(() => (props.form.province && props.form.district) ? props.locations[props.form.province].districts[props.form.district].wards : []);

const handleProvinceChange = (e) => {
    emit('update:form', { ...props.form, province: e.target.value, district: '', ward: '' });
};

const handleDistrictChange = (e) => {
    emit('update:form', { ...props.form, district: e.target.value, ward: '' });
};
</script>

<style scoped>
.checkout-card { background: var(--white); border-radius: var(--radius-lg); box-shadow: var(--shadow-premium); margin-bottom: 2rem; overflow: hidden; }
.checkout-card .card-header { display: flex; align-items: center; gap: 1rem; padding: 2rem; border-bottom: var(--border); background: linear-gradient(135deg, var(--white) 0%, var(--bg-light) 100%); }
.checkout-card .card-header i { font-size: 2rem; color: var(--orange); }
.checkout-card .card-header h3 { font-size: 1.6rem; font-weight: 600; color: var(--black); margin: 0; }
.checkout-card .card-body { padding: 2.5rem; }

.form-group { margin-bottom: 2rem; }
.form-group label { display: block; font-size: 1.4rem; font-weight: 600; color: var(--black); margin-bottom: 0.8rem; }
.form-group .required { color: red; }

.form-control {
    width: 100%;
    padding: 1.2rem 1.5rem;
    font-size: 1.4rem;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    transition: var(--transition);
}
.form-control:focus { outline: none; border-color: var(--orange); box-shadow: var(--focus-shadow); }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

.address-options { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.8rem; }
.address-option { display: flex; align-items: flex-start; gap: 1rem; cursor: pointer; padding: 1.5rem; border: 1px solid #eee; border-radius: 10px; transition: var(--transition); }
.address-option:hover { background: #f9f9f9; }
.address-option input[type="radio"] { margin-top: 0.3rem; width: 18px; height: 18px; cursor: pointer; accent-color: var(--orange); flex-shrink: 0; }
.address-option-content { flex: 1; }
.address-option-title { font-size: 1.4rem; font-weight: 600; color: var(--black); margin-bottom: 0.2rem; }
.address-option-desc { font-size: 1.3rem; color: #6c757d; }

@media (max-width: 768px) {
    .checkout-card .card-header, .checkout-card .card-body { padding: 1.5rem; }
    .form-row { grid-template-columns: 1fr; }
}
</style>
