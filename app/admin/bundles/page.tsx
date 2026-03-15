'use client';

import { useEffect, useState } from 'react';
import {
  getRanges,
  getAllProducts,
  getAllBundles,
  createBundle,
  updateBundle,
  deleteBundle,
  setBundleProducts,
  getBundleProductIds,
} from '@/lib/data';
import type { Range } from '@/lib/types';
import type { Bundle } from '@/lib/types';
import type { Product } from '@/lib/types';

export default function AdminBundlesPage() {
  const [ranges, setRanges] = useState<Range[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    range_id: '',
    name: '',
    description: '',
    price: '',
    savings_label: '',
    productIds: [] as { product_id: string; quantity: number }[],
  });

  const productsInRange = form.range_id
    ? products.filter((p) => p.range_id === form.range_id)
    : [];

  const load = async () => {
    setLoading(true);
    const [r, p, b] = await Promise.all([getRanges(), getAllProducts(), getAllBundles()]);
    setRanges(r);
    setProducts(p);
    setBundles(b);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const getRangeName = (id: string) => ranges.find((r) => r.id === id)?.name ?? id;

  const addProductToForm = () => {
    const inRange = form.range_id ? products.filter((p) => p.range_id === form.range_id) : products;
    setForm((f) => ({ ...f, productIds: [...f.productIds, { product_id: inRange[0]?.id ?? '', quantity: 1 }] }));
  };

  const updateProductInForm = (index: number, product_id: string, quantity: number) => {
    setForm((f) => {
      const next = [...f.productIds];
      next[index] = { product_id, quantity };
      return { ...f, productIds: next };
    });
  };

  const removeProductFromForm = (index: number) => {
    setForm((f) => ({ ...f, productIds: f.productIds.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const price = parseFloat(form.price);
      if (isNaN(price) || price < 0) {
        setError('Invalid price');
        setSaving(false);
        return;
      }
      const items = form.productIds.filter((i) => i.product_id && i.quantity > 0);

      if (editingId) {
        const res = await updateBundle(editingId, {
          range_id: form.range_id,
          name: form.name,
          description: form.description || null,
          price,
          savings_label: form.savings_label || null,
        });
        if (res.error) setError(res.error);
        else {
          await setBundleProducts(editingId, items);
          setEditingId(null);
          setForm({ range_id: ranges[0]?.id ?? '', name: '', description: '', price: '', savings_label: '', productIds: [] });
          load();
        }
      } else {
        const res = await createBundle({
          range_id: form.range_id,
          name: form.name,
          description: form.description || null,
          price,
          savings_label: form.savings_label || null,
        });
        if (res.error) setError(res.error);
        else if (res.id) {
          await setBundleProducts(res.id, items);
          setForm({ range_id: ranges[0]?.id ?? '', name: '', description: '', price: '', savings_label: '', productIds: [] });
          load();
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete bundle "${name}"?`)) return;
    const res = await deleteBundle(id);
    if (res.error) setError(res.error);
    else load();
  };

  const startEdit = async (b: Bundle) => {
    setEditingId(b.id);
    const items = await getBundleProductIds(b.id);
    setForm({
      range_id: b.range_id,
      name: b.name,
      description: (b.description as string) || '',
      price: String(b.price),
      savings_label: (b.savings_label as string) ?? '',
      productIds: items.length > 0 ? items : [{ product_id: products[0]?.id ?? '', quantity: 1 }],
    });
  };

  return (
    <div>
      <h1 className="font-heading text-2xl text-mumsy-dark">Bundles</h1>
      <p className="mt-1 text-sm text-mumsy-dark/70">Create and edit bundles. Select products and set price.</p>

      {ranges.length === 0 && <p className="mt-4 text-amber-700 text-sm">Create at least one range first.</p>}

      <form onSubmit={handleSubmit} className="mt-6 p-4 rounded-2xl bg-white border border-mumsy-lavender/40 space-y-3 max-w-lg">
        <h2 className="font-semibold text-mumsy-dark">{editingId ? 'Edit bundle' : 'Add bundle'}</h2>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Range (bundle will show under this range; only products from this range can be added)</span>
          <select
            required
            value={form.range_id}
            onChange={(e) => {
              const newRangeId = e.target.value;
              setForm((f) => ({ ...f, range_id: newRangeId, productIds: [] }));
            }}
            className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
          >
            <option value="">Select range</option>
            {ranges.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Name</span>
          <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Description</span>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Price (Rs)</span>
          <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Savings label (e.g. Save 15%)</span>
          <input type="text" value={form.savings_label} onChange={(e) => setForm((f) => ({ ...f, savings_label: e.target.value }))} className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm" />
        </label>
        <div>
          <span className="text-sm text-mumsy-dark/80">Products in bundle (only products from the selected range above)</span>
          {!form.range_id && (
            <p className="text-amber-700 text-xs mt-1">Select a range first to add products.</p>
          )}
          {form.productIds.map((item, i) => (
            <div key={i} className="flex gap-2 items-center mt-1">
              <select
                value={item.product_id}
                onChange={(e) => updateProductInForm(i, e.target.value, item.quantity)}
                className="flex-1 rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
              >
                <option value="">Select product</option>
                {productsInRange.map((pr) => (
                  <option key={pr.id} value={pr.id}>{pr.name} (Rs {pr.price})</option>
                ))}
              </select>
              <input type="number" min="1" value={item.quantity} onChange={(e) => updateProductInForm(i, item.product_id, parseInt(e.target.value, 10) || 1)} className="w-16 rounded-xl border border-mumsy-lavender/50 px-2 py-2 text-sm" />
              <button type="button" onClick={() => removeProductFromForm(i)} className="text-red-600 text-sm">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addProductToForm} disabled={!form.range_id || productsInRange.length === 0} className="mt-2 text-sm text-mumsy-purple font-medium disabled:opacity-50">+ Add product</button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving || !form.range_id} className="rounded-full bg-mumsy-purple text-white px-4 py-2 text-sm font-medium disabled:opacity-60">{saving ? 'Saving…' : editingId ? 'Update' : 'Add bundle'}</button>
          {editingId && <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-mumsy-lavender/60 px-4 py-2 text-sm">Cancel</button>}
        </div>
      </form>

      <div className="mt-8">
        <h2 className="font-semibold text-mumsy-dark mb-3">All bundles</h2>
        {loading ? <p className="text-mumsy-dark/70">Loading…</p> : bundles.length === 0 ? <p className="text-mumsy-dark/70">No bundles yet.</p> : (
          <div className="rounded-2xl border border-mumsy-lavender/40 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mumsy-soft/50 border-b border-mumsy-lavender/40">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Range</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bundles.map((b) => (
                  <tr key={b.id} className="border-b border-mumsy-lavender/30">
                    <td className="p-3 font-medium">{b.name}</td>
                    <td className="p-3 text-mumsy-dark/70">{getRangeName(b.range_id)}</td>
                    <td className="p-3">Rs {b.price}</td>
                    <td className="p-3">
                      <button type="button" onClick={() => startEdit(b)} className="text-mumsy-purple font-medium mr-2">Edit</button>
                      <button type="button" onClick={() => handleDelete(b.id, b.name)} className="text-red-600 font-medium">Delete</button>
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
