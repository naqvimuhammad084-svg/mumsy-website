'use client';

import { useEffect, useState } from 'react';

type Slide = {
  id: string | number;
  text: string | null;
  image_url?: string | null;
  sort_order: number;
  created_at?: string | null;
};

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSlides = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/slides?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setError((data && data.error) || 'Failed to load slides');
        setSlides([]);
      } else {
        setSlides(Array.isArray(data) ? data : []);
      }
    } catch {
      setError('Failed to load slides');
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) {
      setError('Add either top text or upload an image');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      let uploadedImageUrl = '';
      if (imageFile) {
        setUploading(true);
        const fd = new FormData();
        fd.set('file', imageFile);
        // Reuse existing safe upload endpoint and storage setup
        const upRes = await fetch('/api/admin/products/upload-image', { method: 'POST', body: fd });
        const up = await upRes.json().catch(() => ({}));
        setUploading(false);
        if (!upRes.ok || !up?.url) {
          setError(up?.error || 'Image upload failed');
          return;
        }
        uploadedImageUrl = String(up.url);
      }

      const res = await fetch('/api/admin/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          image_url: uploadedImageUrl || null,
          sort_order: sortOrder,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to add slide');
        return;
      }
      setText('');
      setImageFile(null);
      setSortOrder(0);
      setSuccess('Slide saved successfully');
      await loadSlides();
    } catch {
      setError('Failed to add slide');
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this slide?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/slides/${encodeURIComponent(String(id))}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error || 'Failed to delete slide') + ' (check hero_slides delete policy in Supabase)');
        return;
      }
      setSuccess('Slide deleted');
      setSlides((prev) => prev.filter((s) => String(s.id) !== String(id)));
      await loadSlides();
    } catch {
      setError('Failed to delete slide');
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl text-mumsy-dark">Hero Slides</h1>
      <p className="mt-1 text-sm text-mumsy-dark/70">
        Add image slides for the hero panel and top text announcements.
      </p>

      <form onSubmit={handleAdd} className="mt-6 p-4 rounded-2xl bg-white border border-mumsy-lavender/40 max-w-lg space-y-3">
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Top message text (optional)</span>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Hero image from your PC (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
          />
          {imageFile && (
            <p className="mt-1 text-xs text-mumsy-dark/70">
              Selected: {imageFile.name}
            </p>
          )}
        </label>
        <label className="block">
          <span className="text-sm text-mumsy-dark/80">Sort order</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-700">{success}</p>}
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-mumsy-purple text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {uploading ? 'Uploading image…' : saving ? 'Saving…' : 'Add slide item'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="font-semibold text-mumsy-dark mb-3">All slides</h2>
        {loading ? (
          <p className="text-mumsy-dark/70">Loading…</p>
        ) : slides.length === 0 ? (
          <p className="text-mumsy-dark/70">No slides yet. Add one above.</p>
        ) : (
          <div className="rounded-2xl border border-mumsy-lavender/40 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mumsy-soft/50 border-b border-mumsy-lavender/40">
                  <th className="text-left p-3">Order</th>
                  <th className="text-left p-3">Image</th>
                  <th className="text-left p-3">Text</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((s) => (
                  <tr key={s.id} className="border-b border-mumsy-lavender/30">
                    <td className="p-3">{s.sort_order ?? 0}</td>
                    <td className="p-3 max-w-[240px] truncate" title={s.image_url ?? ''}>
                      {s.image_url ? (
                        <a href={s.image_url} target="_blank" rel="noopener noreferrer" className="inline-block">
                          <img
                            src={s.image_url}
                            alt="Slide"
                            className="h-14 w-20 rounded object-cover border border-mumsy-lavender/40"
                          />
                        </a>
                      ) : (
                        <span className="text-mumsy-dark/50">—</span>
                      )}
                    </td>
                    <td className="p-3">{s.text || <span className="text-mumsy-dark/50">—</span>}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="rounded-full border border-red-300 px-3 py-1 text-red-600 font-medium hover:bg-red-50"
                      >
                        Delete slide
                      </button>
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

