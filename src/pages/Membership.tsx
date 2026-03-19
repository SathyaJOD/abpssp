import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, writeBatch, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Shield, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';

export default function Membership() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');
  
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if any field is empty
    const emptyFields = Object.entries(formData).filter(([key, value]) => value.trim() === '');
    
    if (emptyFields.length > 0) {
      setError('All fields are mandatory. Please fill out the entire form.');
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
    setLoading(true);
    setError('');
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPaymentId = 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      const batch = writeBatch(db);
      
      // Save to Firestore
      const memberRef = doc(collection(db, 'members'));
      batch.set(memberRef, {
        ...formData,
        status: 'pending',
        paymentId: mockPaymentId,
        createdAt: serverTimestamp()
      });

      // Create PPO tracking document
      const ppoRef = doc(db, 'ppo_numbers', formData.ppoNo.trim());
      batch.set(ppoRef, {
        memberId: memberRef.id,
        createdAt: serverTimestamp()
      });

      await batch.commit();
      
      setSuccessId(memberRef.id);
      setStep(3);
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError('Failed to process application. Please try again later.');
    } finally {
      setLoading(false);
    }
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
                    <li><strong>Their families</strong>, including Wife/Husband, Children, Dependents</li>
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
                  <label htmlFor="panNo" className="block text-sm font-medium text-slate-700">PAN No *</label>
                  <input
                    type="text"
                    name="panNo"
                    id="panNo"
                    required
                    value={formData.panNo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="PAN Number"
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
                  <label htmlFor="defenceService" className="block text-sm font-medium text-slate-700">Defence Service *</label>
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
                  <label htmlFor="serviceYears" className="block text-sm font-medium text-slate-700">Service (Years) *</label>
                  <input
                    type="text"
                    name="serviceYears"
                    id="serviceYears"
                    required
                    value={formData.serviceYears}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="e.g. 22 Years"
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
                  <label htmlFor="spouseName" className="block text-sm font-medium text-slate-700">Name Of Spouse *</label>
                  <input
                    type="text"
                    name="spouseName"
                    id="spouseName"
                    required
                    value={formData.spouseName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Spouse Name"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address *</label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                    placeholder="Full Residential Address"
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
            <div className="p-8 space-y-8">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Membership Fee Summary</h3>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Membership Fee</span>
                  <span className="font-medium text-slate-900">₹ 100.00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-900 font-bold">Total Amount</span>
                  <span className="font-bold text-emerald-600 text-xl">₹ 100.00</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                <CreditCard className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Secure Payment Simulation</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This is a preview environment. Clicking "Pay Now" will simulate a successful transaction and submit your application.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="inline-flex justify-center py-3 px-6 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="inline-flex items-center justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    'Pay ₹100 Now'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-12 text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Thank you for applying for membership. Your application is currently <strong className="text-amber-600">Pending Approval</strong> by the administration.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 inline-block text-left">
                <p className="text-sm text-slate-500 mb-1">Your Application ID:</p>
                <p className="text-lg font-mono font-bold text-slate-900">{successId}</p>
                <p className="text-xs text-slate-400 mt-2">Please save this ID to check your status later.</p>
              </div>

              <div>
                <button
                  onClick={() => window.location.href = '/status'}
                  className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  Check Status Page
                </button>
              </div>
            </div>
          )}

        </div>
        </div>
        </div>
      </div>
    </div>
  );
}
