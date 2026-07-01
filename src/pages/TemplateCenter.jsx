import { ArrowLeft, Check } from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';
import { businessTemplates } from '../templates/businessTemplates.js';
import { Button, Card, PageHeader, PageShell } from '../design/System.jsx';

const templateOrder = ['sand', 'wellness', 'beauty', 'massage', 'hotpot', 'fitness', 'hair', 'nail'];
const templates = templateOrder
  .map((id) => businessTemplates.find((template) => template.id === id))
  .filter(Boolean)
  .map((template) => (template.id === 'hotpot' ? { ...template, name: '餐饮店', industryType: '餐饮店' } : template));

const scenarios = {
  sand: '适合暑假活动、体验价引流、女性养生。',
  wellness: '适合肩颈放松、新客体验、老客户召回。',
  beauty: '适合护理套餐、会员充值、种草推广。',
  massage: '适合老客户召回、肩颈放松、体验价活动。',
  hotpot: '适合开业引流、节日促销、团购活动。',
  fitness: '适合体验课、私教引流、会员转化。',
  hair: '适合新客剪发、形象改造、同城引流。',
  nail: '适合年轻女性、节日款式、朋友圈推广。',
};

export default function TemplateCenter({ selectedTemplateId, onBack, onSelectTemplate }) {
  return (
    <PageShell>
      <PageHeader>
        <BrandLogo compact />
        <Button onClick={onBack}>
          <ArrowLeft size={18} />
          返回首页
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-emerald-700">模板中心</p>
          <h1 className="mt-2 text-4xl font-bold text-stone-950">选择你的行业</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            点击行业后，会回到 AI 首页并自动填充一段适合该行业的提示词。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {templates.map((template) => (
            <Card
              key={template.id}
              interactive
              className={`p-3 ${selectedTemplateId === template.id ? 'border-emerald-300 ring-4 ring-emerald-100' : ''}`}
            >
            <button
              type="button"
              onClick={() => onSelectTemplate(template.id)}
              className="group min-h-40 w-full text-left"
            >
              <div className={`relative h-full rounded-2xl bg-gradient-to-br ${template.background} p-4`}>
                {selectedTemplateId === template.id && (
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white shadow-brand">
                    <Check size={18} />
                  </div>
                )}
                <div className="text-sm font-semibold text-stone-600">{template.name}</div>
                <div className="mt-12 text-2xl font-bold leading-tight text-stone-950">
                  {template.industryType}
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-stone-600">
                  {scenarios[template.id]}
                </p>
              </div>
            </button>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
