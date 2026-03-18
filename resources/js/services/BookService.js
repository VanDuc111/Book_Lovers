import BaseApiService from './BaseApiService';

class BookService extends BaseApiService {
    constructor() {
        super('/books');
    }

    /**
     * Lấy danh sách sách kèm theo lọc (nếu có)
     */
    async fetchBooks(params = {}) {
        return await this.getAll(params);
    }

    /**
     * Lấy chi tiết một cuốn sách
     */
    async getBookDetails(id) {
        return await this.getById(id);
    }

    /**
     * Lấy các sách liên quan dựa trên thể loại
     */
    async getRelatedBooks(categoryName, currentBookId) {
        // Lấy sách cùng thể loại trực tiếp từ server với tính năng random và limit
        const related = await this.getAll({ 
            category: categoryName, 
            limit: 9, 
            random: true 
        });
        return related.filter(b => b.id != currentBookId).slice(0, 8);
    }

    /**
     * Tác vụ Admin: Lưu sách (Thêm/Sửa)
     * Sử dụng FormData để hỗ trợ upload ảnh
     */
    async saveBook(formData) {
        const bookId = formData.get('id');
        if (bookId) {
            // Laravel yêu cầu _method=PUT khi gửi FormData qua POST để giả lập PUT
            formData.append('_method', 'PUT');
            return await this.postFormData(`/${bookId}`, formData);
        }
        return await this.postFormData('/', formData);
    }

    /**
     * Tác vụ Admin: Xóa sách
     */
    async deleteBook(id) {
        return await this.delete(id);
    }
}

export default new BookService();
