import { chatWithAi, generateCopy, generateImage } from '../utils/api.js';
import { buildFallbackPlan } from '../utils/marketingFallback.js';
import { MOCK_AI_MESSAGE, runMockMarketingChat } from './mockMarketingAdvisor.js';

export async function generateMarketingImage(form) {
  try {
    const result = await generateImage(form);
    return {
      ok: Boolean(result.imageUrl),
      imageUrl: result.imageUrl || '',
      message: result.message || '',
      mode: result.mode || 'unknown',
      model: result.model || '',
      provider: result.provider || '',
      prompt: result.prompt || '',
    };
  } catch (error) {
    return {
      ok: false,
      imageUrl: '',
      message: '图片生成失败，已保留本地模板预览。',
      mode: 'error',
      model: '',
      provider: '',
      prompt: '',
    };
  }
}

export async function generateMarketingCopy(form) {
  const fallback = buildFallbackPlan(form);

  try {
    const result = await generateCopy(form);
    if (!result.copy) {
      return {
        ok: false,
        plan: fallback,
        message: result.message || '当前使用本地营销方案。',
        mode: result.mode || 'mock',
      };
    }

    return {
      ok: true,
      plan: {
        title: result.copy.title || fallback.title,
        slogan: result.copy.slogan || fallback.slogan,
        description: result.copy.description || fallback.description,
        copy: {
          moments: result.copy.moments || fallback.copy.moments,
          redbook: result.copy.redbook || fallback.copy.redbook,
          douyin: result.copy.douyin || fallback.copy.douyin,
        },
      },
      message: '',
      mode: result.mode || 'openai',
    };
  } catch (error) {
    return {
      ok: false,
      plan: fallback,
      message: error.message || 'AI 文案生成失败，已使用本地营销方案。',
      mode: 'error',
    };
  }
}

export async function sendMarketingChat({ form, settings, displayedCopy, messages, userInput }) {
  const mockResult = () => runMockMarketingChat({ form, settings, displayedCopy, messages, userInput });

  try {
    const result = await chatWithAi({
      userMessage: userInput,
      projectData: {
        form,
        settings,
        copy: displayedCopy,
      },
      chatHistory: messages,
    });

    if (result.mode !== 'openai') {
      return mockResult();
    }

    return {
      ok: true,
      mode: 'openai',
      message: result.message || '',
      reply: result.reply || '',
      updates: result.updates || {},
      formPatch: result.formPatch || {},
      settingsPatch: result.settingsPatch || {},
      copy: result.copy || null,
    };
  } catch (error) {
    return {
      ...mockResult(),
      message: MOCK_AI_MESSAGE,
      detail: error.message || '',
    };
  }
}
