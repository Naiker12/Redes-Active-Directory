const routes = {
    '#/login': { key: 'login', title: 'Acceso', protected: false },
    '#/dashboard': { key: 'dashboard', title: 'Dashboard', protected: true },
    '#/notas': { key: 'notas', title: 'Notas', protected: true },
    '#/tareas': { key: 'tareas', title: 'Tareas', protected: true },
    '#/reportes': { key: 'reportes', title: 'Reportes', protected: true },
    '#/admin': { key: 'admin', title: 'Administracion', protected: true },
    '#/': { key: 'dashboard', title: 'Dashboard', protected: true }
};

function getCurrentRoute() {
    return routes[window.location.hash || '#/'] || routes['#/dashboard'];
}

async function renderPage() {
    const route = getCurrentRoute();
    const app = document.getElementById('app');

    if (route.protected && !window.authManager.isAuthenticated()) {
        window.location.hash = '#/login';
        return;
    }

    if (!route.protected && window.authManager.isAuthenticated()) {
        window.location.hash = '#/dashboard';
        return;
    }

    document.title = `Portal - ${route.title}`;

    if (route.key === 'login') {
        window.renderLoginPage(app);
        return;
    }

    window.app.renderAppLayout(app, route.title);

    const pageContent = app.querySelector('#page-content');
    switch (route.key) {
        case 'dashboard':
            await window.renderDashboardPage(pageContent);
            break;
        case 'notas':
            await window.renderNotasPage(pageContent);
            break;
        case 'tareas':
            await window.renderTareasPage(pageContent);
            break;
        case 'reportes':
            await window.renderReportesPage(pageContent);
            break;
        case 'admin':
            await window.renderAdminPage(pageContent);
            break;
        default:
            await window.renderDashboardPage(pageContent);
            break;
    }
}

function initRouter() {
    window.addEventListener('hashchange', renderPage);
    window.authManager.onAuthChange(() => {
        renderPage();
    });
}

window.initRouter = initRouter;
window.renderRoute = renderPage;
