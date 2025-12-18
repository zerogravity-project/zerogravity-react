import { Skeleton } from '@radix-ui/themes';

/**
 * ============================================
 * Components
 * ============================================
 */

export function HeaderSkeleton() {
  return <Skeleton height="24px" width="180px" />;
}

export function ContentSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6 p-4">
      {/* Blockquote skeleton */}
      <div className="flex flex-col gap-2 border-l-2 border-[var(--gray-6)] pl-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      {/* Key insights skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-5/6" />
      </div>

      {/* Recommendations skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-5/6" />
      </div>
    </div>
  );
}
