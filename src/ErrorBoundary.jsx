import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center p-8">
          <div className="bg-neutral-950 border border-rose-900/50 p-8 max-w-md w-full shadow-2xl">
            <div className="text-rose-400 font-black text-sm uppercase tracking-widest font-mono mb-4">
              Rendering Failure
            </div>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-4">
              An unexpected error occurred while rendering the application interface.
            </p>
            <pre className="text-[11px] text-rose-300 bg-black p-3 border border-neutral-900 overflow-auto max-h-40 font-mono mb-4">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-none text-xs font-black uppercase tracking-wider"
            >
              Reload Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
