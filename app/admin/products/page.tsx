'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  getRanges,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
} from '@/lib/data';
import type { Range, Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [ranges, setRanges] = useState<Range[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    range_id: '',
    name: '',
    description: '',
    price: '',
    benefits: '',
    ingredients: '',
    how_to_use: '',
    images: [] as File[],
  });

  const load = async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([getRanges(), getAllProducts()]);
      setRanges(r);
      setProducts(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getRangeName = (id: string) => ranges.find((r) => r.id === id)?.name ?? id;

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

      const benefits = form.benefits.trim()
        ? form.benefits.trim().split('\n').map((s) => s.trim()).filter(Boolean)
        : null;
      const ingredients = form.ingredients.trim()
        ? form.ingredients.trim().split('\n').map((s) => s.trim()).filter(Boolean)
        : null;
      const how_to_use = form.how_to_use.trim()
        ? form.how_to_use.trim().split('\n').map((s) => s.trim()).filter(Boolean)
        : null;

      if (editingId) {
        const res = await updateProduct(editingId, {
          range_id: form.range_id,
          name: form.name,
          description: form.description || null,
          price,
          benefits,
          ingredients,
          how_to_use,
        });
        if (res.error) setError(res.error);
        else {
          for (const file of form.images) {
            const up = await uploadProductImage(file);
            if (up.url) await addProductImage(editingId, up.url, 0);
          }
          setEditingId(null);
          setForm({ range_id: ranges[0]?.id ?? '', name: '', description: '', price: '', benefits: '', ingredients: '', how_to_use: '', images: [] });
          load();
        }
      } else {
        const res = await createProduct({
          range_id: form.range_id,
          name: form.name,
          description: form.description || null,
          price,
          benefits,
          ingredients,
          how_to_use,
        });
        if (res.error) setError(res.error);
        else if (res.id) {
          let order = 0;
          for (const file of form.images) {
            const fd = new FormData();
            fd.set('file', file);
            const upRes = await fetch('/api/admin/products/upload-image', { method: 'POST', body: fd });
            const up = await upRes.json().catch(() => ({}));
            if (up.url) await addProductImage(res.id, up.url, order++);
          }
          setForm({ range_id: ranges[0]?.id ?? '', name: '', description: '', price: '', benefits: '', ingredients: '', how_to_use: '', images: [] });
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
    if (!confirm(`Delete product "${name}"?`)) return;
    const res = await deleteProduct(id);
    if (res.error) setError(res.error);
    else load();
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      range_id: p.range_id,
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      benefits: Array.isArray(p.benefits) ? p.benefits.join('\n') : '',
      ingredients: Array.isArray(p.ingredients) ? p.ingredients.join('\n') : '',
      how_to_use: Array.isArray(p.how_to_use) ? p.how_to_use.join('\n') : '',
      images: [],
    });
  };

  return (
    <div>
      <h1 className="font-heading text-2xl text-mumsy-dark">Products</h1>
      <p className="mt-1 text-sm text-mumsy-dark/70">Add, edit, and delete products. Upload images to the product-images bucket.</p>

      {ranges.length === 0 && (
        <p className="mt-4 text-amber-700 text-sm">Create at least one range first (Ranges management).</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 p-4 rounded-2xl bg-white border border-mumsy-lavender/40 space-y-3 max-w-lg">
        <h2 className="font-semibold text-mumsy-dark">{editingId ? 'Edit product' : 'Add product'}</h2>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Range</span>
          <select
            required
            value={form.range_id}
            onChange={(e) => setForm((f) => ({ ...f, range_id: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
          >
            <option value="">Select range</option>
            {ranges.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
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
          <span className="text-sm text-mumsy-dark/80">Benefits (one per line)</span>
          <textarea value={form.benefits} onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))} rows={3} className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Ingredients (one per line)</span>
          <textarea value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} rows={3} className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">How to use (one per line)</span>
          <textarea value={form.how_to_use} onChange={(e) => setForm((f) => ({ ...f, how_to_use: e.target.value }))} rows={3} className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Images (optional, add more after saving)</span>
          <input type="file" accept="image/*" multiple onChange={(e) => setForm((f) => ({ ...f, images: Array.from(e.target.files ?? []) }))} className="mt-1 w-full text-sm" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving || !form.range_id} className="rounded-full bg-mumsy-purple text-white px-4 py-2 text-sm font-medium disabled:opacity-60">{saving ? 'Saving…' : editingId ? 'Update' : 'Add product'}</button>
          {editingId && <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-mumsy-lavender/60 px-4 py-2 text-sm">Cancel</button>}
        </div>
      </form>

      <div className="mt-8">
        <h2 className="font-semibold text-mumsy-dark mb-3">All products</h2>
        {loading ? <p className="text-mumsy-dark/70">Loading…</p> : products.length === 0 ? <p className="text-mumsy-dark/70">No products yet.</p> : (
          <div className="rounded-2xl border border-mumsy-lavender/40 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mumsy-soft/50 border-b border-mumsy-lavender/40">
                  <th className="text-left p-3">Image</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Range</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-mumsy-lavender/30">
                    <td className="p-3">
                      {p.images?.length ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-mumsy-soft">
                          <Image src={p.images[0].url} alt={p.name} fill className="object-contain" unoptimized />
                        </div>
                      ) : <span className="text-mumsy-dark/50">—</span>}
                    </td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-mumsy-dark/70">{getRangeName(p.range_id)}</td>
                    <td className="p-3">Rs {p.price}</td>
                    <td className="p-3">
                      <button type="button" onClick={() => startEdit(p)} className="text-mumsy-purple font-medium mr-2">Edit</button>
                      <button type="button" onClick={() => handleDelete(p.id, p.name)} className="text-red-600 font-medium">Delete</button>
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