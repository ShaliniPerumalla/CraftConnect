import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useComplaints } from "../context/ComplaintContext";

import {
  MessageSquareWarning,
  Plus,
  X,
} from "lucide-react";

import ComplaintCard from "../components/Complaints/ComplaintCard";

const issueTypes = [
  "Order issue",
  "Delivery issue",
  "Product issue",
  "Payment issue",
  "Creator issue",
  "Other",
];

export default function Complaints() {
  const {
    complaints,
    addComplaint,
  } = useComplaints();

  // Read order information from the URL.
  //
  // Example:
  // /complaints?order=CC-1001
  const [searchParams] = useSearchParams();

  const orderIdFromUrl =
    searchParams.get("order") || "";

  const [showForm, setShowForm] = useState(
    Boolean(orderIdFromUrl)
  );

  const [form, setForm] = useState({
    orderId: orderIdFromUrl,
    issueType: "",
    description: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.orderId.trim() ||
      !form.issueType ||
      !form.description.trim()
    ) {
      return;
    }

    addComplaint({
      orderId: form.orderId.trim(),
      subject: form.issueType,
      description: form.description.trim(),
      category: form.issueType,
      priority: "Medium",
    });

    setForm({
      orderId: "",
      issueType: "",
      description: "",
    });

    setShowForm(false);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* PAGE HEADER */}

        <section className="mb-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  font-semibold
                  text-forest
                "
              >
                Customer support
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
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-ink-soft
                "
              >
                Raise an issue with your order and
                keep track of its resolution.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowForm((current) => !current)
              }
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                bg-ink
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                hover:-translate-y-0.5
                hover:shadow-lg
              "
            >
              {showForm ? (
                <X size={17} />
              ) : (
                <Plus size={17} />
              )}

              {showForm
                ? "Cancel"
                : "Raise a complaint"}
            </button>

          </div>

        </section>

        {/* COMPLAINT FORM */}

        {showForm && (
          <section
            className="
              mb-8
              rounded-2xl
              border
              border-border
              bg-card
              p-5
              sm:p-7
            "
          >

            <div className="mb-6">

              <div className="flex items-center gap-3">

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
                  <MessageSquareWarning
                    size={20}
                  />
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-ink">
                    Raise a complaint
                  </h2>

                  <p className="text-xs text-ink-muted">
                    Tell us what went wrong.
                  </p>

                </div>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ORDER ID */}

              <div>

                <label
                  htmlFor="orderId"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-ink
                  "
                >
                  Order ID
                </label>

                <input
                  id="orderId"
                  name="orderId"
                  type="text"
                  value={form.orderId}
                  onChange={handleChange}
                  placeholder="Example: CC-1001"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-4
                    py-3
                    text-sm
                    text-ink
                    outline-none
                    transition
                    focus:border-forest
                    focus:ring-2
                    focus:ring-forest/10
                  "
                />

                {orderIdFromUrl && (
                  <p className="mt-2 text-xs text-forest">
                    This complaint is linked to order #{orderIdFromUrl}.
                  </p>
                )}

              </div>

              {/* ISSUE TYPE */}

              <div>

                <label
                  htmlFor="issueType"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-ink
                  "
                >
                  Issue type
                </label>

                <select
                  id="issueType"
                  name="issueType"
                  value={form.issueType}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-4
                    py-3
                    text-sm
                    text-ink
                    outline-none
                    transition
                    focus:border-forest
                    focus:ring-2
                    focus:ring-forest/10
                  "
                >

                  <option value="">
                    Select an issue
                  </option>

                  {issueTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}

                </select>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label
                  htmlFor="description"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-ink
                  "
                >
                  Describe the issue
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  maxLength={500}
                  placeholder="Tell us what happened..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-4
                    py-3
                    text-sm
                    leading-relaxed
                    text-ink
                    outline-none
                    transition
                    focus:border-forest
                    focus:ring-2
                    focus:ring-forest/10
                  "
                />

                <p className="mt-1 text-right text-xs text-ink-muted">
                  {form.description.length}/500
                </p>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-ink
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
              >
                Submit complaint
              </button>

            </form>

          </section>
        )}

        {/* COMPLAINT LIST */}

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
              Your complaints
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-ink">
              Complaint history
            </h2>

          </div>

          {complaints.length === 0 ? (

            <div
              className="
                rounded-2xl
                border
                border-border
                bg-card
                px-6
                py-14
                text-center
              "
            >

              <MessageSquareWarning
                size={32}
                className="mx-auto text-ink-muted"
              />

              <h3 className="mt-4 text-base font-semibold text-ink">
                No complaints yet
              </h3>

              <p className="mt-1 text-sm text-ink-muted">
                Everything looks good so far.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                />
              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}