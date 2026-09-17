import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
        size={19}
        strokeWidth={1.7}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search handmade crafts..."
        className="w-full rounded-2xl border border-border bg-white py-3.5 pl-11 pr-11 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-all focus:border-amber focus:ring-2 focus:ring-amber/10"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft hover:text-amber transition-colors"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}
