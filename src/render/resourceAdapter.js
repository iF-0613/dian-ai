export function buildResources({ form, settings, displayedCopy, generatedImageUrl }) {
  return [
    {
      id: 'poster',
      title: '宣传海报',
      type: 'visual',
      description: generatedImageUrl ? 'AI 图片海报已生成' : '默认海报视觉',
    },
    {
      id: 'web',
      title: '宣传网页',
      type: 'web',
      description: `${form.storeName} 的落地页`,
    },
    {
      id: 'moments',
      title: '朋友圈',
      type: 'text',
      description: displayedCopy.moments?.slice(0, 42) || '待生成',
    },
    {
      id: 'redbook',
      title: '小红书',
      type: 'text',
      description: displayedCopy.redbook?.slice(0, 42) || '待生成',
    },
    {
      id: 'douyin',
      title: '视频脚本',
      type: 'text',
      description: displayedCopy.douyin?.slice(0, 42) || '待生成',
    },
    {
      id: 'logo',
      title: 'Logo',
      type: 'brand',
      description: settings.logoUrl ? '已上传 Logo' : `${form.storeName} 文字标识`,
    },
  ];
}
