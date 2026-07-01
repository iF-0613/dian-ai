const STORAGE_KEY = 'dianxuan_ai_v3_projects';
const ACTIVE_KEY = 'dianxuan_ai_v3_active_project';

export function createProjectId() {
  return `project_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function nowText() {
  return new Date().toISOString();
}

export function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const projects = raw ? JSON.parse(raw) : [];
    return Array.isArray(projects) ? projects : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadActiveProjectId() {
  return localStorage.getItem(ACTIVE_KEY) || '';
}

export function saveActiveProjectId(projectId) {
  localStorage.setItem(ACTIVE_KEY, projectId);
}

export function createProject({ name, industry, form, settings }) {
  const timestamp = nowText();
  return {
    id: createProjectId(),
    name: name || `${industry || '本地商家'}营销项目`,
    industry: industry || form?.industryType || '本地商家',
    storeInfo: {
      storeName: form?.storeName || '',
      phone: form?.phone || '',
      address: form?.address || '',
      wechat: form?.wechat || '',
    },
    form,
    settings,
    generated: {
      imageUrl: '',
      copy: null,
      title: '',
      slogan: '',
      description: '',
      logoUrl: settings?.logoUrl || '',
      recentItems: [],
    },
    favoriteTemplates: [settings?.templateId || 'wellness'],
    createdAt: timestamp,
    updatedAt: timestamp,
    lastOpenedAt: timestamp,
  };
}

export function touchProject(project, patch = {}) {
  return {
    ...project,
    ...patch,
    updatedAt: nowText(),
  };
}

export function duplicateProject(project) {
  const timestamp = nowText();
  return {
    ...project,
    id: createProjectId(),
    name: `${project.name} 副本`,
    createdAt: timestamp,
    updatedAt: timestamp,
    lastOpenedAt: timestamp,
  };
}
