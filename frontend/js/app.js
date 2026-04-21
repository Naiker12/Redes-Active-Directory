window.app = {
    escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    formatDate(value) {
        if (!value) return 'Sin fecha';
        return new Date(value).toLocaleString('es-CO', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    },

    async apiFetch(path, options = {}) {
        return window.authManager.request(path, options);
    },

    renderLoadingState(message) {
        return `
            <div class="loading-block">
                <div class="spinner"></div>
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    },

    renderEmptyState(message) {
        return `
            <div class="empty-state">
                <div class="text-4xl">--</div>
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    },

    renderPermissionDenied(message) {
        return `
            <div class="section-card feedback feedback-info permission-note">
                <h2 class="text-xl font-bold">Acceso restringido</h2>
                <p class="mt-2">${this.escapeHtml(message)}</p>
            </div>
        `;
    },

    renderMetricCard(title, value, description) {
        return `
            <article class="metric-card">
                <p class="text-sm uppercase tracking-wide text-slate-500">${this.escapeHtml(title)}</p>
                <p class="text-3xl font-bold mt-3">${this.escapeHtml(value)}</p>
                <p class="text-sm text-slate-500 mt-3">${this.escapeHtml(description)}</p>
            </article>
        `;
    },

    renderSidebar(container) {
        const user = window.authManager.user;
        const navItems = [
            { title: 'Dashboard', hash: '#/dashboard', icon: 'DB', show: true },
            { title: 'Notas', hash: '#/notas', icon: 'NT', show: window.authManager.hasPermission('notas') },
            { title: 'Tareas', hash: '#/tareas', icon: 'TK', show: window.authManager.hasPermission('tareas') },
            { title: 'Reportes', hash: '#/reportes', icon: 'RP', show: window.authManager.hasPermission('reportes') },
            { title: 'Administracion', hash: '#/admin', icon: 'AD', show: user?.isAdmin }
        ];

        container.innerHTML = `
            <div class="flex flex-col h-full bg-slate-950 text-white">
                <div class="p-6 border-b border-white/10">
                    <a href="#/dashboard" class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-xl font-bold">AD</div>
                        <div>
                            <div class="font-bold">Portal Redes</div>
                            <div class="text-sm text-slate-400">Gestion interna</div>
                        </div>
                    </a>
                </div>

                <nav class="flex-1 p-4 space-y-2">
                    ${navItems.filter((item) => item.show).map((item) => `
                        <a href="${item.hash}" class="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-200 hover:bg-white/10 transition-colors">
                            <span>${item.icon}</span>
                            <span class="font-medium">${item.title}</span>
                        </a>
                    `).join('')}
                </nav>

                <div class="p-4 border-t border-white/10">
                    <div class="rounded-2xl bg-white/5 p-4">
                        <p class="font-semibold">${this.escapeHtml(user?.displayName || user?.username || 'Usuario')}</p>
                        <p class="text-sm text-slate-400 mt-1">${this.escapeHtml(user?.email || 'Sin correo')}</p>
                        <div class="flex items-center justify-between gap-4 mt-4">
                            <span class="text-xs uppercase tracking-wide text-slate-400">${user?.isAdmin ? 'Administrador' : 'Sesion activa'}</span>
                            <button id="logout-btn" class="btn btn-danger !py-2 !px-3" type="button">Salir</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const logoutButton = container.querySelector('#logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                await window.authManager.logout();
                window.location.hash = '#/login';
            });
        }
    },

    renderAppLayout(container, pageTitle) {
        container.innerHTML = `
            <div class="app-shell flex min-h-screen bg-slate-100">
                <aside id="sidebar" class="hidden md:block w-72 min-h-screen"></aside>
                <div class="flex-1 flex flex-col">
                    <header class="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 px-5 md:px-8 py-4">
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Portal corporativo</p>
                                <h1 id="page-title" class="text-2xl font-bold mt-1">${this.escapeHtml(pageTitle)}</h1>
                            </div>
                            <button id="sidebar-toggle" class="md:hidden btn btn-secondary" type="button">Menu</button>
                        </div>
                    </header>
                    <main class="flex-1 p-5 md:p-8">
                        <div id="page-content"></div>
                    </main>
                </div>
            </div>
        `;

        const sidebar = container.querySelector('#sidebar');
        this.renderSidebar(sidebar);

        const toggleButton = container.querySelector('#sidebar-toggle');
        toggleButton?.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('block');
            sidebar.classList.toggle('fixed');
            sidebar.classList.toggle('z-30');
            sidebar.classList.toggle('inset-y-0');
            sidebar.classList.toggle('left-0');
        });
    }
};

async function initApp() {
    await window.authManager.fetchUser();
    window.initRouter();
    await window.renderRoute();
}

document.addEventListener('DOMContentLoaded', initApp);
