import axios from 'axios';

/**
 * BaseApiService - Lớp cơ sở cho mọi yêu cầu API
 * Sử dụng Axios để tận dụng tính năng Interceptors và tự động xử lý JSON.
 */
class BaseApiService {
    constructor(resource) {
        this.api = axios.create({
            // Đảm bảo baseURL không có dấu gạch chéo ở cuối (trailing slash)
            baseURL: '/api',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        this.resource = resource;

        // Thêm CSRF Token từ meta tag (yêu cầu của Laravel)
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            this.api.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
        }

        // Interceptor xử lý response và lỗi tập trung
        this.api.interceptors.response.use(
            (response) => {
                // Axios trả về dữ liệu trong object data
                return response.data;
            },
            (error) => {
                return this.handleError(error);
            }
        );
    }

    handleError(error) {
        let message = 'Đã xảy ra lỗi kết nối.';
        
        if (error.response) {
            // Server trả về lỗi (4xx, 5xx)
            message = error.response.data.message || error.response.data.error || message;
            
            // Xử lý các mã lỗi đặc biệt
            if (error.response.status === 401) {
                // Ví dụ: Logout nếu hết hạn phiên đăng nhập
                // localStorage.removeItem('user');
                // window.location.href = '/login';
            }
        }
        
        // Hiển thị thông báo lỗi qua Toast nếu có sẵn
        if (window.showToast) {
            window.showToast(message, 'danger');
        }

        return Promise.reject(error);
    }

    // Các phương thức cơ bản (CRUD)
    async getAll(params = {}) {
        return await this.api.get(`${this.resource}`, { params });
    }

    async getById(id) {
        return await this.api.get(`${this.resource}/${id}`);
    }

    async get(endpoint, params = {}) {
        const isAbsolute = endpoint && endpoint.startsWith('/');
        let url = isAbsolute ? endpoint : (endpoint ? `${this.resource}/${endpoint}` : `${this.resource}`);
        // Loại bỏ dấu gạch chéo cuối nếu có để tránh redirect
        if (url.endsWith('/') && url.length > 1) url = url.slice(0, -1);
        return await this.api.get(url, { params });
    }

    async post(endpoint, data) {
        const isAbsolute = endpoint && endpoint.startsWith('/');
        let url = isAbsolute ? endpoint : (endpoint ? `${this.resource}/${endpoint}` : `${this.resource}`);
        if (url.endsWith('/') && url.length > 1) url = url.slice(0, -1);
        return await this.api.post(url, data);
    }

    async postFormData(endpoint, formData) {
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return await this.api.post(`${this.resource}${path === '/' ? '' : path}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    async put(id, data) {
        return await this.api.put(`${this.resource}/${id}`, data);
    }

    async delete(id) {
        return await this.api.delete(`${this.resource}/${id}`);
    }
}

export default BaseApiService;
