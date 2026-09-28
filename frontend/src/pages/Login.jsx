import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Star, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        addToast('Welcome back!', `Logged in as ${result.user.name}`, 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      addToast('Login Failed', err.response?.data?.message || 'Invalid email or password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 sm:my-8 bg-white rounded-3xl border border-neutral-200/90 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
      {/* Left Visual Column */}
      <div className="hidden md:flex md:col-span-5 relative bg-neutral-900 flex-col justify-between p-8 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
          alt="Restaurant Atmosphere"
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">TasteTrack</span>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 / 5 from over 12,000 foodies</span>
          </div>
          <p className="text-xs font-medium text-neutral-200 leading-relaxed">
            "TasteTrack helped us find the best artisan pasta spots and rooftop brunches on our trip."
          </p>
          <p className="text-[11px] text-neutral-400 font-semibold">— Sophia M., Food Enthusiast</p>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Welcome back
          </h2>
          <p className="text-xs text-neutral-500 mt-1.5">
            Log in to manage your saved favorites and reviews.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border border-neutral-300 rounded-2xl overflow-hidden focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900 transition">
            <div className="p-3 bg-white border-b border-neutral-200">
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 outline-none pt-0.5 bg-transparent"
              />
            </div>

            <div className="p-3 bg-white flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 outline-none pt-0.5 bg-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer underline ml-2"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {(errors.email || errors.password) && (
            <p className="text-xs text-rose-600 font-semibold">{errors.email || errors.password}</p>
          )}

          <div className="flex items-center justify-between text-xs text-neutral-600">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-rose-600 border-neutral-300 focus:ring-rose-500"
              />
              Remember me
            </label>
            <a href="#" className="font-semibold text-neutral-900 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:opacity-95 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-rose-600 hover:text-rose-700 hover:underline ml-1">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
