import Navigation from './Navigation.jsx';

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-glow"
      >
        Saltar al contenido principal
      </a>
      <Navigation />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 sm:px-6 lg:px-8"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
}

export default PageShell;
