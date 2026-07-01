import { Loader2, Sparkles } from 'lucide-react';

const buttonVariants = {
  primary: 'bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-brand hover:-translate-y-0.5 hover:shadow-brand-lg',
  secondary: 'bg-white text-stone-800 ring-1 ring-stone-200 hover:-translate-y-0.5 hover:bg-stone-50 hover:shadow-card',
  ghost: 'bg-transparent text-stone-600 hover:bg-white/80 hover:text-stone-950',
  danger: 'bg-white text-red-700 ring-1 ring-red-100 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-card',
};

export function Button({ children, variant = 'secondary', className = '', loading = false, disabled, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[15px] font-semibold transition duration-200 ease-out active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55 ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={17} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

export function Card({ children, className = '', interactive = false }) {
  return (
    <section className={`rounded-2xl border border-stone-200/80 bg-white shadow-card backdrop-blur transition duration-200 ease-out ${interactive ? 'hover:-translate-y-1 hover:border-emerald-200 hover:shadow-card-hover' : ''} ${className}`}>
      {children}
    </section>
  );
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'bg-stone-50 text-stone-600 ring-stone-200',
    brand: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
    dark: 'bg-stone-950 text-white ring-stone-950',
    success: 'bg-green-50 text-green-700 ring-green-100',
    warning: 'bg-amber-50 text-amber-700 ring-amber-100',
    error: 'bg-red-50 text-red-700 ring-red-100',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold ring-1 ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function TextArea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full resize-none rounded-2xl border border-stone-200 bg-white p-5 text-base leading-8 text-stone-900 outline-none transition duration-200 ease-out placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
      {...props}
    />
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-900 outline-none transition duration-200 ease-out placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-900 outline-none transition duration-200 ease-out focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`grid gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/80 p-1.5 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`min-h-10 rounded-xl px-3 py-2 text-[15px] font-semibold transition duration-200 ease-out ${
            activeTab === tab.id
              ? 'bg-white text-stone-950 shadow-sm ring-1 ring-stone-200'
              : 'text-stone-500 hover:bg-white/70 hover:text-stone-950'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function Loading({ label = 'AI 正在处理...' }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
      <Loader2 size={18} className="animate-spin" />
      {label}
    </div>
  );
}

export function Empty({ title = '暂无内容', description = '生成后会显示在这里。', action }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center shadow-card">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Sparkles size={22} />
      </div>
      <div className="text-xl font-semibold text-stone-950">{title}</div>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-stone-200/70 ${className}`} />;
}

export function Dialog({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid animate-fade-in place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-stone-950">{title}</h2>
          <Button variant="ghost" onClick={onClose}>关闭</Button>
        </div>
        <div className="mt-4">{children}</div>
      </Card>
    </div>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-50 animate-toast-in rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
      {message}
    </div>
  );
}

export function PageShell({ children, className = '' }) {
  return (
    <main className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </main>
  );
}

export function PageHeader({ children, className = '' }) {
  return (
    <header className={`mx-auto mb-6 flex w-full max-w-7xl flex-col gap-4 rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-card backdrop-blur sm:flex-row sm:items-center sm:justify-between ${className}`}>
      {children}
    </header>
  );
}
