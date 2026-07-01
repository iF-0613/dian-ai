import { CheckCircle2, Loader2 } from 'lucide-react';

export default function GenerationProgress({ steps, currentStep, progress }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-3xl rounded-[36px] bg-white/90 p-6 shadow-soft backdrop-blur sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-700 text-white">
            <Loader2 className="animate-spin" size={30} />
          </div>
          <p className="mt-5 text-sm font-black text-emerald-700">AI 正在工作</p>
          <h1 className="mt-2 text-4xl font-black text-stone-950">一键生成营销方案</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            正在依次生成海报、网页、多平台文案、标题、Slogan 和店铺介绍。
          </p>
        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-emerald-700 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-right text-sm font-bold text-stone-500">{progress}%</div>

        <div className="mt-6 grid gap-3">
          {steps.map((step, index) => {
            const done = index < currentStep;
            const active = index === currentStep;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                  active ? 'bg-emerald-50 text-emerald-900' : done ? 'bg-white text-stone-500' : 'bg-stone-50 text-stone-400'
                }`}
              >
                {done ? <CheckCircle2 size={20} /> : <Loader2 size={20} className={active ? 'animate-spin' : ''} />}
                <span className="font-bold">{step}</span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
