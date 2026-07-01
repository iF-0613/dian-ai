import { Copy, Download, Eye, RefreshCw } from 'lucide-react';

export default function ResourceCenter({
  resources,
  onView,
  onCopy,
  onDownload,
  onRegenerate,
  highlightedResourceId,
  resourceRefs,
}) {
  return (
    <section className="rounded-[30px] bg-white/88 p-4 shadow-soft backdrop-blur">
      <div className="mb-4">
        <h2 className="text-lg font-black text-stone-950">成果中心</h2>
        <p className="mt-1 text-sm text-stone-500">海报、网页、文案、Logo 和视频脚本。</p>
      </div>

      <div className="grid gap-3">
        {resources.map((resource) => (
          <article
            key={resource.id}
            ref={(node) => {
              if (node) resourceRefs.current[resource.id] = node;
            }}
            tabIndex={-1}
            className={`scroll-mt-6 rounded-3xl p-4 transition duration-300 focus:outline-none ${
              highlightedResourceId === resource.id
                ? 'bg-emerald-50 ring-4 ring-emerald-200'
                : 'bg-[#fbf8f2]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-stone-950">{resource.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">
                  {resource.description}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <SmallAction icon={<Eye size={14} />} text="查看" onClick={() => onView(resource.id)} />
              <SmallAction icon={<Copy size={14} />} text="复制" onClick={() => onCopy(resource.id)} />
              <SmallAction icon={<Download size={14} />} text="下载" onClick={() => onDownload(resource.id)} />
              <SmallAction icon={<RefreshCw size={14} />} text="重生成" onClick={() => onRegenerate(resource.id)} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SmallAction({ icon, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-2 py-2 text-xs font-bold text-stone-700 ring-1 ring-stone-100 hover:bg-stone-50"
    >
      {icon}
      {text}
    </button>
  );
}
