import {
  CalendarCheck,
  Leaf,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react';
import { getServices } from '../utils/copyText.js';

const styleThemes = {
  自然养生风: {
    hero: 'from-[#f4dfc2] via-[#fff4e3] to-[#bedfce]',
    accent: 'bg-emerald-800',
    light: 'bg-emerald-50',
    text: 'text-emerald-900',
  },
  高级轻奢风: {
    hero: 'from-[#31261f] via-[#806947] to-[#ead7b1]',
    accent: 'bg-[#2f261f]',
    light: 'bg-[#f8f0df]',
    text: 'text-[#5f4728]',
  },
  国风典雅: {
    hero: 'from-[#efe0c5] via-[#f8f1e6] to-[#b74b3d]',
    accent: 'bg-red-900',
    light: 'bg-red-50',
    text: 'text-red-900',
  },
  温馨生活风: {
    hero: 'from-[#ffd9c2] via-[#fff2e7] to-[#f4b6a7]',
    accent: 'bg-rose-700',
    light: 'bg-rose-50',
    text: 'text-rose-900',
  },
  INS简约风: {
    hero: 'from-[#e9ece7] via-[#ffffff] to-[#d5dfda]',
    accent: 'bg-stone-900',
    light: 'bg-stone-100',
    text: 'text-stone-900',
  },
};

const qrCells = [
  1, 1, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0,
  1, 1, 1, 0, 1, 1, 1,
  0, 0, 1, 1, 0, 1, 0,
  1, 0, 0, 1, 1, 0, 1,
  0, 1, 1, 0, 0, 1, 0,
  1, 0, 1, 1, 1, 0, 1,
];

export default function PosterPreview({
  form,
  previewRef,
  imageVersion,
  generatedImageUrl,
  isGeneratingImage,
  imageError,
}) {
  const services = getServices(form);
  const theme = styleThemes[form.imageStyle] || styleThemes.自然养生风;
  const keywords = form.imageKeywords || 'SPA、绿植、蜡烛、按摩、放松';

  return (
    <article
      ref={previewRef}
      className="mx-auto w-full max-w-[680px] overflow-hidden rounded-[32px] bg-[#fffaf1] text-stone-950 shadow-soft"
    >
      <section className={`relative min-h-[390px] overflow-hidden bg-gradient-to-br ${theme.hero}`}>
        {generatedImageUrl && (
          <img
            src={generatedImageUrl}
            alt="AI 生成宣传图片"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className={`absolute inset-0 ${
            generatedImageUrl
              ? 'bg-[linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.08)_35%,rgba(255,248,238,.82)_100%)]'
              : 'bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.78),transparent_26%),radial-gradient(circle_at_72%_20%,rgba(255,255,255,.42),transparent_24%),linear-gradient(180deg,rgba(255,255,255,.05),rgba(80,54,28,.18))]'
          }`}
        />
        {isGeneratingImage && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/72 px-6 text-center backdrop-blur-sm">
            <div className="rounded-3xl bg-white px-6 py-5 text-base font-black text-emerald-800 shadow-lg">
              AI 正在生成宣传图片，请稍等...
            </div>
          </div>
        )}
        {imageError && !isGeneratingImage && (
          <div className="absolute left-5 right-5 top-20 z-20 rounded-2xl bg-white/92 px-4 py-3 text-sm font-bold leading-6 text-red-700 shadow-sm">
            {imageError}
          </div>
        )}
        <div className="absolute left-6 top-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-emerald-800 shadow-sm">
            <Leaf size={24} />
          </div>
          <div>
            <div className="text-xl font-black tracking-wide text-stone-900">{form.storeName}</div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-600">
              {form.industryType}
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-6 rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-stone-700">
          AI 宣传图 · {form.imageStyle}
        </div>

        <div className="absolute inset-x-6 bottom-7">
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full bg-white/78 px-3 py-1 text-xs font-bold text-stone-700">
            <Sparkles size={14} />
            <span className="truncate">{keywords}</span>
          </div>
          <h1 className={`max-w-[580px] text-[clamp(2.4rem,9vw,4.8rem)] font-black leading-[1.04] drop-shadow-sm ${generatedImageUrl ? 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.35)]' : 'text-[#31543a]'}`}>
            {form.headline}
          </h1>
          <p className={`mt-4 max-w-[560px] text-base font-semibold leading-7 sm:text-lg ${generatedImageUrl ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.36)]' : 'text-stone-800'}`}>
            {form.subheadline}
          </p>
        </div>

        <div className="absolute right-8 top-24 hidden h-40 w-40 rounded-full border border-white/45 bg-white/18 backdrop-blur-sm sm:block" />
        <div className="absolute right-16 top-36 hidden h-24 w-24 rounded-full bg-white/35 sm:block" />
        <div className="absolute left-8 top-24 hidden h-28 w-16 rotate-12 rounded-full bg-emerald-700/18 blur-sm sm:block" />
        <div className="absolute bottom-28 right-10 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-stone-600">
          生成次数 {imageVersion + 1}
        </div>
      </section>

      <section className="px-5 py-5 sm:px-7">
        <div className="grid gap-3 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={`${service}-${index}`}
              className="rounded-2xl border border-stone-100 bg-white p-4 text-center shadow-sm"
            >
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${theme.light} ${theme.text}`}
              >
                <Sparkles size={18} />
              </div>
              <h3 className="mt-3 text-base font-black leading-6 text-stone-950">{service}</h3>
              <p className="mt-1 text-sm leading-6 text-stone-500">舒适体验 · 细致服务</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-6 sm:px-7">
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-lg shadow-stone-900/10 md:grid-cols-[190px_1fr_136px]">
          <div className={`${theme.accent} p-5 text-white`}>
            <div className="text-sm font-semibold text-white/80">限时体验价</div>
            <div className="mt-2 text-5xl font-black leading-none">{form.price}</div>
            <div className="mt-4 text-sm leading-6 text-white/80">到店可咨询更多项目</div>
          </div>

          <div className="grid gap-3 p-5 text-base font-bold text-stone-900">
            <ContactLine icon={<Phone size={20} />} text={form.phone} />
            <ContactLine icon={<MapPin size={20} />} text={form.address} />
            <ContactLine icon={<MessageCircle size={20} />} text={form.wechat} />
          </div>

          <div className="border-t border-stone-100 p-5 md:border-l md:border-t-0">
            <div className="mx-auto grid h-24 w-24 grid-cols-7 gap-1 rounded-xl bg-white p-2 ring-1 ring-stone-200">
              {qrCells.map((filled, index) => (
                <span
                  key={`${filled}-${index}`}
                  className={filled ? 'rounded-[2px] bg-stone-950' : 'rounded-[2px] bg-stone-100'}
                />
              ))}
            </div>
            <div className="mt-2 text-center text-xs font-bold text-stone-500">扫码预约</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-stone-950 px-5 py-4 text-center text-lg font-black text-white">
          <CalendarCheck size={22} />
          立即预约体验
        </div>
      </section>
    </article>
  );
}

function ContactLine({ icon, text }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 shrink-0 text-emerald-700">{icon}</div>
      <div className="min-w-0 break-words leading-7">{text}</div>
    </div>
  );
}
