import { ImageUp, Palette } from 'lucide-react';

export default function EditorControls({
  settings,
  onSettingChange,
  onUploadLogo,
  onUploadQr,
  onUploadBackground,
}) {
  return (
    <section className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Palette size={18} className="text-emerald-700" />
        <h2 className="text-lg font-black text-stone-950">品牌设置</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="field-label">主题色</span>
          <input
            type="color"
            className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white p-1"
            value={settings.themeColor}
            onChange={(event) => onSettingChange('themeColor', event.target.value)}
          />
        </label>
        <label>
          <span className="field-label">按钮颜色</span>
          <input
            type="color"
            className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white p-1"
            value={settings.buttonColor}
            onChange={(event) => onSettingChange('buttonColor', event.target.value)}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3">
        <UploadButton label="上传 Logo" onChange={onUploadLogo} />
        <UploadButton label="上传二维码" onChange={onUploadQr} />
        <UploadButton label="上传背景图片" onChange={onUploadBackground} />
      </div>
    </section>
  );
}

function UploadButton({ label, onChange }) {
  return (
    <label className="icon-button cursor-pointer bg-white text-stone-900 shadow-sm ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200">
      <ImageUp size={18} />
      {label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0])}
      />
    </label>
  );
}
