import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Card } from '../design/System.jsx';

export default function AgentThinking({ steps, currentStep, progress }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-3xl animate-soft-pop overflow-hidden p-6 sm:p-8">
        <div className="relative text-center">
          <div className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950 text-white shadow-card-hover">
            <Sparkles size={26} />
          </div>
          <p className="relative mt-5 text-sm font-semibold text-emerald-700">AI 正在思考</p>
          <h1 className="relative mt-2 text-3xl font-bold text-stone-950 sm:text-4xl">
            正在为你生成完整营销方案
          </h1>
          <p className="relative mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600">
            AI 会先理解门店和活动，再依次生成海报、网页、文案、Logo 和视频脚本。
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-full bg-stone-100 p-1">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-emerald-700 to-teal-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 grid gap-3">
          {steps.map((step, index) => {
            const done = index < currentStep;
            const active = index === currentStep;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition duration-200 ease-out ${
                  active
                    ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100'
                    : done
                      ? 'bg-white text-stone-600 ring-1 ring-stone-100'
                      : 'bg-stone-50 text-stone-400'
                }`}
              >
                {done ? (
                  <CheckCircle2 size={20} className="text-emerald-700" />
                ) : (
                  <Loader2 size={20} className={active ? 'animate-spin text-emerald-700' : ''} />
                )}
                <span className="font-semibold">{step}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </main>
  );
}
