export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-8">
      <div className="shimmer mb-3 h-9 w-56 rounded-lg bg-stone-200 dark:bg-stone-800" />
      <div className="shimmer mb-8 h-5 w-40 rounded bg-stone-200 dark:bg-stone-800" />
      <div className="mb-8 flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="shimmer h-14 w-28 shrink-0 rounded-2xl bg-stone-200 dark:bg-stone-800"
          />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mb-6">
          <div className="shimmer mb-3 h-24 rounded-3xl bg-stone-200 dark:bg-stone-800" />
          <div className="space-y-3 pl-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="shimmer h-20 rounded-2xl bg-stone-200 dark:bg-stone-800"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
