import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, ShieldCheck, Clock, XCircle, Loader2 } from 'lucide-react';

export default function Status() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const q = query(collection(db, 'members'), where('email', '==', email.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setResult({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('No application found with that Email ID. Please check and try again.');
      }
    } catch (err: any) {
      console.error('Error fetching status:', err);
      if (err.message?.includes('Missing or insufficient permissions')) {
        setError('Permission denied. Please ensure you are authorized to view this status.');
      } else {
        setError('An error occurred while fetching the status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">ABPSSP Membership Status</h2>
          <p className="mt-4 text-lg text-slate-600">
            Enter your Email ID to check your membership approval status.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-100 p-8">
          <form onSubmit={handleSearch} className="mb-8">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email ID
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@example.com"
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-3">Application Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-slate-500">Name</div>
                  <div className="col-span-2 text-sm font-bold text-slate-900">{result.name}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-slate-500">Phone</div>
                  <div className="col-span-2 text-sm text-slate-900">{result.phone}</div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-sm font-medium text-slate-500">Status</div>
                  <div className="col-span-2">
                    {result.status === 'active' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="h-4 w-4" /> Approved / Active
                      </span>
                    )}
                    {result.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="h-4 w-4" /> Pending Review
                      </span>
                    )}
                    {result.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="h-4 w-4" /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                {result.applicationId && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-slate-500">Application ID</div>
                    <div className="col-span-2 text-sm font-mono text-slate-900">{result.applicationId}</div>
                  </div>
                )}

                {result.serviceNo && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-slate-500">Service No.</div>
                    <div className="col-span-2 text-sm text-slate-900">{result.serviceNo}</div>
                  </div>
                )}

                {result.rank && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-slate-500">Rank</div>
                    <div className="col-span-2 text-sm text-slate-900">{result.rank}</div>
                  </div>
                )}

                {result.ppoNo && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-slate-500">PPO Number</div>
                    <div className="col-span-2 text-sm font-mono text-slate-900">{result.ppoNo}</div>
                  </div>
                )}

                {result.defenceService && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-slate-500">Service</div>
                    <div className="col-span-2 text-sm text-slate-900">{result.defenceService}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
