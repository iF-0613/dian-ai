import { Plus } from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';
import { businessTemplates } from '../templates/businessTemplates.js';

export default function ProjectCreatePage({
  projectName,
  industry,
  onProjectNameChange,
  onIndustryChange,
  onCreate,
}) {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <BrandLogo />
        <section className="mt-10 grid gap-8 rounded-[36px] bg-white/86 p-6 shadow-soft backdrop-blur lg:grid-cols-[1fr_420px] lg:p-8">
          <div>
            <p className="text-sm font-black text-emerald-700">欢迎使用店宣 AI V3</p>
            <h1 className="mt-3 text-[clamp(2.4rem,7vw,4.8rem)] font-black leading-tight text-stone-950">
              先创建一个营销项目
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600">
              项目会保存店铺信息、海报、文案、最近生成和收藏模板。后续可以复制、切换、重命名或删除。
            </p>
          </div>

          <form className="rounded-3xl bg-[#fbf8f2] p-5" onSubmit={(event) => event.preventDefault()}>
            <label className="block">
              <span className="field-label">项目名称</span>
              <input
                className="field-control"
                value={projectName}
                onChange={(event) => onProjectNameChange(event.target.value)}
                placeholder="例如：云舒养生馆 6 月营销"
              />
            </label>
            <label className="mt-4 block">
              <span className="field-label">行业</span>
              <select
                className="field-control"
                value={industry}
                onChange={(event) => onIndustryChange(event.target.value)}
              >
                {businessTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={onCreate}
              className="icon-button mt-5 w-full bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-200"
            >
              <Plus size={18} />
              创建项目
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
