async function renderDashboardPage(container) {
    const user = window.authManager.user;
    container.innerHTML = `
        <div class="page-section">
            <section class="hero-banner">
                <p class="uppercase tracking-[0.3em] text-xs text-sky-100">Infraestructura y redes</p>
                <h1 class="text-3xl md:text-4xl font-bold mt-3">Bienvenido, ${window.app.escapeHtml(user?.displayName || user?.username || 'Usuario')}</h1>
                <p class="mt-3 text-sky-50 max-w-2xl">
                    Panel operativo para centralizar identidad, trabajo interno y permisos del portal.
                </p>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-metrics">
                ${window.app.renderMetricCard('Notas', '--', 'Registros administrativos creados por el usuario.')}
                ${window.app.renderMetricCard('Tareas', '--', 'Tareas activas en el tablero personal.')}
                ${window.app.renderMetricCard('Permisos', user?.isAdmin ? 'Administrador' : (user?.permissions?.length || 0), 'Accesos habilitados en el sistema.')}
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <a href="#/notas" class="module-card">
                    <div class="text-3xl">NT</div>
                    <h2 class="text-xl font-bold mt-4">Notas</h2>
                    <p class="text-slate-500 mt-2">Crea y elimina notas ligadas a tu sesion.</p>
                    <p class="mt-4 text-sm font-semibold ${window.authManager.hasPermission('notas') ? 'text-emerald-700' : 'text-amber-700'}">
                        ${window.authManager.hasPermission('notas') ? 'Acceso disponible' : 'Sin permiso asignado'}
                    </p>
                </a>

                <a href="#/tareas" class="module-card">
                    <div class="text-3xl">TK</div>
                    <h2 class="text-xl font-bold mt-4">Tareas</h2>
                    <p class="text-slate-500 mt-2">Gestiona pendientes y actualiza estados operativos.</p>
                    <p class="mt-4 text-sm font-semibold ${window.authManager.hasPermission('tareas') ? 'text-emerald-700' : 'text-amber-700'}">
                        ${window.authManager.hasPermission('tareas') ? 'Acceso disponible' : 'Sin permiso asignado'}
                    </p>
                </a>

                <a href="#/reportes" class="module-card">
                    <div class="text-3xl">RP</div>
                    <h2 class="text-xl font-bold mt-4">Reportes</h2>
                    <p class="text-slate-500 mt-2">Consulta estadisticas simples de tu actividad.</p>
                    <p class="mt-4 text-sm font-semibold ${window.authManager.hasPermission('reportes') ? 'text-emerald-700' : 'text-amber-700'}">
                        ${window.authManager.hasPermission('reportes') ? 'Acceso disponible' : 'Sin permiso asignado'}
                    </p>
                </a>
            </section>

            <section class="section-card">
                <div class="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h2 class="text-xl font-bold">Estado de acceso</h2>
                        <p class="text-slate-500 mt-2">Resumen rapido de identidad, permisos y rol actual.</p>
                    </div>
                    <span class="status-badge ${user?.isAdmin ? 'status-completada' : 'status-en-progreso'}">
                        ${user?.isAdmin ? 'Administrador' : 'Usuario estandar'}
                    </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div class="metric-card">
                        <p class="text-sm uppercase tracking-wide text-slate-500">Usuario</p>
                        <p class="text-lg font-bold mt-2">${window.app.escapeHtml(user?.username || '-')}</p>
                        <p class="text-sm text-slate-500 mt-2">${window.app.escapeHtml(user?.email || 'Sin correo registrado')}</p>
                    </div>
                    <div class="metric-card">
                        <p class="text-sm uppercase tracking-wide text-slate-500">Permisos efectivos</p>
                        <p class="text-lg font-bold mt-2">${user?.isAdmin ? 'notas, tareas, reportes' : (user?.permissions?.join(', ') || 'Sin permisos')}</p>
                    </div>
                </div>
            </section>
        </div>
    `;

    if (window.authManager.hasPermission('reportes')) {
        try {
            const stats = await window.app.apiFetch('/reportes/stats');
            const totalTareas = (stats.resumenTareas || []).reduce((sum, item) => sum + item.cantidad, 0);
            const metrics = container.querySelector('#dashboard-metrics');
            metrics.innerHTML = [
                window.app.renderMetricCard('Notas', stats.totalNotas ?? 0, 'Registros administrativos creados por el usuario.'),
                window.app.renderMetricCard('Tareas', totalTareas, 'Tareas activas en el tablero personal.'),
                window.app.renderMetricCard('Permisos', user?.isAdmin ? 'Administrador' : (user?.permissions?.length || 0), 'Accesos habilitados en el sistema.')
            ].join('');
        } catch (error) {
            const metrics = container.querySelector('#dashboard-metrics');
            metrics.insertAdjacentHTML('beforeend', `<div class="feedback feedback-error md:col-span-3">${window.app.escapeHtml(error.message)}</div>`);
        }
    }
}

window.renderDashboardPage = renderDashboardPage;
