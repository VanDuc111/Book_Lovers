import BaseApiService from './BaseApiService';

class AuthService extends BaseApiService {
    constructor() {
        super('', (data) => this.transformAuthData(data));
    }

    /**
     * Chuẩn hóa dữ liệu trả về từ login/register
     */
    transformAuthData(data) {
        if (!data) return null;
        
        // Nếu response có chứa user object (thường là login/register thành công)
        if (data.user) {
            data.user = {
                ...data.user,
                id: data.user.id || data.user.userID,
                role: (data.user.role || 'user').toLowerCase()
            };
        }
        return data;
    }

    async login(credentials) {
        try {
            const data = await this.api.post('/login', credentials);
            if (data.user) {
                // Lưu user đã được transform vào localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        return await this.api.post('/register', userData);
    }

    logout() {
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        if (!user) return null;
        try {
            const parsed = JSON.parse(user);
            // Một lớp bảo vệ nữa: Đảm bảo có cả id
            if (parsed && !parsed.id && parsed.userID) parsed.id = parsed.userID;
            return parsed;
        } catch (e) {
            return null;
        }
    }

    isLoggedIn() {
        return !!this.getCurrentUser();
    }
}

export default new AuthService();
