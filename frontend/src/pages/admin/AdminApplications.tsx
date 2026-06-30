import { useState } from 'react';
import { FiRefreshCw, FiExternalLink, FiTrash2, FiX } from 'react-icons/fi';
import { useApplications, useJobs, useUpdateApplicationStatus, useDeleteApplication } from '../../hooks/useServiceB';
import type { Application } from '../../grpc/clients/types';

const STATUSES = ['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];

const STATUS_COLOR: Record<string, string> = {
  pending:     'bg-yellow-50 text-yellow-700 border-yellow-200',
  reviewed:    'bg-blue-50 text-blue-700 border-blue-200',
  shortlisted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  accepted:    'bg-green-50 text-green-700 border-green-200',
  rejected:    'bg-red-50 text-red-700 border-red-200',
};

const STATUS_DOT: Record<string, string> = {
  pending:     'bg-yellow-400',
  reviewed:    'bg-blue-400',
  shortlisted: 'bg-indigo-400',
  accepted:    'bg-green-400',
  rejected:    'bg-red-400',
};

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirm({ app, onClose }: { app: Application; onClose: () => void }) {
  const del = useDeleteApplication();
  const handleDelete = async () => {
    await del.mutateAsync(app.id);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiTrash2 size={20} className="text-red-600" />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">Delete Application?</h3>
        <p className="text-slate-500 text-sm mb-6">This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={del.isPending} className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
            {del.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cover Letter Modal ────────────────────────────────────────────────────────
function CoverLetterModal({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Cover Letter</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><FiX size={18} /></button>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

// ── Application Row ───────────────────────────────────────────────────────────
function AppRow({ app, jobTitle, onDelete }: { app: Application; jobTitle: string; onDelete: (app: Application) => void }) {
  const updateStatus = useUpdateApplicationStatus();
  const [status, setStatus] = useState(app.applicationStatus);
  const [coverOpen, setCoverOpen] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    const prev = status;
    setStatus(newStatus);
    try {
      await updateStatus.mutateAsync({ id: app.id, applicationStatus: newStatus });
    } catch {
      setStatus(prev);
    }
  };

  return (
    <>
      {coverOpen && app.coverLetter && <CoverLetterModal text={app.coverLetter} onClose={() => setCoverOpen(false)} />}
      <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
        {/* Applicant */}
        <td className="px-5 py-3">
          <span className="font-mono text-xs text-slate-400">{app.userId.slice(-10)}</span>
        </td>
        {/* Job */}
        <td className="px-5 py-3">
          <p className="font-medium text-slate-800 text-xs leading-snug">{jobTitle || '—'}</p>
          <p className="font-mono text-[10px] text-slate-400">{app.jobId.slice(-8)}</p>
        </td>
        {/* Resume */}
        <td className="px-5 py-3">
          {app.resumeUrl ? (
            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
              <FiExternalLink size={11} /> View
            </a>
          ) : <span className="text-xs text-slate-400">—</span>}
        </td>
        {/* Cover Letter */}
        <td className="px-5 py-3">
          {app.coverLetter ? (
            <button onClick={() => setCoverOpen(true)} className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 text-left max-w-[140px] truncate block">
              {app.coverLetter.slice(0, 40)}…
            </button>
          ) : <span className="text-xs text-slate-400">—</span>}
        </td>
        {/* Status dropdown */}
        <td className="px-5 py-3">
          <div className="inline-flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[status] ?? 'bg-slate-400'}`} />
            <select
              value={status}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={updateStatus.isPending}
              className={`text-xs font-semibold pl-1 pr-5 py-1 rounded-full border appearance-none bg-transparent cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_COLOR[status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}
            >
              {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(s => (
                <option key={s} value={s} className="bg-white text-slate-800">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </td>
        {/* Date */}
        <td className="px-5 py-3 text-xs text-slate-400">
          {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
        </td>
        {/* Actions */}
        <td className="px-5 py-3 text-right">
          <button onClick={() => onDelete(app)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
            <FiTrash2 size={14} />
          </button>
        </td>
      </tr>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminApplications() {
  const [filter,       setFilter]       = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  const { data, isLoading, refetch } = useApplications(
    filter !== 'all' ? { applicationStatus: filter, limit: 100 } : { limit: 100 }
  );
  const { data: jobsData } = useJobs({ limit: 200 });

  const applications = data?.data ?? [];
  const jobMap = Object.fromEntries((jobsData?.data ?? []).map(j => [j.id, j.title]));

  const counts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.applicationStatus] = (acc[a.applicationStatus] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {deleteTarget && <DeleteConfirm app={deleteTarget} onClose={() => setDeleteTarget(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{data?.meta?.total ?? 0} total</p>
        </div>
        <button onClick={() => refetch()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <FiRefreshCw size={15} />
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-colors ${
              filter === s
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
            }`}>
            {s !== 'all' && filter !== s && (
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s] ?? 'bg-slate-400'}`} />
            )}
            {s}
            {s !== 'all' && counts[s] ? (
              <span className="ml-0.5 text-[10px] opacity-70">({counts[s]})</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Applicant</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Job</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Resume</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Cover Letter</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Applied</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">Loading…</td></tr>
              )}
              {!isLoading && applications.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">No applications found</td></tr>
              )}
              {applications.map(app => (
                <AppRow
                  key={app.id}
                  app={app}
                  jobTitle={jobMap[app.jobId] ?? ''}
                  onDelete={setDeleteTarget}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
