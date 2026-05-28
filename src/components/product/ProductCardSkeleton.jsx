export default function ProductCardSkeleton() {
  return (
    <div className="h-full w-full min-w-0 rounded-lg border border-slate-200 bg-white p-2">
      <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-2 h-3.5 w-4/5 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-2/5 animate-pulse rounded bg-slate-300" />
    </div>
  );
}
