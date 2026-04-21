function renderLoginPage(container) {
    container.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-slate-950 p-6">
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-sky-500/20 rounded-full blur-3xl"></div>
                <div class="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-400/15 rounded-full blur-3xl"></div>
                <div class="absolute bottom-0 left-1/4 w-1/2 h-1/3 bg-emerald-400/10 rounded-full blur-3xl"></div>
            </div>

            <div class="relative z-10 w-full max-w-md">
                <div class="card-surface rounded-[1.75rem] p-8 bg-white/95">
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-700 text-white flex items-center justify-center text-2xl">
                            AD
                        </div>
                        <h1 class="text-3xl font-bold text-slate-900">Portal Corporativo</h1>
                        <p class="text-slate-500 mt-2">Acceso centralizado para notas, tareas y reportes.</p>
                    </div>

                    <form id="login-form" class="form-stack">
                        <div>
                            <label for="username" class="field-label">Usuario de dominio</label>
                            <input id="username" class="field-input" type="text" placeholder="usuario@dominio.local" required>
                        </div>

                        <div>
                            <label for="password" class="field-label">Contrasena</label>
                            <input id="password" class="field-input" type="password" placeholder="Ingrese su clave" required>
                        </div>

                        <div id="login-error" class="feedback feedback-error hidden"></div>

                        <button id="login-button" class="btn btn-primary w-full" type="submit">
                            Iniciar sesion
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;

    const form = container.querySelector('#login-form');
    const button = container.querySelector('#login-button');
    const errorBox = container.querySelector('#login-error');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = container.querySelector('#username').value.trim();
        const password = container.querySelector('#password').value;

        errorBox.classList.add('hidden');
        button.disabled = true;
        button.innerHTML = '<span class="inline-flex items-center gap-2"><span class="spinner !w-4 !h-4"></span> Autenticando...</span>';

        try {
            await window.authManager.login(username, password);
            window.location.hash = '#/dashboard';
        } catch (error) {
            errorBox.textContent = error.message || 'No se pudo iniciar sesion.';
            errorBox.classList.remove('hidden');
        } finally {
            button.disabled = false;
            button.textContent = 'Iniciar sesion';
        }
    });
}

window.renderLoginPage = renderLoginPage;
