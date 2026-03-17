import { Link } from 'react-router-dom';
import { Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2f5a28] text-white py-8 border-t-4 border-[#1e3a8a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" 
              alt="ABPSSP Logo" 
              className="h-16 w-16 object-cover rounded-full border-2 border-white p-1 bg-white"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Links and Copyright */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium mb-4">
              <Link to="/" className="hover:text-[#ea580c] transition-colors">Home</Link>
              <span className="text-white/50">|</span>
              <Link to="/about" className="hover:text-[#ea580c] transition-colors">About</Link>
              <span className="text-white/50">|</span>
              <Link to="/objectives" className="hover:text-[#ea580c] transition-colors">Objectives</Link>
              <span className="text-white/50">|</span>
              <Link to="/events" className="hover:text-[#ea580c] transition-colors">Events</Link>
              <span className="text-white/50">|</span>
              <Link to="/membership" className="hover:text-[#ea580c] transition-colors">Membership</Link>
              <span className="text-white/50">|</span>
              <Link to="/gallery" className="hover:text-[#ea580c] transition-colors">Gallery</Link>
              <span className="text-white/50">|</span>
              <Link to="/leadership" className="hover:text-[#ea580c] transition-colors">Leadership</Link>
              <span className="text-white/50">|</span>
              <Link to="/privacy" className="hover:text-[#ea580c] transition-colors">Privacy Policy</Link>
            </div>
            <p className="text-xs text-white/70">
              &copy; {new Date().getFullYear()} ABPSSP - Akhil Bharatiya Poorva Sainik Seva Parishad Andhra Pradesh. All rights reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a href="#" className="bg-[#3b5998] p-2 rounded-full hover:bg-white hover:text-[#3b5998] transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="bg-[#1da1f2] p-2 rounded-full hover:bg-white hover:text-[#1da1f2] transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="mailto:info@abpsspap.org" className="bg-[#ea4335] p-2 rounded-full hover:bg-white hover:text-[#ea4335] transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
