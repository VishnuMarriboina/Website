import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import {
  useJobs,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useActivateJob,
  useDeactivateJob,
} from '../../hooks/useServiceB';
import type { Job, CreateJobRequest, UpdateJobRequest } from '../../grpc/clients/types';

const STATUSES = ['active', 'inactive'];

type FormState = {
  title:              string;
  description:        string;
  department:         string;
  location:           string;
  experienceRequired: string;
  salaryRange:        string;
  status:             string;
};

const EMPTY_FORM: FormState = {
  title: '', description: '', department: '',
  location: '', experienceRequired: '', salaryRange: '', status: 'active',
};

function jobToForm(job: Job): FormState {
  return {
    title:              job.title,
    description:        job.description,
    department:         job.department,
    location:           job.location,
    experienceRequired: job.experienceRequired,
    salaryRange:        job.salaryRange,
    status:             job.status,
  };
}

// ── Job Modal ────────────────────────────────────────────────────────────────

function JobModal({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(job ? jobToForm(job) : EMPTY_FORM);
  const [err,  setErr]  = useState('');
  const create = useCreateJob();
  const update = useUpdateJob();
  const isPending = create.isPending || update.isPending;

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!form.title.trim()) { setErr('Title is required'); return; }
    try {
      if (job) {
        const body: UpdateJobRequest = { id: job.id, ...form, title: form.title.trim(), description: form.description.trim() };
        await update.mutateAsync(body);
      } else {
        const body: CreateJobRequest = { ...form, title: form.title.trim(), description: form.description.trim() };
        await create.mutateAsync(body);
      }
      onClose();
    } catch (ex: unknown) {
      setErr((ex as { message?: string })?.message ?? 'Failed to save job');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">{job ? 'Edit Job' : 'Post Job'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Title *</label>
            <input
              value={form.title}
              onChange={set('title')}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Department</label>
              <input
                value={form.department}
                onChange={set('department')}
                placeholder="e.g. Engineering"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
              <input
                value={form.location}
                onChange={set('location')}
                placeholder="e.g. Hyderabad"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Experience</label>
              <input
                value={form.experienceRequired}
                onChange={set('experienceRequired')}
                placeholder="e.g. 2-4 years"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Salary Range</label>
              <input
                value={form.salaryRange}
                onChange={set('salaryRange')}
                placeholder="e.g. ₹6–10 LPA"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
            <select
              value={form.status}
              onChange={set('status')}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          {err && <p className="text-red-500 text-xs">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl py-2.5 text-sm font-semibold"
            >
              {isPending ? 'Saving…' : job ? 'Save Changes' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Dialog ─────────────────────────────────────────────────────────────

function DeleteDialog({ job, onClose }: { job: Job; onClose: () => void }) {
  const del = useDeleteJob();
  const handleDelete = async () => {
    await del.mutateAsync(job.id);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="text-4xl mb-3">🗑️</div>
        <h2 className="font-bold text-slate-900 text-lg mb-1">Delete Job?</h2>
        <p className="text-sm text-slate-500 mb-6">"{job.title}" will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-50">Cancel</button>
          <button onClick={handleDelete} disabled={del.isPending} className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-xl py-2.5 text-sm font-semibold">
            {del.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminJobs() {
  const [search,      setSearch]  = useState('');
  const [editJob,     setEditJob] = useState<Job | null>(null);
  const [showModal,   setModal]   = useState(false);
  const [deleteTarget, setDel]    = useState<Job | null>(null);

  const { data, isLoading } = useJobs({ limit: 200, search });
  const activate   = useActivateJob();
  const deactivate = useDeactivateJob();

  const jobs = data?.data ?? [];

  const handleToggle = (j: Job) =>
    j.status === 'active' ? deactivate.mutateAsync(j.id) : activate.mutateAsync(j.id);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="text-sm text-slate-500 mt-0.5">{data?.meta?.total ?? 0} positions total</p>
        </div>
        <button
          onClick={() => { setEditJob(null); setModal(true); }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <FiPlus size={16} />
          Post Job
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs…"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No jobs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Department</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Experience</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Salary</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3 max-w-[220px]">
                      <p className="font-medium text-slate-800 truncate">{j.title}</p>
                      {j.description && <p className="text-xs text-slate-400 truncate mt-0.5">{j.description}</p>}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{j.department || '—'}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{j.experienceRequired || '—'}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{j.salaryRange || '—'}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleToggle(j)} className="flex items-center gap-1.5 text-xs font-medium transition-colors">
                        {j.status === 'active'
                          ? <><FiToggleRight size={18} className="text-green-500" /><span className="text-green-600">Active</span></>
                          : <><FiToggleLeft  size={18} className="text-slate-400" /><span className="text-slate-400">Inactive</span></>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => { setEditJob(j); setModal(true); }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDel(j)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <JobModal job={editJob} onClose={() => { setModal(false); setEditJob(null); }} />
      )}
      {deleteTarget && (
        <DeleteDialog job={deleteTarget} onClose={() => setDel(null)} />
      )}
    </div>
  );
}
