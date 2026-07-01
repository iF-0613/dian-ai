import { Copy, Edit3, FolderOpen, Heart, Plus, Trash2 } from 'lucide-react';

export default function ProjectDashboard({
  projects,
  activeProjectId,
  onCreate,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
  onOpenTemplates,
  onGenerate,
}) {
  const activeProject = projects.find((project) => project.id === activeProjectId) || projects[0];
  const recentProjects = [...projects].sort((a, b) => String(b.lastOpenedAt).localeCompare(String(a.lastOpenedAt))).slice(0, 4);
  const recentGenerated = projects
    .flatMap((project) => (project.generated?.recentItems || []).map((item) => ({ ...item, projectName: project.name })))
    .slice(-6)
    .reverse();

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[36px] bg-white/88 p-6 shadow-soft backdrop-blur lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-emerald-700">AI 营销工作台</p>
              <h1 className="mt-2 text-4xl font-black text-stone-950">我的项目</h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                当前项目：{activeProject?.name || '未选择'}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onCreate} className="icon-button bg-white text-stone-900 ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200">
                <Plus size={18} />
                新建项目
              </button>
              <button type="button" onClick={onGenerate} className="icon-button min-h-14 bg-emerald-700 px-6 text-base text-white hover:bg-emerald-800 focus:ring-emerald-200">
                🚀 一键生成营销方案
              </button>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-[30px] bg-white/82 p-5 shadow-soft backdrop-blur">
            <h2 className="text-xl font-black text-stone-950">项目列表</h2>
            <div className="mt-4 grid gap-3">
              {projects.map((project) => (
                <div key={project.id} className={`rounded-3xl p-4 ring-1 ${project.id === activeProjectId ? 'bg-emerald-50 ring-emerald-200' : 'bg-white ring-stone-100'}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-black text-stone-950">{project.name}</div>
                      <div className="mt-1 text-sm text-stone-500">
                        {project.industry} · 更新于 {new Date(project.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <SmallButton onClick={() => onOpen(project.id)} icon={<FolderOpen size={15} />} text="打开" />
                      <SmallButton onClick={() => onRename(project.id)} icon={<Edit3 size={15} />} text="重命名" />
                      <SmallButton onClick={() => onDuplicate(project.id)} icon={<Copy size={15} />} text="复制" />
                      <SmallButton onClick={() => onDelete(project.id)} icon={<Trash2 size={15} />} text="删除" danger />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <InfoPanel title="最近打开" items={recentProjects.map((item) => item.name)} />
            <InfoPanel
              title="收藏模板"
              icon={<Heart size={18} />}
              items={activeProject?.favoriteTemplates?.length ? activeProject.favoriteTemplates : ['wellness']}
              actionText="模板中心"
              onAction={onOpenTemplates}
            />
            <InfoPanel title="最近生成" items={recentGenerated.length ? recentGenerated.map((item) => `${item.projectName} · ${item.type}`) : ['暂无生成记录']} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function SmallButton({ icon, text, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold ring-1 ${danger ? 'bg-red-50 text-red-700 ring-red-100' : 'bg-white text-stone-700 ring-stone-100 hover:bg-stone-50'}`}
    >
      {icon}
      {text}
    </button>
  );
}

function InfoPanel({ title, items, icon, actionText, onAction }) {
  return (
    <section className="rounded-[30px] bg-white/82 p-5 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-black text-stone-950">
          {icon}
          {title}
        </h2>
        {actionText && (
          <button type="button" onClick={onAction} className="text-sm font-black text-emerald-700">
            {actionText}
          </button>
        )}
      </div>
      <div className="mt-3 grid gap-2">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="rounded-2xl bg-[#fbf8f2] px-3 py-2 text-sm font-bold text-stone-600">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
