import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  XCircle,
  CalendarDays,
} from "lucide-react";

const statusConfig = {
  Open: {
    icon: AlertCircle,
    className: "bg-amber-light/20 text-amber-dark",
  },
  "Under Review": {
    icon: Clock3,
    className: "bg-blue-50 text-blue-700",
  },
  Resolved: {
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700",
  },
  Rejected: {
    icon: XCircle,
    className: "bg-red-50 text-red-700",
  },
};

export default function ComplaintCard({ complaint }) {
  const config =
    statusConfig[complaint.status] ||
    statusConfig.Open;

  const StatusIcon = config.icon;

  return (
    <article
      className="
        rounded-2xl
        border border-border
        bg-card
        p-5 sm:p-6
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_18px_45px_rgba(33,30,27,0.07)]
      "
    >
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.18em]
              font-semibold
              text-forest
            "
          >
            Complaint
          </p>

          <h3 className="mt-1 text-lg font-semibold text-ink">
            {complaint.id}
          </h3>
        </div>

        {/* STATUS */}

        <div
          className={`
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            px-3
            py-1.5
            text-xs
            font-medium
            ${config.className}
          `}
        >
          <StatusIcon size={14} />

          {complaint.status}
        </div>
      </div>

      {/* DETAILS */}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">

        <div>
          <p className="text-xs text-ink-muted">
            Order ID
          </p>

          <p className="mt-1 text-sm font-medium text-ink">
            {complaint.orderId}
          </p>
        </div>

        <div>
          <p className="text-xs text-ink-muted">
            Issue
          </p>

          <p className="mt-1 text-sm font-medium text-ink">
           {complaint.category}
          </p>
        </div>

      </div>

      {/* DESCRIPTION */}

      <div className="mt-5">

        <p className="text-xs text-ink-muted">
          Description
        </p>

        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {complaint.description}
        </p>

      </div>

      {/* DATE */}

      <div
        className="
          mt-5
          flex
          items-center
          gap-2
          border-t
          border-border
          pt-4
          text-xs
          text-ink-muted
        "
      >
        <CalendarDays size={14} />

        Submitted{" "}
        {complaint.time || "Recently"}
      </div>
    </article>
  );
}