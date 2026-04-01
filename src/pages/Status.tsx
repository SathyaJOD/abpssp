import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, ShieldCheck, Clock, XCircle, Loader2, Printer } from 'lucide-react';

export default function Status() {
  const [ppoNo, setPpoNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppoNo.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const q = query(collection(db, 'members'), where('ppoNo', '==', ppoNo.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setResult({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('No application found with that PPO Number. Please check and try again.');
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

  const printMemberForm = (member: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the form.');
      return;
    }

    const html = `
      <html>
        <head>
          <title>Membership Application - ${member.name}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; padding: 40px; line-height: 1.6; color: #000; font-size: 14px; }
            .right-align { text-align: right; font-weight: bold; }
            .center-align { text-align: center; }
            .title { font-size: 20px; font-weight: bold; margin: 10px 0; }
            .sub-title { font-size: 16px; text-decoration: underline; font-weight: bold; margin: 15px 0; }
            .part { font-size: 16px; font-weight: bold; margin: 10px 0 0 0; }
            .row { margin-bottom: 10px; display: flex; flex-wrap: wrap; }
            .item { margin-right: 20px; }
            .val { border-bottom: 1px dashed #000; padding: 0 10px; min-width: 100px; display: inline-block; font-weight: bold; }
            .indent { margin-left: 20px; }
            .signature { margin-top: 50px; text-align: right; font-weight: bold; }
            .header-container { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
            .logo-container { width: 120px; }
            .logo { width: 100px; height: 100px; object-fit: contain; }
            .header-text { flex: 1; padding: 0 20px; }
            .photo-container { width: 120px; display: flex; justify-content: flex-end; padding-top: 35px; }
            .photo { width: 110px; height: 140px; object-fit: cover; border: 1px solid #000; }
            .photo-placeholder { width: 115px; height: 145px; border: 1px solid #000; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #000; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="right-align" style="margin-bottom: 10px;">Appendix 'A' (To the Bye Laws)</div>
          
          <div class="header-container">
            <div class="logo-container">
              <img src="https://abpssp.in/wp-content/uploads/2021/10/LOGO1-e1655295576596.png" alt="ABPSSP Logo" class="logo" />
            </div>
            <div class="center-align header-text">
              <div class="title">Akhil Bharatiya Poorva Sainik Seva Parishad<br/>Andhra Pradesh</div>
              <div>E-mail: abpssap01@gmail.com</div>
              <div class="sub-title">Membership Application Form</div>
              <div class="part">PART - I</div>
            </div>
            <div class="photo-container">
              <div class="photo-placeholder">PHOTO</div>
            </div>
          </div>
          
          <div class="row">1. Membership No: <span class="val">${member.applicationId || member.id || ''}</span></div>
          <div class="row">2. Membership Fee: <span class="val">Rs. 100/-</span></div>
          <div class="row">3. Donation Rs: <span class="val">${member.donation || ''}</span></div>
          <div class="row">
            <span class="item">4. Service No: <span class="val">${member.serviceNo || ''}</span></span>
            <span class="item">Rank: <span class="val">${member.rank || ''}</span></span>
            <span class="item">Name: <span class="val">${member.name || ''}</span></span>
          </div>
          <div class="row">5. Name of Spouse / Next of kin: <span class="val">${member.spouseName || ''}</span></div>
          <div class="row">6. Wing of the Defence Services: <span class="val">${member.defenceService || ''}</span></div>
          <div class="row">
            <span class="item">7. A) Arm/Service: <span class="val">${member.armService || ''}</span></span>
            <span class="item">B) Branch: <span class="val">${member.branch || ''}</span></span>
          </div>
          <div class="row indent">C) Decorations (if any): <span class="val">${member.decorations || ''}</span></div>
          <div class="row">
            <span class="item">8. A) Date of Retirement/Release: <span class="val">${member.dateOfRetirement || ''}</span></span>
            <span class="item">Total Service: <span class="val">${member.serviceYears || ''}</span></span>
          </div>
          <div class="row indent">(As per PPO / Discharge Certificate)</div>
          <div class="row indent">B) Date of Birth: <span class="val">${member.dob || ''}</span></div>
          <div class="row">9. Amount of Basic Pension Rs <span class="val">${member.basicPension || ''}</span> pm as per PPO</div>
          <div class="row indent">PPO No: <span class="val">${member.ppoNo || ''}</span></div>
          <div class="row">10. Aadhaar Card No: <span class="val">${member.aadharNo || ''}</span></div>
          <div class="row">11. PAN Card No (if issued): <span class="val">${member.panNo || ''}</span></div>
          <div class="row">12. A) Permanent Address: <span class="val">${member.permanentAddress || ''}</span></div>
          <div class="row indent">B) Current/Correspondence Address: <span class="val">${member.address || ''}</span></div>
          <div class="row indent">
            <span class="item">C) Land Line No. with STD Code <span class="val">${member.landline || ''}</span></span>
            <span class="item">Mobile No: <span class="val">${member.phone || ''}</span></span>
          </div>
          <div class="row indent">D) Email ID: <span class="val">${member.email || ''}</span></div>
          <div class="row">13. Occupation (Post Retirement), if any <span class="val">${member.occupation || ''}</span></div>
          <div class="row indent">(Designation and Name of the organisation in which employed and its address)</div>
          <div class="row">14. Any other info you want to share: <span class="val">${member.otherInfo || ''}</span></div>
          
          <div class="signature">Signature of the Applicant</div>
          
          <script>
            window.onload = function() {
              var logo = document.querySelector('.logo');
              if (logo && !logo.complete) {
                logo.onload = function() { setTimeout(function() { window.print(); }, 500); };
                logo.onerror = function() { setTimeout(function() { window.print(); }, 500); };
              } else {
                setTimeout(function() { window.print(); }, 500);
              }
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">ABPSSP Membership Status</h2>
          <p className="mt-4 text-lg text-slate-600">
            Enter your PPO Number to check your membership approval status.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-100 p-8">
          <form onSubmit={handleSearch} className="mb-8">
            <label htmlFor="ppoNo" className="block text-sm font-medium text-slate-700 mb-2">
              PPO Number
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="ppoNo"
                value={ppoNo}
                onChange={(e) => setPpoNo(e.target.value)}
                placeholder="Enter your PPO Number"
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
                
                {result.status === 'active' && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <button
                      onClick={() => printMemberForm(result)}
                      className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Printer className="h-5 w-5 mr-2" />
                      Download Application Form
                    </button>
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
