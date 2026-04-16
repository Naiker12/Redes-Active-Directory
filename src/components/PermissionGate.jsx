import { useAuth } from '@/context/AuthContext';

/**
 * Componente de Control de Acceso (PermissionGate)
 * Envuelve contenido que requiere permisos específicos.
 * 
 * @param {string} permission - El identificador del permiso requerido (ej. 'notas').
 * @param {React.ReactNode} children - El contenido a mostrar si se tiene acceso.
 * @param {React.ReactNode} fallback - Contenido alternativo (por defecto null) si no hay acceso.
 */
export default function PermissionGate({ permission, children, fallback = null }) {
  const { user } = useAuth();

  // Si no hay sesión iniciada, mostrar el fallback
  if (!user) return fallback;

  // Los administradores tienen acceso total implícito a todos los módulos
  if (user.isAdmin) return children;

  // Verificar si el permiso solicitado está en la lista de permisos del usuario
  if (user.permissions && user.permissions.includes(permission)) {
    return children;
  }

  // Si no cumple ninguna condición, retornar el contenido alternativo
  return fallback;
}
