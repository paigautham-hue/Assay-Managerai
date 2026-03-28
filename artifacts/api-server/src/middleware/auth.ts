import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET must be set in production');
    process.exit(1);
  }
  console.warn('[auth] Using development JWT secret — set JWT_SECRET in production');
  return 'assay-dev-secret-change-in-production';
})();

export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export function extractToken(req: Request): string | null {
  const cookie = req.cookies?.assay_token;
  if (cookie) return cookie;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

// Valid roles: admin, interviewer, viewer, candidate
// Candidates receive ephemeral JWTs from the public invite flow and may ONLY
// access their own interview session, its transcript/observation endpoints, and
// the assessment stream. All other routes should reject candidate-role tokens.
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  // Candidate-role users can only access their own session's endpoints.
  // Their user.id is formatted as `candidate_<sessionId>`.
  if (user.role === 'candidate') {
    const candidateSessionId = user.id.replace(/^candidate_/, '');
    const allowed = isCandidateAllowedPath(req.path, candidateSessionId);
    if (!allowed) {
      res.status(403).json({ error: 'Candidates can only access their own interview session' });
      return;
    }
  }

  req.user = user;
  next();
}

/**
 * Checks whether a candidate-role user is allowed to access the given path.
 * Candidates may only reach endpoints scoped to their own session.
 */
function isCandidateAllowedPath(path: string, sessionId: string): boolean {
  const allowedPrefixes = [
    `/sessions/${sessionId}`,      // GET/PATCH session, transcript, observations, verdicts
    `/assess`,                     // assessment stream for their session
    `/gemini-token`,               // voice token for their interview
    `/voice-provider`,             // voice provider config
    `/session/${sessionId}`,       // legacy singular route
  ];
  return allowedPrefixes.some(prefix => path === prefix || path.startsWith(prefix + '/') || path.startsWith(prefix + '?'));
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const user = verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    if (roles.length > 0 && !roles.includes(user.role)) {
      res.status(403).json({ error: `Access denied. Required roles: ${roles.join(', ')}` });
      return;
    }
    req.user = user;
    next();
  };
}
