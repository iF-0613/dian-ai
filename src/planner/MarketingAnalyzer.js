export function evaluateDiagnosis(diagnosis) {
  const issues = [];
  const suggestions = [];
  const priceNumber = Number(String(diagnosis.price || '').match(/\d+/)?.[0] || 0);

  if (!diagnosis.product || String(diagnosis.product).length < 3) {
    issues.push('主推产品还不够具体，顾客很难一眼判断为什么要来。');
    suggestions.push('把主推产品收窄到一个明确项目，例如“肩颈放松体验”或“新客护理套餐”。');
  }

  if (priceNumber > 199) {
    issues.push('首次体验价格偏高，可能降低新客第一次尝试意愿。');
    suggestions.push('建议设计低门槛体验价或限量福利，用来获取首次到店。');
  }

  if (!diagnosis.targetCustomer) {
    issues.push('目标客户不清晰，文案容易写成泛泛宣传。');
    suggestions.push('明确目标客户，例如年轻女性、附近白领、宝妈或老客户。');
  }

  if (!issues.length) {
    issues.push('当前基础信息较完整，但需要把卖点、价格和预约引导统一到同一个传播主题里。');
    suggestions.push('建议所有素材只突出一个核心主题，避免信息过多导致顾客不行动。');
  }

  return {
    currentProblem: issues.join(' '),
    optimizationAdvice: suggestions.join(' '),
    recommendedPlaybook: '用低门槛体验价做首次到店，用朋友圈建立信任，用小红书做种草，用短视频制造注意力，最后统一引导微信或电话预约。',
  };
}
