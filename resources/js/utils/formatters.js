/**
 * =====================================================================
 *   Utility Functions — formatters.js
 *   Các hàm format dùng chung cho toàn bộ ứng dụng.
 *   Import: import { formatCurrency, formatDate, ... } from '@/utils/formatters';
 * =====================================================================
 */

/**
 * Format số tiền sang dạng VNĐ
 * @param {number} value - Giá trị cần format
 * @returns {string} - Ví dụ: "150.000 ₫"
 */
export const formatCurrency = (value) => {
    if (!value && value !== 0) return '0 ₫';
    return Number(value).toLocaleString('vi-VN') + ' ₫';
};

/**
 * Format số tiền sang Intl (có ký hiệu ₫ phía trước)
 * @param {number} value
 * @returns {string} - Ví dụ: "150.000 ₫"
 */
export const formatCurrencyIntl = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value || 0);
};

/**
 * Format số tiền không có ký hiệu (dùng cho Admin)
 * @param {number} value
 * @returns {string} - Ví dụ: "150.000"
 */
export const formatNumber = (value) => {
    return Math.round(value || 0).toLocaleString('vi-VN');
};

/**
 * Format ngày giờ đầy đủ: dd/MM/yyyy HH:mm
 * @param {string} dateString
 * @returns {string} - Ví dụ: "14/03/2026 08:07"
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Format ngày ngắn gọn: dd/MM/yyyy (dùng locale vi-VN)
 * @param {string} dateString
 * @returns {string}
 */
export const formatDateShort = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

/**
 * Format ngày dạng tùy chọn (dùng cho reviews, hiển thị)
 * @param {string} dateString
 * @returns {string} - Ví dụ: "14 thg 3, 2026"
 */
export const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};
