export default function Loading() {
  return (
    <div className="mx-auto w-[min(1180px,94%)] py-12">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-line/60" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card-surface overflow-hidden rounded-3xl">
            <div className="h-36 animate-pulse bg-line/60" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-line/60" />
              <div className="h-3 w-full animate-pulse rounded bg-line/50" />
              <div className="h-10 w-full animate-pulse rounded bg-line/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
