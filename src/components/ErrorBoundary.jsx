import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Auto-reload on chunk hash mismatch between old tab and new deployment
    const isChunkError =
      /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
        error?.message || ''
      );

    if (isChunkError) {
      const reloadKey = 'admin_chunk_reload_lock';
      const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
      if (Date.now() - lastReload > 5000) {
        sessionStorage.setItem(reloadKey, String(Date.now()));
        window.location.reload();
      }
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError =
        /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
          this.state.error?.message || ''
        );

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-mesh-gradient bg-slate-50 p-4">
          <div className="w-full max-w-md text-center animate-fade-in-up">
            <div className="mb-6 flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center border border-blue-200/50">
                <i className={`fa-solid ${isChunkError ? 'fa-cloud-arrow-down text-brand-blue' : 'fa-triangle-exclamation text-red-500'} text-3xl`} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {isChunkError ? 'Portal Update Available' : 'Something went wrong'}
            </h1>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              {isChunkError
                ? 'A new version of OneVishwam Admin Portal has been released. Click Update Now to refresh and load the latest features.'
                : 'An unexpected error occurred. Please try reloading the page or contact support if the problem persists.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue/80 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-glow-blue hover:shadow-glow-blue transition-all duration-200 hover:-translate-y-0.5"
              >
                <i className="fa-solid fa-rotate-right mr-2" aria-hidden="true" />
                {isChunkError ? 'Update Now' : 'Reload Page'}
              </button>
              <button
                onClick={() => window.location.assign('/')}
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                Go Home
              </button>
            </div>
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mt-8 text-left">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                  Show error details
                </summary>
                <pre className="mt-3 text-xs text-red-600 overflow-auto p-4 bg-red-50 border border-red-100 rounded-xl">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
