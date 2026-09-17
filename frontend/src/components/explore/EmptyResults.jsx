import { SearchX } from "lucide-react";

export default function EmptyResults({ onClear }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border bg-white px-6">

      <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center mb-5">
        <SearchX
          size={25}
          className="text-forest"
          strokeWidth={1.5}
        />
      </div>

      <h3 className="font-display text-2xl text-ink">
        Nothing found yet
      </h3>

      <p className="text-sm text-ink-soft mt-2 max-w-sm">
        Try another search or remove some filters.
        There are plenty more handmade pieces waiting to
        be discovered.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber transition-colors"
      >
        Clear filters
      </button>

    </div>
  );
}

