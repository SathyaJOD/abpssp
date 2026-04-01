import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, writeBatch, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Shield, CreditCard, CheckCircle2, Loader2, QrCode, Building2, User, Hash, MapPin, Copy, ChevronLeft, Printer } from 'lucide-react';

export default function Membership() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');
  
  const [utrId, setUtrId] = useState('');
  const [paymentSettings, setPaymentSettings] = useState({
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=abpssp@sbi&pn=ABPSSP&am=100.00&cu=INR',
    bankName: 'State Bank of India',
    accountName: 'ABPSSP Andhra Pradesh',
    accountNo: '31234567890',
    ifscCode: 'SBIN0001234',
    branch: 'Vijayawada Main'
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'payment');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaymentSettings(docSnap.data() as any);
        }
      } catch (err) {
        console.error('Error fetching payment settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const [formData, setFormData] = useState({
    serviceNo: '',
    rank: '',
    name: '',
    aadharNo: '',
    panNo: '',
    email: '',
    defenceService: '',
    dob: '',
    dateOfRetirement: '',
    serviceYears: '',
    ppoNo: '',
    spouseName: '',
    address: '',
    phone: '',
    photoUrl: '',
    donation: '',
    armService: '',
    branch: '',
    decorations: '',
    basicPension: '',
    permanentAddress: '',
    landline: '',
    occupation: '',
    otherInfo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if any mandatory field is empty
    const mandatoryFields = ['serviceNo', 'rank', 'name', 'aadharNo', 'email', 'defenceService', 'dob', 'dateOfRetirement', 'serviceYears', 'ppoNo', 'spouseName', 'address', 'phone', 'photoUrl'];
    const emptyFields = mandatoryFields.filter(key => (formData[key as keyof typeof formData] as string).trim() === '');
    
    if (emptyFields.length > 0) {
      setError('Please fill out all mandatory fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const ppoNo = formData.ppoNo.trim();

      // 1. Check if an active member exists with this PPO Number
      const q = query(collection(db, 'members'), where('ppoNo', '==', ppoNo), where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError('A member with this PPO Number already exists.');
        setLoading(false);
        return;
      }

      // 2. Check if a recent application is already being processed
      const ppoRef = doc(db, 'ppo_numbers', ppoNo);
      const ppoSnap = await getDoc(ppoRef);
      if (ppoSnap.exists()) {
        setError('A membership application with this PPO Number is already being processed.');
        setLoading(false);
        return;
      }

      setStep(2);
    } catch (err) {
      console.error("Error validating PPO Number:", err);
      setError('Failed to validate PPO Number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!utrId.trim()) {
      setError('Please enter UTR ID.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const applicationId = 'ABPSSP2026-' + Math.floor(10000 + Math.random() * 90000);
      
      const batch = writeBatch(db);
      
      // Save to Firestore
      const memberRef = doc(collection(db, 'members'));
      batch.set(memberRef, {
        ...formData,
        status: 'pending',
        applicationId: applicationId,
        utrId: utrId,
        createdAt: serverTimestamp()
      });

      // Create PPO tracking document
      const ppoRef = doc(db, 'ppo_numbers', formData.ppoNo.trim());
      batch.set(ppoRef, {
        memberId: memberRef.id,
        createdAt: serverTimestamp()
      });

      await batch.commit();
      
      setSuccessId(applicationId);
      setStep(3);
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError('Failed to process application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const printMemberForm = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the form.');
      return;
    }

    const html = `
      <html>
        <head>
          <title>Member Application - ${formData.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { color: #10b981; margin: 10px 0 5px 0; font-size: 24px; }
            h2 { color: #475569; font-size: 18px; margin-top: 0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }
            .value { font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; min-height: 24px; }
            .photo { width: 150px; height: 150px; object-fit: cover; border: 1px solid #cbd5e1; border-radius: 8px; }
            .photo-container { text-align: right; }
            .section-title { background: #f1f5f9; padding: 10px; font-weight: bold; margin: 30px 0 15px 0; border-left: 4px solid #10b981; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ABPSSP Andhra Pradesh</h1>
            <h2>Member Application Form</h2>
            <p style="color: #64748b; font-size: 14px;">Application ID: ${successId}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div style="flex: 1; padding-right: 20px;">
              <div class="field"><div class="label">Full Name</div><div class="value" style="font-size: 20px; font-weight: bold;">${formData.name || '-'}</div></div>
              <div class="field"><div class="label">Status</div><div class="value" style="color: #f59e0b; text-transform: uppercase; font-weight: bold;">PENDING</div></div>
            </div>
            <div class="photo-container">
              ${formData.photoUrl ? `<img src="${formData.photoUrl}" class="photo" alt="Member Photo" />` : '<div class="photo" style="display:flex; align-items:center; justify-content:center; background:#f8fafc; color:#94a3b8;">No Photo</div>'}
            </div>
          </div>

          <div class="section-title">Personal Information</div>
          <div class="grid">
            <div class="field"><div class="label">Phone Number</div><div class="value">${formData.phone || '-'}</div></div>
            <div class="field"><div class="label">Email Address</div><div class="value">${formData.email || '-'}</div></div>
            <div class="field"><div class="label">Date of Birth</div><div class="value">${formData.dob || '-'}</div></div>
            <div class="field"><div class="label">Spouse Name</div><div class="value">${formData.spouseName || '-'}</div></div>
            <div class="field"><div class="label">Aadhar Number</div><div class="value">${formData.aadharNo || '-'}</div></div>
            <div class="field"><div class="label">PAN Number</div><div class="value">${formData.panNo || '-'}</div></div>
          </div>

          <div class="section-title">Service Details</div>
          <div class="grid">
            <div class="field"><div class="label">Defence Service</div><div class="value">${formData.defenceService || '-'}</div></div>
            <div class="field"><div class="label">Arm/Service</div><div class="value">${formData.armService || '-'}</div></div>
            <div class="field"><div class="label">Rank</div><div class="value">${formData.rank || '-'}</div></div>
            <div class="field"><div class="label">Service Number</div><div class="value">${formData.serviceNo || '-'}</div></div>
            <div class="field"><div class="label">Service Years</div><div class="value">${formData.serviceYears || '-'}</div></div>
            <div class="field"><div class="label">Date of Retirement</div><div class="value">${formData.dateOfRetirement || '-'}</div></div>
            <div class="field"><div class="label">PPO Number</div><div class="value">${formData.ppoNo || '-'}</div></div>
            <div class="field"><div class="label">Basic Pension</div><div class="value">${formData.basicPension || '-'}</div></div>
            <div class="field" style="grid-column: span 2;"><div class="label">Decorations</div><div class="value">${formData.decorations || '-'}</div></div>
          </div>

          <div class="section-title">Contact & Other Details</div>
          <div class="grid">
            <div class="field" style="grid-column: span 2;"><div class="label">Present Address</div><div class="value">${formData.address || '-'}</div></div>
            <div class="field" style="grid-column: span 2;"><div class="label">Permanent Address</div><div class="value">${formData.permanentAddress || '-'}</div></div>
            <div class="field"><div class="label">Landline</div><div class="value">${formData.landline || '-'}</div></div>
            <div class="field"><div class="label">Present Occupation</div><div class="value">${formData.occupation || '-'}</div></div>
            <div class="field" style="grid-column: span 2;"><div class="label">Other Information</div><div class="value">${formData.otherInfo || '-'}</div></div>
          </div>

          <div class="section-title">Payment Information</div>
          <div class="grid">
            <div class="field"><div class="label">UTR / Reference ID</div><div class="value">${utrId || '-'}</div></div>
            <div class="field"><div class="label">Donation Amount</div><div class="value">${formData.donation || '-'}</div></div>
            <div class="field" style="grid-column: span 2;">
              <div class="label">Payment Screenshot</div>
              <div style="margin-top: 10px;">
                ${formData.screenshotUrl ? `<img src="${formData.screenshotUrl}" style="max-width: 300px; border: 1px solid #cbd5e1; border-radius: 8px;" alt="Payment Screenshot" />` : 'No screenshot provided'}
              </div>
            </div>
          </div>

          <div class="footer">
            Generated on ${new Date().toLocaleString()} from ABPSSP Membership Portal
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
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
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <Shield className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
          <h2 className="text-3xl font-extrabold text-slate-900">Membership Application</h2>
          <p className="mt-4 text-lg text-slate-600">
            Join Akhil Bharatiya Poorva Sainik Seva Parishad - Andhra Pradesh
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Rules & Eligibility */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-4 border-b pb-2">✅ Membership Eligibility</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-emerald-600">👤</span> 1. Primary Eligible Members
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 ml-6 list-disc">
                    <li><strong>Ex-Servicemen (ESM)</strong> of Army, Navy, Air Force</li>
                    <li><strong>Their families</strong>, including Wife/Husband, Dependents</li>
                  </ul>
                  <p className="text-xs text-slate-500 mt-2 ml-6 italic">👉 These are the main eligible members of the organization.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-emerald-600">👥</span> 2. Other Types of Members
                  </h4>
                  <div className="mt-2 space-y-3 ml-6 text-sm text-slate-600">
                    <div>
                      <strong className="text-slate-700">🔹 Sponsored Members:</strong>
                      <ul className="list-disc ml-5 mt-1">
                        <li>Must be Indian citizens</li>
                        <li>Donate ₹50,000 or more</li>
                        <li>Can include social workers & reputed personalities</li>
                        <li>Need approval from the Management Committee</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-slate-700">🔹 Representative Members:</strong>
                      <ul className="list-disc ml-5 mt-1">
                        <li>State/District level office bearers</li>
                        <li>Representatives from Trusts, Special organizations, Units like Sainik Parivar Kalyan Nyas</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-slate-700">🔹 General Members:</strong>
                      <ul className="list-disc ml-5 mt-1">
                        <li>ESMs and their families who submit application and get approval</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-emerald-600">🏅</span> 3. Patron (Special Category)
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 ml-6 list-disc">
                    <li>Governor of Andhra Pradesh</li>
                    <li>Senior national-level dignitaries</li>
                    <li>Appointed by management committee</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-2xl shadow-md p-6 border border-red-100">
              <h3 className="text-xl font-bold text-red-800 mb-4 border-b border-red-200 pb-2">❌ Disqualification</h3>
              <p className="text-sm text-red-700 mb-2 font-medium">A person cannot become a member if:</p>
              <ul className="space-y-1 text-sm text-red-700 ml-2">
                <li>• Mentally or physically unfit</li>
                <li>• Dismissed from Armed Forces</li>
                <li>• Court-martialed or convicted</li>
                <li>• Declared as deserter</li>
                <li>• Involved in criminal cases (CBI/ED/Police)</li>
                <li>• Proven misconduct against Armed Forces values</li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-2xl shadow-md p-6 border border-amber-100">
              <h3 className="text-xl font-bold text-amber-800 mb-4 border-b border-amber-200 pb-2">⚠️ Membership Termination</h3>
              <p className="text-sm text-amber-700 mb-2 font-medium">Membership can be cancelled if:</p>
              <ul className="space-y-1 text-sm text-amber-700 ml-2">
                <li>• Member resigns</li>
                <li>• Member passes away</li>
                <li>• Member acts against organization</li>
                <li>• Committee decides removal</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-7">
            {/* Progress Steps */}
            <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
          </div>
          <div className="flex justify-center space-x-12 mt-2 text-sm font-medium text-slate-500">
            <span className={step >= 1 ? 'text-emerald-600' : ''}>Details</span>
            <span className={step >= 2 ? 'text-emerald-600' : ''}>Payment</span>
            <span className={step >= 3 ? 'text-emerald-600' : ''}>Complete</span>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="serviceNo" className="block text-sm font-medium text-slate-700">Service No *</label>
                  <input
                    type="text"
                    name="serviceNo"
                    id="serviceNo"
                    required
                    value={formData.serviceNo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="e.g. 14451667-N"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="rank" className="block text-sm font-medium text-slate-700">Rank *</label>
                  <input
                    type="text"
                    name="rank"
                    id="rank"
                    required
                    value={formData.rank}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="e.g. HAV"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Full Name"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="aadharNo" className="block text-sm font-medium text-slate-700">Aadhar No *</label>
                  <input
                    type="text"
                    name="aadharNo"
                    id="aadharNo"
                    required
                    value={formData.aadharNo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="12-digit Aadhar Number"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="panNo" className="block text-sm font-medium text-slate-700">PAN No</label>
                  <input
                    type="text"
                    name="panNo"
                    id="panNo"
                    value={formData.panNo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="PAN Number (if issued)"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email ID *</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="defenceService" className="block text-sm font-medium text-slate-700">Wing of the Defence Services *</label>
                  <select
                    name="defenceService"
                    id="defenceService"
                    required
                    value={formData.defenceService}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border bg-white"
                  >
                    <option value="">Select Service</option>
                    <option value="Army">Army</option>
                    <option value="Navy">Navy</option>
                    <option value="Air Force">Air Force</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="armService" className="block text-sm font-medium text-slate-700">Arm/Service</label>
                  <input
                    type="text"
                    name="armService"
                    id="armService"
                    value={formData.armService}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Arm/Service"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="branch" className="block text-sm font-medium text-slate-700">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    id="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Branch"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="decorations" className="block text-sm font-medium text-slate-700">Decorations (if any)</label>
                  <input
                    type="text"
                    name="decorations"
                    id="decorations"
                    value={formData.decorations}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Decorations"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="dob" className="block text-sm font-medium text-slate-700">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="dateOfRetirement" className="block text-sm font-medium text-slate-700">Date of Retirement *</label>
                  <input
                    type="date"
                    name="dateOfRetirement"
                    id="dateOfRetirement"
                    required
                    value={formData.dateOfRetirement}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="serviceYears" className="block text-sm font-medium text-slate-700">Total Service (Years Months Days) *</label>
                  <input
                    type="text"
                    name="serviceYears"
                    id="serviceYears"
                    required
                    value={formData.serviceYears}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="e.g. 22 Years 5 Months 10 Days"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="basicPension" className="block text-sm font-medium text-slate-700">Amount of Basic Pension Rs pm as per PPO</label>
                  <input
                    type="text"
                    name="basicPension"
                    id="basicPension"
                    value={formData.basicPension}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Rs."
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="ppoNo" className="block text-sm font-medium text-slate-700">PPO No *</label>
                  <input
                    type="text"
                    name="ppoNo"
                    id="ppoNo"
                    required
                    value={formData.ppoNo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="PPO Number"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="spouseName" className="block text-sm font-medium text-slate-700">Name of Spouse / Next of kin *</label>
                  <input
                    type="text"
                    name="spouseName"
                    id="spouseName"
                    required
                    value={formData.spouseName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Spouse / Next of kin Name"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="permanentAddress" className="block text-sm font-medium text-slate-700">Permanent Address</label>
                  <textarea
                    name="permanentAddress"
                    id="permanentAddress"
                    rows={2}
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Permanent Address"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700">Current/Correspondence Address *</label>
                  <textarea
                    name="address"
                    id="address"
                    rows={2}
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Current Address"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="landline" className="block text-sm font-medium text-slate-700">Land Line No with STD Code</label>
                  <input
                    type="tel"
                    name="landline"
                    id="landline"
                    value={formData.landline}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Land Line Number"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Mobile Number"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="donation" className="block text-sm font-medium text-slate-700">Donation Rs (Optional)</label>
                  <input
                    type="number"
                    name="donation"
                    id="donation"
                    value={formData.donation}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Donation Amount"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="occupation" className="block text-sm font-medium text-slate-700">Occupation (Post Retirement), if any</label>
                  <textarea
                    name="occupation"
                    id="occupation"
                    rows={2}
                    value={formData.occupation}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Designation and Name of the organisation in which employed and its address"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="otherInfo" className="block text-sm font-medium text-slate-700">Any other info you want to share</label>
                  <textarea
                    name="otherInfo"
                    id="otherInfo"
                    rows={2}
                    value={formData.otherInfo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Other Information"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700">Profile Photo *</label>
                  <div className="mt-1 flex items-center gap-4">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Preview" className="h-12 w-12 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <User className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 800000) {
                          alert('Photo size must be less than 800KB.');
                          e.target.value = '';
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, photoUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Validating...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="p-0 space-y-0 bg-white">
              {/* Premium Header with Gradient */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-bold tracking-tight mb-2">Membership Payment</h3>
                      <p className="text-slate-400 text-sm max-w-md">Please complete the one-time membership fee to finalize your application.</p>
                    </div>
                    <div className="hidden sm:flex bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
                      <CreditCard className="h-10 w-10 text-emerald-400" />
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Amount Due</div>
                    <div className="text-4xl font-black text-white">₹ 100.00</div>
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-12 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* QR Code Section - Modern Card */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center h-full">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl border border-slate-700">
                          Instant UPI
                        </div>
                        <img 
                          src={paymentSettings.qrCodeUrl} 
                          alt="UPI QR Code" 
                          className="w-48 h-48 rounded-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
                          <QrCode className="h-5 w-5 text-emerald-600" />
                          Scan to Pay
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Open any UPI app (GPay, PhonePe, Paytm) and scan the code above to pay instantly.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details Section - Modern List */}
                  <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-200/60 flex flex-col justify-center">
                    <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-emerald-600" />
                      Direct Bank Transfer
                    </h4>
                    
                    <div className="space-y-6">
                      {[
                        { label: 'Account Name', value: paymentSettings.accountName, icon: User },
                        { label: 'Account Number', value: paymentSettings.accountNo, icon: Hash, copy: true },
                        { label: 'IFSC Code', value: paymentSettings.ifscCode, icon: Shield, copy: true },
                        { label: 'Branch', value: paymentSettings.branch, icon: MapPin }
                      ].map((detail, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                              <detail.icon className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">{detail.label}</p>
                              <p className="text-sm font-bold text-slate-900">{detail.value}</p>
                            </div>
                          </div>
                          {detail.copy && (
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(detail.value);
                                alert(`${detail.label} copied!`);
                              }}
                              className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title={`Copy ${detail.label}`}
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Verification Section - Guided Input */}
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-600/5 rounded-[2rem] -m-4 blur-xl"></div>
                  <div className="relative bg-white p-8 lg:p-10 rounded-[2rem] border-2 border-emerald-100 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">Payment Verification</h4>
                          <p className="text-sm text-slate-500 mt-1">Enter your transaction reference to confirm payment.</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 max-w-md w-full">
                        <div className="relative">
                          <input
                            type="text"
                            id="utrId"
                            value={utrId}
                            onChange={(e) => setUtrId(e.target.value)}
                            className="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg font-mono p-5 pl-6 border bg-slate-50/50 placeholder:text-slate-300"
                            placeholder="Enter UTR / Transaction ID"
                            required
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">Required</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Shield className="h-3 w-3" />
                      <span>Your application status will be updated once our team verifies the transaction (usually within 24-48 hours).</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="order-2 sm:order-1 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm uppercase tracking-widest transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Details
                  </button>
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={loading}
                    className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center py-5 px-12 border border-transparent shadow-2xl shadow-emerald-200 text-sm font-black rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Processing...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-12 text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted to ABPSSP!</h3>
              <p className="text-slate-600 mb-4 max-w-md mx-auto">
                Thank you for applying for membership with ABPSSP AP STATE. Your application is currently <strong className="text-amber-600">Pending Approval</strong> by the administration.
              </p>
              
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm max-w-md mx-auto mb-8 border border-blue-100">
                <p className="font-medium mb-1">📩 Notifications Sent</p>
                <p>An email and SMS have been sent to your registered contact details with your Application ID and current status.</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 inline-block text-left">
                <p className="text-sm text-slate-500 mb-1">Your Application ID:</p>
                <p className="text-xl font-mono font-bold text-slate-900">{successId}</p>
                <p className="text-xs text-slate-400 mt-2">Please save this ID to check your status later.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={printMemberForm}
                  className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Download Application
                </button>
                <button
                  onClick={() => window.location.href = '/status'}
                  className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  Check Status Page
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center py-3 px-6 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print / Download Form
                </button>
              </div>
            </div>
          )}

          {/* Printable Form - Hidden on screen, visible on print */}
          <div id="printable-form" className="hidden print:block p-8 bg-white text-black text-sm">
            <div className="text-center mb-6 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold uppercase">Akhil Bharatiya Purva Sainik Seva Parishad</h1>
              <h2 className="text-xl font-bold uppercase mt-1">Andhra Pradesh State</h2>
              <h3 className="text-lg font-bold uppercase mt-1">Membership Form</h3>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <p><strong>Membership No:</strong> _________________</p>
                <p><strong>Membership Fee:</strong> Rs. 100/-</p>
                <p><strong>Donation Rs:</strong> {formData.donation || '_________________'}</p>
              </div>
              <div className="w-32 h-32 border-2 border-black flex items-center justify-center overflow-hidden">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">Photo</span>
                )}
              </div>
            </div>

            <table className="w-full border-collapse border border-black mb-6">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-1/3">Service No, Rank, Name</td>
                  <td className="border border-black p-2">{formData.serviceNo}, {formData.rank}, {formData.name}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Name of Spouse / Next of kin</td>
                  <td className="border border-black p-2">{formData.spouseName}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Wing of the Defence Services</td>
                  <td className="border border-black p-2">{formData.defenceService}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">A) Arm/Service<br/>B) Branch<br/>C) Decorations (if any)</td>
                  <td className="border border-black p-2">
                    A) {formData.armService}<br/>
                    B) {formData.branch}<br/>
                    C) {formData.decorations}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">A) Date of Retirement/Release, Total Service<br/>B) Date of Birth</td>
                  <td className="border border-black p-2">
                    A) {formData.dateOfRetirement}, {formData.serviceYears}<br/>
                    B) {formData.dob}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Amount of Basic Pension Rs pm as per PPO, PPO No</td>
                  <td className="border border-black p-2">{formData.basicPension}, {formData.ppoNo}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Aadhaar Card No</td>
                  <td className="border border-black p-2">{formData.aadharNo}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">PAN Card No (if issued)</td>
                  <td className="border border-black p-2">{formData.panNo}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">A) Permanent Address<br/>B) Current/Correspondence Address<br/>C) Land Line No, Mobile No<br/>D) Email ID</td>
                  <td className="border border-black p-2">
                    A) {formData.permanentAddress}<br/>
                    B) {formData.address}<br/>
                    C) {formData.landline}, {formData.phone}<br/>
                    D) {formData.email}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Occupation (Post Retirement), if any</td>
                  <td className="border border-black p-2">{formData.occupation}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Any other info you want to share</td>
                  <td className="border border-black p-2">{formData.otherInfo}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8">
              <p className="font-bold mb-4">Declaration:</p>
              <p className="text-justify mb-8">
                I hereby declare that the information given above is true to the best of my knowledge and belief. I agree to abide by the rules and regulations of the Akhil Bharatiya Purva Sainik Seva Parishad.
              </p>
              
              <div className="flex justify-between items-end mt-16">
                <div>
                  <p>Date: _________________</p>
                  <p className="mt-2">Place: _________________</p>
                </div>
                <div className="text-center">
                  <p>_________________________</p>
                  <p className="mt-1 font-bold">Signature of the Applicant</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 border-t-2 border-black pt-4">
              <h4 className="font-bold text-center mb-4">For Office Use Only</h4>
              <div className="flex justify-between">
                <p>Received Rs. 100/- towards Membership Fee.</p>
                <p>Receipt No: _________________</p>
              </div>
              <div className="flex justify-between mt-8">
                <p>Date: _________________</p>
                <p>Signature of Authorized Signatory</p>
              </div>
            </div>
          </div>

        </div>
        </div>
        </div>
      </div>
    </div>
  );
}
