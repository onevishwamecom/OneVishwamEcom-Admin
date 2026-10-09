import { useState, useMemo } from 'react';
import { DataTable, StatusBadge } from '../../../components/Admin/AdminUi';
import { PageContainer, PageHeader, PageSection } from '../../../components/layout/PageContainer';
import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';
import { ErrorState } from '../../../components/skeleton';

const USER_COLUMNS = [
  { key: 'user', label: 'User Details' },
  { key: 'contact', label: 'Contact Info' },
  { key: 'location', label: 'Location' },
  { key: 'lastLogin', label: 'Last Logged In', align: 'center' },
  { key: 'status', label: 'Account Status', align: 'center' },
];

function formatDate(dateStr) {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Never';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Never logged in';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Never logged in';
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: statsData, loading: statsLoading } = useAsyncData(
    () => adminApi.getUserStats(),
    [],
    { totalUsers: 0, loggedInUsers: 0, activeUsers: 0, emailVerifiedUsers: 0 },
    { cacheKey: 'userStats', ttl: CACHE_TTL.listings }
  );

  const { data: usersData, loading: usersLoading, error, retry } = useAsyncData(
    () => adminApi.getUsers(),
    [],
    { users: [], total: 0 },
    { cacheKey: 'users:all', ttl: CACHE_TTL.listings }
  );

  const usersList = usersData?.users || [];

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesStatus =
        statusFilter === 'all' ||
        u.status?.toLowerCase() === statusFilter.toLowerCase();

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.phone?.toLowerCase().includes(query) ||
        u.city?.toLowerCase().includes(query) ||
        u.area?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [usersList, search, statusFilter]);

  const stats = statsData || {
    totalUsers: usersList.length,
    loggedInUsers: usersList.filter((u) => u.lastLogin).length,
    activeUsers: usersList.filter((u) => u.status === 'active').length,
    emailVerifiedUsers: usersList.filter((u) => u.isEmailVerified).length,
  };

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Unable to load website users"
          message="Website user data could not be fetched from MongoDB. Please check backend connection."
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Website Users"
        description="Registered customers and logged-in users on OneVishwam platform"
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Stat 1: Total Registered */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {statsLoading ? '…' : stats.totalUsers ?? 0}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue/70 flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-users text-lg" aria-hidden="true" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Registered OneVishwam customer accounts</p>
        </div>

        {/* Stat 2: Logged In Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Logged In Users</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                {statsLoading ? '…' : stats.loggedInUsers ?? 0}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-user-clock text-lg" aria-hidden="true" />
            </div>
          </div>
          <p className="text-xs text-emerald-700/80 mt-3 font-medium">Users with logged session record</p>
        </div>

        {/* Stat 3: Active Accounts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Accounts</p>
              <h3 className="text-2xl font-extrabold text-brand-blue mt-1">
                {statsLoading ? '…' : stats.activeUsers ?? 0}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-user-shield text-lg" aria-hidden="true" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Active user profiles in database</p>
        </div>

        {/* Stat 4: Verified Emails */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Emails</p>
              <h3 className="text-2xl font-extrabold text-purple-600 mt-1">
                {statsLoading ? '…' : stats.emailVerifiedUsers ?? 0}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-envelope-circle-check text-lg" aria-hidden="true" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Email confirmed customer accounts</p>
        </div>
      </div>

      {/* Main Table Section */}
      <PageSection>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-1 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Customer Directory</h2>
            <p className="text-xs text-slate-400">Viewing {filteredUsers.length} website user(s)</p>
          </div>

          {/* Controls: Search & Status filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-brand-blue transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {usersLoading ? (
          <div className="px-6 py-12 text-center text-sm font-medium text-slate-400">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-blue mb-3 block" />
            Fetching website users from MongoDB…
          </div>
        ) : (
          <DataTable
            columns={USER_COLUMNS}
            rows={filteredUsers}
            emptyIcon="fa-user-slash"
            emptyTitle="No website users found"
            emptyMessage={
              search || statusFilter !== 'all'
                ? 'Try adjusting your search query or filters.'
                : 'No registered customer users found in the database.'
            }
            renderRow={(u) => [
              /* User Details */
              <td key="user" className="py-3">
                <div className="flex items-center gap-3">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="h-10 w-10 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-blue/80 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate text-sm">{u.name}</span>
                      {u.isEmailVerified && (
                        <span title="Email Verified" className="text-emerald-500 text-xs">
                          <i className="fa-solid fa-circle-check" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block font-mono">ID: {u._id}</span>
                  </div>
                </div>
              </td>,

              /* Contact Info */
              <td key="contact" className="text-slate-600 text-sm">
                <div className="space-y-0.5">
                  <p className="flex items-center gap-1.5 truncate">
                    <i className="fa-solid fa-envelope text-slate-300 text-xs w-4" />
                    <span>{u.email || '—'}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <i className="fa-solid fa-phone text-slate-300 text-xs w-4" />
                    <span>{u.phone || '—'}</span>
                  </p>
                </div>
              </td>,

              /* Location */
              <td key="location" className="text-slate-600 text-xs">
                {u.city || u.area ? (
                  <div>
                    <span className="font-semibold text-slate-700 block">{u.city || '—'}</span>
                    {u.area && <span className="text-slate-400">{u.area}</span>}
                  </div>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>,

              /* Last Logged In */
              <td key="lastLogin" className="text-center whitespace-nowrap">
                {u.lastLogin ? (
                  <div className="inline-flex flex-col items-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {timeAgo(u.lastLogin)}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {formatDate(u.lastLogin)}
                    </span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-400 text-xs font-medium">
                    <i className="fa-regular fa-clock text-[10px]" />
                    Never
                  </span>
                )}
              </td>,

              /* Account Status */
              <td key="status" className="text-center whitespace-nowrap">
                <StatusBadge status={u.status || 'active'} />
              </td>,
            ]}
          />
        )}
      </PageSection>
    </PageContainer>
  );
}
