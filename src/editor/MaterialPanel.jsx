import { materialLibrary } from '../assets/materials.js';

const sections = [
  ['logos', 'Logo'],
  ['backgrounds', '背景'],
  ['icons', '图标'],
  ['buttons', '按钮'],
  ['priceCards', '价格卡'],
  ['tags', '标签'],
  ['qrStyles', '二维码样式'],
  ['ctaButtons', '预约按钮'],
];

export default function MaterialPanel({ onApplyMaterial }) {
  return (
    <aside className="rounded-[28px] bg-white/82 p-4 shadow-soft backdrop-blur">
      <div className="mb-4">
        <h2 className="text-lg font-black text-stone-950">素材库</h2>
        <p className="mt-1 text-sm leading-6 text-stone-500">
          点击素材即可应用到当前海报。
        </p>
      </div>

      <div className="space-y-5">
        {sections.map(([key, title]) => (
          <section key={key}>
            <h3 className="mb-2 text-sm font-black text-stone-700">{title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {materialLibrary[key].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onApplyMaterial(key, item)}
                  className="min-h-11 rounded-2xl bg-white px-3 py-2 text-left text-xs font-bold leading-5 text-stone-700 shadow-sm ring-1 ring-stone-100 transition hover:bg-emerald-50 hover:text-emerald-800"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
