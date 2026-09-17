import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import AuthInput from "./AuthInput";

export default function PasswordInput({
  id,
  label,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthInput
      id={id}
      label={label}
      type={visible ? "text" : "password"}
      icon={Lock}
      rightElement={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={
            visible ? "Hide password" : "Show password"
          }
          className="text-ink-soft/60 hover:text-amber transition-colors"
        >
          {visible ? (
            <EyeOff
              className="w-4 h-4"
              strokeWidth={1.75}
            />
          ) : (
            <Eye
              className="w-4 h-4"
              strokeWidth={1.75}
            />
          )}
        </button>
      }
      {...props}
    />
  );
}
