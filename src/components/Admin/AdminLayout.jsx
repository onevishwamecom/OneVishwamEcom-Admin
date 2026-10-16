import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAdminAuth } from '../../store/adminSlice';
import logo from '../../assets/Logo.png';
import logo2 from '../../assets/Logo2.png';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'fa-gauge-high', to: '/admin', end: true },
  { label: 'Listings', icon: 'fa-list', to: '/admin/listings' },
  { label: 'Bulk Listings', icon: 'fa-file-excel', to: '/admin/bulk-listings' },
  { label: 'Approved Items', icon: 'fa-box-open', to: '/admin/approved-items' },
  { label: 'Contributors', icon: 'fa-users', to: '/admin/contributors' },
  { label: 'Website Users', icon: 'fa-user-check', to: '/admin/users' },
  { label: 'Categories', icon: 'fa-table-cells-large', to: '/admin/categories' },
  { label: 'Activity', icon: 'fa-clock-rotate-left', to: '/admin/activity' },
];

function AdminSidebarContent({ compact, onToggleCollapse }) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col">
      {/* ── Brand Header (with the single collapse/expand toggle) ── */}
      <div
        className={`border-b border-white/[0.06] ${
          compact ? 'py-4 px-2 flex flex-col items-center' : 'py-4 px-4 flex items-center justify-between'
        }`}
      >
        {!compact ? (
          <>
            <NavLink to="/admin" className="flex items-center gap-2 group" aria-label="Admin home">
              <img
                src={logo}
                alt="OneVishwam"
                className="h-9 w-auto object-contain transition-all duration-200"
              />
            </NavLink>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
                title="Retract sidebar"
                aria-label="Retract sidebar"
              >
                <i className="fa-solid fa-chevron-left text-xs" aria-hidden="true" />
              </button>
            )}
          </>
        ) : (
          <>
            <NavLink to="/admin" className="flex items-center justify-center group mb-2" aria-label="Admin home">
              <img
                src={logo2}
                alt="OneVishwam"
                className="h-8 w-8 object-contain"
              />
            </NavLink>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="w-10 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Modular Navigation Icons ── */}
      <nav className={`flex-1 py-4 space-y-1.5 ${compact ? 'px-2' : 'px-3'}`}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.end
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={`flex items-center rounded-xl transition-all duration-200 ${
                compact
                  ? 'w-11 h-11 mx-auto justify-center'
                  : 'gap-3 px-3.5 py-2.5'
              } ${
                isActive
                  ? 'bg-brand-blue/20 text-white font-semibold sidebar-active-glow ring-1 ring-brand-blue/30'
                  : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
              }`}
              title={compact ? item.label : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              <i
                className={`fa-solid ${item.icon} text-base shrink-0 ${isActive ? 'text-brand-blue' : 'text-slate-400'}`}
                aria-hidden="true"
              />
              {!compact && <span className="text-sm font-medium truncate">{item.label}</span>}
              {isActive && !compact && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(37,99,235,0.6)] shrink-0" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Minimal Clean Footer ── */}
      <div className={`border-t border-white/[0.06] py-3 ${compact ? 'px-2 text-center' : 'px-4'}`}>
        {compact ? (
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">v1</span>
        ) : (
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            OneVishwam Core Admin
          </p>
        )}
      </div>
    </div>
  );
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch (_) {}
      return next;
    });
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Logout of admin console?',
      text: 'You will be returned to the admin login page.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold',
      },
    });
    if (isConfirmed) {
      logout();
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Skip link */}
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-blue focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to admin content
      </a>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex lg:hidden items-center justify-center h-10 w-10 rounded-xl bg-brand-navy text-white shadow-elevated"
        aria-label="Open admin navigation menu"
      >
        <i className="fa-solid fa-bars" aria-hidden="true" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-sidebar-gradient lg:hidden transition-transform duration-300 overscroll-contain ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin navigation"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close admin navigation menu"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
        <AdminSidebarContent compact={false} />
      </aside>

      {/* Tablet compact sidebar */}
      <aside
        className="hidden lg:hidden md:flex fixed top-0 left-0 z-40 h-screen w-[68px] bg-sidebar-gradient"
        aria-label="Admin navigation"
      >
        <AdminSidebarContent compact />
      </aside>

      {/* Desktop retractable sidebar */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 z-40 h-screen ${
          isCollapsed ? 'w-[68px]' : 'w-64'
        } bg-sidebar-gradient transition-all duration-300 ease-in-out`}
        aria-label="Admin navigation"
      >
        <AdminSidebarContent compact={isCollapsed} onToggleCollapse={toggleSidebar} />
      </aside>

      {/* Main column */}
      <div
        className={`flex flex-1 flex-col min-w-0 ${
          isCollapsed ? 'lg:ml-[68px]' : 'lg:ml-64'
        } md:ml-[68px] ml-0 transition-all duration-300 ease-in-out overflow-x-hidden`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-slate-200/60">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 ml-12 lg:ml-0">
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">OneVishwam Core Admin</h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold border border-brand-blue/20">
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                Admin
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-orange/10 text-brand-orange border border-brand-orange/25 px-4 py-2 text-sm font-bold hover:bg-brand-orange/20 transition-colors"
              >
                <i className="fa-solid fa-right-from-bracket text-xs" aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main
          id="admin-main-content"
          className="flex-1 min-w-0 w-full bg-mesh-gradient bg-slate-50/95 overflow-x-hidden"
          role="main"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
