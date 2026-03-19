import BaseApiService from './BaseApiService';

class OrderService extends BaseApiService {
    constructor() {
        super('/orders', (data) => this.transformOrder(data));
    }

    /**
     * Chuẩn hóa dữ liệu đơn hàng
     */
    transformOrder(order) {
        if (!order) return null;
        return {
            ...order,
            id: order.id || order.orderID,
            user_id: order.user_id || order.userID,
            status: (order.status || order.order_status || 'pending').toLowerCase(),
            created_at: order.created_at || order.order_date,
            total_amount: parseFloat(order.total_amount || 0),
            // Đảm bảo thông tin người nhận tồn tại
            receiver_name: order.receiver_name || order.receiverName || '',
            receiver_phone: order.receiver_phone || order.receiverPhone || ''
        };
    }

    /**
     * Đặt hàng (Checkout)
     */
    async checkout(orderData) {
        return await this.api.post('/checkout', orderData);
    }

    /**
     * Lấy lịch sử đơn hàng của User
     */
    async getMyOrders(userId) {
        return await this.getAll({ user_id: userId });
    }

    /**
     * Lấy thông tin chi tiết đơn hàng
     */
    async getOrderDetails(orderId) {
        return await this.getById(orderId);
     }
 
    /**
     * Tác vụ Admin: Cập nhật trạng thái đơn hàng
     */
    async updateStatus(id, status) {
        return await this.put(id, { status });
    }

    /**
     * Lấy danh sách sách đã mua
     */
    async getPurchasedBooks(userId, bookId = null) {
        const params = { user_id: userId };
        if (bookId) params.book_id = bookId;
        return await this.get('/purchased-books', params);
    }
}

export default new OrderService();
