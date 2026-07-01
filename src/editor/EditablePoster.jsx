import {
  CalendarCheck,
  Coffee,
  Dumbbell,
  Flame,
  Flower2,
  Footprints,
  Hand,
  Leaf,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  Sparkles,
  Sun,
} from 'lucide-react';
import { getServices } from '../utils/copyText.js';

const iconMap = {
  leaf: Leaf,
  sparkles: Sparkles,
  hand: Hand,
  sun: Sun,
  footprints: Footprints,
  coffee: Coffee,
  flame: Flame,
  paw: PawPrint,
  flower: Flower2,
  dumbbell: Dumbbell,
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

export default function EditablePoster({
  form,
  settings,
  previewRef,
  generatedImageUrl,
  imageLoading,
  imageError,
  imageVersion,
  onFieldChange,
  onQrPositionChange,
}) {
  const services = getServices(form);
  const Icon = iconMap[settings.icon] || Leaf;
  const heroImage = settings.backgroundUrl || generatedImageUrl;

  const handleQrPointerDown = (event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const start = settings.qrPosition;

    const move = (moveEvent) => {
      const nextX = Math.min(82, Math.max(4, start.x + (moveEvent.clientX - startX) / 5));
      const nextY = Math.min(84, Math.max(6, start.y + (moveEvent.clientY - startY) / 5));
      onQrPositionChange({ x: nextX, y: nextY });
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <article
      ref={previewRef}
      className={`relative mx-auto w-full max-w-[680px] overflow-hidden rounded-[32px] bg-[#fffaf1] text-stone-950 shadow-soft ${settings.fontClass || ''}`}
    >
      <section className={`relative min-h-[430px] overflow-hidden bg-gradient-to-br ${settings.background}`}>
        {heroImage && (
          <img src={heroImage} alt="宣传背景" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className={`absolute inset-0 ${heroImage ? 'bg-[linear-gradient(180deg,rgba(0,0,0,.34),rgba(0,0,0,.12)_36%,rgba(255,248,238,.9)_100%)]' : 'bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.78),transparent_26%),linear-gradient(180deg,rgba(255,255,255,.06),rgba(80,54,28,.18))]'}`} />

        {imageLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/72 px-6 text-center backdrop-blur-sm">
            <div className="rounded-3xl bg-white px-6 py-5 text-base font-black text-emerald-800 shadow-lg">
              AI 正在生成宣传图片，请稍等...
            </div>
          </div>
        )}
        <div className="absolute left-6 top-6 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/84 shadow-sm"
            style={{ color: settings.themeColor }}
          >
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <Icon size={24} />
            )}
          </div>
          <div>
            <div className="text-xl font-black tracking-wide text-stone-900">{form.storeName}</div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-600">
              {form.industryType}
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-6 rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-stone-700">
          {settings.tagText}
        </div>

        <div className="absolute inset-x-6 bottom-8">
          <EditableText
            as="h1"
            value={form.headline}
            onChange={(value) => onFieldChange('headline', value)}
            className={`max-w-[580px] text-[clamp(2.5rem,9vw,5rem)] font-black leading-[1.04] outline-none ${heroImage ? 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.35)]' : 'text-[#31543a]'}`}
          />
          <EditableText
            as="p"
            value={form.subheadline}
            onChange={(value) => onFieldChange('subheadline', value)}
            className={`mt-4 max-w-[560px] text-base font-semibold leading-7 outline-none sm:text-lg ${heroImage ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.36)]' : 'text-stone-800'}`}
          />
        </div>

        <div className="absolute bottom-28 right-10 rounded-full bg-white/72 px-3 py-1 text-xs font-bold text-stone-600">
          生成次数 {imageVersion + 1}
        </div>
      </section>

      <section className="px-5 py-5 sm:px-7">
        <div className="grid gap-3 md:grid-cols-3">
          {services.map((service, index) => (
            <div key={`${service}-${index}`} className="rounded-2xl border border-stone-100 bg-white p-4 text-center shadow-sm">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ backgroundColor: settings.themeColor }}>
                <Icon size={18} />
              </div>
              <h3 className="mt-3 text-base font-black leading-6 text-stone-950">{service}</h3>
              <p className="mt-1 text-sm leading-6 text-stone-500">舒适体验 · 细致服务</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-6 sm:px-7">
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-lg shadow-stone-900/10 md:grid-cols-[190px_1fr_136px]">
          <div className={`p-5 text-white ${settings.priceStyle === 'soft' ? 'text-stone-950' : ''}`} style={{ backgroundColor: settings.priceStyle === 'soft' ? '#fff7ed' : settings.themeColor }}>
            <div className="text-sm font-semibold opacity-80">限时体验价</div>
            <EditableText
              as="div"
              value={form.price}
              onChange={(value) => onFieldChange('price', value)}
              className="mt-2 text-5xl font-black leading-none outline-none"
            />
            <div className="mt-4 text-sm leading-6 opacity-80">到店可咨询更多项目</div>
          </div>

          <div className="grid gap-3 p-5 text-base font-bold text-stone-900">
            <ContactLine icon={<Phone size={20} />} text={form.phone} color={settings.themeColor} />
            <ContactLine icon={<MapPin size={20} />} text={form.address} color={settings.themeColor} />
            <ContactLine icon={<MessageCircle size={20} />} text={form.wechat} color={settings.themeColor} />
          </div>

          <div className="border-t border-stone-100 p-5 md:border-l md:border-t-0">
            <QrBox qrUrl={settings.qrUrl} qrStyle={settings.qrStyle} />
            <div className="mt-2 text-center text-xs font-bold text-stone-500">扫码预约</div>
          </div>
        </div>

        <div
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-center text-lg font-black text-white"
          style={{ backgroundColor: settings.buttonColor }}
        >
          <CalendarCheck size={22} />
          {settings.ctaText}
        </div>
      </section>

      <button
        type="button"
        onPointerDown={handleQrPointerDown}
        className="absolute z-30 hidden cursor-move rounded-2xl bg-white/92 p-2 shadow-lg ring-1 ring-stone-200 sm:block"
        style={{ left: `${settings.qrPosition.x}%`, top: `${settings.qrPosition.y}%` }}
        title="拖动二维码位置"
      >
        <QrBox qrUrl={settings.qrUrl} qrStyle={settings.qrStyle} compact />
      </button>
    </article>
  );
}

function EditableText({ as: Tag, value, onChange, className }) {
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      className={className}
      onBlur={(event) => onChange(event.currentTarget.textContent || '')}
    >
      {value}
    </Tag>
  );
}

function ContactLine({ icon, text, color }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 shrink-0" style={{ color }}>{icon}</div>
      <div className="min-w-0 break-words leading-7">{text}</div>
    </div>
  );
}

function QrBox({ qrUrl, qrStyle, compact = false }) {
  const rounded = qrStyle === 'rounded' ? 'rounded-2xl' : qrStyle === 'card' ? 'rounded-xl shadow-sm' : 'rounded-md';
  const size = compact ? 'h-16 w-16' : 'h-24 w-24';

  if (qrUrl) {
    return <img src={qrUrl} alt="二维码" className={`mx-auto ${size} ${rounded} object-cover ring-1 ring-stone-200`} />;
  }

  return (
    <div className={`mx-auto grid ${size} grid-cols-7 gap-1 bg-white p-2 ring-1 ring-stone-200 ${rounded}`}>
      {qrCells.map((filled, index) => (
        <span key={`${filled}-${index}`} className={filled ? 'rounded-[2px] bg-stone-950' : 'rounded-[2px] bg-stone-100'} />
      ))}
    </div>
  );
}
