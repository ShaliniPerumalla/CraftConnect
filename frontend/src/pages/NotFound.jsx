import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center">

        <p className="font-display text-8xl text-amber">
          404
        </p>

        <h1 className="font-display text-3xl text-ink mt-4">
          Page Not Found
        </h1>

        <p className="text-ink-soft mt-3">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-ink text-cream hover:bg-amber transition-colors"
        >
          Go Home
        </Link>

      </div>
    </div>
  );
}