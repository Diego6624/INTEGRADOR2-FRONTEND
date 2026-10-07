export default function TypingIndicator({ userName }) {
  if (!userName) return null;

  return (
    <div className="flex justify-start" aria-live="polite">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-sky-100">
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-200" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-200 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-200 [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  );
}
