import React, { ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { motion } from 'framer-motion';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    // Capture error to Sentry with component stack context
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
    console.error('Error caught by boundary:', error, errorInfo.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#0a0a0a', color: 'white' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ maxWidth: '400px', textAlign: 'center', padding: '40px' }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#ef4444' }}>Something went wrong</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>We're sorry, but something unexpected happened.</p>
            <button 
              onClick={this.handleReload}
              style={{ padding: '12px 24px', background: '#D0BCFF', color: '#1a1a1a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Reload Page
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;