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
    {
      title: "National Service & Integrity",
      description: "To promote unity, integrity, and national security by engaging ex-servicemen in activities that strengthen the nation and inspire patriotism among citizens.",
      icon: <Flag className="h-8 w-8 text-[#ea580c]" />
    },
    {
      title: "Support to Ex-Servicemen & Families",
      description: "To provide assistance, welfare support, and guidance to ex-servicemen, war widows, and their families, ensuring dignity and security in their lives.",
      icon: <Users className="h-8 w-8 text-[#1e3a8a]" />
    },
    {
      title: "Healthcare & Social Welfare",
      description: "To contribute to healthcare, sanitation, and rural development by organizing medical camps, awareness programs, and community service initiatives.",
      icon: <HeartPulse className="h-8 w-8 text-[#2f5a28]" />
    },
    {
      title: "Education & Youth Development",
      description: "To guide and motivate youth through training programs, career counseling, and patriotic education, helping them become responsible citizens.",
      icon: <GraduationCap className="h-8 w-8 text-[#ea580c]" />
    },
    {
      title: "Disaster Relief & Rehabilitation",
      description: "To actively participate in rescue, relief, and rehabilitation operations during natural calamities and emergencies.",
      icon: <LifeBuoy className="h-8 w-8 text-[#1e3a8a]" />
    },
    {
      title: "Veteran Welfare & Empowerment",
      description: "To support rehabilitation, employment opportunities, and skill development programs for veterans, including physically challenged ex-servicemen.",
      icon: <ShieldCheck className="h-8 w-8 text-[#2f5a28]" />
    },
    {
      title: "Rural & Community Development",
      description: "To work towards improving rural infrastructure, livelihood opportunities, and social harmony through organized efforts.",
      icon: <Tractor className="h-8 w-8 text-[#ea580c]" />
    },
    {
      title: "Patriotism & National Events",
      description: "To celebrate and organize national events such as Kargil Vijay Diwas, Netaji Jayanti, and other patriotic programs to honor the sacrifices of soldiers.",
      icon: <Calendar className="h-8 w-8 text-[#1e3a8a]" />
    },
    {
      title: "Unity & Brotherhood",
      description: "To foster a sense of brotherhood, cooperation, and unity among ex-servicemen and society through regular meetings, events, and social initiatives.",
      icon: <Handshake className="h-8 w-8 text-[#2f5a28]" />
    },
    {
      title: "Legal & Institutional Support",
      description: "To provide legal guidance and assistance to ex-servicemen and their families whenever required.",
      icon: <Scale className="h-8 w-8 text-[#ea580c]" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mb-12">
          <div className="bg-gradient-to-r from-[#2f5a28] to-[#4d8045] py-16 px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">Main Objectives of ABPSSP</h1>
            <p className="text-green-100 text-xl max-w-3xl mx-auto leading-relaxed">
              The <strong>Akhil Bharatiya Poorva Sainik Seva Parishad (ABPSSP)</strong> is committed to serving the nation and society by utilizing the strength, discipline, and experience of ex-servicemen. The organization works with a clear vision guided by the following core objectives:
            </p>
          </div>
        </div>

        {/* Objectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {objectives.map((obj, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-8 border border-slate-200 hover:shadow-lg transition-shadow flex flex-col">
              <div className="mb-6 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center border border-slate-100">
                {obj.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{obj.title}</h3>
              <p className="text-slate-600 leading-relaxed flex-1">
                {obj.description}
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
