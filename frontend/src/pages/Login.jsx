import { useState } from 'react';
import { Mail, Lock, UtensilsCrossed, Star, ArrowRight } from 'lucide-react';

export default function Login({ onNavigateToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) onLoginSuccess(email);
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-200/90 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
      {/* Left Column: Visual Showcase (Airbnb/Food Discovery Atmosphere) */}
      <div className="hidden md:flex md:col-span-5 relative bg-neutral-900 flex-col justify-between p-8 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" 
          alt="Restaurant Atmosphere" 
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105" 
        /> 
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent" /> 
 
        {/* Top Tag */} 
        <div className="relative z-10 flex items-center gap-2"> 
          <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-lg"> 
            <UtensilsCrossed className="w-4 h-4" /> 
          </div> 
          <span className="font-bold text-base tracking-tight text-white">TasteTrack</span> 
        </div> 
 
        {/* Bottom Testimonial / Atmosphere badge */} 
        <div className="relative z-10 space-y-3"> 
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20"> 
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 
            <span>4.9 / 5 from over 12,000 foodies</span> 
          </div> 
          <p className="text-sm font-medium text-neutral-200 leading-relaxed"> 
            "TasteTrack helped us find the best artisan pasta spots and rooftop brunches on our trip." 
          </p> 
          <p className="text-xs text-neutral-400 font-semibold">— Sophia M., Food Enthusiast</p> 
        </div> 
      </div> 
 
      {/* Right Column: Airbnb Style Auth Form */} 
      <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white"> 
        <div className="mb-6"> 
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900"> 
            Welcome back 
          </h2> 
          <p className="text-sm text-neutral-500 mt-1.5"> 
            Log in to manage your saved favorites and reviews. 
          </p> 
        </div> 
 
        <form onSubmit={handleSubmit} className="space-y-4"> 
          {/* Segmented Inputs */} 
          <div className="border border-neutral-300 rounded-2xl overflow-hidden focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900 transition"> 
            <div className="p-3 bg-white border-b border-neutral-200"> 
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider"> 
                Email 
              </label> 
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => { 
                  setEmail(e.target.value); 
                  setErrors((prev) => ({ ...prev, email: undefined })); 
                }} 
                className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 outline-none pt-0.5 bg-transparent" 
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
                  className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 outline-none pt-0.5 bg-transparent" 
                /> 
              </div> 
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer underline ml-2" 
              > 
                {showPassword ? 'Hide' : 'Show'} 
              </button> 
            </div> 
          </div> 
 
          {errors.email || errors.password ? ( 
            <p className="text-xs text-rose-600 font-medium"> 
              {errors.email || errors.password} 
            </p> 
          ) : null} 
 
          <div className="flex items-center justify-between text-xs text-neutral-600"> 
            <label className="flex items-center gap-2 cursor-pointer select-none"> 
              <input 
                type="checkbox" 
                defaultChecked 
                className="w-4 h-4 rounded text-rose-500 border-neutral-300 focus:ring-rose-500" 
              /> 
              Remember me 
            </label> 
            <a href="#" className="font-semibold text-neutral-900 hover:underline"> 
              Forgot password? 
            </a> 
          </div> 
 
          {/* Airbnb Signature Gradient Button */} 
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] hover:opacity-95 text-white font-semibold text-sm rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60" 
          > 
            <span>{isLoading ? 'Signing in...' : 'Continue'}</span> 
            {!isLoading && <ArrowRight className="w-4 h-4" />} 
          </button> 
        </form> 
 
        {/* Divider */} 
        <div className="relative my-6 text-center"> 
          <div className="absolute inset-0 flex items-center"> 
            <div className="w-full border-t border-neutral-200" /> 
          </div> 
          <span className="relative px-3 bg-white text-xs text-neutral-400 font-medium uppercase"> 
            or continue with 
          </span> 
        </div> 
 
        {/* Social Buttons */} 
        <div className="grid grid-cols-2 gap-3"> 
          <button 
            type="button" 
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-700 transition cursor-pointer" 
          > 
            <svg className="w-4 h-4" viewBox="0 0 24 24"> 
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/> 
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/> 
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/> 
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/> 
            </svg> 
            Google 
          </button> 
          <button 
            type="button" 
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-700 transition cursor-pointer" 
          > 
            <svg className="w-4 h-4 fill-current text-neutral-900" viewBox="0 0 24 24"> 
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24" /> 
            </svg> 
            Apple 
          </button> 
        </div> 
 
        {/* Footer Link */} 
        <div className="mt-8 pt-4 border-t border-neutral-100 text-center"> 
          <p className="text-xs text-neutral-500"> 
            Don't have an account?{' '} 
            <button 
              type="button" 
              onClick={onNavigateToRegister} 
              className="font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-1" 
            > 
              Create one now 
            </button> 
          </p> 
        </div> 
      </div> 
    </div> 
  ); 
}