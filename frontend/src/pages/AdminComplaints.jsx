import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Trash2,
  MessageSquareWarning,
  Package,
  User,
} from "lucide-react";

import { useComplaints } from "../context/ComplaintContext";


// ======================================================
// STATUS STYLES
// ======================================================

const statusStyles = {
  Pending:
    "bg-amber/10 text-amber-dark border-amber/20",

  "In Review":
    "bg-blue-50 text-blue-700 border-blue-100",

  Resolved:
    "bg-forest/10 text-forest border-forest/20",
};


// ======================================================
// PRIORITY STYLES
// ======================================================

const priorityStyles = {
  High:
    "bg-rose-50 text-rose-700 border-rose-100",

  Medium:
    "bg-amber/10 text-amber-dark border-amber/20",

  Low:
    "bg-forest/10 text-forest border-forest/20",
};


// ======================================================
// ADMIN COMPLAINTS
// ======================================================

export default function AdminComplaints() {
  const {
    complaints,
    statistics,
    updateComplaintStatus,
    deleteComplaint,
  } = useComplaints();


  // ====================================================
  // STATUS CHANGE
  // ====================================================

  function handleStatusChange(
    complaintId,
    event
  ) {
    updateComplaintStatus(
      complaintId,
      event.target.value
    );
  }


  // ====================================================
  // DELETE
  // ====================================================

  function handleDelete(complaintId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) {
      return;
    }

    deleteComplaint(complaintId);
  }


  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <section className="mb-10">

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.2em]
              font-semibold
              text-forest
            "
          >
            Admin dashboard
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-semibold
              text-ink
              sm:text-4xl
            "
          >
            Complaints
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-relaxed
              text-ink-soft
            "
          >
            Review customer complaints, monitor their
            status and manage issue resolution.
          </p>

        </section>


        {/* ==================================================
            STATISTICS
        ================================================== */}

        <section
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            mb-10
          "
        >

          {/* TOTAL */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-ink-muted">
                  Total complaints
                </p>

                <p className="mt-2 text-3xl font-semibold text-ink">
                  {statistics.total}
                </p>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-ink/5
                  text-ink
                "
              >
                <MessageSquareWarning size={20} />
              </div>

            </div>

          </div>


          {/* PENDING */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-ink-muted">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-semibold text-ink">
                  {statistics.pending}
                </p>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-amber-light/20
                  text-amber-dark
                "
              >
                <Clock3 size={20} />
              </div>

            </div>

          </div>


          {/* IN REVIEW */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-ink-muted">
                  In review
                </p>

                <p className="mt-2 text-3xl font-semibold text-ink">
                  {statistics.inReview}
                </p>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-700
                "
              >
                <AlertCircle size={20} />
              </div>

            </div>

          </div>


          {/* RESOLVED */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-ink-muted">
                  Resolved
                </p>

                <p className="mt-2 text-3xl font-semibold text-ink">
                  {statistics.resolved}
                </p>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-forest/10
                  text-forest
                "
              >
                <CheckCircle2 size={20} />
              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            COMPLAINT LIST
        ================================================== */}

        <section>

          <div className="mb-5">

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.2em]
                font-semibold
                text-forest
              "
            >
              Customer issues
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-ink">
              Complaint history
            </h2>

          </div>


          {complaints.length === 0 ? (

            /* EMPTY STATE */

            <div
              className="
                rounded-2xl
                border
                border-border
                bg-card
                px-6
                py-16
                text-center
              "
            >

              <MessageSquareWarning
                size={36}
                className="mx-auto text-ink-muted"
              />

              <h3
                className="
                  mt-4
                  text-lg
                  font-semibold
                  text-ink
                "
              >
                No complaints
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-ink-muted
                "
              >
                There are currently no customer complaints.
              </p>

            </div>

          ) : (

            /* COMPLAINT CARDS */

            <div className="space-y-5">

              {complaints.map((complaint) => (

                <article
                  key={complaint.id}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-lg
                  "
                >

                  {/* CARD HEADER */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      border-b
                      border-border
                      p-5
                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >

                    <div>

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >

                        <span
                          className={`
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            ${statusStyles[
                              complaint.status
                            ] || "bg-ink/5 text-ink"}
                          `}
                        >
                          {complaint.status}
                        </span>


                        <span
                          className={`
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            ${priorityStyles[
                              complaint.priority
                            ] || "bg-ink/5 text-ink"}
                          `}
                        >
                          {complaint.priority} priority
                        </span>

                      </div>


                      <h3
                        className="
                          mt-3
                          text-lg
                          font-semibold
                          text-ink
                        "
                      >
                        {complaint.subject}
                      </h3>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-ink-muted
                        "
                      >
                        Complaint ID: {complaint.id}
                      </p>

                    </div>


                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(complaint.id)
                      }
                      className="
                        inline-flex
                        w-fit
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-ink-muted
                        transition-colors
                        hover:bg-rose-50
                        hover:text-rose-700
                      "
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>

                  </div>


                  {/* CARD BODY */}

                  <div className="p-5">

                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-5
                        lg:grid-cols-[1fr_280px]
                      "
                    >

                      {/* LEFT */}

                      <div>

                        <p
                          className="
                            text-sm
                            leading-relaxed
                            text-ink-soft
                          "
                        >
                          {complaint.description}
                        </p>


                        {/* ORDER INFORMATION */}

                        <div
                          className="
                            mt-5
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-3
                          "
                        >

                          {/* ORDER */}

                          <div
                            className="
                              rounded-xl
                              border
                              border-border
                              bg-background
                              p-4
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                text-ink-muted
                              "
                            >
                              <Package size={15} />

                              <span
                                className="
                                  text-[10px]
                                  uppercase
                                  tracking-[0.12em]
                                "
                              >
                                Order
                              </span>
                            </div>

                            <p
                              className="
                                mt-2
                                text-sm
                                font-semibold
                                text-ink
                              "
                            >
                              {complaint.orderId ||
                                "Not provided"}
                            </p>

                          </div>


                          {/* CRAFT */}

                          <div
                            className="
                              rounded-xl
                              border
                              border-border
                              bg-background
                              p-4
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                text-ink-muted
                              "
                            >
                              <Package size={15} />

                              <span
                                className="
                                  text-[10px]
                                  uppercase
                                  tracking-[0.12em]
                                "
                              >
                                Craft
                              </span>
                            </div>

                            <p
                              className="
                                mt-2
                                text-sm
                                font-semibold
                                text-ink
                              "
                            >
                              {complaint.craftName ||
                                "Not provided"}
                            </p>

                          </div>


                          {/* CREATOR */}

                          <div
                            className="
                              rounded-xl
                              border
                              border-border
                              bg-background
                              p-4
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                text-ink-muted
                              "
                            >
                              <User size={15} />

                              <span
                                className="
                                  text-[10px]
                                  uppercase
                                  tracking-[0.12em]
                                "
                              >
                                Creator
                              </span>
                            </div>

                            <p
                              className="
                                mt-2
                                text-sm
                                font-semibold
                                text-ink
                              "
                            >
                              {complaint.creator ||
                                "Not provided"}
                            </p>

                          </div>

                        </div>

                      </div>


                      {/* RIGHT — ADMIN CONTROLS */}

                      <div
                        className="
                          rounded-xl
                          border
                          border-border
                          bg-background
                          p-4
                        "
                      >

                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.15em]
                            font-semibold
                            text-forest
                          "
                        >
                          Manage complaint
                        </p>


                        {/* CATEGORY */}

                        <div className="mt-4">

                          <p className="text-xs text-ink-muted">
                            Category
                          </p>

                          <p className="mt-1 text-sm font-medium text-ink">
                            {complaint.category}
                          </p>

                        </div>


                        {/* ORDER TOTAL */}

                        {complaint.orderTotal !== null &&
                          complaint.orderTotal !== undefined && (
                            <div className="mt-4">

                              <p className="text-xs text-ink-muted">
                                Order total
                              </p>

                              <p className="mt-1 text-sm font-medium text-ink">
                                ₹
                                {Number(
                                  complaint.orderTotal
                                ).toLocaleString("en-IN")}
                              </p>

                            </div>
                          )}


                        {/* STATUS */}

                        <div className="mt-4">

                          <label
                            htmlFor={`status-${complaint.id}`}
                            className="
                              text-xs
                              text-ink-muted
                            "
                          >
                            Update status
                          </label>

                          <select
                            id={`status-${complaint.id}`}
                            value={complaint.status}
                            onChange={(event) =>
                              handleStatusChange(
                                complaint.id,
                                event
                              )
                            }
                            className="
                              mt-2
                              w-full
                              rounded-xl
                              border
                              border-border
                              bg-card
                              px-3
                              py-2.5
                              text-sm
                              text-ink
                              outline-none
                              transition
                              focus:border-forest
                              focus:ring-2
                              focus:ring-forest/10
                            "
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="In Review">
                              In Review
                            </option>

                            <option value="Resolved">
                              Resolved
                            </option>

                          </select>

                        </div>

                      </div>

                    </div>


                    {/* FOOTER */}

                    <div
                      className="
                        mt-5
                        flex
                        flex-col
                        gap-2
                        border-t
                        border-border
                        pt-4
                        text-xs
                        text-ink-muted
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <span>
                        Created{" "}
                        {complaint.time ||
                          "Recently"}
                      </span>

                      <span>
                        Category: {complaint.category}
                      </span>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}