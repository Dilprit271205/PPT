import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-[#07080C] text-[#F8FAFC] flex flex-col items-center justify-center p-6 font-mono text-center">
          <div className="w-12 h-12 rounded-xl bg-[#E53935]/20 border border-[#E53935]/40 flex items-center justify-center text-[#FF4D5A] mb-4">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-[#FF4D5A] mb-2 font-['Space_Grotesk']">
            Runtime Exception Recovered
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-md mb-4">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-[#E53935] text-white text-xs font-bold hover:bg-[#E53935]/90 transition-all"
          >
            Reload Presentation
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

