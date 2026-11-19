import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  { label: 'Ribbon Alerts', icon: 'fa-bullhorn', to: '/admin/announcements' },
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

const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/listings': 'Listings Review',
  '/admin/bulk-listings': 'Bulk Listings',
  '/admin/approved-items': 'Approved Items',
  '/admin/contributors': 'Team Members',
  '/admin/users': 'Website Users',
  '/admin/categories': 'Categories',
  '/admin/announcements': 'Ribbon Alerts',
  '/admin/activity': 'Activity Logs',
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/admin/listings/')) return 'Listing Review';
  if (pathname.startsWith('/admin/approved-items/')) return 'Approved Items';
  if (pathname.startsWith('/admin/contributors/')) return 'Contributor Profile';
  if (pathname.startsWith('/admin/users/')) return 'User Profile';
  return 'Dashboard';
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const adminName = admin?.displayName || admin?.name || 'Administrator';
  const adminEmail = admin?.email || 'admin@onevishwam.com';
  const adminRole = (admin?.role || 'Super Admin').replace(/[-_]/g, ' ');
  const adminInitial = adminName.charAt(0).toUpperCase();

  const pageTitle = getPageTitle(location.pathname);

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
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [dropdownOpen]);

  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Logout of admin console?',
      text: 'You will be returned to the admin login page.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#134e8f',
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
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 ml-12 lg:ml-0">
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">{pageTitle}</h1>
              <p className="text-xs font-medium text-slate-500 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* OneVishwam Live Admin status badge */}
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-200/70 rounded-full px-3.5 py-1.5 shadow-2xs">
                <div className="h-2 w-2 rounded-full bg-brand-blue animate-pulse-soft" />
                <span className="text-xs font-extrabold text-brand-blue">
                  Master Console
                </span>
              </div>

              {/* Activity Log shortcut */}
              <Link
                to="/admin/activity"
                className={`relative flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 ${
                  location.pathname === '/admin/activity'
                    ? 'bg-blue-50 text-brand-blue border border-blue-200/60'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-brand-blue'
                }`}
                title="Activity Log"
                aria-label="Activity Log"
              >
                <i className="fa-solid fa-clock-rotate-left text-base" aria-hidden="true" />
              </Link>

              {/* User profile dropdown matching OneVishwam navbar */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                    {adminInitial}
                  </div>
                  <span className="hidden sm:block font-bold text-slate-800">{adminName}</span>
                  <i
                    className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-full pt-2 w-60 z-50 animate-fade-in"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 overflow-hidden">
                      <div className="px-3.5 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{adminName}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{adminEmail}</p>
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold bg-blue-50 text-brand-blue px-2 py-0.5 rounded-full border border-blue-100">
                          <i className="fa-solid fa-shield-halved text-[8px]" aria-hidden="true" />
                          {adminRole}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/admin/activity"
                          onClick={() => setDropdownOpen(false)}
                          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm text-slate-600 rounded-xl hover:bg-slate-50 hover:text-brand-blue transition-colors"
                        >
                          <i className="fa-solid fa-clock-rotate-left text-xs" />
                          Activity Log
                        </Link>
                        <Link
                          to="/admin/users"
                          onClick={() => setDropdownOpen(false)}
                          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm text-slate-600 rounded-xl hover:bg-slate-50 hover:text-brand-blue transition-colors"
                        >
                          <i className="fa-solid fa-user-check text-xs" />
                          Website Users
                        </Link>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <i className="fa-solid fa-right-from-bracket text-xs" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
