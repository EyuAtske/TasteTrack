import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ type = 'success', title, message, onClose }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  const styles = {
    success: 'border-emerald-200 shadow-emerald-500/10',
    error: 'border-rose-200 shadow-rose-500/10',
    info: 'border-sky-200 shadow-sky-500/10',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border bg-white shadow-lg text-neutral-800 ${styles[type]}`}
    >
      {icons[type]}
      <div className="flex-1 text-sm">
        <p className="font-semibold text-neutral-900 leading-tight">{title}</p>
        {message && <p className="text-neutral-600 text-xs mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}