export default function MessageBubble({ message, currentUserId }) {
  const isMine = message.sender_id === currentUserId;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isMine
            ? "bg-emerald-500 text-slate-950"
            : "border border-slate-700 bg-slate-900 text-slate-200"
        }`}>
        <div
          className={`mb-1 text-[10px] uppercase tracking-[0.2em] ${
            isMine ? "text-slate-900/70" : "text-slate-400"
          }`}>
          {isMine ? "You" : message.sender_name}
        </div>
        <p className='whitespace-pre-wrap break-words'>{message.content}</p>
      </div>
    </div>
  );
}
