export type UserRole = 'owner' | 'admin' | 'interviewer' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  createdAt: string;
  googleId?: string;
  hasPassword: boolean;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 4,
  admin: 3,
  interviewer: 2,
  viewer: 1,
};

export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Administrator',
  interviewer: 'Interviewer',
  viewer: 'Viewer',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: 'Full system access, can manage all users and settings',
  admin: 'Can manage users and view all assessments',
  interviewer: 'Can conduct interviews and view assigned reports',
  viewer: 'Read-only access to reports',
};
