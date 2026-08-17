
import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Toast from './components/Toast';
import { UtensilsCrossed } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-3.5 px-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Taste<span className="text-rose-500">Track</span>
            </span>
          </div>

          <div className="flex gap-2 bg-neutral-100 p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => setCurrentPage('login')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                currentPage === 'login' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Login 
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                currentPage === 'register' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Register 
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 flex items-center justify-center py-8">
        {currentPage === 'login' ? (
          <Login
            onNavigateToRegister={() => setCurrentPage('register')}
            onLoginSuccess={(email) => {
              showToast('success', 'Logged in successfully!', `Welcome back, ${email}`);
            }}
          />
        ) : (
          <Register
            onNavigateToLogin={() => setCurrentPage('login')}
            onRegisterSuccess={(name) => {
              showToast('success', 'Account created!', `Welcome to TasteTrack, ${name}!`);
              setCurrentPage('login');
            }}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full">
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}