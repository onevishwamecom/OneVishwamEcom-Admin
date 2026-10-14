/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CENTRALIZED PAGE LAYOUT SYSTEM
 * ───────────────────────────────────────────────────────────────────────────
 * Every application page should use <PageContainer> for its global page
 * dimensions, responsive padding and vertical rhythm.
 *
 *   PAGE-LEVEL layout   → handled here (width, padding, section spacing).
 *   COMPONENT-LEVEL     → each component keeps its own internal spacing.
 *
 * Do NOT add page-level space-y / px / py / mx-auto on a page manually unless
 * the page has a specific exception (use the className / variant props).
 *
 * Design tokens live in src/index.css under --page-* so the whole app can be
 * re-spaced from a single place, e.g.:
 *   --page-section-gap: 1.5rem → 2rem   (space-y-6 → space-y-8)
 *   --page-padding-x:   clamp(...)      (px-6 → px-8)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Global page wrapper.
 * Controls page width, max-width, horizontal/vertical padding and the spacing
 * between top-level page sections (vertical rhythm).
 */
export function PageContainer({ children, className = '' }) {
  return (
    <div className={`page-container page-enter min-w-0 max-w-full ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * Page header — standard title + description block with an optional leading
 * element (e.g. back button) and optional right-side actions.
 */
export function PageHeader({ title, description, leading, actions, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`.trim()}>
      <div className="flex min-w-0 items-center gap-3">
        {leading}
        <div className="min-w-0">
          {title && (
            <h1 className="break-words text-3xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-1.5 font-medium text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

/**
 * Page section — groups the major sections of a page. The vertical spacing
 * between sections is provided by <PageContainer>; this component exists for
 * code clarity and future section-level styling only.
 */
export function PageSection({ children, className = '' }) {
  return <section className={className}>{children}</section>;
}

export default PageContainer;