import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldCheck, Lock } from "lucide-react"

/**
 * Componente LoginForm basado en el bloque login-04 de shadcn.
 * Se ha analizado y optimizado para incluir integración con AuthContext,
 * traducción completa al español y una estética premium de cristal.
 * 
 * @param {Object} props - Propiedades del componente (onSubmit, loading, error).
 */
export function LoginForm({
  className,
  onSubmit,
  loading,
  error,
  ...props
}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(username, password)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border/40 bg-card/70 backdrop-blur-xl shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Lado Izquierdo: Formulario de Autenticación */}
          <form className="p-8 md:p-12 flex flex-col justify-center" onSubmit={handleSubmit}>
            <FieldGroup className="space-y-6">
              <div className="flex flex-col items-center gap-4 text-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight">Bienvenido</h1>
                  <p className="text-balance text-muted-foreground">
                    Accede al Portal Corporativo de Redes I
                  </p>
                </div>
              </div>
              
              {/* Campo para Usuario Institucional */}
              <Field>
                <FieldLabel htmlFor="username">Usuario de Dominio</FieldLabel>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="usuario@dominio.com" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="h-11 border-border/50 bg-background/40 focus-visible:ring-primary/30"
                />
              </Field>
              
              {/* Campo para Contraseña */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a href="#" className="text-xs font-medium text-primary hover:underline underline-offset-4">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-11 border-border/50 bg-background/40 focus-visible:ring-primary/30"
                  placeholder="••••••••"
                />
              </Field>
              
              {/* Alerta de error en caso de fallo en autenticación */}
              {error && (
                <Alert variant="destructive" className="py-2.5 animate-in slide-in-from-top-1 border-destructive/20 bg-destructive/5 text-destructive">
                  <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {/* Botón de acción principal */}
              <Button type="submit" className="w-full h-11 text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>

              {/* Opción de Login Alternativo Corporativo */}
              <Button variant="outline" className="w-full h-11 border-border/50 bg-background/20 hover:bg-background/40" type="button">
                <div className="mr-2 h-4 w-4 bg-[#0078d4] rounded-sm flex items-center justify-center text-[10px] text-white">M</div>
                Ingresar con Microsoft 365
              </Button>
            </FieldGroup>
          </form>

          {/* Lado Derecho: Imagen de Marca / Hero Section */}
          <div className="relative hidden bg-muted md:block overflow-hidden">
            <img
              src="/login-bg.png"
              alt="Infraestructura Corporativa"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] transition-transform duration-[10s] hover:scale-110" 
            />
            {/* Overlay de gradiente para mejorar la integración visual */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
               <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Infraestructura 2026</p>
               <h2 className="text-2xl font-bold">Control Total de Redes</h2>
               <p className="text-xs opacity-70 leading-relaxed">
                 Gestiona nodos, tareas y reportes de manera centralizada con nuestra plataforma de próxima generación.
               </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
