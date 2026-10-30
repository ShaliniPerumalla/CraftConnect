export default function Toast({
  message,
  type = "success",
  onClose,
}) {
  if (!message) return null;

  const styles = {
    success: "bg-forest text-white",
    error: "bg-red-600 text-white",
    warning: "bg-amber text-ink",
    info: "bg-blue-600 text-white",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 shadow-lg ${styles[type]}`}
    >
      <div className="flex items-center gap-4">
        <span>{message}</span>

        <button onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}