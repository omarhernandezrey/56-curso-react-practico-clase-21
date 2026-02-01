/**
 * Error Boundary Component
 * Captura errores de React y los muestra de forma amigable
 */

import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Actualizar el estado para mostrar el fallback UI
    this.setState({
      error,
      errorInfo,
      hasError: true,
    });

    // Log al console para debugging
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error Info:', errorInfo);

    // Llamar callback personalizado si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* Error Header */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2M9 5h6m0 0h6m0 0h-6m0 0H9" />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-bold text-red-900 text-center mb-2">
              ¡Algo salió mal!
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 text-center text-sm mb-4">
              Hemos encontrado un error inesperado. Por favor, intenta de nuevo.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-xs bg-gray-100 p-3 rounded border border-gray-300">
                <summary className="cursor-pointer font-mono text-gray-700 mb-2">
                  Detalles del error
                </summary>
                <div className="font-mono text-red-700 overflow-auto max-h-32">
                  <p className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <p>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap break-words text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </p>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition"
              >
                Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
