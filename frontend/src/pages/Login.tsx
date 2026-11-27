import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginSchema, LoginForm } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-xl font-bold border border-white/20">
            S
          </div>
          <span className="text-xl font-bold tracking-tight">StorePulse</span>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-indigo-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Store Rating Management Platform
          </span>
          <h1 className="text-4xl font-bold leading-tight">
            Discover, rate, and grow trusted local stores.
          </h1>
          <p className="text-indigo-200 text-sm leading-relaxed">
            One unified portal for customers, store owners, and system administrators to track real-time store ratings and feedback.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { label: 'Customers', desc: 'Rate 1–5 ★' },
              { label: 'Owners', desc: 'Live Insights' },
              { label: 'Admins', desc: 'Full Control' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/10 border border-white/10 p-3 backdrop-blur-sm">
                <div className="text-xs font-semibold text-white">{item.label}</div>
                <div className="text-xs text-indigo-200 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-indigo-300">
          StorePulse • Role-based Rating System
        </div>
      </div>

      {/* Right Sign-in Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              S
            </div>
            <span className="text-xl font-bold text-slate-900">StorePulse</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 text-sm mt-1">Sign in with your email and password to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                />
                {errors.email && <p className="text-rose-600 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="text-rose-600 text-xs mt-1.5">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 active:scale-[0.99] transition font-semibold text-sm shadow-sm shadow-indigo-600/20 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
