import { useState } from 'react';
import { Copy, Download, Eye, FileArchive, LayoutTemplate, PenTool, RefreshCw } from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';
import EditablePoster from '../editor/EditablePoster.jsx';
import LandingPreview from '../components/LandingPreview.jsx';
import { Badge, Button, Card, Dialog, Empty, PageHeader, PageShell } from '../design/System.jsx';

export default function ResultsCenter({
  project,
  form,
  settings,
  displayedCopy,
  posterRef,
  webRef,
  generatedImageUrl,
  imageLoading,
  imageError,
  imageVersion,
  onView,
  onCopy,
  onDownload,
  onDownloadPdf,
  onRegenerate,
  onExportPackage,
  onOpenWorkspace,
  onOpenTemplates,
}) {
  const [selectedCard, setSelectedCard] = useState(null);
  const generatedTime = formatTime(project.updatedAt || project.createdAt);
  const cards = [
    { id: 'poster', title: '海报', type: 'poster', description: form.headline },
    { id: 'web', title: '网页', type: 'web', description: `${form.storeName} 宣传落地页` },
    { id: 'moments', title: '朋友圈', type: 'text', description: displayedCopy.moments },
    { id: 'redbook', title: '小红书', type: 'text', description: displayedCopy.redbook },
    { id: 'logo', title: 'Logo', type: 'logo', description: form.storeName },
    { id: 'douyin', title: '视频脚本', type: 'text', description: displayedCopy.douyin },
  ];
  const openCard = (card) => {
    if (card.type === 'text') {
      setSelectedCard(card);
      return;
    }
    onView(card.id);
  };

  return (
    <PageShell>
      <PageHeader>
        <div>
          <BrandLogo compact />
          <div className="mt-3 text-sm font-medium text-stone-500">
            成果中心只负责查看、复制、下载和重新生成。
          </div>
        </div>
        <nav className="grid gap-2 sm:grid-cols-3">
          <Button onClick={onOpenWorkspace}>
            <PenTool size={17} />
            返回项目
          </Button>
          <Button onClick={onOpenTemplates}>
            <LayoutTemplate size={17} />
            模板中心
          </Button>
          <Button variant="primary" onClick={onExportPackage}>
            <FileArchive size={17} />
            一键导出全部
          </Button>
        </nav>
      </PageHeader>

      <section className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="text-sm font-semibold text-emerald-700">当前项目</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950 sm:text-4xl">{project.name}</h1>
        </div>

        {cards.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Card
              key={card.id}
              interactive
              className={`group overflow-hidden ${card.id === 'poster' ? 'md:col-span-2 xl:col-span-1 border-emerald-200' : ''}`}
            >
              <ResultThumb card={card} form={form} settings={settings} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-2xl font-semibold text-stone-950">{card.title}</h2>
                    <p className="mt-1 text-[13px] font-medium text-stone-500">生成时间：{generatedTime}</p>
                  </div>
                  <Badge tone={card.id === 'poster' ? 'brand' : 'neutral'}>{typeLabel(card.type)}</Badge>
                </div>
                <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-6 text-stone-500">
                  {card.description}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2 opacity-95 transition duration-200 ease-out group-hover:opacity-100">
                  <ActionButton icon={<Eye size={15} />} text="查看" onClick={() => openCard(card)} />
                  <ActionButton icon={<Copy size={15} />} text="复制" onClick={() => onCopy(card.id)} />
                  <ActionButton icon={<Download size={15} />} text="下载PNG" onClick={() => onDownload(card.id)} />
                  <ActionButton icon={<Download size={15} />} text="下载PDF" onClick={() => onDownloadPdf(card.id)} />
                  <ActionButton icon={<RefreshCw size={15} />} text="重新生成" onClick={() => onRegenerate(card.id)} />
                </div>
              </div>
            </Card>
          ))}
        </div>
        ) : (
          <Empty
            title="还没有生成营销素材"
            description="回到项目工作区继续生成，海报、网页和文案会统一出现在这里。"
            action={<Button variant="primary" onClick={onOpenWorkspace}>返回项目</Button>}
          />
        )}
      </section>

      <Dialog
        open={Boolean(selectedCard)}
        title={selectedCard?.title || ''}
        onClose={() => setSelectedCard(null)}
      >
        <pre className="max-h-[70vh] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">
          {selectedCard?.description}
        </pre>
      </Dialog>

      <div className="pointer-events-none fixed left-[-10000px] top-0 w-[760px]" aria-hidden="true" inert="">
        <EditablePoster
          form={form}
          settings={settings}
          previewRef={posterRef}
          generatedImageUrl={generatedImageUrl}
          imageLoading={imageLoading}
          imageError=""
          imageVersion={imageVersion}
          onFieldChange={() => {}}
          onQrPositionChange={() => {}}
        />
        <div className="mt-8">
          <LandingPreview form={form} previewRef={webRef} />
        </div>
      </div>
    </PageShell>
  );
}

function typeLabel(type) {
  if (type === 'poster') return '图片';
  if (type === 'web') return '网页';
  if (type === 'logo') return '品牌';
  return '文案';
}

function ResultThumb({ card, form, settings }) {
  if (card.type === 'poster') {
    return (
      <div className={`min-h-52 bg-gradient-to-br ${settings.background} p-5`}>
        <div className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-stone-700">AI 海报</div>
        <div className="mt-12 max-w-xs text-3xl font-bold leading-tight text-stone-950">{form.headline}</div>
        <div className="mt-4 w-fit rounded-2xl bg-white/86 px-4 py-2 text-sm font-semibold text-emerald-800">{form.price}</div>
      </div>
    );
  }

  if (card.type === 'web') {
    return (
      <div className="min-h-44 bg-stone-50 p-5">
        <div className="h-8 w-32 rounded-full bg-emerald-100" />
        <div className="mt-5 h-6 w-3/4 rounded-full bg-stone-200" />
        <div className="mt-3 h-3 w-full rounded-full bg-stone-100" />
        <div className="mt-2 h-3 w-5/6 rounded-full bg-stone-100" />
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="h-12 rounded-2xl bg-white" />
          <div className="h-12 rounded-2xl bg-white" />
          <div className="h-12 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (card.type === 'logo') {
    return (
      <div className="flex min-h-44 items-center justify-center bg-[#f8fbf8] p-5">
        <div
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white text-3xl font-bold shadow-card"
          style={{ color: settings.themeColor }}
        >
          {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" className="h-full w-full object-cover" /> : form.storeName.slice(0, 2)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-44 bg-stone-50 p-5">
      <div className="space-y-3">
        <div className="h-3 w-full rounded-full bg-stone-200" />
        <div className="h-3 w-11/12 rounded-full bg-stone-200" />
        <div className="h-3 w-4/5 rounded-full bg-stone-200" />
        <div className="h-3 w-3/5 rounded-full bg-emerald-200" />
      </div>
      <div className="mt-8 rounded-2xl bg-white p-3 text-sm font-medium leading-6 text-stone-500 shadow-sm">
        {card.description?.slice(0, 54)}
      </div>
    </div>
  );
}

function formatTime(value) {
  if (!value) return '刚刚生成';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ActionButton({ icon, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-stone-700 ring-1 ring-stone-200 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-card"
    >
      {icon}
      {text}
    </button>
  );
}
