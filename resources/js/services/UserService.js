import BaseApiService from './BaseApiService';

class UserService extends BaseApiService {
    constructor() {
        super('/users', (data) => this.transformUser(data));
    }

    /**
     * Chuẩn hóa dữ liệu người dùng
     */
    transformUser(user) {
        if (!user) return null;
        return {
            ...user,
            id: user.id || user.userID,
            // Đảm bảo các trường cơ bản tồn tại
            name: user.name || '',
            email: user.email || '',
            role: (user.role || 'user').toLowerCase()
        };
    }

    async getUserById(userId) {
        return await this.getById(userId);
    }

    async getUserInfo(userId) {
        return await this.getUserById(userId);
    }

    async updateProfile(userId, profileData) {
        return await this.put(userId, profileData);
    }

    async updatePassword(userId, passwordData) {
        return await this.put(userId, passwordData);
    }

    async getUsers() {
        return await this.getAll();
    }
}

export default new UserService();
