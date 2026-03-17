import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, Mail, MapPin, Phone } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] font-sans">
      
      {/* Hero Section */}
      <section 
        className="relative h-[500px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80")' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
              Serving the Nation<br />After Service
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md font-medium">
              Dedicated to the Welfare of<br />Ex-Servicemen & Veeranaris
            </p>
            <Link 
              to="/about" 
              className="inline-block bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold py-3 px-8 rounded shadow-lg transition-all transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Orange Banner */}
      <div className="bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] py-4 shadow-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center gap-4">
          <h2 className="text-white text-2xl md:text-3xl font-bold tracking-wide text-center drop-shadow-sm">
            "Nation First Always and Every Time."
          </h2>
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" 
            alt="Indian Flag" 
            className="h-6 w-9 object-cover rounded-sm shadow-sm hidden sm:block"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-6">About ABPSSP</h2>
            <p className="text-slate-700 text-lg leading-relaxed mb-8 text-justify">
              Akhil Bharatiya Poorva Sainik Seva Parishad (ABPSSP) is an All India voluntary ex organization dedicated to national service, community development, and welfare of ex-servicemen and the Veeranaris. This organization works on the principle of "Nation First Always and Every Time."
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold py-2.5 px-6 rounded shadow-md transition-all"
            >
              Read More <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80" 
              alt="ABPSSP Members" 
              className="rounded-xl shadow-2xl w-full object-cover h-[350px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-4 -right-4 bg-[#1e3a8a] w-24 h-24 rounded-xl -z-10"></div>
            <div className="absolute -top-4 -left-4 bg-[#ea580c] w-24 h-24 rounded-xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Three Columns Section */}
      <section className="py-12 bg-[#f4f1ea] border-y border-[#e5e0d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Main Objectives */}
            <div className="bg-[#eef2e6] rounded-xl shadow-md overflow-hidden flex flex-col border border-[#d5e0c5]">
              <div className="bg-[#d5e0c5] py-4 px-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-[#2f5a28]" />
                <h3 className="text-xl font-bold text-[#2f5a28]">Main Objectives</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {[
                    'Welfare and rights of ex-servicemen',
                    'Support to Veeranaris and families',
                    'Motivate youth to join armed forces',
                    'Protect Indian traditions and culture',
                    'Provide legal assistance to ex servicemen',
                    'Support during natural calamities',
                    'Promote patriotism and national unity'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#ea580c] shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center mb-6">
                  <Link 
                    to="/objectives" 
                    className="inline-flex items-center bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold py-2 px-6 rounded shadow transition-all"
                  >
                    Learn More <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1596423735880-5c62b9f66487?auto=format&fit=crop&q=80" 
                  alt="Soldiers" 
                  className="w-full h-32 object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Leadership */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-slate-200">
              <div className="py-4 px-6 text-center border-b border-slate-100">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">Leadership</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-center gap-2 mb-6">
                  <div className="text-center">
                    <img src="https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&q=80&w=150&h=150" alt="Leader" className="w-20 h-24 object-cover rounded border-2 border-[#ea580c] mx-auto mb-1" referrerPolicy="no-referrer" />
                    <p className="text-[10px] font-bold bg-[#d5e0c5] text-[#2f5a28] px-1 py-0.5 rounded">Natl President</p>
                  </div>
                  <div className="text-center">
                    <img src="https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&q=80&w=150&h=150" alt="Leader" className="w-20 h-24 object-cover rounded border-2 border-[#ea580c] mx-auto mb-1" referrerPolicy="no-referrer" />
                    <p className="text-[10px] font-bold bg-[#d5e0c5] text-[#2f5a28] px-1 py-0.5 rounded">AP President</p>
                  </div>
                  <div className="text-center">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150" alt="Leader" className="w-20 h-24 object-cover rounded border-2 border-[#ea580c] mx-auto mb-1" referrerPolicy="no-referrer" />
                    <p className="text-[10px] font-bold bg-[#d5e0c5] text-[#2f5a28] px-1 py-0.5 rounded">Gen Secretary</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Lt Gen VK Chaturvedi <span className="text-xs font-normal text-slate-500">(Retd)</span></li>
                  <li className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Wg Cdr Syam Prasad Sharma <span className="text-xs font-normal text-slate-500">(Retd)</span></li>
                  <li className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Hony Capt Anma Rao Appikatla <span className="text-xs font-normal text-slate-500">(Retd)</span></li>
                  <li className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Sub K K N Rao <span className="text-xs font-normal text-slate-500">(Retd)</span></li>
                </ul>
                <div className="text-center">
                  <Link 
                    to="/about" 
                    className="inline-flex items-center bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold py-2 px-6 rounded shadow transition-all"
                  >
                    View Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Events */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-slate-200">
              <div className="py-4 px-6 text-center border-b border-slate-100">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">Events</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <img 
                  src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80" 
                  alt="Events" 
                  className="w-full h-36 object-cover rounded-lg mb-6"
                  referrerPolicy="no-referrer"
                />
                <ul className="space-y-3 mb-6 flex-1">
                  {[
                    'Netaji Subhash Chandra Bose Jayanti',
                    'Vijay Diwas',
                    'Kargil Vijay Diwas',
                    'Walong Day',
                    'National Integration programs'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <Link 
                    to="/events" 
                    className="inline-flex items-center bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold py-2 px-6 rounded shadow transition-all"
                  >
                    View All Events
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Membership & Contact Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Membership Banner */}
          <div className="lg:col-span-2 bg-[#2f5a28] rounded-xl shadow-xl overflow-hidden relative flex flex-col md:flex-row">
            <div className="p-8 md:w-3/5 z-10 relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Membership</h2>
              <p className="text-xl text-emerald-100 mb-6 font-medium">
                Join ABPSSP and Support the Welfare of ex-Servicemen & Veeranaris
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white font-medium">
                  <CheckCircle className="h-5 w-5 text-[#facc15]" /> Ex servicemen, spouses
                </li>
                <li className="flex items-center gap-2 text-white font-medium">
                  <CheckCircle className="h-5 w-5 text-[#facc15]" /> Veeranaris
                </li>
                <li className="flex items-center gap-2 text-white font-medium">
                  <CheckCircle className="h-5 w-5 text-[#facc15]" /> Become a Member
                </li>
              </ul>
              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  to="/membership" 
                  className="inline-block bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold py-3 px-8 rounded shadow-lg transition-all"
                >
                  Become a Member
                </Link>
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-6 rounded-lg text-2xl flex items-center gap-2">
                  <span>₹ 100/-</span>
                </div>
              </div>
            </div>
            <div className="md:w-2/5 relative min-h-[250px] md:min-h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2f5a28] to-transparent z-10 hidden md:block"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2f5a28] to-transparent z-10 md:hidden"></div>
              <img 
                src="https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&q=80" 
                alt="Veteran Saluting" 
                className="absolute inset-0 w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Contact Us */}
          <div className="bg-[#f4f1ea] rounded-xl shadow-md p-8 border border-[#e5e0d8] flex flex-col">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-6">Contact Us</h2>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <div className="bg-[#1e3a8a] p-1 rounded mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-800 font-medium">Col Manenia Ravt (Retd)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#1e3a8a] p-1 rounded mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-800 font-medium">Wg Cdr Syam Prasad Sharma (Retd)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#1e3a8a] p-1 rounded mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-800 font-medium">Hony Capt Anma Rao Appikatla</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#1e3a8a] p-1 rounded mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-800 font-medium">Sub K K N Rao (Retd)</span>
              </li>
              <li className="flex items-start gap-3 mt-4 pt-4 border-t border-[#d5e0c5]">
                <Mail className="h-5 w-5 text-[#ea580c] shrink-0" />
                <a href="mailto:info@abpsspap.org" className="text-slate-800 font-medium hover:text-[#ea580c]">info@abpsspap.org</a>
              </li>
            </ul>
            <Link 
              to="/contact" 
              className="w-full inline-flex justify-center items-center bg-gradient-to-r from-[#2f5a28] to-[#3f7a36] hover:from-[#1e3f19] hover:to-[#2f5a28] text-white font-bold py-3 px-6 rounded shadow transition-all"
            >
              Contact Now <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
