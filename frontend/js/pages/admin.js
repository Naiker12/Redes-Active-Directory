async function renderAdminPage(container) {
    if (!window.authManager.user?.isAdmin) {
        window.location.hash = '#/dashboard';
        return;
    }

    container.innerHTML = `
        <div class="page-section">
            <section class="section-card">
                <h1 class="text-3xl font-bold">Administracion de permisos</h1>
                <p class="text-slate-500 mt-2">Asigna o revoca accesos modulares por usuario.</p>
            </section>

            <section class="grid grid-cols-1 xl:grid-cols-[0.9fr_1.4fr] gap-6">
                <div class="section-card">
                    <h2 class="text-xl font-bold">Asignar permiso</h2>
                    <form id="admin-form" class="form-stack mt-6">
                        <div>
                            <label class="field-label" for="admin-username">Usuario</label>
                            <input class="field-input" id="admin-username" type="text" placeholder="usuarioad" required>
                        </div>
                        <div>
                            <label class="field-label" for="admin-permiso">Permiso</label>
                            <select class="field-select" id="admin-permiso">
                                <option value="notas">notas</option>
                                <option value="tareas">tareas</option>
                                <option value="reportes">reportes</option>
                            </select>
                        </div>
                        <div id="admin-feedback" class="hidden"></div>
                        <button class="btn btn-primary" id="admin-submit" type="submit">Asignar permiso</button>
                    </form>
                </div>

                <div class="section-card">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 class="text-xl font-bold">Permisos actuales</h2>
                            <p class="text-slate-500 mt-2">Vista de <code>/api/admin/permisos</code>.</p>
                        </div>
                        <button class="btn btn-secondary" id="admin-refresh" type="button">Actualizar</button>
                    </div>
                    <div id="admin-table" class="mt-6"></div>
                </div>
            </section>
        </div>
    `;

    const form = container.querySelector('#admin-form');
    const feedback = container.querySelector('#admin-feedback');
    const submitButton = container.querySelector('#admin-submit');
    const tableContainer = container.querySelector('#admin-table');

    async function loadPermisos() {
        tableContainer.innerHTML = window.app.renderLoadingState('Cargando permisos...');
        try {
            const permisos = await window.app.apiFetch('/admin/permisos');
            if (!permisos.length) {
                tableContainer.innerHTML = window.app.renderEmptyState('No hay permisos especiales asignados todavia.');
                return;
            }

            tableContainer.innerHTML = `
                <div class="table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Permiso</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${permisos.map((item) => `
                                <tr>
                                    <td>${window.app.escapeHtml(item.username)}</td>
                                    <td>${window.app.escapeHtml(item.permiso)}</td>
                                    <td>
                                        <button class="btn btn-danger admin-delete" data-username="${window.app.escapeHtml(item.username)}" data-permiso="${window.app.escapeHtml(item.permiso)}" type="button">
                                            Revocar
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;

            tableContainer.querySelectorAll('.admin-delete').forEach((button) => {
                button.addEventListener('click', async () => {
                    button.disabled = true;
                    try {
                        await window.app.apiFetch(`/admin/permisos/${encodeURIComponent(button.dataset.username)}/${encodeURIComponent(button.dataset.permiso)}`, {
                            method: 'DELETE'
                        });
                        await loadPermisos();
                    } catch (error) {
                        button.disabled = false;
                        alert(error.message);
                    }
                });
            });
        } catch (error) {
            tableContainer.innerHTML = `<div class="feedback feedback-error">${window.app.escapeHtml(error.message)}</div>`;
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = container.querySelector('#admin-username').value.trim();
        const permiso = container.querySelector('#admin-permiso').value;

        feedback.className = 'hidden';
        submitButton.disabled = true;
        submitButton.textContent = 'Asignando...';

        try {
            await window.app.apiFetch('/admin/permisos', {
                method: 'POST',
                body: JSON.stringify({ username, permiso })
            });
            form.reset();
            container.querySelector('#admin-permiso').value = 'notas';
            feedback.className = 'feedback feedback-success';
            feedback.textContent = 'Permiso procesado correctamente.';
            await loadPermisos();
        } catch (error) {
            feedback.className = 'feedback feedback-error';
            feedback.textContent = error.message;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Asignar permiso';
        }
    });

    container.querySelector('#admin-refresh').addEventListener('click', loadPermisos);
    await loadPermisos();
}

window.renderAdminPage = renderAdminPage;
