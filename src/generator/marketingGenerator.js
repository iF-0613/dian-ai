import { generateMarketingCopy, generateMarketingImage } from '../services/aiService.js';

export async function generateFullMarketingPlan(form, onStep) {
  const steps = [
    '分析行业',
    '生成营销策略',
    '编写文案',
    '设计海报',
    '生成网页',
    '设计Logo',
    '生成视频脚本',
  ];

  let imageResult = { imageUrl: '', message: '' };
  let copyResult = null;

  for (let index = 0; index < steps.length; index += 1) {
    onStep?.({ index, label: steps[index], progress: Math.round((index / steps.length) * 100), steps });
    await new Promise((resolve) => window.setTimeout(resolve, 420));

    if (index === 3) {
      imageResult = await generateMarketingImage(form);
    }

    if (index === 2) {
      copyResult = await generateMarketingCopy(form);
    }
  }

  onStep?.({ index: steps.length, label: '生成完成', progress: 100, steps });

  return {
    steps,
    imageUrl: imageResult.imageUrl || '',
    imageMessage: imageResult.message || '',
    imageMode: imageResult.mode || 'mock',
    imageModel: imageResult.model || '',
    imagePrompt: imageResult.prompt || '',
    plan: copyResult?.plan,
    mode: copyResult?.mode || imageResult.mode || 'mock',
  };
}

export async function regenerateAsset(assetId, form) {
  if (assetId === 'poster') {
    return generateMarketingImage(form);
  }
  return generateMarketingCopy(form);
}
