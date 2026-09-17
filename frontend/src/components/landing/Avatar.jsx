const palette = [
  "bg-amber-light text-amber-dark",
  "bg-forest-light text-forest-dark",
  "bg-rose-light text-rose-dark",
];

function initialsFrom(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Avatar({ name, size = 40, className = "" }) {
  const initials = initialsFrom(name || "?");
  const toneIndex = (name || "").length % palette.length;

  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-display border border-border ${palette[toneIndex]} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
