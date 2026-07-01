export default function TextPreview({ title, description, content, isAiGenerated, isLoading, error }) {
  return (
    <section className="mx-auto w-full max-w-[760px] animate-soft-pop rounded-2xl border border-stone-200 bg-white p-5 shadow-card sm:p-7">
      <div className="mb-5 flex flex-col gap-2 border-b border-stone-100 pb-5">
        <p className="text-sm font-semibold text-emerald-700">
          {description}
          {isAiGenerated ? ' · AI 已生成' : ' · 本地模板'}
        </p>
        <h2 className="text-2xl font-semibold text-stone-950">{title}</h2>
      </div>
      {isLoading && (
        <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
          AI 正在生成文案，请稍等...
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      )}
      <pre className="min-h-[460px] whitespace-pre-wrap break-words rounded-2xl bg-stone-50 p-5 text-[15px] leading-8 text-stone-800 ring-1 ring-stone-200">
        {content}
      </pre>
    </section>
  );
}
