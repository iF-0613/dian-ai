import { buildDouyinCopy, buildMomentsCopy, buildRedBookCopy } from './copyText.js';

export function buildFallbackPlan(form) {
  return {
    title: `${form.storeName}｜${form.headline}`,
    slogan: `把好体验带给附近的每一位顾客`,
    description: `${form.storeName}是一家专注${form.industryType}体验的本地门店，主推${form.services.filter(Boolean).join('、')}，适合想放松、改善状态或安排日常小确幸的顾客。`,
    copy: {
      moments: buildMomentsCopy(form),
      redbook: buildRedBookCopy(form),
      douyin: buildDouyinCopy(form),
    },
  };
}
