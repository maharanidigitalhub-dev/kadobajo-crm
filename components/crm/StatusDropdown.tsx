'use client';

import { useState, useRef } from 'react';
import { CustomerStatus } from '@/types/customer';

const STATUSES: { value: CustomerStatus; label: string; bg: string; text: string; dot: string }[] = [
  { value: 'new',         label: 'New',         bg: 'bg-stone-100',  text: 'text-stone-700',   dot: 'bg-stone-400' },
  { value: 'contacted',   label: 'Contacted',   bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  { value: 'negotiation', label: 'Negotiation', bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  { value: 'deal',        label: 'Deal',        bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { value: 'lost',        label: 'Lost',        bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
];

export interface StatusDropdownProps {
  customerId: string;
  customerName?: string;
  currentStatus: CustomerStatus;
  userRole?: string;
  userId?: string;
  userName?: string;
  onUpdate?: (newStatus: CustomerStatus) => void;
}

export default function StatusDropdown({
  customerId,
  customerName,
  currentStatus,
  userRole = 'management',
  userId,
  userName,
  onUpdate,
}: StatusDropdownProps) {
  const [status, setStatus]         = useState<CustomerStatus>(currentStatus);
  const [loading, setLoading]       = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [pendingStatus, setPending] = useState<CustomerStatus | null>(null);
  const [chatImage, setChatImage]   = useState<File | null>(null);
  const [imagePreview, setPreview]  = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [successMsg, setSuccess]    = useState('');
  const [errorMsg, setError]        = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const current = STATUSES.find((s) => s.value === status) ?? STATUSES[0];
  const isDirect = userRole === 'superadmin' || userRole === 'manager';

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as CustomerStatus;
    if (newStatus === status) return;

    if (isDirect) {
      await applyStatusDirect(newStatus);
    } else {
      setPending(newStatus);
      setChatImage(null);
      setPreview(null);
      setError('');
      setShowModal(true);
    }
  }

  async function applyStatusDirect(newStatus: CustomerStatus) {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        onUpdate?.(newStatus);
      }
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setError('Ukuran foto maksimal 500KB');
      return;
    }
    setError('');
    setChatImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function submitApproval() {
    if (!chatImage) { setError('Foto chat wajib diupload'); return; }
    if (!pendingStatus) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', chatImage);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      let chatImageUrl = '';
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        chatImageUrl = uploadData.url ?? '';
      }

      const res = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'status_change',
          payload: {
            customer_id: customerId,
            customer_name: customerName,
            from_status: status,
            to_status: pendingStatus,
          },
          chat_image_url: chatImageUrl,
          requested_by: userId,
          requester_name: userName,
        }),
      });

      if (res.ok) {
        setSuccess(`Request perubahan status ke "${pendingStatus}" sudah dikirim ke Manager untuk disetujui.`);
        setTimeout(() => { setShowModal(false); setSuccess(''); }, 3000);
      } else {
        const err = await res.json();
        setError(err.error ?? 'Gagal mengirim request');
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="relative inline-flex items-center">
        <span className={`absolute left-2 w-2 h-2 rounded-full ${current.dot} pointer-events-none z-10`} />
        <select
          value={status}
          onChange={handleChange}
          disabled={loading || userRole === 'management'}
          className={`pl-6 pr-3 py-1 text-xs font-medium rounded-full border appearance-none cursor-pointer transition-all
            ${current.bg} ${current.text} border-current/20
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current/30
            disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {loading && (
          <span className="ml-2 w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">📸</div>
                <div>
                  <h3 className="text-[15px] font-semibold text-stone-800">Ubah Status Customer</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Memerlukan foto bukti chat & persetujuan Manager</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <div>
                  <span className="text-xs text-stone-500">Customer:</span>
                  <p className="text-sm font-semibold text-stone-800">{customerName ?? customerId}</p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUSES.find((s) => s.value === status)?.bg} ${STATUSES.find((s) => s.value === status)?.text}`}>
                    {STATUSES.find((s) => s.value === status)?.label}
                  </span>
                  <span className="text-stone-400 text-sm">→</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUSES.find((s) => s.value === pendingStatus)?.bg} ${STATUSES.find((s) => s.value === pendingStatus)?.text}`}>
                    {STATUSES.find((s) => s.value === pendingStatus)?.label}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-2">
                  📷 Foto Bukti Chat <span className="text-red-500">*</span>
                  <span className="font-normal text-stone-400 ml-1">(maks 500KB)</span>
                </label>
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-stone-200" />
                    <button
                      onClick={() => { setChatImage(null); setPreview(null); }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                    >✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-28 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
                  >
                    <span className="text-2xl">📤</span>
                    <span className="text-xs">Klik untuk upload foto chat</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              {errorMsg && <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</div>}
              {successMsg && <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg font-medium">{successMsg}</div>}
            </div>

            {!successMsg && (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => { setShowModal(false); setPending(null); }}
                  disabled={uploading}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={submitApproval}
                  disabled={uploading || !chatImage}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
                  ) : 'Kirim Request'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
