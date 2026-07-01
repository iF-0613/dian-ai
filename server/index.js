import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  AI_MODELS,
  AI_PROVIDER,
  IMAGE_OPTIONS,
  IMAGE_PROVIDER,
  WANXIANG_CONFIG,
} from './config/models.js';
import {
  buildChatPrompt,
  buildCopyPrompt,
  buildImagePrompt,
  buildMarketingPlanPrompt,
  sanitizeBusiness,
  sanitizeChatPayload,
  sanitizeDiagnosisPayload,
} from './prompts.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 8080;

const allowedOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  ...(process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.use((request, _response, next) => {
  console.log('REQ', request.method, request.url);
  next();
});

const provider = AI_PROVIDER === 'deepseek' ? 'deepseek' : 'openai';
const imageProvider =
  IMAGE_PROVIDER === 'wanxiang' ? 'wanxiang' : IMAGE_PROVIDER === 'openai' ? 'openai' : 'mock';

const hasConfiguredSecret = (value) => {
  const normalized = String(value || '').trim();
  return Boolean(normalized && normalized !== '你的key' && normalized !== '浣犵殑key');
};

const hasWanxiangApiKey = () => hasConfiguredSecret(WANXIANG_CONFIG.apiKey);
const hasOpenAiImageApiKey = () => hasConfiguredSecret(process.env.OPENAI_API_KEY);

const hasApiKey = () => {
  if (provider === 'deepseek') {
    return Boolean(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== '你的key');
  }
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== '你的key');
};

const hasImageApiKey = () =>
  Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== '你的key');

const getClient = () => {
  if (provider === 'deepseek') {
    return new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    });
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  });
};

const getMode = () => (hasApiKey() ? 'online' : 'mock');

async function createJsonTextResponse({ instructions, input, schema, model = AI_MODELS.chat }) {
  if (provider === 'deepseek') {
    const payload = {
      model,
      messages: [
        { role: 'system', content: instructions },
        { role: 'user', content: input },
      ],
    };
    if (!String(model).includes('reasoner')) {
      payload.response_format = { type: 'json_object' };
    }
    const completion = await getClient().chat.completions.create(payload);
    return completion.choices?.[0]?.message?.content || '{}';
  }

  const result = await getClient().responses.create({
    model,
    instructions,
    input,
    text: schema
      ? {
          format: {
            type: 'json_schema',
            name: schema.name,
            schema: schema.schema,
          },
        }
      : {
          format: { type: 'json_object' },
        },
  });
  return result.output_text || '{}';
}

async function buildAiImagePrompt(data) {
  const fallbackPrompt = buildImagePrompt(data);

  if (!hasApiKey()) {
    return fallbackPrompt;
  }

  try {
    const outputText = await createJsonTextResponse({
      model: AI_MODELS.chat,
      instructions:
        '你是本地商家商业海报的图片提示词策划。只输出可解析 JSON，不要 Markdown，不要代码块。图片 Prompt 必须专业、稳定、适合文生图模型。',
      input: [
        '请基于下面门店信息，为通义万相生成一段中文图片生成 Prompt。',
        'Prompt 必须包含：行业场景、画面主体、风格、色调、光影、构图、留白区域、禁止元素。',
        '要求：只描述海报顶部主视觉或背景图，不要直接照抄用户原话；不要生成文字、数字、二维码、电话、品牌 Logo；适合叠加中文标题；商业质感强；不夸大医疗功效。',
        '示例风格：中式养生馆宣传海报背景，温暖柔和光线，干净高级，绿色与米色调，主体为理疗空间、香薰、绿植和毛巾，右上或中部留出文字区域，无人物特写，无乱码文字，无品牌标识。',
        '',
        `门店：${data.storeName || '本地小商家'}`,
        `行业：${data.industryType || '本地生活服务'}`,
        `宣传主题：${data.headline || ''}`,
        `副标题：${data.subheadline || ''}`,
        `特色服务：${data.services?.join('、') || ''}`,
        `图片风格：${data.imageStyle || '自然养生风'}`,
        `关键词：${data.imageKeywords || 'SPA、绿植、蜡烛、按摩、美容、放松'}`,
        '',
        '输出格式：{"prompt":"..."}',
      ].join('\n'),
    });
    const parsed = JSON.parse(outputText);
    const prompt = String(parsed.prompt || '').trim();
    return isRelevantImagePrompt(prompt, data) ? prompt : fallbackPrompt;
  } catch (error) {
    console.warn('image prompt fallback:', error?.message || error);
    return fallbackPrompt;
  }
}

function isRelevantImagePrompt(prompt, data) {
  if (!prompt) return false;
  const hints = [
    data.storeName,
    data.industryType,
    ...(Array.isArray(data.services) ? data.services : []),
    ...(String(data.imageKeywords || '')
      .split(/[,\s，、]+/)
      .map((item) => item.trim())),
  ].filter((item) => String(item || '').trim().length >= 2);

  if (!hints.length) return true;
  return hints.some((item) => prompt.includes(String(item).trim()));
}

function getWanxiangEndpoint() {
  const baseURL = String(WANXIANG_CONFIG.baseURL || '').replace(/\/$/, '');
  return `${baseURL}/services/aigc/multimodal-generation/generation`;
}

async function generateWanxiangImage(prompt) {
  const result = await fetch(getWanxiangEndpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WANXIANG_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
      'X-DashScope-SSE': 'enable',
    },
    body: JSON.stringify({
      model: WANXIANG_CONFIG.model,
      input: {
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }],
          },
        ],
      },
      parameters: {
        size: WANXIANG_CONFIG.size,
        watermark: false,
        enable_interleave: true,
        stream: true,
        max_images: 1,
      },
    }),
  });

  const text = await result.text();

  if (!result.ok) {
    throw new Error(`Wanxiang request failed: ${result.status} ${text.slice(0, 300)}`);
  }

  const remoteImageUrl = extractImageUrl(parseWanxiangResponse(text));
  if (!remoteImageUrl) {
    throw new Error(`Wanxiang response missing image url: ${text.slice(0, 300)}`);
  }

  return toDataImageUrl(remoteImageUrl);
}

function parseWanxiangResponse(text) {
  if (!text) return {};

  const chunks = [];
  for (const line of text.split(/\r?\n/)) {
    const normalized = line.trim().replace(/^data:\s*/, '');
    if (!normalized || normalized === '[DONE]') continue;
    try {
      chunks.push(JSON.parse(normalized));
    } catch {
      // Streaming responses may include non-JSON keep-alive lines.
    }
  }

  if (chunks.length) {
    return chunks.reverse();
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function extractImageUrl(value) {
  if (!value) return '';

  if (typeof value === 'string') {
    return /^(https?:|data:image\/)/i.test(value) ? value : '';
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractImageUrl(item);
      if (found) return found;
    }
    return '';
  }

  if (typeof value === 'object') {
    for (const key of ['image', 'url', 'image_url']) {
      const found = extractImageUrl(value[key]);
      if (found) return found;
    }
    for (const item of Object.values(value)) {
      const found = extractImageUrl(item);
      if (found) return found;
    }
  }

  return '';
}

async function toDataImageUrl(imageUrl) {
  if (!/^https?:/i.test(imageUrl)) {
    return imageUrl;
  }

  try {
    const result = await fetch(imageUrl);
    if (!result.ok) {
      throw new Error(`download image failed: ${result.status}`);
    }
    const contentType = result.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await result.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.warn('image data url fallback:', error?.message || error);
    return imageUrl;
  }
}

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    provider,
    mode: getMode(),
    chatModel: AI_MODELS.chat,
    imageProvider,
    imageMode: hasImageApiKey() ? imageProvider : 'mock',
    imageModel: imageProvider === 'wanxiang' ? WANXIANG_CONFIG.model : AI_MODELS.image,
    models: AI_MODELS,
  });
});

app.post('/api/generate-image', async (request, response) => {
  const data = sanitizeBusiness(request.body);
  const prompt = await buildAiImagePrompt(data);

  if (imageProvider === 'wanxiang') {
    if (!hasWanxiangApiKey()) {
      return response.status(200).json({
        mode: 'mock',
        imageUrl: null,
        prompt,
        model: WANXIANG_CONFIG.model,
        provider: imageProvider,
        message: '当前未配置 DASHSCOPE_API_KEY，已保留本地模板预览。',
      });
    }

    try {
      const imageUrl = await generateWanxiangImage(prompt);
      return response.json({
        mode: 'wanxiang',
        imageUrl,
        prompt,
        model: WANXIANG_CONFIG.model,
        provider: imageProvider,
        message: '',
      });
    } catch (error) {
      console.error('wanxiang image failed:', error);
      return response.status(200).json({
        mode: 'mock',
        imageUrl: null,
        prompt: '',
        model: WANXIANG_CONFIG.model,
        provider: imageProvider,
        message: '图片生成失败，已保留本地模板预览。',
      });
    }
  }

  if (imageProvider !== 'openai' || !hasOpenAiImageApiKey()) {
    return response.status(200).json({
      mode: 'mock',
      imageUrl: null,
      prompt,
      model: AI_MODELS.image,
      provider: imageProvider,
      message: '当前为模拟图片模式，配置图片生成服务后可生成真实 AI 图片。',
    });
  }

  try {
    const result = await new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    }).images.generate({
      model: AI_MODELS.image,
      prompt,
      size: IMAGE_OPTIONS.size,
      quality: IMAGE_OPTIONS.quality,
    });

    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      throw new Error('OpenAI 图片接口未返回图片数据');
    }

    return response.json({
      mode: 'openai',
      imageUrl: `data:image/png;base64,${imageBase64}`,
      prompt,
      model: AI_MODELS.image,
      provider: imageProvider,
      message: '',
    });
  } catch (error) {
    console.error('openai image failed:', error);
    return response.status(200).json({
      mode: 'mock',
      imageUrl: null,
      prompt: '',
      model: AI_MODELS.image,
      provider: imageProvider,
      message: '图片生成失败，已保留本地模板预览。',
    });
  }
});

app.post('/api/generate-image-openai-legacy', async (request, response) => {
  const data = sanitizeBusiness(request.body);

  if (provider !== 'openai' || !hasImageApiKey()) {
    return response.status(200).json({
      mode: 'mock',
      imageUrl: null,
      prompt: buildImagePrompt(data),
      message: '当前未启用 OpenAI 图片模型，已保留模拟海报模式。',
    });
  }

  try {
    const prompt = buildImagePrompt(data);
    const result = await getClient().images.generate({
      model: AI_MODELS.image,
      prompt,
      size: IMAGE_OPTIONS.size,
      quality: IMAGE_OPTIONS.quality,
    });

    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      throw new Error('OpenAI 图片接口未返回图片数据');
    }

    response.json({
      mode: 'openai',
      imageUrl: `data:image/png;base64,${imageBase64}`,
      prompt,
    });
  } catch (error) {
    console.error('generate-image failed:', error);
    response.status(500).json({
      error: 'AI 宣传图片生成失败，请稍后重试，或先使用模拟海报。',
      detail: error?.message || 'unknown error',
    });
  }
});

app.post('/api/generate-copy', async (request, response) => {
  const data = sanitizeBusiness(request.body);

  if (!hasApiKey()) {
    return response.status(200).json({
      mode: 'mock',
      copy: null,
      message: `未配置 ${provider === 'deepseek' ? 'DEEPSEEK_API_KEY' : 'OPENAI_API_KEY'}，当前使用本地模板文案。`,
    });
  }

  try {
    const outputText = await createJsonTextResponse({
      model: AI_MODELS.copy,
      instructions:
        '你只输出可解析 JSON。文案要自然、可信、有本地生活服务场景，不夸大疗效，不做医疗承诺。',
      input: buildCopyPrompt(data),
    });

    const parsed = JSON.parse(outputText);

    response.json({
      mode: 'openai',
      provider,
      copy: {
        title: String(parsed.title || '').trim(),
        slogan: String(parsed.slogan || '').trim(),
        description: String(parsed.description || '').trim(),
        moments: String(parsed.moments || '').trim(),
        redbook: String(parsed.redbook || '').trim(),
        douyin: String(parsed.douyin || '').trim(),
      },
    });
  } catch (error) {
    console.error('generate-copy failed:', error);
    response.status(500).json({
      error: 'AI 文案生成失败，请稍后重试，或先使用本地模板文案。',
      detail: error?.message || 'unknown error',
    });
  }
});

app.post('/api/chat', async (request, response) => {
  const data = sanitizeChatPayload(request.body);

  if (!data.userInput) {
    return response.status(400).json({
      error: '请输入需要 AI 修改的内容。',
    });
  }

  if (!hasApiKey()) {
    return response.status(200).json({
      mode: 'mock',
      message: `当前为模拟 AI 模式，配置 ${provider === 'deepseek' ? 'DEEPSEEK_API_KEY' : 'OPENAI_API_KEY'} 后可启用真实 AI。`,
      reply: '',
      updates: emptyChatUpdates(),
      formPatch: {},
      settingsPatch: {},
      copy: null,
    });
  }

  try {
    const outputText = await createJsonTextResponse({
      instructions:
        '你是店宣 AI 的中文营销顾问。你必须输出可解析 JSON，用于前端同步更新项目数据和文案。',
      input: buildChatPrompt(data),
      schema: {
        name: 'marketing_chat_update',
        schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              reply: { type: 'string' },
              updates: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  price: { type: 'string' },
                  posterTitle: { type: 'string' },
                  posterSubtitle: { type: 'string' },
                  wechatCopy: { type: 'string' },
                  xiaohongshuCopy: { type: 'string' },
                  landingPageCopy: { type: 'string' },
                  videoScript: { type: 'string' },
                },
                required: [
                  'price',
                  'posterTitle',
                  'posterSubtitle',
                  'wechatCopy',
                  'xiaohongshuCopy',
                  'landingPageCopy',
                  'videoScript',
                ],
              },
            },
            required: ['reply', 'updates'],
          },
      },
    });

    const parsed = JSON.parse(outputText);
    const updates = normalizeChatUpdates(parsed.updates);
    const formPatch = buildFormPatchFromUpdates(updates);
    const copy = {
      moments: updates.wechatCopy || data.copy.moments || '',
      redbook: updates.xiaohongshuCopy || data.copy.redbook || '',
      douyin: updates.videoScript || data.copy.douyin || '',
    };

    response.json({
      mode: 'openai',
      provider,
      reply: String(parsed.reply || '').trim(),
      updates,
      formPatch,
      settingsPatch: {},
      copy,
    });
  } catch (error) {
    console.error('chat failed:', error);
    response.status(500).json({
      error: 'AI 聊天生成失败，已保留模拟模式。',
      detail: error?.message || 'unknown error',
    });
  }
});

app.post('/api/marketing-plan', async (request, response) => {
  const diagnosis = sanitizeDiagnosisPayload(request.body);

  if (!hasApiKey()) {
    return response.status(200).json({
      mode: 'mock',
      provider,
      plan: null,
      message: `当前为模拟 AI 模式，配置 ${provider === 'deepseek' ? 'DEEPSEEK_API_KEY' : 'OPENAI_API_KEY'} 后可启用真实 AI。`,
    });
  }

  try {
    const outputText = await createJsonTextResponse({
      model: AI_MODELS.reasoner || AI_MODELS.chat,
      instructions: '你是店宣 AI 的中文营销顾问。你必须输出可解析 JSON，不要 Markdown，不要代码块。',
      input: buildMarketingPlanPrompt(diagnosis),
      schema: {
        name: 'marketing_plan',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            analysis: { type: 'string' },
            customer: { type: 'string' },
            painPoints: { type: 'array', items: { type: 'string' } },
            sellingPoints: { type: 'array', items: { type: 'string' } },
            marketingPlan: { type: 'array', items: { type: 'string' } },
            currentProblem: { type: 'string' },
            optimizationAdvice: { type: 'string' },
            recommendedPlaybook: { type: 'string' },
            posterTitle: { type: 'string' },
            posterSubtitle: { type: 'string' },
            douyin: { type: 'string' },
            xiaohongshu: { type: 'string' },
            moments: { type: 'string' },
            videoScript: { type: 'string' },
          },
          required: [
            'analysis',
            'customer',
            'painPoints',
            'sellingPoints',
            'marketingPlan',
            'currentProblem',
            'optimizationAdvice',
            'recommendedPlaybook',
            'posterTitle',
            'posterSubtitle',
            'douyin',
            'xiaohongshu',
            'moments',
            'videoScript',
          ],
        },
      },
    });

    response.json({
      mode: 'openai',
      provider,
      plan: JSON.parse(outputText),
    });
  } catch (error) {
    console.error('marketing-plan failed:', error);
    response.status(500).json({
      error: 'AI 营销方案生成失败，已保留本地模拟方案。',
      detail: error?.message || 'unknown error',
    });
  }
});

function emptyChatUpdates() {
  return {
    price: '',
    posterTitle: '',
    posterSubtitle: '',
    wechatCopy: '',
    xiaohongshuCopy: '',
    landingPageCopy: '',
    videoScript: '',
  };
}

function normalizeChatUpdates(updates = {}) {
  const empty = emptyChatUpdates();
  return Object.fromEntries(
    Object.keys(empty).map((key) => [key, String(updates?.[key] || '').trim()]),
  );
}

function buildFormPatchFromUpdates(updates) {
  return cleanObject({
    price: updates.price,
    headline: updates.posterTitle,
    subheadline: updates.posterSubtitle || updates.landingPageCopy,
  });
}

function cleanObject(value = {}) {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (Array.isArray(item)) return item.filter(Boolean).length > 0;
      return item !== undefined && item !== null && String(item).trim() !== '';
    }),
  );
}

const distPath = path.resolve(__dirname, '../dist');

app.get('/assets/:file', (req, res) => {
  res.sendFile(path.join(distPath, 'assets', req.params.file));
});

app.use(express.static(distPath));

app.get(/^\/(?!api\/|assets\/).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`店宣 AI 服务监听 http://0.0.0.0:${port}`);
  console.log(`provider: ${provider}`);
  console.log(`mode: ${getMode()}`);
});
