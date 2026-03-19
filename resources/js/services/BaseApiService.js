import axios from 'axios';

/**
 * BaseApiService - Lớp cơ sở cho mọi yêu cầu API
 * Sử dụng Axios để tận dụng tính năng Interceptors và tự động xử lý JSON.
 */
class BaseApiService {
    constructor(resource, transformer = null) {
        this.api = axios.create({
            baseURL: '/api',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        this.resource = resource;
        this.transformer = transformer;

        // Thêm CSRF Token từ meta tag (yêu cầu của Laravel)
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            this.api.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
        }

        // Interceptor xử lý response và lỗi tập trung
        this.api.interceptors.response.use(
            (response) => {
                // Axios trả về dữ liệu trong object data
                let data = response.data;
                
                // Áp dụng transformer nếu có
                if (this.transformer && data) {
                    if (Array.isArray(data)) {
                        data = data.map(item => this.transformer(item));
                    } else if (typeof data === 'object') {
                        // Nếu là object đơn lẻ, hoặc kết quả trả về từ Laravel là { data: [...] }
                        if (data.data && Array.isArray(data.data)) {
                            data.data = data.data.map(item => this.transformer(item));
                        } else {
                            data = this.transformer(data);
                        }
                    }
                }
                
                return data;
            },
            (error) => {
                return this.handleError(error);
            }
        );
    }

    handleError(error) {
        let message = 'Đã xảy ra lỗi kết nối.';
        
        if (error.response) {
            message = error.response.data.message || error.response.data.error || message;
        }
        
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

