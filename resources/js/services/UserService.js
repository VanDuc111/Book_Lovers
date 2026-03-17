import BaseApiService from './BaseApiService';

class UserService extends BaseApiService {
    constructor() {
        super('/users');
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

    async getUsers() {
        return await this.getAll();
    }
}

export default new UserService();
