import BaseApiService from './BaseApiService';

class CategoryService extends BaseApiService {
    constructor() {
        super('/categories', (data) => this.transformCategory(data));
    }

    /**
     * Chuẩn hóa dữ liệu thể loại
     */
    transformCategory(category) {
        if (!category) return null;
        return {
            ...category,
            id: category.id || category.categoryID,
            name: category.name || category.categoryName || ''
        };
    }

    async getCategories() {
        try {
            const categories = await this.getAll();
            // Cập nhật cache sau khi đã được transform bởi BaseApiService
            localStorage.setItem('cached_categories', JSON.stringify(categories));
            return categories;
        } catch (error) {
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
     * Tác vụ Admin: Lưu thể loại
     */
    async saveCategory(data) {
        if (data.id) {
            return await this.put(data.id, data);
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
