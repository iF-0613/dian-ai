import dotenv from 'dotenv';

dotenv.config();

export const AI_PROVIDER = String(process.env.AI_PROVIDER || 'openai').trim().toLowerCase();
export const IMAGE_PROVIDER = String(process.env.IMAGE_PROVIDER || 'wanxiang').trim().toLowerCase();

export const AI_MODELS = {
  image: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2',
  copy:
    process.env.MODEL_CHAT ||
    process.env.OPENAI_COPY_MODEL ||
    process.env.OPENAI_CHAT_MODEL ||
    'gpt-5.5',
  chat:
    process.env.MODEL_CHAT ||
    process.env.OPENAI_CHAT_MODEL ||
    process.env.OPENAI_COPY_MODEL ||
    'gpt-5.5',
  reasoner: process.env.MODEL_REASONER || 'deepseek-reasoner',
};

export const IMAGE_OPTIONS = {
  size: process.env.OPENAI_IMAGE_SIZE || '1024x1536',
  quality: process.env.OPENAI_IMAGE_QUALITY || 'medium',
};

export const WANXIANG_CONFIG = {
  apiKey: process.env.DASHSCOPE_API_KEY || '',
  baseURL: process.env.WANXIANG_BASE_URL || 'https://dashscope.aliyuncs.com/api/v1',
  model: process.env.WANXIANG_IMAGE_MODEL || 'wan2.6-image',
  size: process.env.IMAGE_SIZE || '1024*1024',
};
