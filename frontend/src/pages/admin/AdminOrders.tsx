import { useState } from 'react';
import { useAllOrders, useUpdateOrderStatus } from '../../hooks/useServiceA';
import type { Order } from '../../grpc/clients/types';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_TABS    = ['all', ...STATUS_OPTIONS];

function statusClass(s: string): string {
  const map: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped:   'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[s] ?? 'bg-slate-100 text-slate-600';
}

function OrderRow({ order }: { order: Order }) {
  const update   = useUpdateOrderStatus();
  const [status, setStatus] = useState(order.orderStatus);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await update.mutateAsync({ id: order.id, orderStatus: newStatus });
    } catch {
      setStatus(order.orderStatus);
    }
  };

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50">
      <td className="px-5 py-3 font-mono text-xs text-slate-500">{order.id.slice(-8)}</td>
      <td className="px-5 py-3 font-mono text-xs text-slate-500">{order.userId.slice(-8)}</td>
      <td className="px-5 py-3 text-slate-700 text-sm">{order.products.length} item{order.products.length !== 1 ? 's' : ''}</td>
      <td className="px-5 py-3 text-right font-semibold text-slate-800">₹{order.totalAmount.toLocaleString('en-IN')}</td>
      <td className="px-5 py-3">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusClass(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-5 py-3">
        <select
          value={status}
          onChange={handleChange}
          disabled={update.isPending}
          className="border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </td>
      <td className="px-5 py-3 text-xs text-slate-500">
        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
    </tr>
  );
}

const STATUS_DOT: Record<string, string> = {
  pending:   'bg-yellow-400',
  confirmed: 'bg-blue-400',
  shipped:   'bg-indigo-400',
  delivered: 'bg-green-400',
  cancelled: 'bg-red-400',
};

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState('all');
  const { data, isLoading } = useAllOrders({});

  const allOrders = data?.data ?? [];
  const filtered  = activeTab === 'all'
    ? allOrders
    : allOrders.filter((o) => o.orderStatus === activeTab);

  const counts = allOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500 mt-0.5">{data?.meta?.total ?? 0} orders total</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
            }`}
          >
            {tab !== 'all' && tab !== activeTab && (
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[tab] ?? 'bg-slate-400'}`} />
            )}
            {tab}
            {tab !== 'all' && counts[tab] ? (
              <span className="ml-0.5 text-[10px] opacity-70">({counts[tab]})</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">User ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Items</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Update</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
