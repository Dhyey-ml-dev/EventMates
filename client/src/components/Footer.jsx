import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, MapPin, Mail, Hexagon
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-900">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 flex items-center justify-center">
                <Hexagon className="w-6 h-6 fill-indigo-600 text-indigo-600" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EventMates</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 font-light">
              Providing scalable talent solutions for events worldwide. Empowering students with verifiable real-world experience since 2024.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">LinkedIn</a>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-wide">Candidates</h4>
            <ul className="space-y-4">
              {[
                { label: 'Browse Opportunities', to: '/events' },
                { label: 'Create Profile', to: '/signup' },
                { label: 'Career Dashboard', to: '/dashboard/student' },
                { label: 'Guidelines', to: '/about' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="group flex items-center text-sm hover:text-white transition-colors font-light">
                    <ChevronRight className="w-3 h-3 mr-2 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-wide">Organizers</h4>
            <ul className="space-y-4">
              {[
                { label: 'Post a Listing', to: '/signup?role=organizer' },
                { label: 'Management Console', to: '/dashboard/organizer' },
                { label: 'Enterprise Solutions', to: '/about' },
                { label: 'Platform Administration', to: '/admin' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="group flex items-center text-sm hover:text-white transition-colors font-light">
                    <ChevronRight className="w-3 h-3 mr-2 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-wide">Corporate Office</h4>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm font-light">
                <MapPin className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <span>
                  12th Floor, World Trade Tower<br />
                  SG Highway, Ahmedabad<br />
                  Gujarat, India 380015
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm font-light">
                <Mail className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <span>support@eventmates.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light">
          <p>
            © {currentYear} EventMates Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Data Processing Addendum</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
