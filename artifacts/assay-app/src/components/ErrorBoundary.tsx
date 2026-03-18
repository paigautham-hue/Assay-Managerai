import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.label ?? 'unknown'}]`, error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0D0D1A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: '100%',
            background: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.25)',
            borderRadius: 16,
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#F87171',
              marginBottom: '0.75rem',
            }}
          >
            Something went wrong
          </h2>
          <p style={{ color: '#9CA3AF', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            {this.props.label ? `Error in ${this.props.label}` : 'An unexpected error occurred.'}
          </p>
          {this.state.error && (
            <pre
              style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 8,
                padding: '0.75rem',
                fontSize: '0.75rem',
                color: '#6B7280',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              background: '#C9A84C',
              color: '#0D0D1A',
              border: 'none',
              borderRadius: 8,
              padding: '0.625rem 1.5rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
}
