import React from 'react';
import { Target, Eye, Shield, Users, Building, Lightbulb, Rocket, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] py-12 px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">About ABPSSP-AP</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Akhil Bharatiya Poorva Sainik Seva Parishad – Andhra Pradesh
            </p>
          </div>
          
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Intro */}
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-xl font-medium text-slate-800 leading-relaxed mb-6">
                <strong>Akhil Bharatiya Poorva Sainik Seva Parishad – Andhra Pradesh (ABPSSP-AP)</strong> is a registered organization of ex-servicemen dedicated to serving society, supporting veterans, and contributing to nation-building.
              </p>
              <p className="text-lg leading-relaxed">
                Established with the vision of unity, service, and patriotism, ABPSSP works as a platform for retired Armed Forces personnel (Army, Navy, and Air Force) to continue their service to the nation even after retirement.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-[#ea580c]" />
                  <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#ea580c] shrink-0 mt-0.5" />
                    <span className="text-slate-700">To promote unity, integrity, and national security awareness</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#ea580c] shrink-0 mt-0.5" />
                    <span className="text-slate-700">To support ex-servicemen and their families</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#ea580c] shrink-0 mt-0.5" />
                    <span className="text-slate-700">To contribute to rural development, healthcare, and education</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#ea580c] shrink-0 mt-0.5" />
                    <span className="text-slate-700">To engage in relief and rehabilitation during natural calamities</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-8 w-8 text-[#1e3a8a]" />
                  <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  To build a strong and self-reliant society by utilizing the discipline, skills, and dedication of ex-servicemen for national development and social welfare.
                </p>
              </div>
            </div>

            {/* What We Do */}
            <div>
              <div className="flex items-center gap-3 mb-6 border-b pb-2">
                <Shield className="h-8 w-8 text-[#2f5a28]" />
                <h2 className="text-2xl font-bold text-slate-900">What We Do</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Organize social service activities and awareness programs",
                  "Support war widows, veterans, and their families",
                  "Conduct youth motivation and patriotic events",
                  "Participate in disaster relief and rescue operations",
                  "Promote national pride through events like Kargil Vijay Diwas"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <CheckCircle className="h-5 w-5 text-[#2f5a28] shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community & Registration */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4 border-b pb-2">
                  <Users className="h-6 w-6 text-[#1e3a8a]" />
                  <h2 className="text-xl font-bold text-slate-900">Our Community</h2>
                </div>
                <p className="text-slate-700 mb-3">ABPSSP brings together:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Ex-servicemen (Army, Navy, Air Force)
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Their families and dependents
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Social workers and supporters
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4 border-b pb-2">
                  <Building className="h-6 w-6 text-[#1e3a8a]" />
                  <h2 className="text-xl font-bold text-slate-900">Registration Details</h2>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  ABPSSP-AP is officially registered under the Andhra Pradesh Societies Registration Act, 2001, with its registered office in NTR District, Andhra Pradesh.
                </p>
              </div>
            </div>

            {/* Motto & Commitment */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 text-center flex flex-col justify-center">
                <Lightbulb className="h-10 w-10 text-[#facc15] mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-500 uppercase tracking-wider mb-2">Our Motto</h2>
                <p className="text-2xl font-bold text-[#1e3a8a]">“Seva – Sahas – Samman”</p>
                <p className="text-slate-600 mt-2">(Service – Courage – Respect)</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <Rocket className="h-8 w-8 text-[#ea580c]" />
                  <h2 className="text-2xl font-bold text-slate-900">Our Commitment</h2>
                </div>
                <p className="text-slate-700 text-center leading-relaxed">
                  We are committed to continuing the spirit of service beyond uniform by empowering veterans and contributing to society with dedication, discipline, and patriotism.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
