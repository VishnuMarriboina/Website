import { FiPackage, FiShoppingBag, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import type { Options } from 'react-lottie';
import { useProducts, useAllOrders, useAllUsers } from '../../hooks/useServiceA';
import { useAuthStore } from '../../store/authStore';
import type { Order } from '../../grpc/clients/types';
import imageAnim from '../../assets/image.json';

function StatCard({
  label, value, icon: Icon, color, to,
}: { label: string; value: string | number; icon: React.ElementType; color: string; to: string }) {
  return (
    <Link to={to} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped:   'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

const lottieOpts: Options = {
  loop: true, autoplay: true, animationData: imageAnim,
  rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
};

const today = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  const { data: productsData } = useProducts({ limit: 1 });
  const { data: ordersData }   = useAllOrders({});
  const { data: usersData }    = useAllUsers({});
  const { data: stockData }    = useProducts({ limit: 200 });

  const totalProducts = productsData?.meta?.total ?? 0;
  const totalOrders   = ordersData?.meta?.total   ?? 0;
  const totalUsers    = usersData?.meta?.total    ?? 0;
  const lowStock      = (stockData?.data ?? []).filter((p) => p.stock < 20).length;

  const recentOrders: Order[] = (ordersData?.data ?? []).slice(0, 5);
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? 'Admin';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-800 rounded-2xl px-8 py-7 mb-7 overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-orange-500/10 border border-orange-500/10 pointer-events-none" />
        <div className="absolute -bottom-12 right-28 w-36 h-36 rounded-full bg-orange-500/8 border border-orange-500/10 pointer-events-none" />
        <div className="absolute top-0 right-0 h-full w-56 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-orange-400 uppercase tracking-widest mb-2">
              {today}
            </p>
            <h1 className="text-2xl font-bold text-white leading-snug">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-sm">
              Here's what's happening with your store today. Manage products, track orders, and monitor stock levels.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-xs text-slate-400 font-medium">All systems operational</span>
            </div>
          </div>
          <div className="shrink-0 hidden sm:block">
            <Lottie options={lottieOpts} height={130} width={160} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={totalProducts} icon={FiPackage}      color="bg-blue-500"   to="/admin/products" />
        <StatCard label="Total Orders"   value={totalOrders}   icon={FiShoppingBag}  color="bg-green-500"  to="/admin/orders" />
        <StatCard label="Total Users"    value={totalUsers}    icon={FiUsers}        color="bg-purple-500" to="/admin/users" />
        <StatCard label="Low Stock Items" value={lowStock}     icon={FiAlertTriangle} color="bg-orange-500" to="/admin/stock" />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-800 rounded-t-2xl">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-orange-400 font-semibold hover:text-orange-300 transition-colors">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{order.id.slice(-8)}</td>
                    <td className="px-6 py-3 text-slate-700 font-mono text-xs">{order.userId.slice(-8)}</td>
                    <td className="px-6 py-3 text-right font-semibold text-slate-800">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3"><StatusBadge status={order.orderStatus} /></td>
                    <td className="px-6 py-3 text-slate-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
