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

  static getDerivedStateFromError(error: Error): Partial<State> {
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

    // Aquí podrías enviar el error a un servicio de logging
    // logErrorToService(error, errorInfo);
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
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4v2m0-10a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  ¡Algo salió mal!
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Lo sentimos, encontramos un problema inesperado. Por favor, intenta de nuevo.
                </p>

                {this.state.error && process.env.NODE_ENV === 'development' && (
                  <details className="mt-4 p-4 bg-gray-100 rounded text-left">
                    <summary className="cursor-pointer font-semibold text-gray-700">
                      Detalles del error
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}

                <button
                  onClick={this.handleReset}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
