import { ArrowRight, CheckCircle2, CircleHelp, Sparkles } from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';
import { businessTemplates } from '../templates/businessTemplates.js';

const advantages = [
  '海报、网页、朋友圈、小红书、抖音口播一次生成',
  '内置本地生活行业模板，适合小店快速出图',
  '可上传 Logo、二维码和背景图，导出即可使用',
  '支持 OpenAI 图片和文案接口，也可无 Key 模拟使用',
];

const faqs = [
  ['没有 API Key 可以用吗？', '可以。没有 API Key 时会保留模拟海报和本地模板文案。'],
  ['能导出图片吗？', '可以导出宣传海报或宣传网页为 PNG。'],
  ['适合哪些门店？', '养生、美容、按摩、餐饮、宠物、花店、健身等本地商家都可以用。'],
  ['以后能继续扩展吗？', '可以。V2.1 已按 pages、templates、assets、editor 等目录拆分。'],
];

export default function HomePage({ onStart, onOpenTemplates }) {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <BrandLogo />
        <button
          type="button"
          onClick={() => onStart()}
          className="icon-button bg-stone-950 text-white hover:bg-stone-800 focus:ring-stone-200"
        >
          开始制作
          <ArrowRight size={18} />
        </button>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[1fr_520px] lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-bold text-emerald-800 shadow-sm">
            <Sparkles size={16} />
            店宣 AI V2.1
          </div>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.5rem,7vw,5.4rem)] font-black leading-[1.04] text-stone-950">
            小商家也能 3 分钟做出专业宣传设计
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-stone-600">
            从行业模板开始，快速生成宣传海报、落地页和营销文案。像 Canva、稿定设计、创客贴一样好上手，但更适合本地小店。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onStart()}
              className="icon-button bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-200"
            >
              开始制作
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={onOpenTemplates}
              className="icon-button bg-white text-stone-900 shadow-sm ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200"
            >
              查看模板中心
            </button>
          </div>
        </div>

        <div className="rounded-[36px] bg-white/75 p-4 shadow-soft backdrop-blur">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f3dfc2] via-[#fff6e8] to-[#cfe7d8] p-6">
            <div className="rounded-3xl bg-white/82 p-5 shadow-lg">
              <div className="text-sm font-bold text-emerald-800">云舒养生馆</div>
              <div className="mt-8 text-5xl font-black leading-tight text-stone-950">
                给疲惫身体一次深度放松
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {['海报', '网页', '文案'].map((item) => (
                  <div key={item} className="rounded-2xl bg-white px-3 py-5 text-center text-sm font-black shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-emerald-700 px-4 py-3 text-center font-black text-white">
                立即预约体验
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-stone-950">产品优势</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item) => (
            <div key={item} className="rounded-3xl bg-white p-5 shadow-sm">
              <CheckCircle2 className="text-emerald-700" size={22} />
              <p className="mt-4 text-sm font-bold leading-7 text-stone-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-stone-950">行业模板展示</h2>
            <p className="mt-2 text-sm text-stone-500">点击任意模板进入编辑器继续制作。</p>
          </div>
          <button type="button" onClick={onOpenTemplates} className="text-sm font-black text-emerald-700">
            全部模板
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {businessTemplates.slice(0, 10).map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onStart(template.id)}
              className={`min-h-36 rounded-3xl bg-gradient-to-br ${template.background} p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft`}
            >
              <div className="text-sm font-bold text-stone-600">{template.name}</div>
              <div className="mt-8 text-xl font-black text-stone-950">{template.defaults.headline}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-stone-950">常见问题</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <div key={question} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-lg font-black text-stone-950">
                <CircleHelp size={20} />
                {question}
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-600">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-4 py-8 text-sm font-semibold text-stone-500 sm:px-6 lg:px-8">
        店宣 AI - 为本地小商家打造的 AI 宣传设计软件
      </footer>
    </main>
  );
}
