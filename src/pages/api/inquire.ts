import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

interface InquiryBody {
  name?: string;
  email?: string;
  phone?: string;
  apartmentOrCourtyardOfInterest?: string;
  howYouLikeToLive?: string;
  timeline?: string;
}

const TIMELINE_LABEL: Record<string, string> = {
  immediate: "Within 3 months",
  "3-6": "3 – 6 months",
  "just-looking": "Just looking",
};

export const POST: APIRoute = async ({ request, locals }) => {
  let body: InquiryBody;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
  }

  const errors = validate(body);
  if (errors.length) {
    return json({ ok: false, message: errors.join(" ") }, 400);
  }

  const apiKey =
    (locals as any)?.runtime?.env?.RESEND_API_KEY ||
    (locals as any)?.RESEND_API_KEY ||
    process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[inquire] RESEND_API_KEY missing — email cannot be sent.");
    return json({ ok: false, message: "Email service is not configured." }, 503);
  }

  const from =
    (locals as any)?.runtime?.env?.RESEND_FROM ||
    process.env.RESEND_FROM ||
    "The Courtyard Collective <onboarding@resend.dev>";
  const replyTo =
    (locals as any)?.runtime?.env?.RESEND_REPLY_TO || process.env.RESEND_REPLY_TO;

  const interest = formatInterest(body.apartmentOrCourtyardOfInterest);
  const timelineLabel = body.timeline ? (TIMELINE_LABEL[body.timeline] ?? body.timeline) : undefined;

  try {
    const resend = new Resend(apiKey);
    const res: any = await resend.emails.send({
      from,
      to: body.email!,
      reply_to: replyTo,
      subject: "We've got your courtyard inquiry, neighbor to neighbor.",
      html: renderHtml({
        name: body.name!,
        email: body.email!,
        phone: body.phone,
        interest,
        howYouLikeToLive: body.howYouLikeToLive,
        timeline: timelineLabel,
      }),
      text: renderText({
        name: body.name!,
        email: body.email!,
        phone: body.phone,
        interest,
        howYouLikeToLive: body.howYouLikeToLive,
        timeline: timelineLabel,
      }),
    } as any);

    const id = res?.data?.id;
    return json({ ok: true, emailId: id }, 200);
  } catch (err: any) {
    const reason = err?.message ?? String(err);
    console.error("[inquire] resend failed:", reason);
    return json({ ok: false, message: reason }, 502);
  }
};

function validate(b: InquiryBody): string[] {
  const errs: string[] = [];
  if (!b.name || b.name.trim().length < 2) errs.push("Please share your name.");
  if (!b.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errs.push("That email looks off.");
  if (!b.timeline) errs.push("Please pick a timeline.");
  return errs;
}

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function formatInterest(raw?: string): string {
  if (!raw) return "Open to any";
  if (raw.startsWith("apartment:")) return `Apartment: ${raw.slice("apartment:".length)}`;
  if (raw.startsWith("courtyard:")) return `Courtyard: ${raw.slice("courtyard:".length)}`;
  return raw;
}

interface TemplateProps {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  howYouLikeToLive?: string;
  timeline?: string;
}

function renderHtml(p: TemplateProps): string {
  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:10px 0;border-bottom:1px solid #d9c9ae;color:#6b5a45;font:600 11px/1 Georgia,serif;letter-spacing:0.16em;text-transform:uppercase;vertical-align:top;width:160px;">${label}</td><td style="padding:10px 0;border-bottom:1px solid #d9c9ae;color:#3a2410;font:400 16px/1.5 Georgia,serif;">${escape(value)}</td></tr>`
      : "";

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f5efe3;font-family:Georgia,serif;color:#3a2410;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe3;padding:40px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fbf7ee;border:1px solid #d9c9ae;">
          <tr><td style="padding:32px 36px 24px 36px;border-bottom:1px solid #d9c9ae;">
            <div style="font:700 11px/1 Georgia,serif;letter-spacing:0.18em;text-transform:uppercase;color:#6b5a45;margin-bottom:14px;">The Courtyard Collective</div>
            <h1 style="margin:0;font:400 30px/1.2 Georgia,serif;color:#582f0e;">Got it, ${escape(firstName(p.name))}.</h1>
            <p style="margin:14px 0 0 0;font:italic 400 18px/1.5 Georgia,serif;color:#3a2410;">
              We'll find the courtyard that fits how you like to live and write back within a day, neighbor to neighbor.
            </p>
          </td></tr>
          <tr><td style="padding:24px 36px 8px 36px;">
            <div style="font:700 11px/1 Georgia,serif;letter-spacing:0.18em;text-transform:uppercase;color:#6b5a45;margin-bottom:14px;">What you sent us</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row("Name", p.name)}
              ${row("Email", p.email)}
              ${row("Phone", p.phone)}
              ${row("Interest", p.interest)}
              ${row("How you like to live", p.howYouLikeToLive)}
              ${row("Timeline", p.timeline)}
            </table>
          </td></tr>
          <tr><td style="padding:24px 36px 32px 36px;border-top:1px solid #d9c9ae;">
            <p style="margin:0;color:#3a2410;font:400 15px/1.6 Georgia,serif;">
              In the meantime, the <a href="https://www.courtyard-collective.com/communities" style="color:#582f0e;text-decoration:underline;">courtyard profiles</a> and the <a href="https://www.courtyard-collective.com/meet-the-neighbors" style="color:#582f0e;text-decoration:underline;">meet-the-neighbors process</a> will tell you most of what to expect before we sit down.
            </p>
          </td></tr>
          <tr><td style="padding:20px 36px;background:#26190e;color:#f2e9d8;text-align:center;font:400 13px/1.5 Georgia,serif;">
            The Courtyard Collective · Tbilisi, Georgia<br>
            <span style="opacity:0.65;">Mon–Sat 10am–7pm · courtyard visits by appointment</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function renderText(p: TemplateProps): string {
  const lines = [
    `Got it, ${firstName(p.name)}.`,
    "",
    "We'll find the courtyard that fits how you like to live and write back",
    "within a day, neighbor to neighbor.",
    "",
    "— What you sent us —",
    `Name:     ${p.name}`,
    `Email:    ${p.email}`,
  ];
  if (p.phone) lines.push(`Phone:    ${p.phone}`);
  lines.push(`Interest: ${p.interest}`);
  if (p.howYouLikeToLive) lines.push(`How you like to live: ${p.howYouLikeToLive}`);
  if (p.timeline) lines.push(`Timeline: ${p.timeline}`);
  lines.push("", "The Courtyard Collective · Tbilisi, Georgia");
  return lines.join("\n");
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || "neighbor";
}
