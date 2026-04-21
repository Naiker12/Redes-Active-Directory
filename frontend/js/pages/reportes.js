async function renderReportesPage(container) {
    if (!window.authManager.hasPermission('reportes')) {
        container.innerHTML = window.app.renderPermissionDenied('No tienes permiso para consultar reportes.');
        return;
    }

    container.innerHTML = `
        <div class="page-section">
            <section class="section-card">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 class="text-3xl font-bold">Reportes y estadisticas</h1>
                        <p class="text-slate-500 mt-2">Resumen generado desde <code>/api/reportes/stats</code>.</p>
                    </div>
                    <button class="btn btn-secondary" id="reportes-refresh" type="button">Actualizar</button>
                </div>
            </section>

            <section id="reportes-content"></section>
        </div>
    `;

    const content = container.querySelector('#reportes-content');

    async function loadStats() {
        content.innerHTML = window.app.renderLoadingState('Generando estadisticas...');
        try {
            const stats = await window.app.apiFetch('/reportes/stats');
            const resumen = stats.resumenTareas || [];
            content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    ${window.app.renderMetricCard('Total de notas', stats.totalNotas ?? 0, 'Cantidad de notas asociadas al usuario.')}
                    ${window.app.renderMetricCard('Estados registrados', resumen.length, 'Estados distintos encontrados en tus tareas.')}
                    ${window.app.renderMetricCard('Generado', window.app.escapeHtml(window.app.formatDate(stats.generadoEn)), 'Momento del ultimo calculo.')}
                    ${window.app.renderMetricCard('Usuario', window.app.escapeHtml(window.authManager.user?.username || '-'), 'Identidad usada para generar el reporte.')}
                </div>

                <div class="section-card mt-6">
                    <h2 class="text-xl font-bold">Resumen por estado</h2>
                    <div class="mt-6 ${resumen.length ? 'table-wrap' : ''}">
                        ${resumen.length ? `
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Estado</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${resumen.map((item) => `
                                        <tr>
                                            <td>${window.app.escapeHtml(item.estado)}</td>
                                            <td>${item.cantidad}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : window.app.renderEmptyState('Todavia no hay tareas para construir un resumen.')}
                    </div>
                </div>
            `;
        } catch (error) {
            content.innerHTML = `<div class="feedback feedback-error">${window.app.escapeHtml(error.message)}</div>`;
        }
    }

    container.querySelector('#reportes-refresh').addEventListener('click', loadStats);
    await loadStats();
}

window.renderReportesPage = renderReportesPage;
