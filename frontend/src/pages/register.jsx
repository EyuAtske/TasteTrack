import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register({ onNavigateToLogin, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Password strength check
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const strengthScore = [hasMinLength, hasNumber, hasLetter].filter(Boolean).length;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Please accept the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate sending to backend API (POST /api/auth/register)
    setTimeout(() => {
      setIsLoading(false);
      if (onRegisterSuccess) {
        onRegisterSuccess(name);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 px-4">
      <div className="bg-white border border-neutral-200 rounded-3xl shadow-xl p-8 sm:p-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Create your account
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Join foodies sharing taste notes and discovering restaurants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            id="register-name"
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            id="register-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div>
            <Input
              id="register-password"
              label="Password"
              type="password"
              isPassword
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthScore <= 1
                        ? 'w-1/3 bg-rose-500'
                        : strengthScore === 2
                        ? 'w-2/3 bg-amber-500'
                        : 'w-full bg-emerald-500'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-neutral-500">
                  Password strength: {strengthScore <= 1 ? 'Weak' : strengthScore === 2 ? 'Medium' : 'Strong'}
                </p>
              </div>
            )}
          </div>

          <Input
            id="register-confirm-password"
            label="Confirm Password"
            type="password"
            isPassword
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            error={errors.confirmPassword}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-neutral-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-rose-600 border-neutral-300 focus:ring-rose-500 cursor-pointer"
              />
              <span>I agree to the TasteTrack Terms of Service and Privacy Policy</span>
            </label>
            {errors.terms && <p className="text-xs text-rose-600 font-medium mt-1">{errors.terms}</p>}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-1"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}