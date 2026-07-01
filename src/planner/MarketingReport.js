export function normalizeMarketingReport(plan, fallback) {
  return {
    analysis: String(plan.analysis || fallback.analysis),
    customer: String(plan.customer || fallback.customer),
    painPoints: normalizeList(plan.painPoints, fallback.painPoints, 5),
    marketingPlan: normalizeList(plan.marketingPlan, fallback.marketingPlan, 6),
    sellingPoints: normalizeList(plan.sellingPoints, fallback.sellingPoints, 3),
    currentProblem: String(plan.currentProblem || fallback.currentProblem),
    optimizationAdvice: String(plan.optimizationAdvice || fallback.optimizationAdvice),
    recommendedPlaybook: String(plan.recommendedPlaybook || fallback.recommendedPlaybook),
    posterTitle: String(plan.posterTitle || fallback.posterTitle),
    posterSubtitle: String(plan.posterSubtitle || fallback.posterSubtitle),
    douyin: String(plan.douyin || fallback.douyin),
    xiaohongshu: String(plan.xiaohongshu || fallback.xiaohongshu),
    moments: String(plan.moments || fallback.moments),
    videoScript: String(plan.videoScript || fallback.videoScript),
  };
}

function normalizeList(value, fallback, minLength) {
  const source = Array.isArray(value) && value.length ? value : fallback;
  const list = (source || []).map(String).filter(Boolean);
  while (list.length < minLength) {
    list.push((fallback || [])[list.length] || '围绕核心活动目标继续强化转化路径');
  }
  return list;
}
