import { generateFullMarketingPlan, regenerateAsset } from '../generator/marketingGenerator.js';
import { planChatEdit, planFromPrompt } from '../planner/intentPlanner.js';

export const agentMessages = {
  welcome:
    '你好，我是店宣 AI。告诉我你的门店、活动目标、价格和目标客户，我会自动完成分析、规划、生成、编辑和导出。',
};

export function createAgentPlan(prompt) {
  return planFromPrompt(prompt);
}

export async function runAgentGeneration(form, onStep) {
  return generateFullMarketingPlan(form, onStep);
}

export function runAgentChatEdit(message, form, settings) {
  return planChatEdit(message, form, settings);
}

export async function runAgentRegenerate(assetId, form) {
  return regenerateAsset(assetId, form);
}
