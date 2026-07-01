import { Home, LayoutTemplate, PenTool, Settings } from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';

export default function ProjectNav({
  project,
  resources,
  onHome,
  onTemplates,
  onAdvancedEdit,
  onExport,
  onViewResource,
  activeResourceId,
}) {
  return (
    <aside className="rounded-[30px] bg-white/88 p-4 shadow-soft backdrop-blur">
      <BrandLogo compact />
      <div className="mt-6 rounded-3xl bg-[#fbf8f2] p-4">
        <div className="text-xs font-black text-emerald-700">当前项目</div>
        <div className="mt-2 text-lg font-black leading-7 text-stone-950">
          {project?.name || '未命名项目'}
        </div>
        <div className="mt-1 text-sm text-stone-500">{project?.industry || '本地商家'}</div>
      </div>

      <div className="mt-5 grid gap-2">
        <NavButton icon={<Home size={18} />} text="工作台" onClick={onHome} />
        <NavButton icon={<LayoutTemplate size={18} />} text="模板中心" onClick={onTemplates} />
        <NavButton icon={<PenTool size={18} />} text="进入高级编辑" onClick={onAdvancedEdit} />
        <NavButton icon={<Settings size={18} />} text="导出营销素材包" onClick={onExport} primary />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-black text-stone-700">资源库</h3>
        <div className="mt-3 grid gap-2">
          {resources.map((resource) => (
            <button
              key={resource.id}
              type="button"
              onClick={() => onViewResource(resource.id)}
              className={`rounded-2xl px-3 py-2 text-left text-sm font-bold ring-1 transition focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                activeResourceId === resource.id
                  ? 'bg-emerald-50 text-emerald-800 ring-emerald-100'
                  : 'bg-white text-stone-600 ring-stone-100 hover:bg-emerald-50 hover:text-emerald-800 hover:ring-emerald-100'
              }`}
            >
              {resource.title}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function NavButton({ icon, text, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-bold ${
        primary
          ? 'bg-emerald-700 text-white hover:bg-emerald-800'
          : 'bg-white text-stone-700 ring-1 ring-stone-100 hover:bg-stone-50'
      }`}
    >
      {icon}
      {text}
    </button>
  );
}
