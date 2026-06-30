import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import logo from '../assets/logo.json';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-lg">
              <Lottie animationData={logo} loop className="w-8 h-8" />
              <span>SERVCRUST</span>
            </div>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed max-w-xs">
              India's first B2B e-commerce platform for stone aggregates — connecting construction professionals with quality material suppliers across the country.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Company</h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/"         className="hover:text-orange-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-orange-400 transition-colors">Products</Link></li>
              <li><Link to="/services" className="hover:text-orange-400 transition-colors">Careers</Link></li>
              <li><Link to="/contact"  className="hover:text-orange-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal & social */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Legal</h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/term"    className="hover:text-orange-400 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/refund"  className="hover:text-orange-400 transition-colors">Refund Policy</Link></li>
            </ul>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 mt-5">Follow Us</h3>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/ServCrust/" aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 8 19">
                  <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://x.com/" aria-label="X (Twitter)"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 17">
                  <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd" />
                </svg>
              </a>
              <Link to="/whatsup" aria-label="WhatsApp"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-green-600 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © 2024{' '}
            <a href="https://servcrust.com/" className="hover:text-orange-400 transition-colors">ServCrust</a>
            . All Rights Reserved.
          </p>
          <p className="text-xs text-slate-600">Built with ❤ for India's construction industry</p>
        </div>
      </div>
    </footer>
  );
}
