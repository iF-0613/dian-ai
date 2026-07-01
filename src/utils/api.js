const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

async function postJson(url, payload) {
  const response = await fetch(apiUrl(url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || '请求失败，请稍后重试');
  }
  return data;
}

export function generateImage(payload) {
  return postJson('/api/generate-image', payload);
}

export function generateCopy(payload) {
  return postJson('/api/generate-copy', payload);
}

export function chatWithAi(payload) {
  return postJson('/api/chat', payload);
}

export function requestMarketingPlan(payload) {
  return postJson('/api/marketing-plan', payload);
}
