export type UserRole = 'owner' | 'admin' | 'interviewer' | 'viewer';
export type UserStatus = 'active' | 'suspended';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  organizationId?: string;
  createdAt: string;
  lastActiveAt?: string | null;
  googleId?: string;
  hasPassword: boolean;
}

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  invitedById: string;
  invitedBy: { id: string; name: string; email: string };
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  inviteUrl?: string;
}

export interface ActivityLogEntry {
  id: string;
  userId: string | null;
  actorId: string | null;
  action: string;
  details: Record<string, unknown>;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
  actor: { id: string; name: string; email: string } | null;
}

export interface OrgSettings {
  id: string | null;
  name: string;
  userCount: number;
  settings: Record<string, unknown>;
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
