import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mail, Phone, Facebook, Twitter, Linkedin, Youtube, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Objectives', path: '/objectives' },
    { name: 'Events', path: '/events' },
    { name: 'Membership', path: '/membership' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'Members', path: '/members' },
    { name: 'Status', path: '/status' },
    { name: 'Login', path: '/admin' },
  ];

  return (
    <header className="w-full font-sans shadow-md z-50 relative">
      {/* Top Bar */}
      <div className="bg-[#1e293b] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-6 mb-2 sm:mb-0">
          <a href="mailto:info@abpsspap.org" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
            <Mail className="h-3.5 w-3.5 text-orange-400" />
            <span>info@abpsspap.org</span>
          </a>
          <a href="tel:0112301512408" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
            <Phone className="h-3.5 w-3.5 text-orange-400" />
            <span>011-2301512408</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 mr-4">
            <a href="tel:0112301512408" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
              <Phone className="h-3.5 w-3.5 text-orange-400" />
              <span>011-2301512408</span>
            </a>
            <a href="mailto:info@abpsspap.org" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
              <Mail className="h-3.5 w-3.5 text-orange-400" />
              <span>info@abpsspap.org</span>
            </a>
          </div>
          <div className="flex items-center gap-3 border-l border-slate-600 pl-4">
            <a href="#" className="hover:text-orange-400 transition-colors"><Facebook className="h-3.5 w-3.5" /></a>
            <a href="#" className="hover:text-orange-400 transition-colors"><Twitter className="h-3.5 w-3.5" /></a>
            <a href="#" className="hover:text-orange-400 transition-colors"><Linkedin className="h-3.5 w-3.5" /></a>
            <a href="#" className="hover:text-orange-400 transition-colors"><Youtube className="h-3.5 w-3.5" /></a>
          </div>
          <Link to="/membership" className="ml-2 bg-[#2563eb] hover:bg-blue-700 text-white px-3 py-1 rounded-sm flex items-center gap-1 font-medium transition-colors">
            <span className="w-2 h-2 rounded-full bg-white mr-1"></span>
            Join ABPSSP <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <img 
              src="https://abpssp.in/wp-content/uploads/2021/10/LOGO1-e1655295576596.png" 
              alt="ABPSSP Logo" 
              className="h-16 w-16 object-cover object-top rounded-full bg-white p-1"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <h1 className="text-[#1e3a8a] text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                AKHIL BHARATIYA POORVA SAINIK SEVA PARISHAD
              </h1>
              <h2 className="text-[#ea580c] text-lg sm:text-xl font-bold tracking-widest">
                ANDHRA PRADESH
              </h2>
            </div>
          </Link>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-[#1e3a8a] text-white hidden md:block border-t-4 border-[#ea580c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-3 text-sm font-semibold transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-[#2563eb] text-white' 
                    : 'hover:bg-[#2563eb] text-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1e3a8a] border-t-4 border-[#ea580c]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-[#2563eb] text-white'
                    : 'text-slate-100 hover:bg-[#2563eb]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
