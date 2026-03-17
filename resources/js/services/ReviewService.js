import BaseApiService from './BaseApiService';

class ReviewService extends BaseApiService {
    constructor() {
        super('/reviews');
    }

    /**
     * Lấy tóm tắt đánh giá (avg_rating, review_count, v.v.)
     */
    async getReviewSummary(bookId) {
        const res = await this.get('', { summary: 1, bookID: bookId });
        return (Array.isArray(res) && res.length > 0) ? res[0] : null;
    }

    /**
     * Lấy đánh giá của một cuốn sách
     */
    async getBookReviews(bookId) {
        return await this.get('', { bookID: bookId });
    }

    /**
     * Gửi đánh giá mới
     */
    async submitReview(reviewData) {
        return await this.post('', reviewData);
    }

    /**
     * Xóa đánh giá (Admin)
     */
    async deleteReview(reviewId) {
        return await this.delete(reviewId);
    }
}

export default new ReviewService();
