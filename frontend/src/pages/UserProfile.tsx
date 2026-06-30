import { FiMail, FiShield, FiCalendar, FiHash, FiUser, FiLogOut, FiPackage, FiBriefcase } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserOrders } from '../hooks/useServiceA';
import { useUserApplications } from '../hooks/useServiceB';

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return '—'; }
}

interface DetailRowProps { icon: React.ElementType; label: string; value: string }
function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800 break-all">{value}</p>
      </div>
    </div>
  );
}

interface ActivityCardProps {
  icon: React.ElementType;
  label: string;
  count: number;
  to: string;
  color: string;
}
function ActivityCard({ icon: Icon, label, count, to, color }: ActivityCardProps) {
  return (
    <Link to={to} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors group">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-slate-900">{count}</p>
      </div>
      <span className="text-slate-300 group-hover:text-orange-400 transition-colors text-lg">→</span>
    </Link>
  );
}

export default function UserProfile() {
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);

  const { data: ordersData }      = useUserOrders({});
  const { data: applicationsData } = useUserApplications(user?.id ?? '');

  const totalOrders       = ordersData?.meta?.total       ?? 0;
  const totalApplications = applicationsData?.meta?.total ?? (applicationsData?.data?.length ?? 0);

  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
          {/* Banner */}
          <div className="relative h-28 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,115,22,0.15),_transparent_60%)]" />
            <div className="absolute -bottom-10 left-8">
              <div className="w-20 h-20 rounded-2xl bg-orange-500 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg select-none">
                {getInitials(user.name)}
              </div>
            </div>
          </div>

          {/* Name + role badge */}
          <div className="px-8 pt-14 pb-6 flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              <FiUser size={11} />
              Member
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Account details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 py-3 border-b border-slate-100">
              Account Details
            </p>
            <DetailRow icon={FiUser}     label="Full Name"    value={user.name} />
            <DetailRow icon={FiMail}     label="Email"        value={user.email} />
            <DetailRow icon={FiShield}   label="Role"         value="Member" />
            <DetailRow icon={FiCalendar} label="Member Since" value={formatDate(user.createdAt)} />
            <DetailRow icon={FiHash}     label="Account ID"   value={user.id} />
          </div>

          {/* Activity + Actions */}
          <div className="flex flex-col gap-5">
            {/* Activity */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">My Activity</p>
              <div className="space-y-3">
                <ActivityCard
                  icon={FiPackage}
                  label="Total Orders"
                  count={totalOrders}
                  to="/orders"
                  color="bg-green-500"
                />
                <ActivityCard
                  icon={FiBriefcase}
                  label="Job Applications"
                  count={totalApplications}
                  to="/services"
                  color="bg-orange-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Actions</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition-colors border border-red-100"
              >
                <FiLogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
