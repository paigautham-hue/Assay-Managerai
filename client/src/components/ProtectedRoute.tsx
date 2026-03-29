import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types/admin';
import { hasMinimumRole } from '@/types/admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  minimumRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRoles, minimumRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (requiredRoles && user && !requiredRoles.includes(user.role as UserRole)) {
      navigate('/');
      return;
    }
    if (minimumRole && user && !hasMinimumRole(user.role as UserRole, minimumRole)) {
      navigate('/');
    }
  }, [isLoading, isAuthenticated, user, navigate, requiredRoles, minimumRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-dark)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (requiredRoles && user && !requiredRoles.includes(user.role as UserRole)) return null;
  if (minimumRole && user && !hasMinimumRole(user.role as UserRole, minimumRole)) return null;

  return <>{children}</>;
}
