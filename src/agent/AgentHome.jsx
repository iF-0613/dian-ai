import { ArrowRight, BadgeCheck, Bot, RotateCcw, Send } from 'lucide-react';
import { useState } from 'react';
import BrandLogo from '../components/BrandLogo.jsx';
import { Badge, Button, Card, Input } from '../design/System.jsx';
import {
  answerDiagnosticQuestion,
  buildPromptFromDiagnosis,
  buildConsultantAcknowledgement,
  createDiagnosticState,
  diagnosticQuestions,
  getCurrentQuestion,
  isDiagnosticComplete,
} from '../planner/ConversationManager.js';

const outputs = ['AI分析', '宣传海报', '宣传网页', '朋友圈', '小红书', '视频脚本'];

export default function AgentHome({ prompt, onPromptChange, onSubmit }) {
  const [diagnosis, setDiagnosis] = useState(() => createDiagnosticState(prompt));
  const [answer, setAnswer] = useState('');
  const currentQuestion = getCurrentQuestion(diagnosis);
  const complete = isDiagnosticComplete(diagnosis);

  const startDiagnosis = () => {
    setDiagnosis({
      ...createDiagnosticState(prompt),
      started: true,
      messages: prompt ? [{ role: 'user', content: prompt }] : [],
    });
  };

  const submitAnswer = () => {
    const value = answer.trim();
    if (!value || !currentQuestion) return;
    const next = answerDiagnosticQuestion(diagnosis, value);
    const currentId = currentQuestion.id;
    next.messages = [
      ...next.messages,
      {
        role: 'assistant',
        content: buildConsultantAcknowledgement(currentId, value, next.answers),
      },
    ];
    setDiagnosis(next);
    setAnswer('');
    onPromptChange(buildPromptFromDiagnosis(next.answers));
  };

  const reset = () => {
    setDiagnosis(createDiagnosticState(''));
    setAnswer('');
    onPromptChange('');
  };

  const generate = () => {
    onSubmit(diagnosis.answers);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-7 sm:px-6 lg:px-8">
      <section className="w-full max-w-5xl animate-page-in">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <BrandLogo />
          </div>
          <h1 className="mt-8 text-[clamp(2.4rem,6vw,4.8rem)] font-bold leading-[1.05] text-stone-950">
            AI 先诊断，再策划。
          </h1>
          <p className="mt-4 text-base font-medium leading-8 text-stone-600 sm:text-lg">
            像营销顾问一样，先问清楚门店情况，再一次生成完整营销素材。
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {outputs.map((item) => (
              <Badge key={item} tone="brand">
                <BadgeCheck size={14} />
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <Card className="mx-auto mt-8 max-w-4xl overflow-hidden shadow-card-hover">
          <div className="border-b border-stone-100 bg-white px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-stone-950">AI 营销诊断</h2>
                <p className="mt-1 text-sm text-stone-500">
                  我会像真人顾问一样，一轮一轮问清楚，再给你完整诊断和素材。
                </p>
              </div>
              <Button variant="ghost" onClick={reset} className="shrink-0">
                <RotateCcw size={16} />
                重来
              </Button>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
            <div className="min-h-[460px] bg-stone-50 p-5">
              <div className="space-y-4">
                {!diagnosis.started ? (
                  <AssistantMessage>
                    先不用填表。我们像真实咨询一样聊几句，我会判断你的客户、卖点、价格和打法。
                  </AssistantMessage>
                ) : null}

                {diagnosis.messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${
                      message.role === 'user'
                        ? 'rounded-br-md bg-emerald-700 text-white'
                        : 'rounded-bl-md bg-white text-stone-700 ring-1 ring-stone-200'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}

                {diagnosis.started && currentQuestion ? (
                  <AssistantMessage>{currentQuestion.question}</AssistantMessage>
                ) : null}

                {complete ? (
                  <AssistantMessage>
                    信息已收集完整。现在可以统一生成 AI 分析、海报、网页、朋友圈、小红书和视频脚本。
                  </AssistantMessage>
                ) : null}
              </div>
            </div>

            <aside className="border-t border-stone-100 bg-white p-5 lg:border-l lg:border-t-0">
              <div className="text-sm font-semibold text-emerald-700">
                {complete ? '诊断完成' : '顾问正在了解你的门店'}
              </div>
              <div className="mt-3 rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-600">
                {complete ? (
                  '信息已经足够，我会开始分析市场、客户、痛点和营销打法。'
                ) : (
                  <>
                    <div>当前正在聊：{currentQuestion?.label || '诊断完成'}</div>
                    <div className="mt-2 text-stone-500">已了解 {Object.keys(diagnosis.answers).length} 项关键信息。</div>
                  </>
                )}
              </div>

              {!diagnosis.started ? (
                <Button variant="primary" onClick={startDiagnosis} className="mt-5 w-full">
                  开始策划
                  <ArrowRight size={18} />
                </Button>
              ) : !complete ? (
                <div className="mt-5 space-y-3">
                  <Input
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') submitAnswer();
                    }}
                    placeholder="输入你的回答"
                  />
                  <Button variant="primary" onClick={submitAnswer} className="w-full">
                    发送回答
                    <Send size={17} />
                  </Button>
                </div>
              ) : (
                <Button variant="primary" onClick={generate} className="mt-5 w-full">
                  生成完整营销方案
                  <ArrowRight size={18} />
                </Button>
              )}
            </aside>
          </div>
        </Card>
      </section>
    </main>
  );
}

function AssistantMessage({ children }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[82%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm leading-7 text-stone-700 shadow-sm ring-1 ring-stone-200">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <Bot size={14} />
          店宣 AI
        </div>
        {children}
      </div>
    </div>
  );
}
