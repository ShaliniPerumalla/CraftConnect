function getStrength(password) {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return Math.min(score, 4);
}

const LEVELS = [
  {
    label: "Weak",
    color: "bg-rose",
  },
  {
    label: "Fair",
    color: "bg-amber-light",
  },
  {
    label: "Good",
    color: "bg-amber",
  },
  {
    label: "Strong",
    color: "bg-forest",
  },
];

export default function PasswordStrength({ password }) {
  if (!password) {
    return null;
  }

  const score = getStrength(password);

  const level = LEVELS[Math.max(score - 1, 0)];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index < score
                ? level.color
                : "bg-border"
            }`}
          />
        ))}
      </div>

      <p className="mt-1.5 text-xs text-ink-soft">
        Password strength:{" "}
        <span className="font-medium text-ink">
          {level.label}
        </span>
      </p>
    </div>
  );
}
