import { FiMail, FiShield, FiCalendar, FiHash, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useProducts, useAllOrders, useAllUsers, useLogout } from '../../hooks/useServiceA';

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return '—';
  }
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

export default function AdminProfile() {
  const navigate   = useNavigate();
  const user       = useAuthStore((s) => s.user);
  const logout     = useLogout();

  const { data: productsData } = useProducts({ limit: 1 });
  const { data: ordersData }   = useAllOrders({ limit: 1 });
  const { data: usersData }    = useAllUsers({ limit: 1 });

  const totalProducts = productsData?.meta?.total ?? 0;
  const totalOrders   = ordersData?.meta?.total   ?? 0;
  const totalUsers    = usersData?.meta?.total    ?? 0;

  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="p-6 max-w-3xl mx-auto">
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

        {/* Name + role */}
        <div className="px-8 pt-14 pb-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
            <FiShield size={11} />
            Administrator
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
          <DetailRow icon={FiShield}   label="Role"         value="Administrator" />
          <DetailRow icon={FiCalendar} label="Member Since" value={formatDate(user.createdAt)} />
          <DetailRow icon={FiHash}     label="Account ID"   value={user.id} />
        </div>

        {/* Store stats + actions */}
        <div className="flex flex-col gap-5">
          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Store Overview</p>
            <div className="space-y-3">
              {[
                { label: 'Total Products', value: totalProducts, color: 'bg-blue-500' },
                { label: 'Total Orders',   value: totalOrders,   color: 'bg-green-500' },
                { label: 'Total Users',    value: totalUsers,    color: 'bg-purple-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-sm text-slate-600">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{value.toLocaleString()}</span>
                </div>
              ))}
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
  );
}
