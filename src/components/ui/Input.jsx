export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block w-full">
      {label ? <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span> : null}
      <input
        className={`w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
