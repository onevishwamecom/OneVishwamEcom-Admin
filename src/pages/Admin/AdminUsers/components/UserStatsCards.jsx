import React from 'react';

export default function UserStatsCards({
  stats = {},
  statsLoading = false,
  formatDuration,
}) {
  return (
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

      {/* Stat 3: Total Time Spent on Site */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Time Spent</p>
            <h3 className="text-2xl font-extrabold text-brand-blue mt-1">
              {statsLoading ? '…' : formatDuration(stats.totalTimeSpentSeconds || 0)}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <i className="fa-solid fa-stopwatch text-lg" aria-hidden="true" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 font-medium">
          Avg {statsLoading ? '…' : formatDuration(stats.avgTimeSpentSeconds || 0)} per active user
        </p>
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
  );
}
