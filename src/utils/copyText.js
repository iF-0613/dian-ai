const compact = (value) => String(value || '').trim();

export function getServices(form) {
  return form.services.map(compact).filter(Boolean);
}

export function buildGeneralCopy(form) {
  const services = getServices(form);

  return [
    `【${form.storeName}】${form.industryType}限时体验`,
    form.headline,
    form.subheadline,
    '',
    `特色服务：${services.join(' / ')}`,
    `体验价：${form.price}`,
    `预约电话：${form.phone}`,
    `门店地址：${form.address}`,
    `微信咨询：${form.wechat}`,
    '',
    '想放松身体、改善状态、犒劳自己，可以提前预约到店体验。',
  ].join('\n');
}

export function buildMomentsCopy(form) {
  const services = getServices(form);

  return [
    '最近真的很适合给自己安排一次放松。',
    '',
    `${form.storeName}正在做${form.industryType}新客体验，${form.headline}`,
    form.subheadline,
    '',
    `这次主推：${services.join('、')}，比较适合肩颈紧、身体累、想安静放松一下的朋友。`,
    '',
    `体验价：${form.price}`,
    `预约电话：${form.phone}`,
    `地址：${form.address}`,
    `微信：${form.wechat}`,
    '',
    '想来的朋友可以先加微信或电话预约，帮你提前安排合适时间。',
  ].join('\n');
}

export function buildRedBookCopy(form) {
  const services = getServices(form);
  const tags = [
    `#${form.industryType}`,
    '#本地生活',
    '#放松解压',
    '#养生体验',
    '#小店推荐',
  ];

  return [
    `下班后想放松？这家${form.industryType}可以试试`,
    '',
    `最近发现一家很适合放空自己的小店：${form.storeName} ✨`,
    '',
    `${form.headline}`,
    `${form.subheadline}`,
    '',
    '体验亮点：',
    ...services.map((service) => `🌿 ${service}`),
    '',
    `💰 新客体验价：${form.price}`,
    `📍 地址：${form.address}`,
    `📞 电话：${form.phone}`,
    `💬 微信：${form.wechat}`,
    '',
    '整体感觉比较舒服，不会有很强的推销感，适合想认真休息一下、缓解疲惫的人。建议提前预约，避免到店等待。',
    '',
    tags.join(' '),
  ].join('\n');
}

export function buildDouyinCopy(form) {
  const services = getServices(form);

  return [
    '你是不是也经常肩颈紧、身体累，下班后只想好好放松一下？',
    '',
    `今天给大家介绍一家本地小店：${form.storeName}。`,
    `${form.headline}，店里主打${services.join('、')}。`,
    '',
    `现在新客体验价是${form.price}，想来的朋友可以提前预约。`,
    `电话：${form.phone}，地址：${form.address}，微信：${form.wechat}。`,
    '',
    '给自己留一点休息时间，状态真的会不一样。',
  ].join('\n');
}

export function buildCopyByTab(form, activeTab) {
  if (activeTab === 'moments') return buildMomentsCopy(form);
  if (activeTab === 'redbook') return buildRedBookCopy(form);
  if (activeTab === 'douyin') return buildDouyinCopy(form);
  return buildGeneralCopy(form);
}
