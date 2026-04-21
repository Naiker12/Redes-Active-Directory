async function renderTareasPage(container) {
    if (!window.authManager.hasPermission('tareas')) {
        container.innerHTML = window.app.renderPermissionDenied('No tienes permiso para gestionar tareas.');
        return;
    }

    container.innerHTML = `
        <div class="page-section">
            <section class="section-card">
                <h1 class="text-3xl font-bold">Tablero de tareas</h1>
                <p class="text-slate-500 mt-2">Gestiona tus pendientes y actualiza su estado operativo.</p>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
                <div class="section-card">
                    <h2 class="text-xl font-bold">Nueva tarea</h2>
                    <form id="tarea-form" class="form-stack mt-6">
                        <div>
                            <label class="field-label" for="tarea-titulo">Titulo</label>
                            <input class="field-input" id="tarea-titulo" type="text" maxlength="120" required>
                        </div>
                        <div>
                            <label class="field-label" for="tarea-estado">Estado inicial</label>
                            <select class="field-select" id="tarea-estado">
                                <option value="Pendiente">Pendiente</option>
                                <option value="En progreso">En progreso</option>
                                <option value="Completada">Completada</option>
                            </select>
                        </div>
                        <div id="tarea-feedback" class="hidden"></div>
                        <button class="btn btn-primary" id="tarea-submit" type="submit">Crear tarea</button>
                    </form>
                </div>

                <div class="section-card">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 class="text-xl font-bold">Mis tareas</h2>
                            <p class="text-slate-500 mt-2">Edicion conectada a <code>/api/tareas</code>.</p>
                        </div>
                        <button class="btn btn-secondary" id="tareas-refresh" type="button">Actualizar</button>
                    </div>
                    <div id="tareas-list" class="mt-6"></div>
                </div>
            </section>
        </div>
    `;

    const listContainer = container.querySelector('#tareas-list');
    const form = container.querySelector('#tarea-form');
    const feedback = container.querySelector('#tarea-feedback');
    const submitButton = container.querySelector('#tarea-submit');

    function badgeClass(estado) {
        const normalized = (estado || '').toLowerCase();
        if (normalized.includes('complet')) return 'status-completada';
        if (normalized.includes('progreso')) return 'status-en-progreso';
        return 'status-pendiente';
    }

    async function loadTareas() {
        listContainer.innerHTML = window.app.renderLoadingState('Cargando tareas...');
        try {
            const tareas = await window.app.apiFetch('/tareas');
            if (!tareas.length) {
                listContainer.innerHTML = window.app.renderEmptyState('No hay tareas registradas todavia.');
                return;
            }

            listContainer.innerHTML = `
                <div class="item-list">
                    ${tareas.map((tarea) => `
                        <article class="item-card">
                            <div class="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h3 class="text-lg font-bold">${window.app.escapeHtml(tarea.titulo)}</h3>
                                    <p class="text-sm text-slate-500 mt-2">Creada: ${window.app.formatDate(tarea.createdAt)}</p>
                                </div>
                                <span class="status-badge ${badgeClass(tarea.estado)}">${window.app.escapeHtml(tarea.estado)}</span>
                            </div>
                            <div class="item-actions">
                                <select class="field-select tarea-estado" data-id="${tarea.id}">
                                    <option value="Pendiente" ${tarea.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                    <option value="En progreso" ${tarea.estado === 'En progreso' ? 'selected' : ''}>En progreso</option>
                                    <option value="Completada" ${tarea.estado === 'Completada' ? 'selected' : ''}>Completada</option>
                                </select>
                                <button class="btn btn-success tarea-update" data-id="${tarea.id}" type="button">Actualizar estado</button>
                                <button class="btn btn-danger tarea-delete" data-id="${tarea.id}" type="button">Eliminar</button>
                            </div>
                        </article>
                    `).join('')}
                </div>
            `;

            listContainer.querySelectorAll('.tarea-update').forEach((button) => {
                button.addEventListener('click', async () => {
                    const select = listContainer.querySelector(`.tarea-estado[data-id="${button.dataset.id}"]`);
                    button.disabled = true;
                    try {
                        await window.app.apiFetch(`/tareas/${button.dataset.id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({ estado: select.value })
                        });
                        await loadTareas();
                    } catch (error) {
                        button.disabled = false;
                        alert(error.message);
                    }
                });
            });

            listContainer.querySelectorAll('.tarea-delete').forEach((button) => {
                button.addEventListener('click', async () => {
                    button.disabled = true;
                    try {
                        await window.app.apiFetch(`/tareas/${button.dataset.id}`, { method: 'DELETE' });
                        await loadTareas();
                    } catch (error) {
                        button.disabled = false;
                        alert(error.message);
                    }
                });
            });
        } catch (error) {
            listContainer.innerHTML = `<div class="feedback feedback-error">${window.app.escapeHtml(error.message)}</div>`;
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const titulo = container.querySelector('#tarea-titulo').value.trim();
        const estado = container.querySelector('#tarea-estado').value;

        feedback.className = 'hidden';
        submitButton.disabled = true;
        submitButton.textContent = 'Creando...';

        try {
            await window.app.apiFetch('/tareas', {
                method: 'POST',
                body: JSON.stringify({ titulo, estado })
            });
            form.reset();
            container.querySelector('#tarea-estado').value = 'Pendiente';
            feedback.className = 'feedback feedback-success';
            feedback.textContent = 'Tarea creada correctamente.';
            await loadTareas();
        } catch (error) {
            feedback.className = 'feedback feedback-error';
            feedback.textContent = error.message;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Crear tarea';
        }
    });

    container.querySelector('#tareas-refresh').addEventListener('click', loadTareas);
    await loadTareas();
}

window.renderTareasPage = renderTareasPage;
