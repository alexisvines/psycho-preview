export function Skeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:1000px_100%] animate-shimmer rounded-lg ${className}`}
        />
      ))}
    </>
  );
}

export function SkeletonText() {
  return <Skeleton className="h-4 w-3/4" />;
}

export function SkeletonTitle() {
  return <Skeleton className="h-6 w-1/2" />;
}

export function SkeletonAvatar() {
  return <Skeleton className="h-10 w-10 rounded-full" />;
}

export function SkeletonCard() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
