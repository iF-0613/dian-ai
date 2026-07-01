import { ArrowLeft, ImageUp, Palette, Settings } from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';
import { Button, Card, Input, Badge, PageHeader, PageShell } from '../design/System.jsx';

export default function SettingsPage({
  form,
  settings,
  onBack,
  onSettingChange,
  onUploadLogo,
  onUploadQr,
  onUploadBackground,
}) {
  return (
    <PageShell>
      <PageHeader className="max-w-5xl">
        <BrandLogo compact />
        <Button onClick={onBack}>
          <ArrowLeft size={17} />
          返回项目
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Badge tone="brand">
            <Settings size={14} />
            设置
          </Badge>
          <h1 className="mt-3 text-4xl font-bold text-stone-950">品牌与导出设置</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            这里只放会影响所有素材的基础设置。具体内容修改请回到项目工作区，通过表单或 AI 聊天完成。
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.86fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <Palette size={19} className="text-emerald-700" />
              <h2 className="text-2xl font-semibold text-stone-950">品牌颜色</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">主题色</span>
                <Input
                  type="color"
                  value={settings.themeColor}
                  onChange={(event) => onSettingChange('themeColor', event.target.value)}
                  className="mt-2 h-12 p-1"
                />
              </label>
              <label>
                <span className="field-label">按钮颜色</span>
                <Input
                  type="color"
                  value={settings.buttonColor}
                  onChange={(event) => onSettingChange('buttonColor', event.target.value)}
                  className="mt-2 h-12 p-1"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3">
              <UploadButton label="上传 Logo" onChange={onUploadLogo} />
              <UploadButton label="上传二维码" onChange={onUploadQr} />
              <UploadButton label="上传背景图片" onChange={onUploadBackground} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-stone-950">当前品牌预览</h2>
            <div className="mt-5 flex min-h-72 items-center justify-center rounded-2xl bg-stone-50 ring-1 ring-stone-200">
              <div className="text-center">
                <div
                  className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-white text-3xl font-bold shadow-card"
                  style={{ color: settings.themeColor }}
                >
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    form.storeName?.slice(0, 2) || '店宣'
                  )}
                </div>
                <div className="mt-4 text-2xl font-semibold text-stone-950">{form.storeName}</div>
                <div className="mt-1 text-sm font-medium text-stone-500">{form.industryType}</div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

function UploadButton({ label, onChange }) {
  return (
    <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-[15px] font-semibold text-stone-800 ring-1 ring-stone-200 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-stone-50 hover:shadow-card">
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
