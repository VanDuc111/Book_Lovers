<template>
  <div class="password-field-container">
    <label v-if="label" :for="id" class="form-label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    <div class="password-wrapper">
      <input 
        :type="isVisible ? 'text' : 'password'" 
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="form-control custom-input"
        :placeholder="placeholder"
        :required="required"
      >
      <div class="toggle-password" @click="toggleVisibility" title="Hiển thị/Ẩn mật khẩu">
        <img 
          :src="isVisible ? '/assets/icons/eye-slash-svgrepo-com.svg' : '/assets/icons/eye.svg'" 
          class="eye-icon"
          :alt="isVisible ? 'Ẩn' : 'Hiện'"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  required: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: () => 'pass-' + Math.random().toString(36).substr(2, 9)
  }
});

defineEmits(['update:modelValue']);

const isVisible = ref(false);
const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};
</script>

<style scoped>
.password-field-container {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.8rem;
  font-size: var(--fs-sm);
  color: var(--black);
  font-weight: 500;
  text-align: left;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.custom-input {
  width: 100% !important;
  padding: 1.2rem !important;
  padding-right: 4.5rem !important;
  border: var(--border) !important;
  border-radius: var(--radius-sm) !important;
  font-size: var(--fs-base) !important;
  color: var(--black) !important;
  transition: var(--transition) !important;
  background: var(--white) !important;
}

.custom-input:focus {
  border-color: var(--orange) !important;
  box-shadow: var(--focus-shadow) !important;
  outline: none !important;
}

/* Hide native Eye icon in Edge/IE */
.custom-input::-ms-reveal,
.custom-input::-ms-clear {
  display: none;
}

/* Hide native reveal button in newer browsers if any */
.custom-input::-webkit-contacts-auto-fill-button,
.custom-input::-webkit-credentials-auto-fill-button {
  visibility: hidden;
  display: none !important;
  pointer-events: none;
  position: absolute;
  right: 0;
}

.toggle-password {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--light-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transition: var(--transition);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
}

.eye-icon {
  width: 2.2rem;
  height: 2.2rem;
  opacity: 0.6;
  transition: var(--transition);
}

.toggle-password:hover .eye-icon {
  opacity: 1;
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(341deg) brightness(102%) contrast(101%);
}

.toggle-password:hover {
  color: var(--orange);
  background: rgba(0, 0, 0, 0.03);
}

.required {
  color: var(--error);
  font-weight: bold;
  margin-left: 2px;
}
</style>
