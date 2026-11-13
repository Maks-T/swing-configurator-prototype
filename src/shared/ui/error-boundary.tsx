import * as React from 'react';

type ErrorBoundaryFallbackProps = {
  error: Error;
  reset: () => void;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((props: ErrorBoundaryFallbackProps) => React.ReactNode);
  onError?: (error: Error, info: React.ErrorInfo) => void;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  override render() {
    const { error } = this.state;

    if (error) {
      const { fallback } = this.props;

      if (typeof fallback === 'function') {
        return fallback({ error, reset: this.reset });
      }

      return fallback ?? null;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export type { ErrorBoundaryFallbackProps, ErrorBoundaryProps };
