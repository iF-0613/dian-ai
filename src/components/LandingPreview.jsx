import { CalendarCheck, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { getServices } from '../utils/copyText.js';

export default function LandingPreview({ form, previewRef }) {
  const services = getServices(form);

  return (
    <article
      ref={previewRef}
      className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[30px] bg-[#fffaf2] text-stone-900 shadow-soft"
    >
      <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#f4dcc2_0%,#fff8ee_45%,#dceee6_100%)] px-5 py-8 sm:px-8 sm:py-12">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/50" />
        <div className="absolute left-6 top-10 h-28 w-28 rounded-full bg-emerald-200/35 blur-2xl" />
        <div className="absolute bottom-0 right-12 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-white">
              <Sparkles size={14} />
              {form.industryType} · 新客体验
            </div>

            <p className="mt-8 text-sm font-semibold tracking-[0.24em] text-stone-500">
              {form.storeName}
            </p>
            <h1 className="mt-3 text-[clamp(2.3rem,7vw,4.75rem)] font-black leading-[1.05] text-stone-950">
              {form.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
              {form.subheadline}
            </p>
          </div>

          <div className="rounded-3xl bg-stone-950 p-5 text-white shadow-2xl shadow-stone-900/20">
            <div className="text-sm font-semibold text-amber-100">限时体验价</div>
            <div className="mt-2 text-5xl font-black">{form.price}</div>
            <div className="mt-4 flex items-center gap-2 text-sm text-stone-200">
              <CalendarCheck size={18} />
              预约后优先安排合适时间
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
              Services
            </p>
            <h2 className="mt-1 text-3xl font-black text-stone-950">特色服务</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-stone-500">
            从进店体验到服务细节，突出小商家最容易被顾客记住的卖点。
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={`${service}-${index}`}
              className="rounded-3xl border border-stone-100 bg-[#fbf8f2] p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-black text-white">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-black text-stone-950">{service}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                注重舒适、放松和细致服务，让顾客愿意进店体验并再次预约。
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f3eadf] px-5 py-8 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <Phone className="text-emerald-700" size={24} />
            <div className="mt-4 text-sm font-semibold text-stone-500">预约电话</div>
            <div className="mt-1 break-words text-3xl font-black text-stone-950">
              {form.phone}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <InfoCard icon={<MessageCircle size={22} />} label="微信咨询" value={form.wechat} />
            <InfoCard icon={<MapPin size={22} />} label="门店地址" value={form.address} />
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-emerald-700 px-6 py-4 text-center text-base font-black text-white shadow-lg shadow-emerald-900/15">
          立即预约体验，给疲惫的自己留一段放松时间
        </div>
      </section>
    </article>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="text-emerald-700">{icon}</div>
      <div className="mt-3 text-sm font-semibold text-stone-500">{label}</div>
      <div className="mt-1 break-words text-lg font-black leading-7 text-stone-950">
        {value}
      </div>
    </div>
  );
}
