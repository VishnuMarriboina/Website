import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiBarChart2,
  FiLogOut, FiMenu, FiX, FiUser, FiBriefcase, FiFileText,
} from 'react-icons/fi';
import Lottie from 'react-lottie';
import type { Options } from 'react-lottie';
import { useAuthStore } from '../../store/authStore';
import logoAnim from '../../assets/logo.json';

const navItems = [
  { to: '/admin',               label: 'Dashboard',    icon: FiGrid,        end: true  },
  { to: '/admin/products',      label: 'Products',     icon: FiPackage,     end: false },
  { to: '/admin/orders',        label: 'Orders',       icon: FiShoppingBag, end: false },
  { to: '/admin/users',         label: 'Users',        icon: FiUsers,       end: false },
  { to: '/admin/stock',         label: 'Stock',        icon: FiBarChart2,   end: false },
  { to: '/admin/jobs',          label: 'Jobs',         icon: FiBriefcase,   end: false },
  { to: '/admin/applications',  label: 'Applications', icon: FiFileText,    end: false },
  { to: '/admin/profile',       label: 'Profile',      icon: FiUser,        end: false },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const navigate  = useNavigate();
  const user      = useAuthStore((s) => s.user);
  const logout    = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-1">
          <Lottie
            options={{ loop: true, autoplay: true, animationData: logoAnim, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } } satisfies Options}
            width={44} height={44}
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base tracking-wide leading-tight">Admin Panel</p>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">ServCrust management portal</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="ml-1 text-slate-400 hover:text-white shrink-0">
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User card + logout */}
      <div className="px-3 pb-4 border-t border-slate-700/50 pt-3 space-y-1">
        {user && (
          <NavLink
            to="/admin/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                isActive ? 'bg-slate-700' : 'hover:bg-slate-800'
              }`
            }
          >
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate leading-tight">{user.email}</p>
            </div>
            <FiUser size={13} className="text-slate-500 shrink-0" />
          </NavLink>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <FiLogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <FiMenu size={20} />
          </button>
          <span className="font-semibold text-slate-800">Admin</span>
        </div>

        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
