import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Copy,
  Download,
  Home,
  ImagePlus,
  LayoutDashboard,
  LayoutTemplate,
  RefreshCw,
  Trash2,
  WandSparkles,
} from 'lucide-react';
import AgentHome from './agent/AgentHome.jsx';
import AgentThinking from './agent/AgentThinking.jsx';
import { agentMessages, runAgentGeneration, runAgentRegenerate } from './agent/marketingAgent.js';
import BusinessForm from './components/BusinessForm.jsx';
import BrandLogo from './components/BrandLogo.jsx';
import LandingPreview from './components/LandingPreview.jsx';
import TextPreview from './components/TextPreview.jsx';
import EditablePoster from './editor/EditablePoster.jsx';
import EditorControls from './editor/EditorControls.jsx';
import MaterialPanel from './editor/MaterialPanel.jsx';
import { fileToDataUrl } from './editor/upload.js';
import TemplateCenter from './pages/TemplateCenter.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ResultsCenter from './projects/ResultsCenter.jsx';
import {
  createProject,
  duplicateProject,
  loadActiveProjectId,
  loadProjects,
  nowText,
  saveActiveProjectId,
  saveProjects,
  touchProject,
} from './projects/projectStorage.js';
import { buildResources } from './render/resourceAdapter.js';
import { getTemplateById } from './templates/businessTemplates.js';
import { generateMarketingCopy, generateMarketingImage, sendMarketingChat } from './services/aiService.js';
import { MOCK_AI_MESSAGE } from './services/mockMarketingAdvisor.js';
import {
  buildCopyByTab,
  buildDouyinCopy,
  buildMomentsCopy,
  buildRedBookCopy,
} from './utils/copyText.js';
import {
  buildMarketingHtml,
  downloadNodeAsPng,
  downloadText,
  exportMarketingPackage,
  printAsPdf,
} from './utils/download.js';
import { buildFallbackPlan } from './utils/marketingFallback.js';
import MarketingWorkspace from './workspace/MarketingWorkspace.jsx';
import { createMarketingPlan } from './planner/MarketingPlanner.js';
import { detectTemplateId } from './planner/intentPlanner.js';

const tabs = [
  { id: 'poster', label: 'AI 宣传海报' },
  { id: 'web', label: '宣传网页' },
  { id: 'moments', label: '朋友圈文案' },
  { id: 'redbook', label: '小红书文案' },
  { id: 'douyin', label: '抖音口播稿' },
];

const imageGenerationSteps = [
  '正在理解营销需求',
  '正在生成图片 Prompt',
  '正在调用生图模型',
  '正在应用到海报预览',
  '已完成',
];

const baseContact = {
  phone: '138 0000 0000',
  address: '人民路 88 号阳光广场 2 楼',
  wechat: 'yunshu888',
};

const initialTemplate = getTemplateById('wellness');

function buildFormFromTemplate(template) {
  return {
    ...baseContact,
    storeName: template.defaults.storeName,
    industryType: template.industryType,
    headline: template.defaults.headline,
    subheadline: template.defaults.subheadline,
    services: template.defaults.services,
    price: template.defaults.price,
    imageStyle: template.imageStyle,
    imageKeywords: template.imageKeywords,
  };
}

function buildSettingsFromTemplate(template) {
  return {
    templateId: template.id,
    themeColor: template.primaryColor,
    buttonColor: template.buttonColor,
    background: template.background,
    icon: template.icon,
    logoUrl: '',
    qrUrl: '',
    backgroundUrl: '',
    qrPosition: { x: 72, y: 70 },
    priceStyle: template.priceStyle,
    tagText: '新客体验',
    qrStyle: 'square',
    ctaText: '立即预约体验',
    fontClass: template.fontClass,
  };
}

function getInitialState() {
  const projects = loadProjects();
  const activeId = loadActiveProjectId();
  const activeProject = projects.find((project) => project.id === activeId) || projects[0];
  return { projects, activeProject };
}

function createMessage(role, content) {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    role,
    content,
    time: nowText(),
  };
}

function mergeFormPatch(currentForm, patch = {}) {
  const allowedKeys = [
    'storeName',
    'industryType',
    'headline',
    'subheadline',
    'services',
    'price',
    'phone',
    'address',
    'wechat',
    'imageStyle',
    'imageKeywords',
  ];
  const next = { ...currentForm };
  allowedKeys.forEach((key) => {
    const value = patch[key];
    if (Array.isArray(value) && key === 'services') {
      const services = value.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 3);
      if (services.length) next.services = services;
      return;
    }
    if (value !== undefined && value !== null && String(value).trim()) {
      next[key] = String(value).trim();
    }
  });
  return next;
}

function mergeSettingsPatch(currentSettings, patch = {}) {
  const allowedKeys = ['themeColor', 'buttonColor', 'background', 'tagText', 'ctaText'];
  const next = { ...currentSettings };
  allowedKeys.forEach((key) => {
    const value = patch[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      next[key] = String(value).trim();
    }
  });
  return next;
}

export default function App() {
  const initial = getInitialState();
  const [projects, setProjects] = useState(initial.projects);
  const [activeProjectId, setActiveProjectId] = useState(initial.activeProject?.id || '');
  const [page, setPage] = useState('agentHome');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [thinkingSteps, setThinkingSteps] = useState([
    '正在分析市场',
    '正在分析客户',
    '正在制定营销策略',
    '正在生成营销素材',
  ]);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [thinkingProgress, setThinkingProgress] = useState(0);
  const [form, setForm] = useState(initial.activeProject?.form || buildFormFromTemplate(initialTemplate));
  const [editorSettings, setEditorSettings] = useState(
    initial.activeProject?.settings || buildSettingsFromTemplate(initialTemplate),
  );
  const [activeTab, setActiveTab] = useState('poster');
  const [copyStatus, setCopyStatus] = useState('复制文案');
  const [exportStatus, setExportStatus] = useState('导出图片');
  const [imageVersion, setImageVersion] = useState(0);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(initial.activeProject?.generated?.imageUrl || '');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imageStep, setImageStep] = useState('');
  const [imageMode, setImageMode] = useState(initial.activeProject?.generated?.imageMode || 'mock');
  const [imageModel, setImageModel] = useState(initial.activeProject?.generated?.imageModel || '');
  const [imagePrompt, setImagePrompt] = useState(initial.activeProject?.generated?.imagePrompt || '');
  const [imageHistory, setImageHistory] = useState(initial.activeProject?.generated?.imageHistory || []);
  const [aiCopy, setAiCopy] = useState(initial.activeProject?.generated?.copy || null);
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [messages, setMessages] = useState(initial.activeProject?.messages || [createMessage('assistant', agentMessages.welcome)]);
  const [chatInput, setChatInput] = useState('');
  const [chatThinking, setChatThinking] = useState(null);
  const [aiModeMessage, setAiModeMessage] = useState('');
  const posterRef = useRef(null);
  const webRef = useRef(null);

  const activeProject = projects.find((project) => project.id === activeProjectId);

  const fallbackPlan = useMemo(() => buildFallbackPlan(form), [form]);
  const displayedCopy = {
    moments: aiCopy?.moments || fallbackPlan.copy.moments,
    redbook: aiCopy?.redbook || fallbackPlan.copy.redbook,
    douyin: aiCopy?.douyin || fallbackPlan.copy.douyin,
  };
  const activeAnalysis = activeProject?.generated?.analysis || null;
  const resources = buildResources({ form, settings: editorSettings, displayedCopy, generatedImageUrl });

  useEffect(() => {
    let alive = true;
    fetch('/api/health')
      .then((response) => response.json())
      .then((data) => {
        if (alive && data.mode === 'mock') setAiModeMessage(MOCK_AI_MESSAGE);
      })
      .catch(() => {
        if (alive) setAiModeMessage(MOCK_AI_MESSAGE);
      });
    return () => {
      alive = false;
    };
  }, []);

  const persistProjects = (nextProjects) => {
    setProjects(nextProjects);
    saveProjects(nextProjects);
  };

  const persistActiveProject = (patch) => {
    if (!activeProjectId) return;
    persistProjects(
      projects.map((project) =>
        project.id === activeProjectId
          ? touchProject(project, typeof patch === 'function' ? patch(project) : patch)
          : project,
      ),
    );
  };

  const activateProject = (project) => {
    setActiveProjectId(project.id);
    saveActiveProjectId(project.id);
    setForm(project.form);
    setEditorSettings(project.settings);
    setGeneratedImageUrl(project.generated?.imageUrl || '');
    setImageMode(project.generated?.imageMode || 'mock');
    setImageModel(project.generated?.imageModel || '');
    setImagePrompt(project.generated?.imagePrompt || '');
    setImageHistory(project.generated?.imageHistory || []);
    setAiCopy(project.generated?.copy || null);
    setMessages(project.messages?.length ? project.messages : [createMessage('assistant', agentMessages.welcome)]);
    setImageError('');
    setImageStep('');
    setCopyError('');
    persistProjects(
      projects.map((item) =>
        item.id === project.id ? { ...item, lastOpenedAt: nowText() } : item,
      ),
    );
  };

  const saveGenerated = (patch, type) => {
    const recentItem = type ? { type, time: nowText() } : null;
    persistActiveProject((project) => ({
      generated: {
        ...project.generated,
        ...patch,
        recentItems: recentItem
          ? [...(project.generated?.recentItems || []), recentItem].slice(-12)
          : project.generated?.recentItems || [],
      },
    }));
  };

  const pushImageHistory = (item) => {
    if (!item?.imageUrl) return [];
    const nextHistory = [
      {
        id: `image_${Date.now()}`,
        imageUrl: item.imageUrl,
        prompt: item.prompt || '',
        mode: item.mode || 'mock',
        model: item.model || '',
        time: nowText(),
      },
      ...imageHistory.filter((historyItem) => historyItem.imageUrl !== item.imageUrl),
    ].slice(0, 3);
    setImageHistory(nextHistory);
    return nextHistory;
  };

  const startAgent = async (diagnosisAnswers) => {
    const prompt = agentPrompt.trim();
    const diagnosis = diagnosisAnswers || {};
    if (!prompt && !diagnosis.industry) return;

    const template = getTemplateById(detectTemplateId(diagnosis.industry || prompt));
    const marketingPlan = await createMarketingPlan(diagnosis);
    const nextForm = {
      ...buildFormFromTemplate(template),
      industryType: diagnosis.industry || template.industryType,
      headline: marketingPlan.posterTitle,
      subheadline: marketingPlan.posterSubtitle,
      services: [
        diagnosis.product || template.defaults.services[0],
        ...(marketingPlan.sellingPoints || []).slice(0, 2),
      ].filter(Boolean).slice(0, 3),
      price: diagnosis.price || template.defaults.price,
      imageStyle: diagnosis.style || template.imageStyle,
    };
    const nextSettings = buildSettingsFromTemplate(template);
    const project = createProject({
      name: `${nextForm.industryType}${diagnosis.goal || '营销'}方案`,
      industry: nextForm.industryType,
      form: nextForm,
      settings: nextSettings,
    });
    project.messages = [
      createMessage('user', prompt || JSON.stringify(diagnosis)),
      createMessage('assistant', `我已完成营销诊断：${marketingPlan.analysis}`),
    ];

    const nextProjects = [project, ...projects];
    persistProjects(nextProjects);
    setActiveProjectId(project.id);
    saveActiveProjectId(project.id);
    setForm(nextForm);
    setEditorSettings(nextSettings);
    setGeneratedImageUrl('');
    setAiCopy({
      moments: marketingPlan.moments,
      redbook: marketingPlan.xiaohongshu,
      douyin: marketingPlan.videoScript || marketingPlan.douyin,
    });
    setMessages(project.messages);
    setPage('thinking');

    const consultantSteps = ['正在分析市场', '正在分析客户', '正在制定营销策略', '正在生成营销素材'];
    setThinkingSteps(consultantSteps);
    for (let index = 0; index < consultantSteps.length; index += 1) {
      setThinkingStep(index);
      setThinkingProgress(Math.round((index / consultantSteps.length) * 100));
      await new Promise((resolve) => window.setTimeout(resolve, 420));
    }
    setThinkingStep(consultantSteps.length);
    setThinkingProgress(100);

    const result = await runAgentGeneration(nextForm);

    let generatedImageHistory = [];
    if (result.imageUrl) {
      const imageItem = {
        imageUrl: result.imageUrl,
        prompt: result.imagePrompt || '',
        mode: result.imageMode || 'mock',
        model: result.imageModel || '',
      };
      generatedImageHistory = pushImageHistory(imageItem);
      setGeneratedImageUrl(result.imageUrl);
      setImageMode(imageItem.mode);
      setImageModel(imageItem.model);
      setImagePrompt(imageItem.prompt);
    }
    if (result.imageMessage) setImageError(result.imageMessage);
    const plannedCopy = {
      moments: marketingPlan.moments,
      redbook: marketingPlan.xiaohongshu,
      douyin: marketingPlan.videoScript || marketingPlan.douyin,
    };
    if (result.plan?.copy) setAiCopy({ ...plannedCopy, ...result.plan.copy });

    setActiveTab('analysis');

    const generatedPatch = {
      imageUrl: result.imageUrl,
      imageMode: result.imageMode || 'mock',
      imageModel: result.imageModel || '',
      imagePrompt: result.imagePrompt || '',
      imageHistory: generatedImageHistory,
      copy: { ...plannedCopy, ...(result.plan?.copy || {}) },
      title: marketingPlan.posterTitle,
      slogan: marketingPlan.customer,
      description: marketingPlan.analysis,
      analysis: marketingPlan,
    };

    persistProjects(
      nextProjects.map((item) =>
        item.id === project.id
          ? touchProject(item, {
              form: nextForm,
              settings: nextSettings,
              generated: {
                ...item.generated,
                ...generatedPatch,
                recentItems: [{ type: 'AI Agent 营销方案', time: nowText() }],
              },
            })
          : item,
      ),
    );
    setPage('workspace');
  };

  const openProject = (projectId) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    activateProject(project);
    setPage('workspace');
  };

  const renameProject = (projectId) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    const nextName = window.prompt('请输入新的项目名称', project.name);
    if (!nextName) return;
    persistProjects(
      projects.map((item) =>
        item.id === projectId ? touchProject(item, { name: nextName }) : item,
      ),
    );
  };

  const deleteProject = (projectId) => {
    if (!window.confirm('确定删除这个项目吗？')) return;
    const nextProjects = projects.filter((project) => project.id !== projectId);
    persistProjects(nextProjects);
    if (activeProjectId === projectId) {
      const nextActive = nextProjects[0];
      if (nextActive) activateProject(nextActive);
      else {
        setActiveProjectId('');
        saveActiveProjectId('');
        setPage('agentHome');
      }
    }
  };

  const duplicateExistingProject = (projectId) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    const copy = { ...project, id: `project_${Date.now()}`, name: `${project.name} 副本`, updatedAt: nowText(), createdAt: nowText() };
    persistProjects([copy, ...projects]);
  };

  const applyTemplate = (templateId, navigate = true) => {
    const template = getTemplateById(templateId);
    const nextForm = {
      ...form,
      ...buildFormFromTemplate(template),
      phone: form.phone || baseContact.phone,
      address: form.address || baseContact.address,
      wechat: form.wechat || baseContact.wechat,
    };
    const nextSettings = {
      ...buildSettingsFromTemplate(template),
      logoUrl: editorSettings.logoUrl,
      qrUrl: editorSettings.qrUrl,
      backgroundUrl: editorSettings.backgroundUrl,
      qrPosition: editorSettings.qrPosition,
    };
    setForm(nextForm);
    setEditorSettings(nextSettings);
    setGeneratedImageUrl('');
    setImageError('');
    setImageStep('');
    setImagePrompt('');
    setImageHistory([]);
    setImageMode('mock');
    setImageModel('');
    setAiCopy(null);
    setCopyError('');
    persistActiveProject((project) => ({
      form: nextForm,
      settings: nextSettings,
      industry: template.name,
      favoriteTemplates: Array.from(new Set([...(project.favoriteTemplates || []), template.id])),
      generated: { ...project.generated, imageUrl: '', copy: null },
    }));
    if (navigate) setPage('advancedEditor');
  };

  const updateField = (field, value) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    persistActiveProject({
      form: nextForm,
      storeInfo: {
        storeName: nextForm.storeName,
        phone: nextForm.phone,
        address: nextForm.address,
        wechat: nextForm.wechat,
      },
    });
  };

  const updateService = (index, value) => {
    const nextForm = {
      ...form,
      services: form.services.map((service, serviceIndex) =>
        serviceIndex === index ? value : service,
      ),
    };
    setForm(nextForm);
    persistActiveProject({ form: nextForm });
  };

  const updateSetting = (field, value) => {
    const nextSettings = { ...editorSettings, [field]: value };
    setEditorSettings(nextSettings);
    persistActiveProject({ settings: nextSettings });
  };

  const handleUpload = async (field, file) => {
    const dataUrl = await fileToDataUrl(file);
    if (dataUrl) updateSetting(field, dataUrl);
  };

  const applyMaterial = (category, item) => {
    const mapping = {
      logos: ['icon', item.value],
      backgrounds: ['background', item.value],
      icons: ['icon', item.value],
      buttons: ['buttonColor', item.value],
      priceCards: ['priceStyle', item.value],
      tags: ['tagText', item.value],
      qrStyles: ['qrStyle', item.value],
      ctaButtons: ['ctaText', item.value],
    };
    const next = mapping[category];
    if (next) updateSetting(next[0], next[1]);
  };

  const generateRealImage = async () => {
    setActiveTab('poster');
    setImageLoading(true);
    setImageError('');
    const result = await generateMarketingImage(form);
    if (result.imageUrl) {
      setGeneratedImageUrl(result.imageUrl);
      updateSetting('backgroundUrl', '');
      setImageVersion((current) => current + 1);
      saveGenerated({ imageUrl: result.imageUrl }, '宣传海报');
    } else {
      setImageError(result.message || '当前继续使用默认海报。');
    }
    setImageLoading(false);
  };

  const generatePosterImage = async () => {
    setActiveTab('poster');
    setImageLoading(true);
    setImageError('');
    setImageStep(imageGenerationSteps[0]);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 320));
      setImageStep(imageGenerationSteps[1]);
      await new Promise((resolve) => window.setTimeout(resolve, 320));
      setImageStep(imageGenerationSteps[2]);

      const result = await generateMarketingImage(form);
      setImageMode(result.mode || 'mock');
      setImageModel(result.model || '');
      setImagePrompt(result.prompt || '');

      if (!result.imageUrl) {
        setImageStep(imageGenerationSteps[4]);
        setImageError(result.message || '图片生成失败，已保留本地模板预览。');
        saveGenerated(
          {
            imageMode: result.mode || 'mock',
            imageModel: result.model || '',
            imagePrompt: result.prompt || '',
          },
          '图片生成失败',
        );
        return;
      }

      setImageStep(imageGenerationSteps[3]);
      const nextHistory = pushImageHistory(result);
      setGeneratedImageUrl(result.imageUrl);
      updateSetting('backgroundUrl', '');
      setImageVersion((current) => current + 1);
      saveGenerated(
        {
          imageUrl: result.imageUrl,
          imageMode: result.mode || 'mock',
          imageModel: result.model || '',
          imagePrompt: result.prompt || '',
          imageHistory: nextHistory,
        },
        '宣传海报',
      );
      await new Promise((resolve) => window.setTimeout(resolve, 240));
      setImageStep(imageGenerationSteps[4]);
    } catch {
      setImageStep(imageGenerationSteps[4]);
      setImageError('图片生成失败，已保留本地模板预览。');
    } finally {
      setImageLoading(false);
    }
  };

  const generateRealCopy = async () => {
    setCopyLoading(true);
    setCopyError('');
    const result = await generateMarketingCopy(form);
    setAiCopy(result.plan.copy);
    saveGenerated({ copy: result.plan.copy, title: result.plan.title, slogan: result.plan.slogan, description: result.plan.description }, '营销文案');
    if (result.message) setCopyError(result.message);
    setCopyLoading(false);
  };

  const wait = (ms) => new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

  const runChatEdit = async (rawText) => {
    const text = rawText.trim();
    if (!text) return;

    const userMessage = createMessage('user', text);
    const baseMessages = [...messages, userMessage];
    setMessages(baseMessages);
    setChatInput('');

    const thinkingSteps = ['正在理解修改要求', '正在更新海报', '正在同步文案', '已完成'];

    for (let index = 0; index < thinkingSteps.length; index += 1) {
      setChatThinking({
        step: thinkingSteps[index],
        done: thinkingSteps.slice(0, index),
      });
      await wait(360);
    }

    const aiResult = await sendMarketingChat({
      form,
      settings: editorSettings,
      displayedCopy,
      messages: baseMessages,
      userInput: text,
    });

    const nextForm = aiResult.form || mergeFormPatch(form, aiResult.formPatch);
    const nextSettings = aiResult.settings || mergeSettingsPatch(editorSettings, aiResult.settingsPatch);
    const nextCopy = aiResult.copy || buildFallbackPlan(nextForm).copy;
    const assistantReply = aiResult.reply || '我已根据你的要求完成模拟优化。';

    if (aiResult.mode === 'mock' || aiResult.mode === 'error') {
      setAiModeMessage(MOCK_AI_MESSAGE);
    }

    const assistantMessage = createMessage(
      'assistant',
      `${assistantReply}\n\n✓ 海报已更新\n✓ 网页已更新\n✓ 朋友圈已更新\n✓ 小红书已更新\n✓ 视频脚本已更新`,
    );
    const nextMessages = [...baseMessages, assistantMessage];

    setMessages(nextMessages);
    setChatThinking(null);
    setForm(nextForm);
    setEditorSettings(nextSettings);
    setAiCopy(nextCopy);
    persistActiveProject({
      form: nextForm,
      settings: nextSettings,
      messages: nextMessages,
      generated: {
        ...(activeProject?.generated || {}),
        copy: nextCopy,
        recentItems: [
          ...((activeProject?.generated?.recentItems || []).slice(-11)),
          { type: aiResult.ok ? '真实 AI 聊天修改' : '模拟 AI 聊天修改', time: nowText() },
        ],
      },
    });

    if (!aiResult.copy && !aiResult.ok && (text.includes('文案') || text.includes('标题') || text.includes('高级'))) {
      const result = await generateMarketingCopy(nextForm);
      setAiCopy(result.plan.copy);
      saveGenerated({ copy: result.plan.copy, title: result.plan.title, slogan: result.plan.slogan, description: result.plan.description }, 'AI 对话修改');
    }
  };

  const sendChatMessage = async () => {
    await runChatEdit(chatInput);
  };

  const sendQuickCommand = async (text) => {
    await runChatEdit(text);
  };

  const useImageHistoryItem = (item) => {
    if (!item?.imageUrl) return;
    setGeneratedImageUrl(item.imageUrl);
    setImageMode(item.mode || 'mock');
    setImageModel(item.model || '');
    setImagePrompt(item.prompt || '');
    updateSetting('backgroundUrl', '');
    saveGenerated(
      {
        imageUrl: item.imageUrl,
        imageMode: item.mode || 'mock',
        imageModel: item.model || '',
        imagePrompt: item.prompt || '',
      },
      '切换历史图片',
    );
  };

  const regenerateResource = async (assetId) => {
    if (assetId === 'poster') {
      await generatePosterImage();
      return;
    }

    const result = await runAgentRegenerate(assetId, form);
    if (assetId === 'poster') {
      if (result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
        saveGenerated({ imageUrl: result.imageUrl }, '重新生成海报');
      }
      return;
    }
    if (result.plan?.copy) {
      setAiCopy(result.plan.copy);
      saveGenerated({ copy: result.plan.copy, title: result.plan.title, slogan: result.plan.slogan, description: result.plan.description }, '重新生成文案');
    }
  };

  const clearGeneratedResults = () => {
    setGeneratedImageUrl('');
    setImageError('');
    setAiCopy(null);
    setCopyError('');
    setImageVersion(0);
    updateSetting('backgroundUrl', '');
    saveGenerated({ imageUrl: '', imagePrompt: '', imageHistory: [], imageMode: 'mock', imageModel: '', copy: null, title: '', slogan: '', description: '', logoUrl: '' });
  };

  const getCurrentCopy = () => {
    if (activeTab === 'moments') return displayedCopy.moments;
    if (activeTab === 'redbook') return displayedCopy.redbook;
    if (activeTab === 'douyin') return displayedCopy.douyin;
    return buildCopyByTab(form, activeTab);
  };

  const copyCurrentText = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentCopy());
      setCopyStatus('已复制');
    } catch {
      setCopyStatus('复制失败');
    }
    window.setTimeout(() => setCopyStatus('复制文案'), 1600);
  };

  const exportCurrentPreview = async () => {
    const targetRef = activeTab === 'poster' ? posterRef : activeTab === 'web' ? webRef : null;

    if (!targetRef?.current) {
      setExportStatus('请切换海报或网页');
      window.setTimeout(() => setExportStatus('导出图片'), 1800);
      return;
    }

    try {
      setExportStatus('正在导出');
      await downloadNodeAsPng(
        targetRef.current,
        `${form.storeName || '店宣AI'}-${activeTab === 'poster' ? '宣传海报' : '宣传网页'}.png`,
      );
      setExportStatus('导出完成');
    } catch {
      setExportStatus('导出失败');
    }
    window.setTimeout(() => setExportStatus('导出图片'), 1800);
  };

  const copyResource = async (resourceId) => {
    const contentMap = {
      poster: buildCopyByTab(form, 'poster'),
      web: buildMarketingHtml(form),
      moments: displayedCopy.moments,
      redbook: displayedCopy.redbook,
      douyin: displayedCopy.douyin,
      logo: form.storeName,
    };
    await navigator.clipboard.writeText(contentMap[resourceId] || '');
  };

  const downloadResource = async (resourceId) => {
    if (resourceId === 'poster') {
      await downloadNodeAsPng(posterRef.current, `${form.storeName}-宣传海报.png`);
      return;
    }
    if (resourceId === 'web') {
      downloadText(`${form.storeName}-宣传网页.html`, buildMarketingHtml(form), 'text/html;charset=utf-8');
      return;
    }
    if (resourceId === 'moments') downloadText(`${form.storeName}-朋友圈文案.txt`, displayedCopy.moments);
    if (resourceId === 'redbook') downloadText(`${form.storeName}-小红书文案.txt`, displayedCopy.redbook);
    if (resourceId === 'douyin') downloadText(`${form.storeName}-抖音口播稿.txt`, displayedCopy.douyin);
    if (resourceId === 'logo') downloadText(`${form.storeName}-Logo说明.txt`, editorSettings.logoUrl ? '已上传 Logo，可在海报中查看。' : form.storeName);
  };

  const downloadPdfResource = (resourceId) => {
    const contentMap = {
      poster: buildCopyByTab(form, 'poster'),
      web: buildMarketingHtml(form),
      moments: displayedCopy.moments,
      redbook: displayedCopy.redbook,
      douyin: displayedCopy.douyin,
      logo: `${form.storeName}\n${form.industryType}`,
    };
    const titleMap = {
      poster: '宣传海报',
      web: '宣传网页',
      moments: '朋友圈文案',
      redbook: '小红书文案',
      douyin: '视频脚本',
      logo: 'Logo',
    };
    printAsPdf(`${form.storeName}-${titleMap[resourceId] || '营销素材'}`, contentMap[resourceId] || '');
  };

  const viewResource = (resourceId) => {
    if (['poster', 'web', 'moments', 'redbook', 'douyin'].includes(resourceId)) {
      setActiveTab(resourceId);
    } else {
      setActiveTab('logo');
    }
    setPage('workspace');
  };

  const exportPackage = async () => {
    await exportMarketingPackage({
      projectName: activeProject?.name,
      form,
      copy: displayedCopy,
      posterNode: posterRef.current,
    });
  };

  const regenerateCurrent = () => {
    if (['moments', 'redbook', 'douyin'].includes(activeTab)) {
      generateRealCopy();
      return;
    }
    generatePosterImage();
  };

  const selectTemplateForHome = (templateId) => {
    const template = getTemplateById(templateId);
    const industryName = template.id === 'hotpot' ? '餐饮店' : template.name;
    applyTemplate(templateId, false);
    setAgentPrompt(
      `我是一家${industryName}，准备做新店开业，体验价${template.defaults.price}，想吸引附近顾客到店体验。`,
    );
    setPage('agentHome');
  };

  if (page === 'agentHome') {
    return (
      <AgentHome
        prompt={agentPrompt}
        onPromptChange={setAgentPrompt}
        onSubmit={startAgent}
      />
    );
  }

  if (page === 'thinking') {
    return (
      <AgentThinking
        steps={thinkingSteps}
        currentStep={thinkingStep}
        progress={thinkingProgress}
      />
    );
  }

  if (page === 'workspace') {
    return (
      <MarketingWorkspace
        project={activeProject}
        form={form}
        settings={editorSettings}
        analysis={activeAnalysis}
        displayedCopy={displayedCopy}
        messages={messages}
        chatThinking={chatThinking}
        aiModeMessage={aiModeMessage}
        chatInput={chatInput}
        activeTab={activeTab}
        posterRef={posterRef}
        webRef={webRef}
        generatedImageUrl={generatedImageUrl}
        imageLoading={imageLoading}
        imageError={imageError}
        imageStep={imageStep}
        imageMode={imageMode}
        imageModel={imageModel}
        imagePrompt={imagePrompt}
        imageHistory={imageHistory}
        imageVersion={imageVersion}
        copyLoading={copyLoading}
        copyError={copyError}
        isAiCopyGenerated={Boolean(aiCopy)}
        onChatInputChange={setChatInput}
        onSendMessage={sendChatMessage}
        onQuickCommand={sendQuickCommand}
        onFieldChange={updateField}
        onServiceChange={updateService}
        onGenerateImage={generatePosterImage}
        onUseImageHistory={useImageHistoryItem}
        onSettingChange={updateSetting}
        onUploadLogo={(file) => handleUpload('logoUrl', file)}
        onUploadQr={(file) => handleUpload('qrUrl', file)}
        onUploadBackground={(file) => handleUpload('backgroundUrl', file)}
        onQrPositionChange={(position) => updateSetting('qrPosition', position)}
        onTabChange={setActiveTab}
        onOpenHome={() => setPage('agentHome')}
        onOpenSettings={() => setPage('settings')}
        onOpenResults={() => setPage('results')}
        onOpenTemplates={() => setPage('templates')}
        onViewResource={viewResource}
        onCopyResource={copyResource}
        onDownloadResource={downloadResource}
        onRegenerateResource={regenerateResource}
        onExportPackage={exportPackage}
      />
    );
  }

  if (page === 'dashboard') {
    setPage('agentHome');
    return null;
  }

  if (page === 'advancedEditor') {
    setPage('settings');
    return null;
  }

  if (page === 'settings') {
    return (
      <SettingsPage
        form={form}
        settings={editorSettings}
        onBack={() => setPage('workspace')}
        onSettingChange={updateSetting}
        onUploadLogo={(file) => handleUpload('logoUrl', file)}
        onUploadQr={(file) => handleUpload('qrUrl', file)}
        onUploadBackground={(file) => handleUpload('backgroundUrl', file)}
      />
    );
  }

  if (page === 'results') {
    if (!activeProject) {
      setPage('agentHome');
      return null;
    }
    return (
      <ResultsCenter
        project={activeProject}
        form={form}
        settings={editorSettings}
        displayedCopy={displayedCopy}
        posterRef={posterRef}
        webRef={webRef}
        generatedImageUrl={generatedImageUrl}
        imageLoading={imageLoading}
        imageError={imageError}
        imageVersion={imageVersion}
        onView={viewResource}
        onCopy={copyResource}
        onDownload={downloadResource}
        onDownloadPdf={downloadPdfResource}
        onRegenerate={regenerateResource}
        onExportPackage={exportPackage}
        onOpenWorkspace={() => setPage('workspace')}
        onOpenTemplates={() => setPage('templates')}
      />
    );
  }

  if (page === 'templates') {
    return (
      <TemplateCenter
        selectedTemplateId={editorSettings.templateId}
        onBack={() => setPage('agentHome')}
        onSelectTemplate={selectTemplateForHome}
      />
    );
  }

  setPage('agentHome');
  return null;

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <header className="mx-auto mb-5 flex max-w-[1540px] flex-col gap-4 rounded-3xl border border-white/80 bg-white/90 px-4 py-4 shadow-soft backdrop-blur sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <BrandLogo compact />

        <div className="grid gap-3 sm:grid-cols-2 xl:flex">
          <button type="button" onClick={() => setPage('workspace')} className="icon-button bg-white text-stone-900 shadow-sm ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200">
            <LayoutDashboard size={18} />
            工作区
          </button>
          <button type="button" onClick={() => setPage('agentHome')} className="icon-button bg-white text-stone-900 shadow-sm ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200">
            <Home size={18} />
            AI 首页
          </button>
          <button type="button" onClick={() => setPage('templates')} className="icon-button bg-white text-stone-900 shadow-sm ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200">
            <LayoutTemplate size={18} />
            模板中心
          </button>
          <button type="button" onClick={copyCurrentText} className="icon-button bg-white text-stone-900 shadow-sm ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200">
            <Copy size={18} />
            {copyStatus}
          </button>
          <button type="button" onClick={exportCurrentPreview} className="icon-button bg-white text-stone-900 shadow-sm ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200">
            <Download size={18} />
            {exportStatus}
          </button>
          <button type="button" onClick={generateRealCopy} disabled={copyLoading} className="icon-button bg-white text-stone-900 shadow-sm ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200 disabled:cursor-not-allowed disabled:opacity-60">
            <WandSparkles size={18} />
            {copyLoading ? '生成文案中' : 'AI 生成文案'}
          </button>
          <button type="button" onClick={generatePosterImage} disabled={imageLoading} className="icon-button bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70">
            <ImagePlus size={18} />
            {imageLoading ? '生成图片中' : 'AI 生成宣传图片'}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1540px] gap-6 xl:grid-cols-[360px_minmax(0,1fr)_270px]">
        <aside className="space-y-5 xl:sticky xl:top-5 xl:max-h-[calc(100vh-2.5rem)] xl:overflow-y-auto">
          <BusinessForm
            form={form}
            onFieldChange={updateField}
            onServiceChange={updateService}
            onGenerateImage={generatePosterImage}
            isGeneratingImage={imageLoading}
          />
          <EditorControls
            settings={editorSettings}
            onSettingChange={updateSetting}
            onUploadLogo={(file) => handleUpload('logoUrl', file)}
            onUploadQr={(file) => handleUpload('qrUrl', file)}
            onUploadBackground={(file) => handleUpload('backgroundUrl', file)}
          />
        </aside>

        <section className="min-w-0">
          <div className="mb-4 rounded-3xl border border-white/80 bg-white/76 p-2 shadow-soft backdrop-blur">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-11 rounded-2xl px-3 py-2 text-sm font-black transition ${
                    activeTab === tab.id
                      ? 'bg-stone-950 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-white hover:text-stone-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-6 text-stone-600">
                高级编辑模式：适合需要手动微调海报、上传素材和导出的用户。
              </div>
              <button type="button" onClick={regenerateCurrent} disabled={imageLoading || copyLoading} className="icon-button bg-white text-stone-900 shadow-sm ring-1 ring-stone-100 hover:bg-stone-50 focus:ring-stone-200 disabled:cursor-not-allowed disabled:opacity-60">
                <RefreshCw size={18} />
                重新生成
              </button>
              <button type="button" onClick={clearGeneratedResults} className="icon-button bg-white text-red-700 shadow-sm ring-1 ring-red-100 hover:bg-red-50 focus:ring-red-100">
                <Trash2 size={18} />
                清空生成结果
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/50 p-3 shadow-soft backdrop-blur sm:p-5">
            {activeTab === 'poster' && (
              <EditablePoster
                form={form}
                settings={editorSettings}
                previewRef={posterRef}
                generatedImageUrl={generatedImageUrl}
                imageLoading={imageLoading}
                imageError={imageError}
                imageVersion={imageVersion}
                onFieldChange={updateField}
                onQrPositionChange={(position) => updateSetting('qrPosition', position)}
              />
            )}
            {activeTab === 'web' && <LandingPreview form={form} previewRef={webRef} />}
            {activeTab === 'moments' && (
              <TextPreview title="朋友圈文案" description="自然口吻 · 可直接复制发布" content={displayedCopy.moments} isAiGenerated={Boolean(aiCopy)} isLoading={copyLoading} error={copyError} />
            )}
            {activeTab === 'redbook' && (
              <TextPreview title="小红书文案" description="种草风格 · 分段排版 · 自带话题" content={displayedCopy.redbook} isAiGenerated={Boolean(aiCopy)} isLoading={copyLoading} error={copyError} />
            )}
            {activeTab === 'douyin' && (
              <TextPreview title="抖音口播稿" description="短视频口播 · 20-40 秒" content={displayedCopy.douyin} isAiGenerated={Boolean(aiCopy)} isLoading={copyLoading} error={copyError} />
            )}
          </div>
        </section>

        <MaterialPanel onApplyMaterial={applyMaterial} />
      </div>
    </main>
  );
}
