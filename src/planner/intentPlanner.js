import { businessTemplates, getTemplateById } from '../templates/businessTemplates.js';

const scenarioPrompts = {
  opening:
    '我是本地新店，准备做新店开业活动。希望快速做一套开业海报、朋友圈文案和小红书种草文案，吸引附近顾客第一次到店。',
  holiday:
    '我想做节日活动营销，需要一套适合节日前发布的宣传海报、活动网页和社群朋友圈文案。',
  member:
    '我想做会员充值活动，希望突出优惠、长期价值和老客户复购，引导顾客加微信咨询。',
  groupbuy:
    '我想做团购引流活动，需要突出低门槛体验价、服务亮点和到店预约。',
  recall:
    '我想召回老客户，希望文案自然、有温度，提醒老客户回来体验最近的优惠项目。',
};

const keywordTemplateMap = [
  ['美容', 'beauty'],
  ['皮肤', 'beauty'],
  ['按摩', 'massage'],
  ['推拿', 'massage'],
  ['沙疗', 'sand'],
  ['足疗', 'foot'],
  ['咖啡', 'coffee'],
  ['火锅', 'hotpot'],
  ['宠物', 'pet'],
  ['花店', 'flower'],
  ['鲜花', 'flower'],
  ['健身', 'fitness'],
  ['养生', 'wellness'],
  ['艾灸', 'wellness'],
];

export function getScenarioPrompt(type) {
  return scenarioPrompts[type] || '';
}

export function detectTemplateId(prompt) {
  const text = prompt || '';
  const matched = keywordTemplateMap.find(([keyword]) => text.includes(keyword));
  return matched?.[1] || 'wellness';
}

export function extractPrice(prompt) {
  const matched = String(prompt || '').match(/(\d{1,4})\s*(元|块|¥)?/);
  return matched ? `${matched[1]} 元 / 次` : '';
}

export function extractCity(prompt) {
  const matched = String(prompt || '').match(/我是(.{2,8}?)(一家|一个|本地|的)/);
  return matched?.[1] || '';
}

export function planFromPrompt(prompt) {
  const templateId = detectTemplateId(prompt);
  const template = getTemplateById(templateId);
  const price = extractPrice(prompt);
  const city = extractCity(prompt);

  const campaign = prompt.includes('开业')
    ? '新店开业'
    : prompt.includes('节日')
      ? '节日活动'
      : prompt.includes('会员')
        ? '会员充值'
        : prompt.includes('团购')
          ? '团购引流'
          : prompt.includes('老客户')
            ? '老客户召回'
            : '本地引流';

  return {
    template,
    campaign,
    projectName: `${template.name}${campaign}营销方案`,
    formPatch: {
      price: price || template.defaults.price,
      headline:
        campaign === '新店开业'
          ? `${template.name}新客体验限时开启`
          : template.defaults.headline,
      subheadline: city
        ? `面向${city}附近顾客，结合${campaign}目标，打造一套适合到店转化的宣传内容。`
        : template.defaults.subheadline,
    },
  };
}

export function planChatEdit(message, currentForm, currentSettings) {
  const text = message || '';
  const formPatch = {};
  const settingsPatch = {};
  const notes = [];

  const price = extractPrice(text);
  if (text.includes('价格') && price) {
    formPatch.price = price;
    notes.push(`已把体验价调整为 ${price}`);
  }

  if (text.includes('粉色') || text.includes('年轻女生')) {
    settingsPatch.themeColor = '#be185d';
    settingsPatch.buttonColor = '#db2777';
    settingsPatch.background = 'from-[#ffe0ea] via-[#fff7fb] to-[#ead8ff]';
    formPatch.imageStyle = '高级轻奢风';
    notes.push('已切换为更适合年轻女性的粉色轻奢风格');
  }

  if (text.includes('高级') || text.includes('质感')) {
    formPatch.headline = `把${currentForm.industryType}体验做得更有质感`;
    formPatch.subheadline = '用更克制、更高级的视觉和文案，突出舒适体验、专业服务和到店价值。';
    notes.push('已优化标题和副标题，让表达更高级');
  }

  if (text.includes('标题')) {
    formPatch.headline = formPatch.headline || `${currentForm.storeName}品质体验限时开启`;
    notes.push('已优化宣传标题');
  }

  if (!notes.length) {
    notes.push('已理解你的需求，并优先调整文案表达和营销重点');
    formPatch.subheadline = `${currentForm.subheadline} ${text}`.slice(0, 90);
  }

  return {
    form: { ...currentForm, ...formPatch },
    settings: { ...currentSettings, ...settingsPatch },
    reply: notes.join('，') + '。',
  };
}

export function listTemplateNames() {
  return businessTemplates.map((template) => template.name).join('、');
}
