import BaseApiService from './BaseApiService';

class BookService extends BaseApiService {
    constructor() {
        super('/books', (data) => this.transformBook(data));
    }

    /**
     * Chuẩn hóa dữ liệu sách từ API
     */
    transformBook(book) {
        if (!book) return null;
        return {
            ...book,
            id: book.id || book.bookID,
            price: parseFloat(book.price || book.bookPrice || 0),
            category_id: book.category_id || book.categoryID,
            category_name: book.category?.name || book.categoryName,
            // Đảm bảo các trường khác tồn tại
            title: book.title || '',
            author: book.author || '',
            image: book.image || null,
            stock: parseInt(book.stock || 0)
        };
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
        const related = await this.getAll({ 
            category: categoryName, 
            limit: 9, 
            random: true 
        });
        // Lọc bỏ chính nó và giới hạn 8 cuốn
        return Array.isArray(related) ? related.filter(b => b.id != currentBookId).slice(0, 8) : [];
    }

    /**
     * Tác vụ Admin: Lưu sách (Thêm/Sửa)
     */
    async saveBook(formData) {
        const bookId = formData.get('id');
        if (bookId) {
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
