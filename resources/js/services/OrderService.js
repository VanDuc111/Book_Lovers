import BaseApiService from './BaseApiService';

class OrderService extends BaseApiService {
    constructor() {
        super('/orders');
    }

    /**
     * Đặt hàng (Checkout)
     */
    async checkout(orderData) {
        // Endpoint đặc biệt /api/checkout trong routes/api.php
        return await this.api.post('/checkout', orderData);
    }

    /**
     * Lấy lịch sử đơn hàng của User
     */
    async getMyOrders(userId) {
        return await this.getAll({ userID: userId });
    }

    /**
     * Lấy thông tin chi tiết đơn hàng (Dành cho Admin hoặc User xem chi tiết)
     */
    async getOrderDetails(orderId) {
        return await this.getById(orderId);
     }
 
    /**
     * Tác vụ Admin: Cập nhật trạng thái đơn hàng
     */
    async updateStatus(id, status) {
        return await this.put(`${id}`, { orderID: id, order_status: status });
    }

    /**
     * Lấy danh sách sách đã mua (cho Profile/Review)
     */
    async getPurchasedBooks(userId, bookId = null) {
        const params = { userID: userId };
        if (bookId) params.bookID = bookId;
        return await this.get('/purchased-books', params);
    }
}

export default new OrderService();
