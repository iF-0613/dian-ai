import { useEffect, useState } from 'react';
import {
  Download,
  FileArchive,
  Home,
  ImageUp,
  Maximize2,
  RefreshCw,
  Send,
  Settings2,
  Trophy,
  X,
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';
import LandingPreview from '../components/LandingPreview.jsx';
import TextPreview from '../components/TextPreview.jsx';
import EditablePoster from '../editor/EditablePoster.jsx';
import { Button, Card, Input, Select, Tabs, Toast } from '../design/System.jsx';

const previewTabs = [
  { id: 'analysis', label: '🧠 AI分析' },
  { id: 'poster', label: '🖼 海报' },
  { id: 'web', label: '🌐 网页' },
  { id: 'moments', label: '💬 朋友圈' },
  { id: 'redbook', label: '📱 小红书' },
  { id: 'logo', label: '🎨 Logo' },
  { id: 'douyin', label: '🎬 视频脚本' },
];

const quickActions = [
  ['✨', '标题更高级'],
  ['💰', '价格改成59元'],
  ['🌿', '换成暖色风格'],
  ['🎯', '更适合年轻女性'],
  ['🎁', '增加会员活动'],
];

const industryOptions = ['养生馆', '美容店', '按摩店', '沙疗馆', '足疗馆', '咖啡店', '火锅店', '宠物店', '花店', '健身房', '其他本地服务'];
const imageStyleOptions = ['自然养生风', '高级轻奢风', '国风典雅', '温馨生活风', 'INS简约风'];

export default function MarketingWorkspace({
  project,
  form,
  settings,
  analysis,
  displayedCopy,
  messages,
  chatThinking,
  aiModeMessage,
  chatInput,
  activeTab,
  posterRef,
  webRef,
  generatedImageUrl,
  imageLoading,
  imageError,
  imageStep,
  imageMode,
  imageModel,
  imagePrompt,
  imageHistory,
  imageVersion,
  copyLoading,
  copyError,
  isAiCopyGenerated,
  onChatInputChange,
  onSendMessage,
  onQuickCommand,
  onFieldChange,
  onServiceChange,
  onGenerateImage,
  onUseImageHistory,
  onSettingChange,
  onUploadLogo,
  onUploadQr,
  onUploadBackground,
  onQrPositionChange,
  onTabChange,
  onOpenHome,
  onOpenResults,
  onViewResource,
  onCopyResource,
  onDownloadResource,
  onRegenerateResource,
  onExportPackage,
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState('');
  const shownMessages = messages?.length
    ? messages
    : [
        {
          id: 'welcome',
          role: 'assistant',
          content: '我已经为你生成了一套营销方案。你可以继续告诉我怎么改，比如：价格改成59、标题高级一点、换成暖色、适合年轻女性。',
        },
      ];

  const runQuickAction = async (text) => {
    await onQuickCommand(text);
    setToast('已同步更新：海报、网页、朋友圈、小红书、视频脚本。');
    window.setTimeout(() => setToast(''), 1800);
  };

  useEffect(() => {
    if (!imageError) return;
    setToast('图片生成失败，已保留本地模板预览。');
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [imageError]);

  const runSendMessage = async () => {
    if (!chatInput.trim()) return;
    await onSendMessage();
    setToast('已同步更新：海报、网页、朋友圈、小红书、视频脚本。');
    window.setTimeout(() => setToast(''), 1800);
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <header className="mx-auto mb-4 flex w-full max-w-[1540px] shrink-0 flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white/90 px-4 py-3 shadow-card backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <BrandLogo compact />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-semibold text-stone-950">{project?.name || '当前项目'}</h1>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
              已自动保存
            </span>
          </div>
        </div>
        <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Button onClick={onOpenHome}>
            <Home size={17} />
            返回首页
          </Button>
          <Button onClick={() => setSettingsOpen(true)}>
            <Settings2 size={17} />
            商家设置
          </Button>
          <Button onClick={onOpenResults}>
            <Trophy size={17} />
            成果中心
          </Button>
          <Button variant="primary" onClick={onExportPackage}>
            <FileArchive size={17} />
            一键导出全部
          </Button>
        </nav>
      </header>

      {aiModeMessage ? (
        <div className="mx-auto mb-3 w-full max-w-[1540px] shrink-0 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
          {aiModeMessage || '当前为模拟 AI 模式，配置 OPENAI_API_KEY 后可启用真实 AI。'}
        </div>
      ) : null}

      <div className="mx-auto grid min-h-0 w-full max-w-[1540px] flex-1 grid-rows-[minmax(260px,42vh)_minmax(0,1fr)] gap-5 lg:grid-cols-[390px_minmax(0,1fr)] lg:grid-rows-1">
        <aside className="min-h-0 overflow-hidden rounded-2xl border border-stone-200/80 bg-white/78 p-4 shadow-card backdrop-blur">
          <ChatBox
            messages={shownMessages}
            thinking={chatThinking}
            value={chatInput}
            onChange={onChatInputChange}
            onSend={runSendMessage}
            onQuickAction={runQuickAction}
          />
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white/78 shadow-card backdrop-blur">
          <div className="shrink-0 border-b border-stone-200/80 bg-white/92 p-3">
            <Tabs
              tabs={previewTabs}
              activeTab={activeTab}
              onChange={onTabChange}
              className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#eef1ef] p-6 sm:p-8">
            <PreviewCanvas
              key={activeTab}
              activeTab={activeTab}
              form={form}
              settings={settings}
              analysis={analysis}
              displayedCopy={displayedCopy}
              posterRef={posterRef}
              webRef={webRef}
              generatedImageUrl={generatedImageUrl}
              imageLoading={imageLoading}
              imageError={imageError}
              imageStep={imageStep}
              imageMode={imageMode}
              imageModel={imageModel}
              imagePrompt={imagePrompt}
              imageHistory={imageHistory}
              imageVersion={imageVersion}
              copyLoading={copyLoading}
              copyError={copyError}
              isAiCopyGenerated={isAiCopyGenerated}
              onFieldChange={onFieldChange}
              onQrPositionChange={onQrPositionChange}
              onGenerateImage={onGenerateImage}
              onUseImageHistory={onUseImageHistory}
            />
          </div>

          <div className="shrink-0 border-t border-stone-200/80 bg-white/92 p-3">
            <div className="mx-auto grid max-w-3xl gap-2 sm:grid-cols-4">
              <Button onClick={() => onViewResource(activeTab)}>
                <Maximize2 size={16} />
                查看
              </Button>
              <Button onClick={() => onCopyResource(activeTab)}>复制</Button>
              <Button onClick={() => onDownloadResource(activeTab)}>
                <Download size={16} />
                下载
              </Button>
              <Button onClick={() => onRegenerateResource(activeTab)} disabled={imageLoading || copyLoading}>
                <RefreshCw size={16} />
                重新生成
              </Button>
            </div>
          </div>
        </section>
      </div>

      <MerchantSettingsModal
        open={settingsOpen}
        form={form}
        settings={settings}
        imageLoading={imageLoading}
        onClose={() => setSettingsOpen(false)}
        onFieldChange={onFieldChange}
        onServiceChange={onServiceChange}
        onGenerateImage={onGenerateImage}
        onSettingChange={onSettingChange}
        onUploadLogo={onUploadLogo}
        onUploadQr={onUploadQr}
        onUploadBackground={onUploadBackground}
      />

      <Toast message={toast} />
    </main>
  );
}

function ChatBox({ messages, thinking, value, onChange, onSend, onQuickAction }) {
  const [adviceVisible, setAdviceVisible] = useState(true);

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden p-4">
      <div className="shrink-0">
        <h2 className="text-xl font-semibold text-stone-950">AI 营销顾问</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          直接告诉我目标，我会同步优化海报、网页和文案。
        </p>
      </div>
      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto rounded-2xl bg-[#f7f8f7] p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {thinking ? <ThinkingBubble thinking={thinking} /> : null}
        {adviceVisible && !thinking ? (
          <AdvisorCard
            onAccept={() => {
              onQuickAction('增加限时体验价和会员活动，让宣传更适合到店转化');
              setAdviceVisible(false);
            }}
            onDismiss={() => setAdviceVisible(false)}
          />
        ) : null}
      </div>
      <div className="mt-3 shrink-0 border-t border-stone-100 pt-3">
        <div className="flex flex-wrap gap-2">
        {quickActions.map(([icon, action]) => (
          <button
            key={action}
            type="button"
            onClick={() => onQuickAction(action)}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 ring-1 ring-stone-200 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-card"
          >
            <span className="mr-1">{icon}</span>
            {action}
          </button>
        ))}
        </div>
      </div>
      <div className="mt-3 flex shrink-0 gap-2 bg-white">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSend();
          }}
          placeholder="继续告诉 AI 你的修改需求..."
        />
        <Button variant="primary" onClick={onSend} className="shrink-0 px-3">
          <Send size={18} />
        </Button>
      </div>
    </Card>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const lines = String(message.content || '').split('\n');
  const [visibleLines, setVisibleLines] = useState(isUser ? lines.length : 1);

  useEffect(() => {
    if (isUser) return undefined;
    setVisibleLines(1);
    const timer = window.setInterval(() => {
      setVisibleLines((current) => {
        if (current >= lines.length) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 180);
    return () => window.clearInterval(timer);
  }, [isUser, message.id, lines.length]);

  return (
    <div className={`flex animate-chat-message ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${
          isUser
            ? 'rounded-br-md bg-emerald-700 text-white'
            : 'rounded-bl-md bg-white text-stone-700 ring-1 ring-stone-200'
        }`}
      >
        {lines.slice(0, visibleLines).join('\n')}
      </div>
    </div>
  );
}

function ThinkingBubble({ thinking }) {
  return (
    <div className="flex animate-chat-message justify-start">
      <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm leading-7 text-stone-700 shadow-sm ring-1 ring-emerald-100">
        <div className="font-semibold text-emerald-800">{thinking.step}</div>
        <div className="mt-2 space-y-1 text-stone-500">
          {thinking.done.map((step) => (
            <div key={step}>✓ {step}</div>
          ))}
        </div>
        <div className="mt-3 flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-700" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-700 [animation-delay:120ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-700 [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}

function AdvisorCard({ onAccept, onDismiss }) {
  return (
    <div className="animate-soft-pop rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm leading-7 text-emerald-950">
      <div className="font-semibold">营销建议</div>
      <p className="mt-1">
        我发现这是本地到店型活动。如果增加限时体验价和会员活动，通常更容易推动顾客预约。
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
        >
          立即优化
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100 transition hover:bg-emerald-50"
        >
          暂时保持
        </button>
      </div>
    </div>
  );
}

function MerchantSettingsModal({
  open,
  form,
  settings,
  imageLoading,
  onClose,
  onFieldChange,
  onServiceChange,
  onGenerateImage,
  onSettingChange,
  onUploadLogo,
  onUploadQr,
  onUploadBackground,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <section className="flex max-h-[calc(100vh-32px)] w-full max-w-5xl animate-soft-pop flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card-hover">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-stone-200 px-5 py-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">商家设置</h2>
            <p className="mt-1 text-sm text-stone-500">这里管理基础资料和品牌素材，AI 对话会继续同步修改营销内容。</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="shrink-0 px-3">
            <X size={18} />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-stone-50/70 p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <SettingsSection title="商家信息">
              <Field label="店铺名称" value={form.storeName} onChange={(value) => onFieldChange('storeName', value)} />
              <SelectField label="行业类型" value={form.industryType} options={industryOptions} onChange={(value) => onFieldChange('industryType', value)} />
              <Field label="联系电话" value={form.phone} onChange={(value) => onFieldChange('phone', value)} />
              <Field label="地址" value={form.address} onChange={(value) => onFieldChange('address', value)} />
              <Field label="微信号" value={form.wechat} onChange={(value) => onFieldChange('wechat', value)} />
            </SettingsSection>

            <SettingsSection title="活动信息">
              <Field label="主标题" value={form.headline} onChange={(value) => onFieldChange('headline', value)} />
              <TextField label="副标题" value={form.subheadline} onChange={(value) => onFieldChange('subheadline', value)} />
              <Field label="活动价格" value={form.price} onChange={(value) => onFieldChange('price', value)} />
              <Field label="活动标签" value={settings.tagText} onChange={(value) => onSettingChange('tagText', value)} />
            </SettingsSection>

            <SettingsSection title="服务项目">
              {form.services.map((service, index) => (
                <Field
                  key={index}
                  label={`特色服务 ${index + 1}`}
                  value={service}
                  onChange={(value) => onServiceChange(index, value)}
                />
              ))}
            </SettingsSection>

            <SettingsSection title="品牌设置">
              <Field label="主色" type="color" value={settings.themeColor} onChange={(value) => onSettingChange('themeColor', value)} />
              <Field label="按钮色" type="color" value={settings.buttonColor} onChange={(value) => onSettingChange('buttonColor', value)} />
              <SelectField label="图片风格" value={form.imageStyle} options={imageStyleOptions} onChange={(value) => onFieldChange('imageStyle', value)} />
              <UploadButton label="上传 Logo" onChange={onUploadLogo} />
              <UploadButton label="上传二维码" onChange={onUploadQr} />
              <UploadButton label="上传背景图" onChange={onUploadBackground} />
              <Button variant="primary" className="w-full" onClick={onGenerateImage} loading={imageLoading}>
                AI 生成宣传图片
              </Button>
            </SettingsSection>
          </div>
        </div>

        <footer className="flex shrink-0 justify-end border-t border-stone-200 bg-white px-5 py-4">
          <Button variant="primary" onClick={onClose}>完成</Button>
        </footer>
      </section>
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </Card>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 ${type === 'color' ? 'h-11 p-1' : ''}`}
      />
    </label>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-900 outline-none transition duration-200 ease-out focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </Select>
    </label>
  );
}

function UploadButton({ label, onChange }) {
  return (
    <label className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-[15px] font-semibold text-stone-800 ring-1 ring-stone-200 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-stone-50 hover:shadow-card">
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

function PreviewCanvas({
  activeTab,
  form,
  settings,
  analysis,
  displayedCopy,
  posterRef,
  webRef,
  generatedImageUrl,
  imageLoading,
  imageError,
  imageStep,
  imageMode,
  imageModel,
  imagePrompt,
  imageHistory,
  imageVersion,
  copyLoading,
  copyError,
  isAiCopyGenerated,
  onFieldChange,
  onQrPositionChange,
  onGenerateImage,
  onUseImageHistory,
}) {
  if (activeTab === 'analysis') {
    return <AnalysisPreview analysis={analysis} form={form} />;
  }

  if (activeTab === 'poster') {
    return (
      <div className="mx-auto flex max-w-[900px] flex-col gap-4">
        <ImageGenerationPanel
          imageUrl={generatedImageUrl}
          loading={imageLoading}
          error={imageError}
          step={imageStep}
          mode={imageMode}
          model={imageModel}
          prompt={imagePrompt}
          history={imageHistory}
          onGenerate={onGenerateImage}
          onUseImage={onUseImageHistory}
        />
        <div className="animate-soft-pop rounded-2xl bg-white/70 p-4 shadow-inner ring-1 ring-white">
          <EditablePoster
            form={form}
            settings={settings}
            previewRef={posterRef}
            generatedImageUrl={generatedImageUrl}
            imageLoading={imageLoading}
            imageError=""
            imageVersion={imageVersion}
            onFieldChange={onFieldChange}
            onQrPositionChange={onQrPositionChange}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'web') {
    return (
      <div className="mx-auto max-w-5xl animate-soft-pop rounded-2xl bg-white/70 p-4 shadow-inner ring-1 ring-white">
        <LandingPreview form={form} previewRef={webRef} />
      </div>
    );
  }

  if (activeTab === 'logo') {
    return <LogoPreview form={form} settings={settings} />;
  }

  const textMap = {
    moments: ['朋友圈文案', '自然口吻 · 适合直接发布', displayedCopy.moments],
    redbook: ['小红书文案', '种草风格 · 分段排版', displayedCopy.redbook],
    douyin: ['视频脚本', '短视频口播 · 到店引流', displayedCopy.douyin],
  };
  const [title, description, content] = textMap[activeTab] || textMap.moments;
  return (
    <div className="mx-auto max-w-3xl">
      <TextPreview
        title={title}
        description={description}
        content={content}
        isAiGenerated={isAiCopyGenerated}
        isLoading={copyLoading}
        error={copyError}
      />
    </div>
  );
}

function ImageGenerationPanel({
  imageUrl,
  loading,
  error,
  step,
  mode,
  model,
  prompt,
  history = [],
  onGenerate,
  onUseImage,
}) {
  const steps = ['正在理解营销需求', '正在生成图片 Prompt', '正在调用生图模型', '正在应用到海报预览', '已完成'];
  const currentIndex = Math.max(0, steps.indexOf(step || (loading ? steps[0] : '已完成')));
  const modeText = mode === 'wanxiang' ? 'Wanxiang' : mode === 'openai' ? 'OpenAI' : 'Mock';

  return (
    <Card className="animate-soft-pop p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
              当前模式：{modeText}
            </span>
            <span className="rounded-full bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
              当前模型：{model || '本地模板'}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
              生成状态：{step || (imageUrl ? '已完成' : '未生成')}
            </span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-5">
            {steps.map((item, index) => {
              const active = loading ? index <= currentIndex : step === '已完成' || imageUrl;
              return (
                <div
                  key={item}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    active ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100' : 'bg-stone-50 text-stone-400 ring-1 ring-stone-100'
                  }`}
                >
                  {active ? '✓ ' : ''}
                  {item}
                </div>
              );
            })}
          </div>

          {prompt ? (
            <p className="mt-4 line-clamp-3 rounded-2xl bg-stone-50 px-4 py-3 text-xs leading-6 text-stone-500 ring-1 ring-stone-100">
              图片 Prompt：{prompt}
            </p>
          ) : null}

          {error ? (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-100">
              图片生成失败，已保留本地模板预览。
            </p>
          ) : null}
        </div>

        <div className="w-full shrink-0 lg:w-48">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200">
            {imageUrl ? (
              <img src={imageUrl} alt="当前宣传图" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-xs font-semibold text-stone-400">
                本地模板预览
              </div>
            )}
          </div>
          <Button variant="primary" className="mt-3 w-full" onClick={onGenerate} loading={loading}>
            重新生成图片
          </Button>
          {imageUrl ? (
            <Button className="mt-2 w-full" onClick={() => onUseImage?.({ imageUrl, prompt, mode, model })}>
              使用当前图
            </Button>
          ) : null}
        </div>
      </div>

      {history.length ? (
        <div className="mt-4 border-t border-stone-100 pt-4">
          <div className="mb-2 text-sm font-semibold text-stone-800">最近生成图片</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {history.slice(0, 3).map((item, index) => (
              <button
                key={item.id || `${item.imageUrl}-${index}`}
                type="button"
                onClick={() => onUseImage?.(item)}
                className={`group overflow-hidden rounded-2xl bg-white text-left ring-1 transition hover:-translate-y-0.5 hover:shadow-card ${
                  item.imageUrl === imageUrl ? 'ring-emerald-300' : 'ring-stone-200'
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                  <img src={item.imageUrl} alt={`历史图片 ${index + 1}`} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="px-3 py-2 text-xs font-semibold text-stone-600">
                  {index === 0 ? '当前图' : `上一张 ${index}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function AnalysisPreview({ analysis, form }) {
  const plan = analysis || {
    analysis: `${form.storeName} 当前适合先明确目标客户、主推服务和活动价格，再统一输出海报、网页和文案。`,
    customer: '附近有到店需求的本地顾客',
    painPoints: ['不知道是否适合自己', '担心价格不透明', '缺少信任感', '没有立即行动理由', '预约路径不清楚'],
    sellingPoints: form.services?.filter(Boolean) || [],
    marketingPlan: ['突出活动价格', '强调服务体验', '引导顾客预约咨询', '统一视觉风格', '强化本地信任', '减少信息干扰'],
    currentProblem: '当前需要把门店优势收窄成一个清晰活动主题。',
    optimizationAdvice: '建议优先突出一个主推项目、一个价格和一个预约入口。',
    recommendedPlaybook: '朋友圈做信任触达，小红书做种草，短视频做注意力，海报负责快速转化。',
  };

  return (
    <section className="mx-auto w-full max-w-4xl animate-soft-pop rounded-2xl bg-white p-6 shadow-card">
      <div>
        <p className="text-sm font-semibold text-emerald-700">店铺营销诊断报告</p>
        <h2 className="mt-2 text-3xl font-semibold text-stone-950">AI 已完成营销诊断</h2>
        <p className="mt-3 text-base leading-8 text-stone-600">{plan.analysis}</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <InfoBlock title="市场分析" items={[plan.analysis]} />
        <InfoBlock title="目标客户" items={[plan.customer]} />
        <InfoBlock title="客户痛点" items={plan.painPoints} />
        <InfoBlock title="推荐卖点" items={plan.sellingPoints} />
        <InfoBlock title="营销策略" items={plan.marketingPlan} />
        <InfoBlock title="当前问题" items={[plan.currentProblem]} />
        <InfoBlock title="优化建议" items={[plan.optimizationAdvice]} />
        <InfoBlock title="推荐打法" items={[plan.recommendedPlaybook]} />
      </div>
    </section>
  );
}

function InfoBlock({ title, items = [] }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-100">
      <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.filter(Boolean).map((item, index) => (
          <div key={`${item}-${index}`} className="rounded-xl bg-white px-3 py-2 text-sm leading-6 text-stone-600">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoPreview({ form, settings }) {
  return (
    <section className="mx-auto flex min-h-[520px] w-full max-w-[760px] animate-soft-pop items-center justify-center rounded-2xl bg-white p-8 shadow-card">
      <div className="text-center">
        <div
          className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl bg-stone-50 text-5xl font-bold shadow-sm ring-1 ring-stone-200"
          style={{ color: settings.themeColor }}
        >
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-full w-full object-cover" />
          ) : (
            form.storeName?.slice(0, 2) || '店宣'
          )}
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-stone-950">{form.storeName}</h2>
        <p className="mt-2 text-sm font-medium text-stone-500">{form.industryType} · 品牌标识预览</p>
      </div>
    </section>
  );
}
