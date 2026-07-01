import { Send } from 'lucide-react';
import { useAutoScroll } from '../hooks/useAutoScroll.js';

export default function ChatPanel({ messages, input, onInputChange, onSend, compact = false }) {
  const messageListRef = useAutoScroll(messages.length);

  return (
    <section className={`flex flex-col bg-white/88 backdrop-blur ${compact ? 'h-full min-h-[520px]' : 'min-h-[640px] rounded-[30px] shadow-soft'}`}>
      <div className="border-b border-stone-100 px-5 py-4">
        <h2 className="text-lg font-black text-stone-950">AI 对话</h2>
        <p className="mt-1 text-sm text-stone-500">
          直接说“把价格改成59”“换成粉色”“标题再高级一点”。
        </p>
      </div>

      <div ref={messageListRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-7 ${
              message.role === 'user'
                ? 'ml-auto bg-emerald-700 text-white'
                : 'bg-[#fbf8f2] text-stone-700'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onSend();
            }}
            className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="继续告诉 AI 你的修改需求..."
          />
          <button
            type="button"
            onClick={onSend}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
