import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-[#ff444f] mb-4">
              TZX<span className="text-white">Trading</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Professional investment pools managed by expert traders
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-[#ff444f] cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-[#ff444f] cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-[#ff444f] cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-[#ff444f] cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#ff444f]">About Us</a></li>
              <li><a href="#" className="hover:text-[#ff444f]">How It Works</a></li>
              <li><a href="#" className="hover:text-[#ff444f]">Investment Pools</a></li>
              <li><a href="#" className="hover:text-[#ff444f]">FAQs</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#ff444f]">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-[#ff444f]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#ff444f]">Risk Disclosure</a></li>
              <li><a href="#" className="hover:text-[#ff444f]">Compliance</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={16} /> 0798633983
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> tzxtrading@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2026 TZXTrading. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;