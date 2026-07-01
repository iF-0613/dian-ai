const normalize = (value) => String(value || '').trim();

export function sanitizeBusiness(payload = {}) {
  return {
    storeName: normalize(payload.storeName),
    industryType: normalize(payload.industryType),
    headline: normalize(payload.headline),
    subheadline: normalize(payload.subheadline),
    services: Array.isArray(payload.services)
      ? payload.services.map(normalize).filter(Boolean).slice(0, 3)
      : [],
    price: normalize(payload.price),
    phone: normalize(payload.phone),
    address: normalize(payload.address),
    wechat: normalize(payload.wechat),
    imageStyle: normalize(payload.imageStyle),
    imageKeywords: normalize(payload.imageKeywords),
  };
}

export function sanitizeChatPayload(payload = {}) {
  const projectData = payload.projectData || payload.project || {};
  const form = sanitizeBusiness(projectData.form || payload.form || projectData || {});
  const settings = projectData.settings || payload.settings || {};
  const copy = projectData.copy || payload.copy || {};
  const rawHistory = payload.chatHistory || payload.history || [];
  const history = Array.isArray(rawHistory)
    ? rawHistory
        .slice(-12)
        .map((message) => ({
          role: normalize(message.role),
          content: normalize(message.content).slice(0, 600),
        }))
        .filter((message) => message.role && message.content)
    : [];

  return {
    form,
    settings: {
      themeColor: normalize(settings.themeColor),
      buttonColor: normalize(settings.buttonColor),
      background: normalize(settings.background),
      imageStyle: normalize(form.imageStyle),
      tagText: normalize(settings.tagText),
      ctaText: normalize(settings.ctaText),
    },
    copy: {
      moments: normalize(copy.moments).slice(0, 1600),
      redbook: normalize(copy.redbook).slice(0, 1600),
      douyin: normalize(copy.douyin).slice(0, 1600),
    },
    history,
    userInput: normalize(payload.userMessage || payload.userInput).slice(0, 1200),
  };
}

export function buildImagePrompt(data) {
  return [
    '请生成一张竖版商业宣传海报顶部主视觉图片，不要包含文字、数字、二维码、电话或真实品牌标识。',
    `门店：${data.storeName || '本地小商家'}`,
    `行业：${data.industryType || '本地生活服务'}`,
    `宣传主题：${data.headline}`,
    `副标题含义：${data.subheadline}`,
    `特色服务：${data.services.join('、')}`,
    `图片风格：${data.imageStyle || '自然养生风'}`,
    `画面关键词：${data.imageKeywords || 'SPA、绿植、蜡烛、按摩、美容、放松'}`,
    '画面要求：适合本地商家；温暖、干净、现代、有商业海报质感；中心留出适合叠加中文标题的视觉空间；光线柔和；高端但亲切；不夸大医疗或功效。',
  ].join('\n');
}

export function buildCopyPrompt(data) {
  return `
你是一名懂本地生活商家私域营销的中文文案策划。
请基于下面门店信息，生成真实可用的营销方案，不能只是模板拼接。

门店信息：
- 店名：${data.storeName}
- 行业：${data.industryType}
- 主标题：${data.headline}
- 副标题：${data.subheadline}
- 特色服务：${data.services.join('、')}
- 体验价：${data.price}
- 电话：${data.phone}
- 地址：${data.address}
- 微信号：${data.wechat}

输出必须是严格 JSON，不要 Markdown，不要代码块：
{
  "title": "宣传标题，12-24 个中文字符",
  "slogan": "宣传 Slogan，短、有记忆点",
  "description": "店铺介绍，80-140 字，自然可信",
  "moments": "朋友圈文案，语气自然，有吸引人的开头，包含店名、服务、体验价、联系方式，最后有行动引导",
  "redbook": "小红书文案，包含吸引人的标题、分段正文、emoji、话题标签，适合本地生活商家",
  "douyin": "抖音口播稿，适合 20-40 秒短视频，口语化，有开头钩子、服务介绍、价格和预约引导"
}
`.trim();
}

export function buildChatPrompt(data) {
  return `
你是“店宣 AI”的中文本地商家营销顾问。
你的任务不是闲聊，而是根据用户的修改要求，同步优化项目数据和营销内容。

要求：
1. 回复要自然，像专业营销顾问，简洁说明你做了什么。
2. 必须返回严格 JSON，不要 Markdown，不要代码块。
3. 不要编造无法验证的疗效、医疗承诺、夸大保证。
4. updates 里的每个字段都必须返回字符串；不需要更新的字段返回空字符串。
5. 文案要结合当前店铺、价格、服务、地址、电话、微信和用户要求。
6. 用户要求修改价格、标题、风格、目标客群时，要体现在 updates 里，不能只回复一句话。

当前商家信息：
${JSON.stringify(data.form, null, 2)}

当前品牌设置：
${JSON.stringify(data.settings, null, 2)}

当前文案：
${JSON.stringify(data.copy, null, 2)}

最近聊天：
${JSON.stringify(data.history, null, 2)}

用户本次修改要求：
${data.userInput}

输出 JSON 结构：
{
  "reply": "给用户的回复",
  "updates": {
    "price": "",
    "posterTitle": "",
    "posterSubtitle": "",
    "wechatCopy": "",
    "xiaohongshuCopy": "",
    "landingPageCopy": "",
    "videoScript": ""
  }
}
`.trim();
}

export function sanitizeDiagnosisPayload(payload = {}) {
  const diagnosis = payload.diagnosis || {};
  return {
    industry: normalize(diagnosis.industry),
    city: normalize(diagnosis.city),
    goal: normalize(diagnosis.goal),
    product: normalize(diagnosis.product),
    price: normalize(diagnosis.price),
    targetCustomer: normalize(diagnosis.targetCustomer),
    style: normalize(diagnosis.style),
  };
}

export function buildMarketingPlanPrompt(data) {
  return `
你是店宣 AI，一名中文本地商家营销顾问。
请先分析需求，再制定营销方案，最后生成完整营销素材。

诊断信息：
- 行业：${data.industry}
- 城市：${data.city}
- 当前目的：${data.goal}
- 主推产品：${data.product}
- 活动价格：${data.price}
- 目标客户：${data.targetCustomer}
- 希望风格：${data.style}

要求：
1. customerPainPoints 至少 5 条。
2. marketingPlan 至少 6 条。
3. sellingPoints 只给 3 条最推荐的宣传卖点。
4. 如果价格偏高、卖点太多、定位不清，要在 currentProblem 和 optimizationAdvice 里主动提醒。

输出必须是严格 JSON：
{
  "analysis": "",
  "customer": "",
  "painPoints": [],
  "sellingPoints": [],
  "marketingPlan": [],
  "currentProblem": "",
  "optimizationAdvice": "",
  "recommendedPlaybook": "",
  "posterTitle": "",
  "posterSubtitle": "",
  "douyin": "",
  "xiaohongshu": "",
  "moments": "",
  "videoScript": ""
}
`.trim();
}
