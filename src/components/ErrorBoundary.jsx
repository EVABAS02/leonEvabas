import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Erreur applicative interceptée :', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center px-4 font-sans">
          <div className="max-w-sm text-center space-y-4">
            <h1 className="text-xl font-serif font-bold text-white">
              Une erreur <span className="text-[#E85D04]">est survenue</span>
            </h1>
            <p className="text-sm text-white/50">
              Quelque chose s'est mal passé de façon inattendue. Recharge la page — si ça persiste, note le contexte (quelle page, quelle action) pour investiguer.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-lg bg-[#E85D04] hover:bg-[#E85D04]/90 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}