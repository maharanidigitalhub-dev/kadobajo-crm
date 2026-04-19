'use client';

import { useEffect, useState } from 'react';

type HeroData = {
  title: string;
  subtitle: string;
  image: string;
};

type HomepageData = {
  hero: HeroData;
};

const defaultHero: HeroData = {
  title: '',
  subtitle: '',
  image: '',
};

export default function AdminCmsPage() {
  const [form, setForm] = useState<HeroData>(defaultHero);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewImage = localPreview || form.image.trim();

  useEffect(() => {
    if (!imageFile) {
      setLocalPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setLocalPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  useEffect(() => {
    let cancelled = false;

    async function loadCms() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/cms?key=homepage', { cache: 'no-store' });
        const json = (await response.json()) as { data?: HomepageData; error?: string };

        if (!response.ok) {
          throw new Error(json.error ?? 'Gagal memuat data CMS.');
        }

        if (!cancelled) {
          setForm({
            title: json.data?.hero?.title ?? '',
            subtitle: json.data?.hero?.subtitle ?? '',
            image: json.data?.hero?.image ?? '',
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Gagal memuat data CMS.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCms();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const title = form.title.trim();
    const subtitle = form.subtitle.trim();
    const currentImage = form.image.trim();

    if (!title || !subtitle) {
      setError('Title dan subtitle wajib diisi.');
      return;
    }

    if (!imageFile && !currentImage) {
      setError('Upload image wajib diisi.');
      return;
    }

    setSaving(true);

    try {
      const payload = new FormData();
      payload.append('key', 'homepage');
      payload.append('title', title);
      payload.append('subtitle', subtitle);
      payload.append('currentImage', currentImage);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const response = await fetch('/api/cms', {
        method: 'POST',
        body: payload,
      });

      const json = (await response.json()) as { data?: HomepageData; error?: string };

      if (!response.ok) {
        throw new Error(json.error ?? 'Gagal menyimpan CMS.');
      }

      if (json.data?.hero?.image) {
        setForm((prev) => ({ ...prev, image: json.data?.hero?.image ?? prev.image }));
      }
      setImageFile(null);
      window.alert('CMS berhasil disimpan.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan CMS.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Mini CMS</h1>
      <p className="mt-2 text-sm text-slate-600">Edit konten homepage hero untuk kebutuhan demo.</p>

      {loading ? (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading data...
        </div>
      ) : (
        <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              placeholder="Masukkan title"
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="mb-1 block text-sm font-medium text-slate-700">
              Subtitle
            </label>
            <input
              id="subtitle"
              type="text"
              value={form.subtitle}
              onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              placeholder="Masukkan subtitle"
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="image" className="mb-1 block text-sm font-medium text-slate-700">
              Upload Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              disabled={saving}
            />
            <p className="mt-1 text-xs text-slate-500">
              Upload file gambar baru. Jika tidak diisi, gambar lama tetap dipakai.
            </p>
          </div>

          {previewImage ? (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <img src={previewImage} alt="Preview hero" className="h-56 w-full object-cover" />
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      )}
    </main>
  );
}
