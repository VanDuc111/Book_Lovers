/**
 * App Messaging Constants
 * Centralized source for all Toast/Alert messages to ensure consistency and maintainability.
 */

export const MSG = {
    // Auth & User
    AUTH: {
        REGISTER_SUCCESS: "Đăng ký thành công! Đang chuyển hướng...",
        LOGIN_SUCCESS: "Đăng nhập thành công!",
        LOGOUT_SUCCESS: "Đăng xuất thành công!",
        PASSWORD_MIN_LENGTH: "Mật khẩu phải có ít nhất 8 ký tự.",
        PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp.",
        PASSWORD_UPDATE_SUCCESS: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
        EMAIL_INVALID: "Email không đúng định dạng chuẩn (Ví dụ: ten@example.com).",
        REQUIRED_NAME: "Vui lòng nhập tên người dùng.",
        REQUIRED_CURRENT_PASS: "Vui lòng nhập mật khẩu hiện tại.",
        REQUIRED_NEW_PASS: "Vui lòng nhập mật khẩu mới.",
        PROFILE_UPDATE_SUCCESS: "Cập nhật hồ sơ thành công!",
        PHONE_INVALID: "Số điện thoại không đúng định dạng."
    },

    // Cart & Checkout
    CART: {
        ADD_SUCCESS: "Đã thêm sản phẩm vào giỏ hàng!",
        REMOVE_SUCCESS: "Đã xóa sản phẩm khỏi giỏ hàng.",
        UPDATE_QTY_ERROR: "Không thể cập nhật số lượng. Vui lòng thử lại.",
        STOCK_WARNING: (stock) => `Chỉ còn ${stock} sản phẩm trong kho.`,
        EMPTY_FOR_CHECKOUT: "Vui lòng chọn sản phẩm để thanh toán."
    },

    // Reviews
    REVIEW: {
        SUBMIT_SUCCESS: "Gửi đánh giá thành công!",
        SUBMIT_ERROR: "Lỗi gửi đánh giá. Vui lòng thử lại.",
        RATING_REQUIRED: "Vui lòng chọn số sao đánh giá.",
        COMMENT_REQUIRED: "Vui lòng nhập nhận xét của bạn."
    },

    // Global Errors
    ERROR: {
        GENERAL: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        NOT_FOUND: "Không tìm thấy dữ liệu yêu cầu.",
        UNAUTHORIZED: "Bạn cần đăng nhập để thực hiện thao tác này."
    }
};

export default MSG;
