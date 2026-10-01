import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isHi = typeof window !== 'undefined' && localStorage.getItem('dhara_lang') === 'hi';
      return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }} className="glass-card">
          <AlertTriangle color="#ef4444" size={48} style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>{isHi ? 'कुछ गलत हो गया।' : 'Something went wrong.'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{this.state.error?.message || (isHi ? 'एक अप्रत्याशित त्रुटि हुई।' : 'An unexpected error occurred.')}</p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '1.5rem' }}
            onClick={() => window.location.reload()}
          >
            {isHi ? 'पेज पुनः लोड करें' : 'Reload Page'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
