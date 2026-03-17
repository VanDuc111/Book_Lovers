import BaseApiService from './BaseApiService';

class CategoryService extends BaseApiService {
    constructor() {
        super('/categories');
    }

    async getCategories() {
        try {
            const categories = await this.getAll();
            // Lưu vào localStorage để hỗ trợ instant loading (MPA)
            localStorage.setItem('cached_categories', JSON.stringify(categories));
            return categories;
        } catch (error) {
            // Nếu lỗi mạng, cố gắng lấy từ cache
            const cached = localStorage.getItem('cached_categories');
            if (cached) return JSON.parse(cached);
            throw error;
        }
    }

    getCachedCategories() {
        const cached = localStorage.getItem('cached_categories');
        return cached ? JSON.parse(cached) : [];
    }

    /**
     * Tác vụ Admin: Lưu thể loại (Thêm/Sửa)
     */
    async saveCategory(data) {
        if (data.categoryID) {
            return await this.put(data.categoryID, data);
        }
        return await this.post('/', data);
    }

    /**
     * Tác vụ Admin: Xóa thể loại
     */
    async deleteCategory(id) {
        return await this.delete(id);
    }
}

export default new CategoryService();
