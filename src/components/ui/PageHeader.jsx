export function PageHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 font-medium mt-1.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PageHeader;
