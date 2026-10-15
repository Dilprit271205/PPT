import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails?: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#E53935] text-white text-xs font-bold hover:bg-[#E53935]/90 transition-all cursor-pointer"
            >
              Reload Presentation
            </button>
            <button
              onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
              className="px-3 py-2 rounded-xl border border-[#94A3B8]/20 text-[#94A3B8] text-xs hover:text-[#F8FAFC] transition-all cursor-pointer"
            >
              {this.state.showDetails ? 'Hide Stack' : 'View Stack'}
            </button>
          </div>

          {this.state.showDetails && (
            <div className="mt-4 p-4 rounded-xl bg-[#101522] border border-[#94A3B8]/20 max-w-xl text-left overflow-auto max-h-60 text-[10px] text-[#FF4D5A]">
              <pre className="whitespace-pre-wrap">{this.state.error?.stack}</pre>
              {this.state.errorInfo?.componentStack && (
                <pre className="whitespace-pre-wrap mt-2 text-[#94A3B8] border-t border-[#94A3B8]/20 pt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

