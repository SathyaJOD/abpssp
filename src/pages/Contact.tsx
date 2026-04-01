import { Mail, Phone, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const contacts = [
    { name: 'Col Munama Ravi (Retd)', phone: '8106912448' },
    { name: 'Wg Cdr Syam Prasad Sharma (Retd)', phone: '8527032158' },
    { name: 'Hony Capt Amma Rao Appikatla (Retd)', phone: '9441110294' },
    { name: 'Sub K K N Rao (Retd)', phone: '9951387899' },
    { name: 'Dr Mamta Misra', phone: '9885754783' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#1e3a8a] mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get in touch with the ABPSSP AP STATE (ABPSSP) - Andhra Pradesh team. We are here to assist our ex-servicemen and their families.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-[#2f5a28] mb-6 border-b border-slate-100 pb-4">Our Representatives</h2>
            <div className="space-y-6">
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-[#f4f1ea] p-3 rounded-full shrink-0">
                    <User className="h-6 w-6 text-[#ea580c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{contact.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-slate-600">
                      <Phone className="h-4 w-4 text-emerald-600" />
                      <a href={`tel:${contact.phone}`} className="hover:text-[#ea580c] transition-colors font-medium">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Inquiries & Address */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-[#2f5a28] mb-6 border-b border-slate-100 pb-4">General Inquiries</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f4f1ea] p-3 rounded-full shrink-0">
                    <Mail className="h-6 w-6 text-[#ea580c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Email Us</h3>
                    <p className="mt-1 text-slate-600">
                      <a href="mailto:abpsspap01@gmail.com" className="hover:text-[#ea580c] transition-colors font-medium">
                        abpsspap01@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#f4f1ea] p-3 rounded-full shrink-0">
                    <MapPin className="h-6 w-6 text-[#ea580c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Office Location</h3>
                    <p className="mt-1 text-slate-600 leading-relaxed">
                      ABPSSP AP STATE<br />
                      Andhra Pradesh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2f5a28] rounded-xl shadow-md p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4">Need Help with Membership?</h2>
                <p className="mb-6 text-blue-100">
                  If you have any questions regarding the membership process or need assistance with your application, please reach out to one of our representatives.
                </p>
                <Link 
                  to="/membership" 
                  className="inline-block bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3 px-6 rounded shadow transition-colors"
                >
                  Go to Membership
                </Link>
              </div>
              {/* Decorative background element */}
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
