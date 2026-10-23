import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/authService";

export default function EmailVerification() {
  const { token } = useParams();

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  if (status === "verifying") {
    return <div>Verifying your email...</div>;
  }

  if (status === "success") {
    return (
      <div>
        <h1>Email verified successfully</h1>

        <Link to="/login">
          Continue to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Verification failed</h1>

      <Link to="/login">
        Back to Login
      </Link>
    </div>
  );
}