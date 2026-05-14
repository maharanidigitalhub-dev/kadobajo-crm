'use client';
import { useState, useEffect } from 'react';

type Tab = 'customers' | 'cms' | 'lp';

export default function ApprovalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('customers');
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/approval?type=${activeTab}&status=pending`)
      .then(r => r.json())
      .then(data => { setRequests(data); setLoading(false); });
  }, [activeTab]);

  async function handleAction(id: string, action: 'approve' | 'reject', note = '') {
    await fetch(`/api/approval/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reviewed_by: 'MANAGER_USER_ID', note }),
    });
    // Refresh list
    setRequests(prev => prev.filter((r: { id: string }) => r.id !== id));
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'customers', label: 'Customers' },
    { key: 'cms',       label: 'CMS'       },
    { key: 'lp',        label: 'Landing Page' },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Approval</h1>

      {/* Tab navigation */}
      <div className="flex border-b mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Approval list */}
      {loading ? (
        <p className="text-gray-500 text-sm">Memuat...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-400 text-sm">Tidak ada permintaan pending</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req: any) => (
            <li key={req.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{req.requester?.name ?? req.requested_by}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(req.created_at).toLocaleString('id-ID')}
                </p>
                {/* Preview data yang diubah */}
                <pre className="mt-2 text-xs bg-gray-50 rounded p-2 max-w-md overflow-x-auto">
                  {JSON.stringify(req.payload, null, 2)}
                </pre>
                {/* Jika ada foto chat untuk customer */}
                {req.payload?.chat_photo_url && (
                  <img
                    src={req.payload.chat_photo_url}
                    alt="Chat history"
                    className="mt-2 max-h-40 rounded border"
                  />
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleAction(req.id, 'approve')}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    const note = prompt('Alasan penolakan (opsional):') ?? '';
                    handleAction(req.id, 'reject', note);
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
