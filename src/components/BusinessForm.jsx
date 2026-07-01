import { ImagePlus } from 'lucide-react';

const industryOptions = [
  '养生馆',
  '美容店',
  '按摩店',
  '沙疗馆',
  '足疗馆',
  '咖啡店',
  '火锅店',
  '宠物店',
  '花店',
  '健身房',
  '其他本地服务',
];

const imageStyleOptions = [
  '自然养生风',
  '高级轻奢风',
  '国风典雅',
  '温馨生活风',
  'INS简约风',
];

export default function BusinessForm({
  form,
  onFieldChange,
  onServiceChange,
  onGenerateImage,
  isGeneratingImage,
}) {
  return (
    <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
      <section className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-black text-stone-950">商家信息填写</h2>
          <p className="mt-1 text-sm leading-6 text-stone-500">
            修改左侧表单，海报、网页和文案会实时更新。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <label>
            <span className="field-label">店铺名称</span>
            <input
              className="field-control"
              value={form.storeName}
              onChange={(event) => onFieldChange('storeName', event.target.value)}
              placeholder="例如：云舒养生馆"
            />
          </label>

          <label>
            <span className="field-label">行业类型</span>
            <select
              className="field-control"
              value={form.industryType}
              onChange={(event) => onFieldChange('industryType', event.target.value)}
            >
              {industryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="field-label">主标题</span>
          <input
            className="field-control"
            value={form.headline}
            onChange={(event) => onFieldChange('headline', event.target.value)}
            placeholder="例如：给疲惫身体一次深度放松"
          />
        </label>

        <label className="mt-4 block">
          <span className="field-label">副标题</span>
          <textarea
            className="field-control min-h-24 resize-none"
            value={form.subheadline}
            onChange={(event) => onFieldChange('subheadline', event.target.value)}
            placeholder="写一句让顾客心动的介绍"
          />
        </label>

        <div className="mt-4">
          <div className="field-label">特色服务（3 项）</div>
          <div className="mt-2 grid gap-3">
            {form.services.map((service, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-sm font-bold text-stone-600">
                  {index + 1}
                </div>
                <input
                  className="field-control mt-0"
                  value={service}
                  onChange={(event) => onServiceChange(index, event.target.value)}
                  placeholder={`特色服务 ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <label>
            <span className="field-label">体验价</span>
            <input
              className="field-control"
              value={form.price}
              onChange={(event) => onFieldChange('price', event.target.value)}
              placeholder="例如：68 元 / 次"
            />
          </label>

          <label>
            <span className="field-label">电话</span>
            <input
              className="field-control"
              value={form.phone}
              onChange={(event) => onFieldChange('phone', event.target.value)}
              placeholder="例如：138 0000 0000"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="field-label">地址</span>
          <input
            className="field-control"
            value={form.address}
            onChange={(event) => onFieldChange('address', event.target.value)}
            placeholder="例如：人民路 88 号 2 楼"
          />
        </label>

        <label className="mt-4 block">
          <span className="field-label">微信号</span>
          <input
            className="field-control"
            value={form.wechat}
            onChange={(event) => onFieldChange('wechat', event.target.value)}
            placeholder="例如：ys888888"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/55 p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-black text-stone-950">宣传图片设置</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            用于生成 AI 图片 prompt，也会影响模拟海报风格。
          </p>
        </div>

        <label className="block">
          <span className="field-label">图片风格</span>
          <select
            className="field-control"
            value={form.imageStyle}
            onChange={(event) => onFieldChange('imageStyle', event.target.value)}
          >
            {imageStyleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="field-label">图片关键词</span>
          <input
            className="field-control"
            value={form.imageKeywords}
            onChange={(event) => onFieldChange('imageKeywords', event.target.value)}
            placeholder="例如：SPA、绿植、蜡烛、按摩、沙疗、美容、放松"
          />
        </label>

        <button
          type="button"
          onClick={onGenerateImage}
          disabled={isGeneratingImage}
          className="icon-button mt-4 w-full bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <ImagePlus size={18} />
          {isGeneratingImage ? 'AI 正在生成宣传图片' : 'AI 生成宣传图片'}
        </button>
      </section>
    </form>
  );
}
