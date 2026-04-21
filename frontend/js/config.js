window.APP_CONFIG = {
    apiBase: window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : '/api'
};
