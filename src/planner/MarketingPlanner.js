import { requestMarketingPlan } from '../utils/api.js';
import { analyzeIndustry } from './IndustryAnalyzer.js';
import { evaluateDiagnosis } from './MarketingAnalyzer.js';
import { normalizeMarketingReport } from './MarketingReport.js';

export async function createMarketingPlan(diagnosis) {
  try {
    const result = await requestMarketingPlan({ diagnosis });
    if (result?.plan) return normalizePlan(result.plan, diagnosis);
  } catch {
    // Fall through to local plan so the product remains demoable.
  }
  return buildLocalMarketingPlan(diagnosis);
}

export function buildLocalMarketingPlan(diagnosis) {
  const insight = analyzeIndustry(diagnosis);
  const evaluation = evaluateDiagnosis(diagnosis);
  const price = diagnosis.price || '体验价到店咨询';
  const product = diagnosis.product || '主推服务';
  const storeType = diagnosis.industry || '本地门店';
  const customer = diagnosis.targetCustomer || insight.customer;
  const style = diagnosis.style || '温暖';

  return {
    analysis: `${insight.analysis} 当前重点应放在“${product} + ${price} + 清晰预约引导”，让${customer}快速判断是否适合自己。`,
    customer,
    painPoints: insight.painPoints,
    sellingPoints: insight.sellingPoints,
    marketingPlan: [
      `用${price}降低首次到店门槛`,
      `围绕${product}提炼 3 个直接可感知卖点`,
      `朋友圈负责信任触达，小红书负责种草，短视频负责吸引注意`,
      `所有素材统一突出${style}风格和预约方式`,
      `用城市/商圈信息增强本地真实感`,
      `把预约电话和微信放到每个素材的明显位置`,
    ],
    currentProblem: evaluation.currentProblem,
    optimizationAdvice: evaluation.optimizationAdvice,
    recommendedPlaybook: evaluation.recommendedPlaybook,
    posterTitle: `${storeType}${diagnosis.goal || '活动'}限时开启`,
    posterSubtitle: `${product}，${price}，适合${customer}到店体验。`,
    douyin: `你是不是也想找一个靠谱的${storeType}？这次我们主推${product}，${price}，适合${customer}。想体验可以提前预约，到店会帮你安排合适时间。`,
    xiaohongshu: `${storeType}体验分享｜${product}真的适合想放松一下的人✨\n\n这次活动重点是${product}，价格是${price}。\n\n推荐给：${customer}\n\n亮点：\n${insight.sellingPoints.map((item) => `🌿 ${item}`).join('\n')}\n\n#本地生活 #${storeType} #同城探店 #放松体验`,
    moments: `最近准备了一套${storeType}${diagnosis.goal || '活动'}。\n\n主推：${product}\n价格：${price}\n适合：${customer}\n\n如果你最近也想找个地方放松、体验或了解一下，可以先私信预约，我帮你安排合适时间。`,
    videoScript: `开头：最近想体验${storeType}的朋友可以看看。\n\n介绍：我们这次主推${product}，活动价格是${price}，比较适合${customer}。\n\n卖点：${insight.sellingPoints.join('、')}。\n\n结尾：想了解的朋友可以提前预约，到店体验更省时间。`,
  };
}

function normalizePlan(plan, diagnosis) {
  const fallback = buildLocalMarketingPlan(diagnosis);
  return normalizeMarketingReport(plan, fallback);
}
