import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useAllUsers } from '../../hooks/useServiceA';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAllUsers({ limit: 200 });

  const users = (data?.data ?? []).filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-sm text-slate-500 mt-0.5">{data?.meta?.total ?? 0} registered users</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3 text-slate-400 text-xs">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
