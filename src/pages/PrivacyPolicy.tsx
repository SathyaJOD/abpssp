import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, FileText, Database, Cookie, UserCheck, Link as LinkIcon, RefreshCw, MapPin } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="bg-indigo-600 px-8 py-10 text-white text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-indigo-200" />
          <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-indigo-100 max-w-2xl mx-auto">
            Welcome to the official website of ABPSSP AP STATE (ABPSSP).
            We are a registered society under the Andhra Pradesh Societies Registration Act, 2001.
          </p>
        </div>

        <div className="px-8 py-10 text-slate-600 space-y-10">
          <p className="text-lg text-slate-700 font-medium border-b border-slate-100 pb-6">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <Database className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-slate-900">1. Information We Collect</h2>
            </div>
            <p className="text-slate-600">We collect only necessary information to provide our services:</p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3">Personal Information</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>Full Name</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>Mobile Number</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>Email Address</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>Address</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>Membership/Application Details</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3">Payment Information</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>Transaction ID (UTR Number)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>Payment Screenshot (uploaded by user)</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3">Technical Information</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>IP Address</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>Device & Browser details</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>Website usage data</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-slate-900">2. Purpose of Data Collection</h2>
            </div>
            <p className="text-slate-600">We use your information for:</p>
            <ul className="grid sm:grid-cols-2 gap-3 text-slate-600">
              <li className="flex items-start gap-2"><UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> Processing membership applications</li>
              <li className="flex items-start gap-2"><UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> Verifying payments (QR / Bank Transfer)</li>
              <li className="flex items-start gap-2"><UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> Generating Application ID</li>
              <li className="flex items-start gap-2"><UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> Sending updates via SMS/Email</li>
              <li className="flex items-start gap-2"><UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> Managing events, programs, and activities</li>
              <li className="flex items-start gap-2"><UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> Internal administrative purposes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <Shield className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-slate-900">3. Payment Verification Policy</h2>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-3">
              <p className="flex items-center gap-3 text-slate-700"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Users must upload payment screenshot + UTR ID</p>
              <p className="flex items-center gap-3 text-slate-700"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Payments are verified manually or through banking records</p>
              <p className="flex items-center gap-3 text-slate-700"><div className="w-2 h-2 rounded-full bg-red-500"></div> Fake or invalid transactions will be rejected</p>
              <p className="flex items-center gap-3 text-slate-700 font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> No sensitive banking details (PIN, OTP, passwords) are collected</p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <Lock className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-slate-900">4. Data Sharing Policy</h2>
            </div>
            <p className="text-slate-800 font-medium">We do NOT sell or share your personal data.</p>
            <p className="text-slate-600">Your information may only be shared:</p>
            <ul className="space-y-2 text-slate-600 pl-4 border-l-2 border-indigo-100">
              <li>• With authorized ABPSSP officials</li>
              <li>• When required by law or government authorities</li>
              <li>• To prevent fraud or misuse</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <Shield className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-slate-900">5. Data Security</h2>
            </div>
            <p className="text-slate-600">We take appropriate security measures to protect your data:</p>
            <ul className="space-y-2 text-slate-600 pl-4 border-l-2 border-indigo-100">
              <li>• Secure storage systems</li>
              <li>• Restricted access to authorized personnel</li>
              <li>• Regular monitoring for unauthorized access</li>
            </ul>
          </section>

          <div className="grid sm:grid-cols-2 gap-8 pt-4">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-indigo-600">
                <Cookie className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-slate-900">6. Cookies Usage</h2>
              </div>
              <p className="text-slate-600">Our website may use cookies to:</p>
              <ul className="space-y-1 text-slate-600 text-sm pl-4 border-l-2 border-indigo-100">
                <li>• Improve user experience</li>
                <li>• Analyze website traffic</li>
                <li>• Optimize performance</li>
              </ul>
              <p className="text-sm text-slate-500 italic mt-2">You can disable cookies in your browser settings.</p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-indigo-600">
                <UserCheck className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-slate-900">7. User Rights</h2>
              </div>
              <p className="text-slate-600">You have the right to:</p>
              <ul className="space-y-1 text-slate-600 text-sm pl-4 border-l-2 border-indigo-100">
                <li>• Access your personal data</li>
                <li>• Request corrections</li>
                <li>• Request deletion (as per legal rules)</li>
              </ul>
            </section>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-indigo-600">
                <LinkIcon className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-slate-900">8. Third-Party Links</h2>
              </div>
              <p className="text-slate-600">
                Our website may contain external links. We are not responsible for their privacy practices.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-indigo-600">
                <RefreshCw className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-slate-900">9. Policy Updates</h2>
              </div>
              <p className="text-slate-600">
                This Privacy Policy may be updated anytime. Changes will be posted on this page.
              </p>
            </section>
          </div>

          <section className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-3 text-indigo-600 mb-6">
              <MapPin className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-slate-900">10. Contact Information</h2>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h3 className="font-semibold text-indigo-900 mb-2">ABPSSP AP STATE</h3>
              <div className="flex items-start gap-3 text-indigo-800 mt-4">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Registered Office:</p>
                  <p>H.No 1-1-1, Vijayawada, Andhra Pradesh, 520001</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
