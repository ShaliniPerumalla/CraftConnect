import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-ink text-cream/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-[13px] text-center">
        <Sparkles size={13} className="text-amber shrink-0" />
        <span>
          New this month — request a one-of-a-kind piece through{" "}
          <span className="text-amber font-medium">Custom Orders</span>
        </span>
        <Link
          to="/requirements"
          className="hidden sm:inline-flex items-center gap-1 font-medium text-cream hover:text-amber transition-colors ml-1"
        >
          Start a request
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
