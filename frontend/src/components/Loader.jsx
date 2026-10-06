export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-8 h-8 border-4 border-amber/30 border-t-amber rounded-full animate-spin" />

      <p className="mt-3 text-sm text-ink-soft">
        {text}
      </p>
    </div>
  );
}