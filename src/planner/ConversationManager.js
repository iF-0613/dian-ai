export const diagnosticQuestions = [
  {
    id: 'industry',
    label: '行业',
    question: '先让我了解一下，你的店主要是做什么的？比如沙疗馆、美容院、美甲店、餐饮或健身房。',
  },
  {
    id: 'city',
    label: '所在城市',
    question: '了解了。你的店在哪个城市或商圈？不同城市的顾客消费习惯会不太一样。',
  },
  {
    id: 'goal',
    label: '当前目的',
    question: '现在你最想解决的问题是什么？是新店开业、活动促销、节日营销、会员裂变，还是新品上市？',
  },
  {
    id: 'product',
    label: '主推产品',
    question: '这次最想推的产品或服务是什么？建议只选一个主推，否则顾客容易记不住。',
  },
  {
    id: 'price',
    label: '活动价格',
    question: '这次活动价格准备定多少？例如体验价59元、套餐99元。价格会直接影响转化门槛。',
  },
  {
    id: 'targetCustomer',
    label: '目标客户',
    question: '你最想吸引哪类客户？比如年轻女性、白领、宝妈、学生或中老年。',
  },
  {
    id: 'style',
    label: '希望风格',
    question: '最后，整体希望是什么感觉？高级、温暖、年轻、国风，还是科技感？',
  },
];

export function createDiagnosticState(initialPrompt = '') {
  return {
    started: false,
    currentIndex: 0,
    answers: {},
    messages: initialPrompt
      ? [{ role: 'user', content: initialPrompt }]
      : [],
  };
}

export function answerDiagnosticQuestion(state, answer) {
  const question = diagnosticQuestions[state.currentIndex];
  if (!question) return state;
  return {
    ...state,
    answers: {
      ...state.answers,
      [question.id]: answer,
    },
    messages: [
      ...state.messages,
      { role: 'user', content: answer },
    ],
    currentIndex: state.currentIndex + 1,
    started: true,
  };
}

export function buildConsultantAcknowledgement(questionId, answer, answers) {
  const text = String(answer || '').trim();
  const messages = {
    industry: `明白，你是做${text}的。我会按这个行业的获客逻辑来判断，不会只套普通海报模板。`,
    city: `${text}的本地客群很关键，我会把同城到店转化放进策略里。`,
    goal: `目标是${text}，那重点要从“好看”转到“让顾客愿意预约/到店”。`,
    product: `主推${text}是对的，后面我会帮你把卖点收窄，避免宣传太散。`,
    price: `价格是${text}。我会判断这个价格对新客来说是高门槛还是引流价，并给出建议。`,
    targetCustomer: `目标客户是${text}，后面的文案语气、视觉风格和卖点都会围绕这类人来写。`,
    style: `好的，整体走${text}风格。信息已经够了，我接下来会生成一份完整的店铺营销诊断报告。`,
  };
  return messages[questionId] || `收到：${text}`;
}

export function getCurrentQuestion(state) {
  return diagnosticQuestions[state.currentIndex] || null;
}

export function isDiagnosticComplete(state) {
  return state.currentIndex >= diagnosticQuestions.length;
}

export function buildPromptFromDiagnosis(answers) {
  return [
    `行业：${answers.industry}`,
    `城市：${answers.city}`,
    `目的：${answers.goal}`,
    `主推产品：${answers.product}`,
    `活动价格：${answers.price}`,
    `目标客户：${answers.targetCustomer}`,
    `希望风格：${answers.style}`,
  ].join('\n');
}
