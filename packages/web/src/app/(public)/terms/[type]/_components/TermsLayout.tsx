/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface TermsLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

/*
 * ============================================
 * Component
 * ============================================
 */

/**
 * Terms layout component
 * Shared layout for all terms pages
 */
export function TermsLayout({ title, lastUpdated, children }: TermsLayoutProps) {
  return (
    <main className="pt-topnav-height mobile:pb-8 min-h-screen bg-[var(--gray-1)] pb-10">
      <div className="mobile:mt-10 mx-auto mt-10 max-w-3xl px-5">
        {/* Header */}
        <header className="mobile:mb-10 mb-8 flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold">{title}</h1>
          <time dateTime={lastUpdated} className="text-sm text-[var(--gray-11)]">
            Last Updated:{' '}
            {new Date(lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        {/* Content */}
        <article className="mobile:px-8 mobile:mb-10 rounded-lg bg-[var(--color-background)] shadow-md">
          {children}
        </article>
      </div>
    </main>
  );
}
