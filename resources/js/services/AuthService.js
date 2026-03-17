import BaseApiService from './BaseApiService';

class AuthService extends BaseApiService {
    constructor() {
        // Base route cho auth là trống vì endpoint là /api/login, /api/register
        super('');
    }

    async login(credentials) {
        try {
            const data = await this.api.post('/login', credentials);
            if (data.user) {
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
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn() {
        return !!this.getCurrentUser();
    }
}

export default new AuthService();
