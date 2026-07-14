import { useState, useRef, useEffect } from 'react';
import { IoLogoWhatsapp } from 'react-icons/io';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiLogOut, FiUser, FiMail, FiCalendar, FiChevronDown, FiShoppingCart, FiPackage, FiShield } from 'react-icons/fi';
import Lottie from 'react-lottie';
import type { Options } from 'react-lottie';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCart, useLogout } from '../hooks/useServiceA';
import logo from '../assets/logo.json';

interface NavLink {
  to: string;
  label: string;
}

const navLinks: NavLink[] = [
  { to: '/',         label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Careers' },
  { to: '/contact',  label: 'Contact Us' },
];

function CartIconButton() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data } = useCart();
  const itemCount = data?.data?.items?.length ?? 0;

  if (!isAuthenticated) return null;

  return (
    <Link to="/cart" className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Cart">
      <FiShoppingCart size={20} className="text-slate-700" />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

// ── Profile dropdown ──────────────────────────────────────────────────────────

function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);
  const logout   = useLogout();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
      {/* Avatar + name banner */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-5 py-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg">
          {getInitials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-base leading-tight truncate">{user.name}</p>
          <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            user.role === 'ADMIN'
              ? 'bg-orange-500/80 text-white'
              : 'bg-orange-500/30 text-orange-300'
          }`}>
            {user.role === 'ADMIN' ? 'Admin' : 'Member'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-start gap-3">
          <FiMail className="text-slate-400 mt-0.5 shrink-0" size={15} />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Email</p>
            <p className="text-sm text-slate-700 truncate">{user.email}</p>
          </div>
        </div>

        {/* <div className="flex items-start gap-3">
          <FiUser className="text-slate-400 mt-0.5 shrink-0" size={15} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">User ID</p>
            <p className="text-xs text-slate-500 font-mono">{user.id}</p>
          </div>
        </div> */}

        <div className="flex items-start gap-3">
          <FiCalendar className="text-slate-400 mt-0.5 shrink-0" size={15} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Member since</p>
            <p className="text-sm text-slate-700">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-1">
        {user.role === 'ADMIN' && (
          <Link
            to="/admin"
            onClick={onClose}
            className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl hover:bg-orange-50 text-orange-600 text-sm font-semibold transition-colors"
          >
            <FiShield size={15} />
            Admin Panel
          </Link>
        )}
        <Link
          to="/profile"
          onClick={onClose}
          className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
        >
          <FiUser size={15} className="text-slate-400" />
          My Profile
        </Link>
        <Link
          to="/orders"
          onClick={onClose}
          className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
        >
          <FiPackage size={15} className="text-slate-400" />
          My Orders
        </Link>
        {/* <Link
          to="/cart"
          onClick={onClose}
          className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
        >
          <FiShoppingCart size={15} className="text-slate-400" />
          Cart
        </Link> */}
      </div>

      <div className="px-5 pb-4 pt-2 border-t border-slate-100 mt-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition-colors"
        >
          <FiLogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ── Avatar button ─────────────────────────────────────────────────────────────

function UserAvatarButton() {
  const user            = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 group focus:outline-none"
        aria-label="Open profile menu"
      >
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:ring-2 group-hover:ring-orange-400 transition-all">
          {getInitials(user.name)}
        </div>
        <span className="hidden lg:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
          {user.name.split(' ')[0]}
        </span>
        <FiChevronDown
          size={14}
          className={`hidden lg:block text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && <ProfileDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user            = useAuthStore((s) => s.user);
  const logout          = useLogout();
  const navigate        = useNavigate();

  const lottieOptions: Options = {
    loop: true,
    autoplay: true,
    animationData: logo,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  const handleMobileLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <div className="w-full bg-white shadow-xl sticky z-50 top-0">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center h-[70px]">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-1 text-orange-700">
            <Lottie options={lottieOptions} width={50} height={50} />
            <span>SERVCRUST</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-1">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `relative px-3 py-2 text-base font-medium transition-colors rounded-xl ${
                        isActive
                          ? 'text-orange-600 font-semibold'
                          : 'hover:text-white hover:bg-gray-900'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {label}
                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            <CartIconButton />
            {isAuthenticated && user ? (
              <UserAvatarButton />
            ) : (
              <Link
                to="/login"
                className="cursor-pointer hover:text-white hover:bg-gray-900 hover:rounded-xl px-3 py-2 text-base font-medium transition-colors"
              >
                Login
              </Link>
            )}
            <Link
              to="/whatsup"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors text-sm font-semibold"
            >
              <IoLogoWhatsapp size={20} />
              Join With Us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-700 text-2xl p-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 pb-4">

            {/* Logged-in user info banner */}
            {isAuthenticated && user && (
              <div className="mx-4 mt-3 mb-2 bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-slate-400 text-xs truncate">{user.email}</p>
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-1 pt-2">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-orange-50 text-orange-600 font-semibold'
                          : 'hover:bg-gray-100'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}

              {isAuthenticated ? (
                <>
                  {user?.role === 'ADMIN' && (
                    <li>
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-orange-50 text-orange-600 font-semibold"
                      >
                        <FiShield size={15} />
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
                    >
                      <FiUser size={15} className="text-slate-400" />
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
                    >
                      <FiPackage size={15} className="text-slate-400" />
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cart"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
                    >
                      <FiShoppingCart size={15} className="text-slate-400" />
                      Cart
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleMobileLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium"
                    >
                      <FiLogOut size={15} />
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
                  >
                    Login
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/whatsup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 mt-2 mx-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 font-semibold text-sm"
                >
                  <IoLogoWhatsapp size={18} />
                  Join With Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
