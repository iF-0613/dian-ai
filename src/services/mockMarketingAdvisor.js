import { buildDouyinCopy, buildMomentsCopy, buildRedBookCopy } from '../utils/copyText.js';

export const MOCK_AI_MESSAGE = '当前为模拟 AI 模式，配置 OPENAI_API_KEY 后可启用真实 AI。';

const warmBackground = 'from-[#f7e3c7] via-[#fff7ed] to-[#d8eadf]';
const pinkBackground = 'from-[#ffe0ea] via-[#fff7fb] to-[#ead8ff]';
const promoBackground = 'from-[#fee2e2] via-[#fff7ed] to-[#fde68a]';

export function runMockMarketingChat({ form, settings, userInput }) {
  const text = String(userInput || '').trim();
  const formPatch = {};
  const settingsPatch = {};
  const notes = [];

  const price = extractPrice(text);
  if ((text.includes('价格') || text.includes('价') || text.includes('59')) && price) {
    formPatch.price = price;
    notes.push(`体验价已调整为 ${price}`);
  }

  if (text.includes('高级') || text.includes('质感') || text.includes('轻奢')) {
    formPatch.headline = `把${form.industryType}体验做得更有质感`;
    formPatch.subheadline = '用更克制、更高级的视觉和文案，突出舒适体验、专业服务和到店价值。';
    formPatch.imageStyle = '高级轻奢风';
    settingsPatch.themeColor = '#065f46';
    settingsPatch.buttonColor = '#047857';
    notes.push('标题和副标题已改成更高级、更有质感的表达');
  }

  if (text.includes('年轻女性') || text.includes('年轻女生') || text.includes('女生') || text.includes('粉色')) {
    formPatch.subheadline = '更适合年轻女性下班后、周末和闺蜜结伴到店，强调放松、舒服和拍照氛围。';
    formPatch.imageStyle = '高级轻奢风';
    settingsPatch.themeColor = '#be185d';
    settingsPatch.buttonColor = '#db2777';
    settingsPatch.background = pinkBackground;
    notes.push('风格已调整为更适合年轻女性的轻柔氛围');
  }

  if (text.includes('暖色') || text.includes('温暖') || text.includes('暖')) {
    formPatch.imageStyle = '温馨生活风';
    settingsPatch.themeColor = '#b45309';
    settingsPatch.buttonColor = '#d97706';
    settingsPatch.background = warmBackground;
    notes.push('视觉已切换为暖色、温馨、放松的感觉');
  }

  if (text.includes('促销') || text.includes('活动') || text.includes('限时')) {
    formPatch.headline = `${form.storeName}限时体验活动`;
    formPatch.subheadline = '限时体验价开放中，适合新客到店感受服务，名额有限建议提前预约。';
    settingsPatch.background = promoBackground;
    settingsPatch.tagText = '限时活动';
    notes.push('已强化限时活动和到店预约转化');
  }

  if (text.includes('会员') || text.includes('会员卡') || text.includes('充值')) {
    formPatch.subheadline = '新客体验后可咨询会员卡福利，适合长期护理、定期放松和老客户复购。';
    settingsPatch.tagText = '会员福利';
    settingsPatch.ctaText = '咨询会员福利';
    notes.push('已加入会员活动引导');
  }

  if (text.includes('接地气') || text.includes('自然') || text.includes('别太广告')) {
    formPatch.subheadline = '用自然一点的表达，把服务、价格和预约方式说清楚，让顾客看完愿意咨询。';
    notes.push('文案语气已调整得更自然、更像真实朋友圈推荐');
  }

  if (text.includes('标题') && !formPatch.headline) {
    formPatch.headline = `${form.storeName}品质体验限时开启`;
    notes.push('已优化宣传标题');
  }

  if (!notes.length) {
    formPatch.subheadline = `${form.subheadline} ${text}`.slice(0, 96);
    notes.push('已根据你的要求调整营销重点，并同步到各类素材');
  }

  const nextForm = mergeForm(form, formPatch);
  const nextSettings = mergeSettings(settings, settingsPatch);
  const copy = buildMockCopy(nextForm, text);

  return {
    ok: false,
    mode: 'mock',
    message: MOCK_AI_MESSAGE,
    reply: buildReply(notes, nextForm),
    formPatch,
    settingsPatch,
    form: nextForm,
    settings: nextSettings,
    copy,
  };
}

function extractPrice(text) {
  const matched = String(text || '').match(/(\d{1,4})\s*(元|块|¥)?/);
  return matched ? `${matched[1]} 元 / 次` : '';
}

function mergeForm(form, patch) {
  return {
    ...form,
    ...patch,
    services: Array.isArray(patch.services) && patch.services.length ? patch.services.slice(0, 3) : form.services,
  };
}

function mergeSettings(settings, patch) {
  return {
    ...settings,
    ...patch,
  };
}

function buildReply(notes, form) {
  return [
    notes.join('，') + '。',
    `我会把重点放在“${form.headline}”，并同步优化海报、网页和三类文案，让顾客更容易看懂活动价值。`,
  ].join('\n');
}

function buildMockCopy(form, userInput) {
  const suffix = userInput.includes('会员')
    ? '\n\n到店后也可以咨询会员福利，适合想长期护理或定期放松的朋友。'
    : '';

  return {
    moments: `${buildMomentsCopy(form)}${suffix}`,
    redbook: buildRedBookCopy(form),
    douyin: buildDouyinCopy(form),
  };
}
