import { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { useProducts, useUpdateProduct } from '../../hooks/useServiceA';
import type { Product } from '../../grpc/clients/types';

function stockBadge(stock: number): { label: string; cls: string } {
  if (stock === 0)  return { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' };
  if (stock < 20)   return { label: 'Low',          cls: 'bg-orange-100 text-orange-700' };
  if (stock < 100)  return { label: 'Medium',       cls: 'bg-yellow-100 text-yellow-700' };
  return              { label: 'OK',           cls: 'bg-green-100 text-green-700' };
}

function StockRow({ product }: { product: Product }) {
  const update = useUpdateProduct();
  const [editing, setEditing] = useState(false);
  const [value,   setValue]   = useState(String(product.stock));

  const save = async () => {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n >= 0) {
      await update.mutateAsync({
        id: product.id, name: product.name, description: product.description,
        category: product.category, image: product.image, price: product.price,
        stock: n, status: product.status,
      });
    }
    setEditing(false);
  };

  const { label, cls } = stockBadge(product.stock);

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50">
      <td className="px-5 py-3 font-medium text-slate-800 max-w-[200px] truncate">{product.name}</td>
      <td className="px-5 py-3 text-slate-500 text-sm">{product.category}</td>
      <td className="px-5 py-3 text-right font-semibold text-slate-700">₹{product.price.toLocaleString('en-IN')}</td>
      <td className="px-5 py-3 text-right">
        {editing ? (
          <div className="inline-flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-20 border border-orange-400 rounded-lg px-2 py-1 text-sm text-right focus:outline-none"
              autoFocus
            />
            <button onClick={save} disabled={update.isPending} className="p-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
              <FiCheck size={13} />
            </button>
            <button onClick={() => { setValue(String(product.stock)); setEditing(false); }} className="p-1 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors">
              <FiX size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="font-bold text-slate-800 hover:text-orange-500 transition-colors px-2 py-0.5 rounded-lg hover:bg-orange-50"
          >
            {product.stock}
          </button>
        )}
      </td>
      <td className="px-5 py-3">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
      </td>
    </tr>
  );
}

export default function AdminStock() {
  const { data, isLoading } = useProducts({ limit: 200 });

  const sorted = [...(data?.data ?? [])].sort((a, b) => a.stock - b.stock);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Stock Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Click a stock number to edit it inline</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { label: 'Out of Stock (0)',  cls: 'bg-red-100 text-red-700' },
          { label: 'Low (1–19)',        cls: 'bg-orange-100 text-orange-700' },
          { label: 'Medium (20–99)',    cls: 'bg-yellow-100 text-yellow-700' },
          { label: 'OK (100+)',         cls: 'bg-green-100 text-green-700' },
        ].map((b) => (
          <span key={b.label} className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${b.cls}`}>{b.label}</span>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : sorted.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No products</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Category</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Price</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Stock</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Level</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <StockRow key={p.id} product={p} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
