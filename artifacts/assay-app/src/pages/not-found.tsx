import { useLocation } from 'wouter';

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-dark">
      <div className="text-center px-6">
        <h1
          className="text-8xl font-extrabold mb-4"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8D48B, #C9A84C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </h1>
        <p className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary, #E2E8F0)' }}>
          Page Not Found
        </p>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary, #94A3B8)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8D48B)',
            color: '#0D0D1A',
          }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
