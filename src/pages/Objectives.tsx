import React from 'react';
import { 
  Flag, 
  Users, 
  HeartPulse, 
  GraduationCap, 
  LifeBuoy, 
  ShieldCheck, 
  Tractor, 
  Calendar, 
  Handshake, 
  Scale, 
  Star 
} from 'lucide-react';

export default function Objectives() {
  const objectives = [
    'To foster a sense of brotherhood and camaraderie among ex-servicemen.',
    'To work for the welfare and rehabilitation of ex-servicemen and their families.',
    'To instill a sense of patriotism and national service among the youth.',
    'To provide a platform for ex-servicemen to contribute to nation-building activities.',
    'To assist the government and local authorities during national emergencies and natural disasters.'
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mb-12">
          <div className="bg-gradient-to-r from-[#2f5a28] to-[#4d8045] py-16 px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">Main Objectives of ABPSSP</h1>
            <p className="text-green-100 text-xl max-w-3xl mx-auto leading-relaxed">
              The <strong>ABPSSP AP STATE (ABPSSP)</strong> is committed to serving the nation and society by utilizing the strength, discipline, and experience of ex-servicemen. The organization works with a clear vision guided by the following core objectives:
            </p>
          </div>
        </div>

        {/* Objectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {objectives.map((obj, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-8 border border-slate-200 hover:shadow-lg transition-shadow flex flex-col">
              <div className="mb-6 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center border border-slate-100">
                <ShieldCheck className="h-8 w-8 text-[#2f5a28]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Objective {i + 1}</h3>
              <p className="text-slate-600 leading-relaxed flex-1">
                {obj}
              </p>
            </div>
          ))}
        </div>

        {/* Commitment Section */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-2xl shadow-xl overflow-hidden border border-blue-800 p-10 text-center">
          <Star className="h-12 w-12 text-[#facc15] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Our Commitment</h2>
          <p className="text-blue-100 text-xl max-w-4xl mx-auto leading-relaxed">
            ABPSSP stands as a symbol of continued service beyond uniform, dedicated to nation-building, social welfare, and honoring the spirit of our armed forces.
          </p>
        </div>

      </div>
    </div>
  );
}
