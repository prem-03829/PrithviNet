/**
 * PrithviNet Role-Based Access Control (RBAC) Matrix
 */
export const PERMISSIONS = {
  // Case Management
  CLOSE_CASE: ['government', 'admin'],
  ISSUE_CITATION: ['government', 'admin'],
  ADD_ACTIVITY_NOTE: ['government', 'admin'],
  VIEW_OWN_CASES: ['industry', 'government', 'admin'],
  VIEW_ALL_CASES: ['government', 'admin'],

  // Compliance
  SUBMIT_REPORT: ['industry'],
  APPROVE_REPORT: ['government', 'admin'],
  VIEW_ANALYTICS: ['government', 'admin'],

  // Public Features
  SUBMIT_COMPLAINT: ['citizen'],
  TRACK_COMPLAINT: ['citizen', 'government', 'admin'],
  VIEW_PUBLIC_DATA: ['citizen', 'industry', 'government', 'admin'],

  // System
  ACCESS_ADMIN_CONSOLE: ['government', 'admin'],
  ACCESS_INDUSTRY_PORTAL: ['industry'],
};

/**
 * Helper function to check if a role has a specific permission
 * @param {string} role - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles ? allowedRoles.includes(role.toLowerCase()) : false;
};
