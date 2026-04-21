async function renderNotasPage(container) {
    if (!window.authManager.hasPermission('notas')) {
        container.innerHTML = window.app.renderPermissionDenied('No tienes permiso para gestionar notas.');
        return;
    }

    container.innerHTML = `
        <div class="page-section">
            <section class="section-card">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 class="text-3xl font-bold">Notas administrativas</h1>
                        <p class="text-slate-500 mt-2">Crea, revisa y elimina tus notas personales.</p>
                    </div>
                </div>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
                <div class="section-card">
                    <h2 class="text-xl font-bold">Nueva nota</h2>
                    <form id="nota-form" class="form-stack mt-6">
                        <div>
                            <label class="field-label" for="nota-titulo">Titulo</label>
                            <input class="field-input" id="nota-titulo" type="text" maxlength="120" required>
                        </div>
                        <div>
                            <label class="field-label" for="nota-contenido">Contenido</label>
                            <textarea class="field-textarea" id="nota-contenido" placeholder="Describe el apunte administrativo..."></textarea>
                        </div>
                        <div id="nota-feedback" class="hidden"></div>
                        <button class="btn btn-primary" id="nota-submit" type="submit">Guardar nota</button>
                    </form>
                </div>

                <div class="section-card">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 class="text-xl font-bold">Mis notas</h2>
                            <p class="text-slate-500 mt-2">Listado cargado desde <code>/api/notas</code>.</p>
                        </div>
                        <button class="btn btn-secondary" id="notas-refresh" type="button">Actualizar</button>
                    </div>
                    <div id="notas-list" class="mt-6"></div>
                </div>
            </section>
        </div>
    `;

    const listContainer = container.querySelector('#notas-list');
    const form = container.querySelector('#nota-form');
    const feedback = container.querySelector('#nota-feedback');
    const submitButton = container.querySelector('#nota-submit');

    async function loadNotas() {
        listContainer.innerHTML = window.app.renderLoadingState('Cargando notas...');
        try {
            const notas = await window.app.apiFetch('/notas');
            if (!notas.length) {
                listContainer.innerHTML = window.app.renderEmptyState('Todavia no tienes notas creadas.');
                return;
            }

            listContainer.innerHTML = `
                <div class="item-list">
                    ${notas.map((nota) => `
                        <article class="item-card">
                            <div class="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h3 class="text-lg font-bold">${window.app.escapeHtml(nota.titulo)}</h3>
                                    <p class="text-sm text-slate-500 mt-2">${window.app.formatDate(nota.createdAt)}</p>
                                </div>
                                <button class="btn btn-danger nota-delete" data-id="${nota.id}" type="button">Eliminar</button>
                            </div>
                            <p class="text-slate-600 whitespace-pre-wrap">${window.app.escapeHtml(nota.contenido || 'Sin contenido adicional.')}</p>
                        </article>
                    `).join('')}
                </div>
            `;

            listContainer.querySelectorAll('.nota-delete').forEach((button) => {
                button.addEventListener('click', async () => {
                    button.disabled = true;
                    try {
                        await window.app.apiFetch(`/notas/${button.dataset.id}`, { method: 'DELETE' });
                        await loadNotas();
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
        const titulo = container.querySelector('#nota-titulo').value.trim();
        const contenido = container.querySelector('#nota-contenido').value.trim();

        feedback.className = 'hidden';
        submitButton.disabled = true;
        submitButton.textContent = 'Guardando...';

        try {
            await window.app.apiFetch('/notas', {
                method: 'POST',
                body: JSON.stringify({ titulo, contenido })
            });
            form.reset();
            feedback.className = 'feedback feedback-success';
            feedback.textContent = 'Nota creada correctamente.';
            await loadNotas();
        } catch (error) {
            feedback.className = 'feedback feedback-error';
            feedback.textContent = error.message;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar nota';
        }
    });

    container.querySelector('#notas-refresh').addEventListener('click', loadNotas);
    await loadNotas();
}

window.renderNotasPage = renderNotasPage;
