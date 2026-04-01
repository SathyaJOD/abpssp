import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, Mail, MapPin, Phone, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] font-sans">
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[400px] md:min-h-[500px] bg-cover bg-center flex items-center py-16 md:py-0"
        style={{ backgroundImage: 'url("https://image.pollinations.ai/prompt/A%20wide%20panoramic%208K%20ultra%20HD%20sky%20background%20with%20a%20smooth%20gradient%20from%20deep%20blue%20at%20the%20top%20to%20soft%20pastel%20tones%20near%20the%20horizon.%20Soft%2C%20fluffy%20clouds%20are%20scattered%20across%20the%20sky%20with%20warm%20sunlight%20glow%20near%20the%20bottom.%20On%20the%20right%20side%2C%20a%20highly%20transparent%2C%20very%20faint%20Indian%20national%20flag%20is%20gently%20flowing%20in%20the%20air%2C%20with%20saffron%2C%20white%2C%20and%20green%20colors%20softly%20blended%20into%20the%20sky.%20The%20Ashoka%20Chakra%20is%20barely%20visible.%20The%20flag%20should%20appear%20extremely%20light%2C%20elegant%2C%20and%20highly%20blurred%2C%20blending%20naturally%20into%20the%20sky.%20Clean%20composition%20with%20empty%20space%20on%20the%20left%20side%20for%20text.%20No%20people%2C%20no%20buildings%2C%20minimal%2C%20professional%20website%20banner%20style.?width=1920&height=500&nologo=true")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
              Serving Those Who Served
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
              Akhil Bharatiya Poorva Sainik Seva Parishad (ABPSSP) is dedicated to the welfare of ex-servicemen and their families.
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
            src="https://abpssp.in/wp-content/uploads/2021/10/LOGO1-e1655295576596.png" 
            alt="ABPSSP Logo" 
            className="h-10 w-10 object-cover object-top rounded-full bg-white p-0.5 shadow-sm hidden sm:block"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-6">About ABPSSP</h2>
            <div className="text-slate-700 text-lg leading-relaxed mb-8 text-justify space-y-4">
              <p>
                ABPSSP AP STATE (ABPSSP) is an all-India voluntary organization of ex-servicemen. It is apolitical and non-profit oriented, working for national security, community development, and the welfare of ex-servicemen and Veer Naris. The organization brings ex-servicemen together on one platform, promoting discipline, patriotism, and service to the nation under the principle <span className="font-bold text-[#ea580c]">“Nation First Always and Every Time.”</span>
              </p>
            </div>
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
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" 
                  alt="Objectives" 
                  className="w-full h-36 object-cover rounded-lg mb-6"
                  referrerPolicy="no-referrer"
                />
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#ea580c] shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-medium">Welfare and rights of ex-servicemen & Veer Naris</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Link 
                    to="/objectives" 
                    className="inline-flex items-center bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold py-2 px-6 rounded shadow transition-all"
                  >
                    Learn More <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
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
                    <div className="w-20 h-24 bg-slate-100 rounded border-2 border-slate-200 mx-auto mb-1 flex items-center justify-center text-slate-300">
                      <User className="h-10 w-10" />
                    </div>
                    <p className="text-[10px] font-bold bg-[#d5e0c5] text-[#2f5a28] px-1 py-0.5 rounded">Natl President</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-24 bg-slate-100 rounded border-2 border-slate-200 mx-auto mb-1 flex items-center justify-center text-slate-300">
                      <User className="h-10 w-10" />
                    </div>
                    <p className="text-[10px] font-bold bg-[#d5e0c5] text-[#2f5a28] px-1 py-0.5 rounded">AP President</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-24 bg-slate-100 rounded border-2 border-slate-200 mx-auto mb-1 flex items-center justify-center text-slate-300">
                      <User className="h-10 w-10" />
                    </div>
                    <p className="text-[10px] font-bold bg-[#d5e0c5] text-[#2f5a28] px-1 py-0.5 rounded">State VP</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Lt Gen VK Chaturvedi <span className="text-xs font-normal text-slate-500">(Retd)</span></li>
                  <li className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Colonel Paleti Rambabu <span className="text-xs font-normal text-slate-500">(Retd)</span></li>
                  <li className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> AC CBR Prasad <span className="text-xs font-normal text-slate-500">(Retd)</span></li>
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
                <h3 className="text-2xl font-bold text-[#1e3a8a]">Events & Programs</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <img 
                  src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80" 
                  alt="Events" 
                  className="w-full h-36 object-cover rounded-lg mb-6"
                  referrerPolicy="no-referrer"
                />
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] shrink-0"></span>
                    Netaji Subhash Chandra Bose Jayanti
                  </li>
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
                ABPSSP invites service-minded people to contribute to nation-building.
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#facc15] mb-3">Eligible:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle className="h-5 w-5 text-[#facc15]" /> Ex-servicemen
                  </li>
                  <li className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle className="h-5 w-5 text-[#facc15]" /> Spouses
                  </li>
                  <li className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle className="h-5 w-5 text-[#facc15]" /> Veer Naris
                  </li>
                  <li className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle className="h-5 w-5 text-[#facc15]" /> Sponsored Members (Donate ₹50,000+)
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  to="/membership" 
                  className="inline-block bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold py-3 px-8 rounded shadow-lg transition-all"
                >
                  Become a Member
                </Link>
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-6 rounded-lg text-2xl flex items-center gap-2">
                  <span>Fee: ₹ 100/-</span>
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
                <span className="text-slate-800 font-medium">Col Munama Ravi (Retd) – 8106912448</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#1e3a8a] p-1 rounded mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-800 font-medium">Wg Cdr Syam Prasad Sharma (Retd) – 8527032158</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#1e3a8a] p-1 rounded mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-800 font-medium">Hony Capt Amma Rao Appikatla (Retd) – 9441110294</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#1e3a8a] p-1 rounded mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-800 font-medium">Sub K K N Rao (Retd) – 9951387899</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#1e3a8a] p-1 rounded mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-800 font-medium">Dr Mamta Misra – 9885754783</span>
              </li>
              <li className="flex items-start gap-3 mt-4 pt-4 border-t border-[#d5e0c5]">
                <Mail className="h-5 w-5 text-[#ea580c] shrink-0" />
                <a href="mailto:abpsspap01@gmail.com" className="text-slate-800 font-medium hover:text-[#ea580c]">abpsspap01@gmail.com</a>
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
