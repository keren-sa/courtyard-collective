import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  apartmentOptions: Option[];
}

type Status = "idle" | "submitting" | "success" | "error";

const timelineOptions = [
  { value: "immediate", label: "Within 3 months" },
  { value: "3-6", label: "3 – 6 months" },
  { value: "just-looking", label: "Just looking" },
];

export default function BuyerInquiryForm({ apartmentOptions }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] p-8 md:p-10">
        <div className="caps text-[color:var(--color-accent)] mb-3">Sent</div>
        <h3 className="font-display text-2xl md:text-3xl text-[color:var(--color-primary)] mb-4 leading-snug">
          Got it. We'll find the courtyard that fits how you like to live and write back within a day,
          neighbor to neighbor.
        </h3>
        <p className="text-[color:var(--color-text-muted)]">
          In the meantime, you can read the{" "}
          <a className="underline" href="/communities">
            courtyard profiles
          </a>{" "}
          or the{" "}
          <a className="underline" href="/meet-the-neighbors">
            meet-the-neighbors process
          </a>
          .
        </p>
      </div>
    );
  }

  const labelCls = "caps text-[color:var(--color-text-muted)] block mb-2";
  const inputCls =
    "w-full bg-transparent border-b border-[color:var(--color-border)] py-3 text-[color:var(--color-text)] focus:outline-none focus:border-[color:var(--color-primary)] transition-colors text-base placeholder:text-[color:var(--color-text-muted)]/60";

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <label htmlFor="name" className={labelCls}>
            Full name
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone (optional)
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls} />
        </div>
        <div>
          <label htmlFor="apartmentOrCourtyardOfInterest" className={labelCls}>
            Apartment or courtyard of interest
          </label>
          <select
            id="apartmentOrCourtyardOfInterest"
            name="apartmentOrCourtyardOfInterest"
            className={inputCls}
            defaultValue=""
          >
            <option value="">Open to any</option>
            {apartmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="howYouLikeToLive" className={labelCls}>
          How you like to live
        </label>
        <textarea
          id="howYouLikeToLive"
          name="howYouLikeToLive"
          rows={4}
          placeholder="Loud Sundays? Quiet mornings? A grapevine to sit under? Tell us."
          className={inputCls + " resize-none"}
        />
      </div>

      <fieldset>
        <legend className={labelCls}>Timeline</legend>
        <div className="flex flex-wrap gap-6">
          {timelineOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="timeline"
                value={opt.value}
                required
                className="accent-[color:var(--color-primary)] w-4 h-4"
              />
              <span className="text-[color:var(--color-text)]">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {status === "error" && (
        <div className="text-sm text-[#9b1818] bg-[#fef2f2] border border-[#fecaca] px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <button type="submit" className="btn-primary uppercase tracking-widest text-xs" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send your inquiry"}
        </button>
        <p className="text-sm text-[color:var(--color-text-muted)] italic">
          No account, no spam. Just your details so we can introduce you to the right courtyard before
          any paperwork comes up.
        </p>
      </div>
    </form>
  );
}
