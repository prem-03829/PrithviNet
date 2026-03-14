import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Route Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-app text-text-primary p-6 text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-2xl font-black mb-2">Something went wrong.</h2>
          <p className="text-text-secondary mb-6">The application encountered an unexpected error while rendering this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-primary text-background-dark font-bold rounded-xl hover:brightness-110 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
