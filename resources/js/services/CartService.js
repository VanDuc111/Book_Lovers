import BaseApiService from './BaseApiService';

class CartService extends BaseApiService {
    constructor() {
        super('/cart', (data) => this.transformCartItem(data));
    }

    /**
     * Chuẩn hóa dữ liệu mục trong giỏ hàng
     */
    transformCartItem(item) {
        if (!item) return null;
        return {
            ...item,
            id: item.id || item.cartItemID,
            book_id: item.book_id || item.bookID,
            user_id: item.user_id || item.userID,
            price: parseFloat(item.price || item.bookPrice || 0),
            quantity: parseInt(item.quantity || 1)
        };
    }

    /**
     * Lấy danh sách giỏ hàng
     */
    async getCart(userId) {
        try {
            const data = await this.getAll({ user_id: userId });
            // Cache lại trạng thái đã transform
            localStorage.setItem(`cart_cache_${userId}`, JSON.stringify(data));
            return data;
        } catch (error) {
            const cached = localStorage.getItem(`cart_cache_${userId}`);
            if (cached) return JSON.parse(cached);
            throw error;
        }
    }

    getCachedCart(userId) {
        if (!userId) return [];
        const cached = localStorage.getItem(`cart_cache_${userId}`);
        return cached ? JSON.parse(cached) : [];
    }

    /**
     * Thêm sản phẩm vào giỏ
     */
    async addToCart(bookId, userId, quantity = 1) {
        // Gọi thẳng checkout logic hoặc cart logic tùy API route
        return await this.post('/', {
            book_id: bookId,
            user_id: userId,
            quantity
        });
    }

    /**
     * Cập nhật số lượng
     */
    async updateQuantity(cartItemId, quantity) {
        return await this.put(cartItemId, { quantity });
    }

    /**
     * Xóa sản phẩm
     */
    async removeFromCart(cartItemId) {
        return await this.delete(cartItemId);
    }
}

export default new CartService();
