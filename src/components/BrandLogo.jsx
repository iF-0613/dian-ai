import { Leaf } from 'lucide-react';

export default function BrandLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-600 text-white shadow-brand">
        <Leaf size={24} />
      </div>
      <div>
        <div className="text-xl font-bold text-stone-950">店宣 AI</div>
        {!compact && (
          <div className="text-xs font-medium text-stone-500">
            小商家宣传设计工具
          </div>
        )}
      </div>
    </div>
  );
}
