import { useUserStore } from '../store/useUserStore';

/**
 * RoleGate Component
 * Controls visibility of children based on user role.
 * @param {string[]} roles - Array of allowed roles (e.g., ['government', 'admin'])
 * @param {React.ReactNode} children - Content to render if permitted
 * @param {React.ReactNode} fallback - Content to render if not permitted
 */
export default function RoleGate({ roles = [], children, fallback = null }) {
  const { user } = useUserStore();
  
  // Normalize roles to lowercase for comparison
  const normalizedUserRole = user?.role?.toLowerCase();
  const allowedRoles = roles.map(r => r.toLowerCase());

  if (!user || !allowedRoles.includes(normalizedUserRole)) {
    return fallback;
  }

  return children;
}
