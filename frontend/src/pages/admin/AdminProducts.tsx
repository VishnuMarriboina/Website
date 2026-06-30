import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useActivateProduct,
  useDeactivateProduct,
} from '../../hooks/useServiceA';
import type { Product } from '../../grpc/clients/types';

const CATEGORIES = ['Sand', 'Gravel', 'Stone', 'Dust', 'GSB', 'Other'];
const STATUSES   = ['active', 'inactive'];

type FormState = {
  name: string; description: string; category: string;
  image: string; price: string; stock: string; status: string;
};

const EMPTY_FORM: FormState = {
  name: '', description: '', category: CATEGORIES[0],
  image: '', price: '', stock: '', status: 'active',
};

function ProductModal({
  product, onClose,
}: { product: Product | null; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(
    product
      ? { name: product.name, description: product.description, category: product.category,
          image: product.image, price: String(product.price), stock: String(product.stock), status: product.status }
      : EMPTY_FORM
  );
  const [err, setErr] = useState('');
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const isPending = create.isPending || update.isPending;

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!form.name.trim()) { setErr('Name is required'); return; }
    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);
    if (isNaN(price) || price < 0) { setErr('Invalid price'); return; }
    if (isNaN(stock) || stock < 0) { setErr('Invalid stock'); return; }
    try {
      if (product) {
        await update.mutateAsync({ id: product.id, name: form.name.trim(), description: form.description,
          category: form.category, image: form.image, price, stock, status: form.status });
      } else {
        await create.mutateAsync({ name: form.name.trim(), description: form.description,
          category: form.category, image: form.image, price, stock, status: form.status });
      }
      onClose();
    } catch (ex: unknown) {
      setErr((ex as { message?: string })?.message ?? 'Failed to save product');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Name *</label>
            <input value={form.name} onChange={set('name')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
              <select value={form.category} onChange={set('category')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
              <select value={form.status} onChange={set('status')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Image URL</label>
            <input value={form.image} onChange={set('image')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Price (₹)</label>
              <input type="number" min="0" value={form.price} onChange={set('price')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={set('stock')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          {err && <p className="text-red-500 text-xs">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={isPending} className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
              {isPending ? 'Saving…' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const del = useDeleteProduct();
  const handleDelete = async () => {
    await del.mutateAsync(product.id);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="text-4xl mb-3">🗑️</div>
        <h2 className="font-bold text-slate-900 text-lg mb-1">Delete Product?</h2>
        <p className="text-sm text-slate-500 mb-6">"{product.name}" will be permanently removed.</p>
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

export default function AdminProducts() {
  const [search, setSearch]     = useState('');
  const [editProduct, setEdit]  = useState<Product | null | 'new'>('new' as never);
  const [deleteTarget, setDel]  = useState<Product | null>(null);
  const [showModal, setModal]   = useState(false);

  const { data, isLoading } = useProducts({ limit: 200, search });
  const activate   = useActivateProduct();
  const deactivate = useDeactivateProduct();

  const products = data?.data ?? [];

  const handleToggle = (p: Product) =>
    p.status === 'active' ? deactivate.mutateAsync(p.id) : activate.mutateAsync(p.id);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">{data?.meta?.total ?? 0} products total</p>
        </div>
        <button
          onClick={() => { setEdit(null); setModal(true); }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <FiPlus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Category</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Price</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Stock</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-medium text-slate-800 max-w-[200px] truncate">{p.name}</td>
                    <td className="px-5 py-3 text-slate-500">{p.category}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-right text-slate-700">{p.stock}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleToggle(p)} className="flex items-center gap-1.5 text-xs font-medium transition-colors">
                        {p.status === 'active'
                          ? <><FiToggleRight size={18} className="text-green-500" /> <span className="text-green-600">Active</span></>
                          : <><FiToggleLeft  size={18} className="text-slate-400" /> <span className="text-slate-400">Inactive</span></>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => { setEdit(p); setModal(true); }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDel(p)}
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
        <ProductModal
          product={editProduct === 'new' ? null : editProduct}
          onClose={() => { setModal(false); setEdit('new' as never); }}
        />
      )}
      {deleteTarget && (
        <DeleteDialog product={deleteTarget} onClose={() => setDel(null)} />
      )}
    </div>
  );
}
