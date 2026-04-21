class AuthManager {
    constructor() {
        this.user = null;
        this.listeners = [];
        this.apiBase = window.APP_CONFIG.apiBase;
    }

    onAuthChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach((callback) => callback(this.user));
    }

    async request(path, options = {}) {
        const response = await fetch(`${this.apiBase}${path}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });

        let data = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            data = await response.json();
        }

        if (!response.ok) {
            throw new Error(data?.message || 'No se pudo completar la solicitud.');
        }

        return data;
    }

    async fetchUser() {
        try {
            this.user = await this.request('/auth/me', { method: 'GET' });
        } catch (error) {
            this.user = null;
        }
        this.notifyListeners();
        return this.user;
    }

    async login(username, password) {
        this.user = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        this.notifyListeners();
        return this.user;
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.user = null;
            this.notifyListeners();
        }
    }

    isAuthenticated() {
        return Boolean(this.user);
    }

    hasPermission(permission) {
        return Boolean(this.user?.isAdmin || this.user?.permissions?.includes(permission));
    }
}

window.authManager = new AuthManager();
