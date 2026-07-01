const industryProfiles = {
  沙疗馆: {
    customer: '注重放松、调理和新鲜体验的本地女性顾客',
    sellingPoints: ['温热放松体验', '适合下班后舒缓', '体验价降低第一次到店门槛'],
    painPoints: ['不知道沙疗适不适合自己', '担心环境不够干净舒适', '害怕价格不透明', '缺少第一次体验理由', '不知道和普通按摩有什么区别'],
  },
  美容院: {
    customer: '关注形象管理、皮肤状态和长期护理的女性顾客',
    sellingPoints: ['护理效果可感知', '会员复购空间', '适合小红书种草'],
    painPoints: ['担心被过度推销', '不知道护理项目怎么选', '价格套餐不够清晰', '想变美但缺少持续动力', '对门店专业度缺乏信任'],
  },
  美甲店: {
    customer: '年轻女性、学生、白领和节日前有变美需求的顾客',
    sellingPoints: ['款式上新', '拍照好看', '低门槛体验和闺蜜同行'],
    painPoints: ['不知道最近流行什么款', '担心做出来和图片差距大', '想要好看但预算有限', '需要节日前快速变美', '担心卸甲修甲不专业'],
  },
  餐饮: {
    customer: '附近居民、上班族、朋友聚餐和家庭消费人群',
    sellingPoints: ['招牌产品明确', '套餐价格清晰', '适合同城团购引流'],
    painPoints: ['不知道招牌菜是什么', '担心踩雷不好吃', '聚餐需要性价比', '不知道停车和排队情况', '缺少马上下单的理由'],
  },
  健身房: {
    customer: '想改善身材、提升状态、需要陪伴感和计划感的人群',
    sellingPoints: ['体验课低门槛', '私教指导', '可持续打卡转化'],
    painPoints: ['担心办卡后坚持不下来', '不知道自己适合什么训练', '害怕私教推销压力', '想改变但缺少计划', '担心环境和氛围不适合新手'],
  },
};

export function analyzeIndustry({ industry, city, goal, targetCustomer }) {
  const profile = industryProfiles[industry] || {
    customer: targetCustomer || '附近有明确到店需求的本地顾客',
    sellingPoints: ['服务体验清晰', '价格门槛明确', '适合同城私域传播'],
    painPoints: ['不知道是否适合自己', '担心价格不透明', '缺少信任感', '没有立即行动理由', '预约路径不够清楚'],
  };

  return {
    analysis: `${industry || '本地门店'}在${city || '本地'}做${goal || '营销活动'}，核心不是单纯曝光，而是让顾客快速理解服务价值、价格门槛和预约方式。`,
    customer: targetCustomer || profile.customer,
    sellingPoints: profile.sellingPoints,
    painPoints: profile.painPoints,
  };
}
