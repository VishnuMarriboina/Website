import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Unhandled render error:', error, info.componentStack);
  }

  handleReload = (): void => {
    this.setState({ error: null });
    window.location.assign('/');
  };

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">Something went wrong</h1>
          <p className="text-slate-400 text-sm mb-6">
            An unexpected error occurred. Try reloading the page — if it keeps happening, please
            get in touch with support.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-xl transition text-sm"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
