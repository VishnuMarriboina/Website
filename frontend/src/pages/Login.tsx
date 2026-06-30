import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import bgImage from '../Images/login/bg8.avif';
import { useAuthStore } from '../store/authStore';
import { useLogin, useRegister } from '../hooks/useServiceA';
import type { FieldProps, PasswordFieldProps, AuthFormProps, LoginFormState, RegisterFormState } from './types';

// ── Shared input field ─────────────────────────────────────────────────────────

function Field({ icon: Icon, type, placeholder, value, onChange, error, rightEl }: FieldProps) {
  return (
    <div className="mb-4">
      <div className={`flex items-center gap-3 bg-white/10 border ${error ? 'border-red-400' : 'border-white/20'} rounded-xl px-4 py-3 focus-within:border-indigo-400 transition`}>
        <Icon className="text-white/50 shrink-0" size={16} />
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
        />
        {rightEl}
      </div>
      {error && <p className="text-red-400 text-xs mt-1 pl-1">{error}</p>}
    </div>
  );
}

// ── Password field with show/hide toggle ──────────────────────────────────────

function PasswordField({ placeholder, value, onChange, error }: PasswordFieldProps) {
  const [show, setShow] = useState<boolean>(false);
  return (
    <Field
      icon={FaLock}
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      rightEl={
        <button type="button" onClick={() => setShow((s) => !s)} className="text-white/40 hover:text-white/80 transition">
          {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      }
    />
  );
}

// ── Login form ────────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: AuthFormProps) {
  const setCredentials = useAuthStore((s) => s.setCredentials);
  const { mutateAsync: loginUser, isPending, error: apiError } = useLogin();
  const [form, setForm] = useState<LoginFormState>({ email: '', password: '' });
  const [errs, setErrs] = useState<Partial<LoginFormState>>({});

  const set = (key: keyof LoginFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<LoginFormState> = {};
    if (!form.email.trim())               e.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password.trim())            e.password = 'Password is required';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await loginUser({ email: form.email.trim().toLowerCase(), password: form.password });
      setCredentials(result.token, result.user);
      onSuccess(result.user.name, result.user.role);
    } catch { /* shown via apiError */ }
  };

  const errorMessage = apiError instanceof Error
    ? apiError.message
    : (apiError as { message?: string } | null)?.message ?? null;

  return (
    <form onSubmit={handleSubmit}>
      <Field icon={FaEnvelope} type="email" placeholder="Email address" value={form.email} onChange={set('email')} error={errs.email} />
      <PasswordField placeholder="Password" value={form.password} onChange={set('password')} error={errs.password} />

      {apiError && (
        <div className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 mb-4">
          <p className="text-red-300 text-sm">{errorMessage ?? 'Login failed. Please try again.'}</p>
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition text-sm mt-2">
        {isPending ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}

// ── Register form ─────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess }: AuthFormProps) {
  const setCredentials = useAuthStore((s) => s.setCredentials);
  const { mutateAsync: registerUser, isPending, error: apiError } = useRegister();
  const [form, setForm] = useState<RegisterFormState>({ name: '', email: '', password: '', confirm: '' });
  const [errs, setErrs] = useState<Partial<RegisterFormState>>({});

  const set = (key: keyof RegisterFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<RegisterFormState> = {};
    if (!form.name.trim())                e.name     = 'Name is required';
    else if (form.name.trim().length < 2) e.name     = 'Name must be at least 2 characters';
    if (!form.email.trim())               e.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password)                   e.password = 'Password is required';
    else if (form.password.length < 6)    e.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password)   e.confirm  = 'Passwords do not match';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await registerUser({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });
      setCredentials(result.token, result.user);
      onSuccess(result.user.name, result.user.role);
    } catch { /* shown via apiError */ }
  };

  const errorMessage = apiError instanceof Error
    ? apiError.message
    : (apiError as { message?: string } | null)?.message ?? null;

  return (
    <form onSubmit={handleSubmit}>
      <Field icon={FaUser}    type="text"  placeholder="Full name"              value={form.name}     onChange={set('name')}     error={errs.name} />
      <Field icon={FaEnvelope} type="email" placeholder="Email address"          value={form.email}    onChange={set('email')}    error={errs.email} />
      <PasswordField placeholder="Password (min 6 characters)"   value={form.password} onChange={set('password')} error={errs.password} />
      <PasswordField placeholder="Confirm password"              value={form.confirm}  onChange={set('confirm')}  error={errs.confirm} />

      {apiError && (
        <div className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 mb-4">
          <p className="text-red-300 text-sm">{errorMessage ?? 'Registration failed. Please try again.'}</p>
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition text-sm mt-2">
        {isPending ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}

// ── Main Login page ───────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode]       = useState<'login' | 'register'>('login');
  const [welcome, setWelcome] = useState<string | null>(null);

  const handleSuccess = (name: string, role: string) => {
    setWelcome(name);
    setTimeout(() => navigate(role === 'ADMIN' ? '/admin' : '/'), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-md px-4">
        {welcome ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome, {welcome}!</h2>
            <p className="text-white/60 text-sm">Redirecting you to the home page…</p>
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">ServCrust</h1>
              <p className="text-white/50 text-sm mt-1">Order Management System</p>
            </div>

            <div className="flex bg-white/10 rounded-xl p-1 mb-8">
              {(['login', 'register'] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === m ? 'bg-white text-slate-800 shadow' : 'text-white/60 hover:text-white'}`}>
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {mode === 'login' ? <LoginForm onSuccess={handleSuccess} /> : <RegisterForm onSuccess={handleSuccess} />}

            <p className="text-center text-white/30 text-xs mt-6">
              {mode === 'login' ? (
                <>No account?{' '}
                  <button onClick={() => setMode('register')} className="text-indigo-400 hover:underline">Register here</button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-indigo-400 hover:underline">Sign in</button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
