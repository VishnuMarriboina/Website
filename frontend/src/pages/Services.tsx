import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs, useCreateApplication } from '../hooks/useServiceB';
import { useAuthStore } from '../store/authStore';
import type { Job } from '../grpc/clients/types';

import f1  from '../Images/Jobs/Front-end.webp';
import b1  from '../Images/Jobs/Back-end.jpg';
import q1  from '../Images/Jobs/qa.jpg';
import se  from '../Images/Jobs/S-E.jpg';
import ba1 from '../Images/Jobs/ba1.png';
import pm1 from '../Images/Jobs/pm.png';
import op  from '../Images/Jobs/om.jpg';
import bg2 from '../Images/Jobs/b2b1.jpg';

// ── Image resolver ────────────────────────────────────────────────────────────

const JOB_IMAGE_MAP: [string, string][] = [
  ['frontend',   f1],
  ['front-end',  f1],
  ['react',      f1],
  ['backend',    b1],
  ['back-end',   b1],
  ['grpc',       b1],
  ['qa',         q1],
  ['quality',    q1],
  ['test',       q1],
  ['sales',      se],
  ['executive',  se],
  ['project',    pm1],
  ['pm',         pm1],
  ['business',   ba1],
  ['analyst',    ba1],
  ['operations', op],
  ['logistics',  op],
];

function resolveJobImage(title: string): string {
  const lower = title.toLowerCase();
  const match = JOB_IMAGE_MAP.find(([key]) => lower.includes(key));
  return match ? match[1] : b1;
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-16" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-8 bg-slate-200 rounded w-24 mt-4" />
      </div>
    </div>
  );
}

// ── Apply Modal ───────────────────────────────────────────────────────────────

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const navigate      = useNavigate();
  const user          = useAuthStore((s) => s.user);
  const isAuth        = useAuthStore((s) => s.isAuthenticated);
  const createApp     = useCreateApplication();

  const [resumeUrl,   setResumeUrl]   = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [err,         setErr]         = useState('');
  const [submitted,   setSubmitted]   = useState(false);

  if (!isAuth || !user) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Sign in to Apply</h2>
          <p className="text-sm text-slate-500 mb-6">You need an account to apply for this position.</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2.5 text-sm font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-sm text-slate-500 mb-6">
            We've received your application for <strong>{job.title}</strong>. Our team will be in touch soon.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-700 text-white rounded-xl py-2.5 text-sm font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!resumeUrl.trim()) { setErr('Resume URL is required'); return; }
    try {
      await createApp.mutateAsync({
        userId:      user.id,
        jobId:       job.id,
        resumeUrl:   resumeUrl.trim(),
        coverLetter: coverLetter.trim(),
      });
      setSubmitted(true);
    } catch (ex: unknown) {
      setErr((ex as { message?: string })?.message ?? 'Failed to submit application');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Apply for Position</h2>
            <p className="text-xs text-slate-500 mt-0.5">{job.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Applicant info (read-only) */}
          <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600">
            Applying as <strong>{user.name}</strong> ({user.email})
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Resume URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">Link to your resume (Google Drive, Dropbox, etc.)</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              placeholder="Tell us why you're a great fit…"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
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
              disabled={createApp.isPending}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl py-2.5 text-sm font-semibold"
            >
              {createApp.isPending ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────

function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={resolveJobImage(job.title)}
          alt={job.title}
          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {job.department && (
          <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
            {job.department}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h2 className="font-semibold text-slate-900 text-sm leading-snug">{job.title}</h2>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {job.location && (
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
              📍 {job.location}
            </span>
          )}
          {job.experienceRequired && (
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
              🏅 {job.experienceRequired}
            </span>
          )}
          {job.salaryRange && (
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
              💰 {job.salaryRange}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed flex-1 line-clamp-3">{job.description}</p>

        <button
          onClick={() => onApply(job)}
          className="mt-4 bg-slate-900 hover:bg-slate-700 active:bg-black text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors self-start shadow-sm"
        >
          Apply Now →
        </button>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

function Services() {
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const { data, isLoading, isError, refetch } = useJobs({ status: 'active', limit: 50 });
  const openings = data?.data ?? [];

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={bg2} alt="Join ServCrust" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-center px-4">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-2">We're Hiring</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Join the ServCrust Team</h1>
          <p className="text-slate-300 text-sm mt-3 max-w-md">
            Be part of India's fastest-growing construction-tech company. We're looking for builders, thinkers, and doers.
          </p>
        </div>
      </div>

      {/* ── Job openings ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">Open Positions</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Current Openings</h2>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center py-16 gap-4">
            <p className="text-slate-500 text-sm">Failed to load job openings. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && openings.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-500 text-sm font-medium">No open positions right now.</p>
            <p className="text-slate-400 text-xs">Check back soon or send an open application below.</p>
          </div>
        )}

        {!isLoading && !isError && openings.length > 0 && (
          <>
            <p className="text-xs text-slate-400 mb-6 text-center">
              {openings.length} open position{openings.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {openings.map((job) => (
                <JobCard key={job.id} job={job} onApply={setApplyJob} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <div className="bg-orange-500 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white">Don't see a role that fits?</h2>
          <p className="text-orange-100 text-sm mt-2">Send us your resume anyway — we're always looking for exceptional talent.</p>
          <a
            href="mailto:careers@servcrust.com"
            className="inline-block mt-5 bg-white text-orange-600 font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Send Open Application
          </a>
        </div>
      </div>

      {/* Apply modal */}
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
}

export default Services;
