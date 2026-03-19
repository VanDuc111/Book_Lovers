import BaseApiService from './BaseApiService';

class ReviewService extends BaseApiService {
    constructor() {
        super('/reviews', (data) => this.transformReview(data));
    }

    /**
     * Chuẩn hóa dữ liệu đánh giá
     */
    transformReview(review) {
        if (!review) return null;
        // Nếu là object tóm tắt (summary) thì không transform sâu
        if (review.avg_rating !== undefined) return review;
        
        return {
            ...review,
            id: review.id || review.reviewID,
            book_id: review.book_id || review.bookID,
            user_id: review.user_id || review.userID,
            rating: parseInt(review.rating || 5),
            comment: review.comment || '',
            user_name: review.user_name || review.userName || 'Ẩn danh',
            book_title: review.book_title || review.bookTitle || '',
            book_image: review.book_image || review.bookImage || null,
            created_at: review.created_at || review.review_date || review.reviewDate
        };
    }

    /**
     * Lấy tóm tắt đánh giá
     */
    async getReviewSummary(bookId) {
        const res = await this.get('', { summary: 1, book_id: bookId });
        return (Array.isArray(res) && res.length > 0) ? res[0] : null;
    }

    /**
     * Lấy đánh giá của một cuốn sách
     */
    async getBookReviews(bookId) {
        return await this.get('', { book_id: bookId });
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
