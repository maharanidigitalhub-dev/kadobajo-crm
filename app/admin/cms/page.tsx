'use client';

import { useEffect, useState } from 'react';

type CmsHomepageData = {
  title: string;
  description: string;
  updatedAt?: string;
};

const initialForm: CmsHomepageData = {
  title: '',
  description: '',
};

export default function AdminCmsPage() {
  const [form, setForm] = useState<CmsHomepageData>(initialForm);
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCmsData() {
      setPageLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/cms', { cache: 'no-store' });
        const json = (await response.json()) as { data?: CmsHomepageData; error?: string };

        if (!response.ok) {
          throw new Error(json.error ?? 'Failed to load CMS data.');
        }

        if (!cancelled && json.data) {
          setForm({
            title: json.data.title ?? '',
            description: json.data.description ?? '',
            updatedAt: json.data.updatedAt,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load CMS data.');
        }
      } finally {
        if (!cancelled) {
          setPageLoading(false);
        }
      }
    }

    void loadCmsData();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || !description) {
      setError('Title dan description wajib diisi.');
      return;
    }

    setSaveLoading(true);

    try {
      const response = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      const json = (await response.json()) as { data?: CmsHomepageData; error?: string };

      if (!response.ok) {
        throw new Error(json.error ?? 'Gagal menyimpan konten.');
      }

      setForm((prev) => ({
        ...prev,
        title: json.data?.title ?? prev.title,
        description: json.data?.description ?? prev.description,
        updatedAt: json.data?.updatedAt,
      }));

      setNotice('Konten homepage berhasil disimpan.');
      window.alert('Konten homepage berhasil disimpan.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan konten.');
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Mini CMS</h1>
        <p className="mt-2 text-sm text-slate-600">Kelola konten homepage (title & description).</p>
      </div>

      {pageLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading CMS data...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              placeholder="Masukkan title homepage"
              disabled={saveLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              placeholder="Masukkan description homepage"
              disabled={saveLoading}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {notice ? <p className="text-sm text-emerald-600">{notice}</p> : null}

          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-500">
              {form.updatedAt ? `Last updated: ${new Date(form.updatedAt).toLocaleString()}` : 'Belum ada update.'}
            </p>

            <button
              type="submit"
              disabled={saveLoading}
              className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
