export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon ? (
        <div className="mb-3 rounded-2xl bg-slate-100 p-4 text-slate-400">
          <Icon size={32} />
        </div>
      ) : null}
      <h3 className="text-base font-bold text-slate-700">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}
