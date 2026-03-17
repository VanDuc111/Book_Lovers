import BaseApiService from './BaseApiService';

class CartService extends BaseApiService {
    constructor() {
        super('/cart');
    }

    /**
     * Lấy danh sách giỏ hàng theo User ID
     */
    async getCart(userId) {
        try {
            const data = await this.getAll({ userID: userId });
            // Cache lại số lượng để hiện tức thì khi load trang (MPA)
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
    async addToCart(bookID, userId, quantity = 1) {
        return await this.post('/cart', {
            bookID,
            userID: userId,
            quantity
        });
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ
     */
    async updateQuantity(cartItemId, quantity) {
        return await this.put(cartItemId, { quantity });
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    async removeFromCart(cartItemId) {
        return await this.delete(cartItemId);
    }
}

export default new CartService();
