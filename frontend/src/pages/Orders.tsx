import { useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiX, FiHash, FiCalendar, FiCreditCard } from "react-icons/fi";
import { useUserOrders } from "../hooks/useServiceA";
import { useAuthStore } from "../store/authStore";
import type { Order } from "../grpc/clients/types";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  pending:   { label: "Pending",   color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-400", icon: <FiClock size={12} />       },
  confirmed: { label: "Confirmed", color: "bg-blue-50   text-blue-700   border-blue-200",   dot: "bg-blue-400",   icon: <FiCheckCircle size={12} /> },
  shipped:   { label: "Shipped",   color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-400", icon: <FiTruck size={12} />       },
  delivered: { label: "Delivered", color: "bg-green-50  text-green-700  border-green-200",  dot: "bg-green-400",  icon: <FiCheckCircle size={12} /> },
  cancelled: { label: "Cancelled", color: "bg-red-50    text-red-700    border-red-200",    dot: "bg-red-400",    icon: <FiXCircle size={12} />     },
};

function fmtDate(iso: string, full = false) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: full ? "long" : "short", year: "numeric",
      ...(full ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
  } catch { return "—"; }
}

// ── Order Detail Modal ────────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const status = STATUS_CONFIG[order.orderStatus] ?? STATUS_CONFIG["pending"];

  const steps = ["pending", "confirmed", "shipped", "delivered"];
  const stepIdx = steps.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:rounded-2xl sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="font-bold text-slate-900">Order Details</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">#{order.id.slice(-10).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">

          {/* Status + date row */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${status.color}`}>
              {status.icon}
              {status.label}
            </span>
            <div className="text-right">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Placed on</p>
              <p className="text-xs font-medium text-slate-700">{fmtDate(order.createdAt, true)}</p>
            </div>
          </div>

      

          {/* Order info */}
          <div className="bg-slate-50 rounded-xl divide-y divide-slate-100">
            {[
              { icon: FiHash,       label: "Order ID",       value: order.id },
              { icon: FiCalendar,   label: "Date",           value: fmtDate(order.createdAt, true) },
              { icon: FiCreditCard, label: "Payment",        value: order.paymentStatus ?? "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3">
                <Icon size={14} className="text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500 w-20 shrink-0">{label}</span>
                <span className="text-xs font-medium text-slate-800 font-mono truncate">{value}</span>
              </div>
            ))}
          </div>

              {/* Progress tracker */}
          {!isCancelled && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between relative">
                {/* connector line */}
                <div className="absolute left-0 right-0 top-3 h-0.5 bg-slate-200 mx-6 z-0" />
                <div
                  className="absolute left-0 top-3 h-0.5 bg-orange-400 z-0 transition-all duration-500"
                  style={{ right: `${(1 - stepIdx / (steps.length - 1)) * 100}%`, left: '24px' }}
                />
                {steps.map((step, i) => (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-colors ${
                      i < stepIdx       ? "bg-orange-500 border-orange-500 text-white"
                      : i === stepIdx   ? "bg-white border-orange-500 text-orange-500"
                      : "bg-white border-slate-200 text-slate-300"
                    }`}>
                      {i < stepIdx ? "✓" : i + 1}
                    </div>
                    <p className={`text-[10px] font-medium capitalize text-center leading-tight ${
                      i <= stepIdx ? "text-slate-700" : "text-slate-300"
                    }`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Items ({order.products.length})
            </p>
            <div className="space-y-2">
              {order.products.map((p) => (
                <div key={p.productId} className="bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.productName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Qty: {p.quantity} × ₹{p.price.toLocaleString("en-IN")}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900 shrink-0">
                    ₹{(p.quantity * p.price).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-900 rounded-xl px-4 py-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-300">Total Amount</p>
            <p className="text-xl font-bold text-white">₹{order.totalAmount.toLocaleString("en-IN")}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Order Row Card ────────────────────────────────────────────────────────────

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const status = STATUS_CONFIG[order.orderStatus] ?? STATUS_CONFIG["pending"];

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-4 hover:border-orange-200 hover:shadow-md transition-all text-left group"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-orange-50 transition-colors">
        <FiPackage size={18} className="text-slate-500 group-hover:text-orange-500 transition-colors" />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800 truncate">
            Order #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {order.products.length} item{order.products.length !== 1 ? "s" : ""} · {fmtDate(order.createdAt)}
        </p>
      </div>

      {/* Right side */}
      <div className="shrink-0 text-right space-y-1.5">
        <p className="text-sm font-bold text-slate-900">₹{order.totalAmount.toLocaleString("en-IN")}</p>
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.color}`}>
          {status.icon}
          {status.label}
        </span>
      </div>

      <span className="text-slate-300 group-hover:text-orange-400 transition-colors text-base ml-1">›</span>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function Orders() {
  const [selected, setSelected]     = useState<Order | null>(null);
  const isAuthenticated             = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading, isError, refetch } = useUserOrders();
  const orders = data?.data ?? [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <FiPackage size={48} className="text-slate-200" />
        <p className="text-slate-500 font-medium">Please log in to view your orders</p>
        <Link to="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} />}

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
          <Link to="/products"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
            Shop More →
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-3 bg-slate-100 rounded w-16" />
                  <div className="h-3 bg-slate-100 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <p className="text-slate-500 text-sm">Failed to load orders.</p>
            <button onClick={() => refetch()}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center gap-4">
            <FiPackage size={40} className="text-slate-200" />
            <p className="text-slate-500 font-medium">No orders yet</p>
            <Link to="/products"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onClick={() => setSelected(order)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
