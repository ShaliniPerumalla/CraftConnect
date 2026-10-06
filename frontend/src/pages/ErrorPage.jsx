import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="text-center">

        <h1 className="text-4xl font-display text-ink">
          Something went wrong
        </h1>

        <p className="mt-3 text-ink-soft">
          We couldn't complete that request.
          Please try again.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-ink text-cream"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
}