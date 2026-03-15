'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Range } from '@/lib/types';

export default function AdminRangesPage() {
  const [ranges, setRanges] = useState<Range[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<{ name: string; slug: string; description: string; logo?: File | null }>({ name: '', slug: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ranges');
      const data = await res.json();
      if (!res.ok) {
        setError(Array.isArray(data) ? '' : (data.error || 'Failed to load'));
        setRanges([]);
      } else {
        setRanges(Array.isArray(data) ? data : []);
        setError('');
      }
    } catch {
      setError('Failed to load ranges');
      setRanges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const slugFromName = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editingId) {
        const fd = new FormData();
        fd.set('name', form.name);
        fd.set('slug', form.slug);
        fd.set('description', form.description);
        if (form.logo) fd.set('logo', form.logo);
        const res = await fetch(`/api/admin/ranges/${editingId}`, { method: 'PATCH', body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || 'Update failed');
          return;
        }
        setEditingId(null);
        setForm({ name: '', slug: '', description: '' });
      } else {
        const fd = new FormData();
        fd.set('name', form.name);
        fd.set('slug', form.slug);
        fd.set('description', form.description);
        if (form.logo) fd.set('logo', form.logo);
        const res = await fetch('/api/admin/ranges', { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || 'Create failed');
          return;
        }
        setForm({ name: '', slug: '', description: '' });
      }
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg.includes('fetch') ? 'Could not reach the server. Is "npm run dev" running?' : 'Request failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete range "${name}"?`)) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/ranges/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || 'Delete failed');
      else load();
    } catch {
      setError('Request failed');
    }
  };

  const startEdit = (r: Range) => {
    setEditingId(r.id);
    setForm({ name: r.name, slug: r.slug, description: (r.description as string) || '' });
  };

  return (
    <div>
      <h1 className="font-heading text-2xl text-mumsy-dark">Ranges</h1>
      <p className="mt-1 text-sm text-mumsy-dark/70">Add, edit, and delete ranges. New ranges appear on the site for customers.</p>

      <form onSubmit={handleSubmit} className="mt-6 p-4 rounded-2xl bg-white border border-mumsy-lavender/40 space-y-3 max-w-md">
        <h2 className="font-semibold text-mumsy-dark">{editingId ? 'Edit range' : 'Add range'}</h2>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Name</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => {
              setForm((f) => ({ ...f, name: e.target.value, slug: editingId ? f.slug : slugFromName(e.target.value) }));
            }}
            className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Slug (URL)</span>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Logo (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm((f) => ({ ...f, logo: e.target.files?.[0] ?? null }))}
            className="mt-1 w-full text-sm"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="rounded-full bg-mumsy-purple text-white px-4 py-2 text-sm font-medium disabled:opacity-60">
            {saving ? 'Saving…' : editingId ? 'Update' : 'Add range'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', slug: '', description: '' }); }} className="rounded-full border border-mumsy-lavender/60 px-4 py-2 text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h2 className="font-semibold text-mumsy-dark mb-3">All ranges</h2>
        {loading ? (
          <p className="text-mumsy-dark/70">Loading…</p>
        ) : ranges.length === 0 ? (
          <p className="text-mumsy-dark/70">No ranges yet. Add one above. (VINTIMA may already be in the database.)</p>
        ) : (
          <div className="rounded-2xl border border-mumsy-lavender/40 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mumsy-soft/50 border-b border-mumsy-lavender/40">
                  <th className="text-left p-3">Logo</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Slug</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ranges.map((r) => (
                  <tr key={r.id} className="border-b border-mumsy-lavender/30">
                    <td className="p-3">
                      {r.logo_url ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-mumsy-soft">
                          <Image src={r.logo_url} alt="" fill className="object-contain" unoptimized />
                        </div>
                      ) : (
                        <span className="text-mumsy-dark/50">—</span>
                      )}
                    </td>
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3 text-mumsy-dark/70">{r.slug}</td>
                    <td className="p-3">
                      <button type="button" onClick={() => startEdit(r)} className="text-mumsy-purple font-medium mr-2">Edit</button>
                      <button type="button" onClick={() => handleDelete(r.id, r.name)} className="text-red-600 font-medium">Delete</button>
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
