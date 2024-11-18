import { Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to render fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an external service here
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Don't worry, we've got you covered
                </h3>
                <p className="text-sm text-gray-500">
                  Try these steps to get back on track:
                </p>
              </div>

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                  <span className="ml-2">Refresh the page to start fresh</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                  <span className="ml-2">
                    Clear your browser cache and cookies
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                  <span className="ml-2">
                    If the problem persists, contact support
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
