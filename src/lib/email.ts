import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress =
  process.env.RESEND_FROM || "The Courtyard Collective <onboarding@resend.dev>";
const replyTo = process.env.RESEND_REPLY_TO;

let resend: Resend | null = null;
function client() {
  if (!apiKey) return null;
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

export interface InquiryConfirmation {
  name: string;
  email: string;
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

export async function sendInquiryConfirmation(
  data: InquiryConfirmation,
): Promise<{ ok: true; id?: string } | { ok: false; reason: string }> {
  const c = client();
  if (!c) return { ok: false, reason: "RESEND_API_KEY not set" };

  const interest = data.apartmentOrCourtyardOfInterest?.startsWith("apartment:")
    ? `Apartment: ${data.apartmentOrCourtyardOfInterest.slice("apartment:".length)}`
    : data.apartmentOrCourtyardOfInterest?.startsWith("courtyard:")
      ? `Courtyard: ${data.apartmentOrCourtyardOfInterest.slice("courtyard:".length)}`
      : "Open to any";

  const props = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    interest,
    howYouLikeToLive: data.howYouLikeToLive,
    timeline: data.timeline ? (TIMELINE_LABEL[data.timeline] ?? data.timeline) : undefined,
  };

  try {
    const res = await c.emails.send({
      from: fromAddress,
      to: data.email,
      reply_to: replyTo,
      subject: "We've got your courtyard inquiry, neighbor to neighbor.",
      html: renderHtml(props),
      text: renderText(props),
    } as any);
    return { ok: true, id: (res as any)?.data?.id };
  } catch (err: any) {
    return { ok: false, reason: err?.message ?? String(err) };
  }
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
  lines.push(
    "",
    "Courtyard profiles → https://www.courtyard-collective.com/communities",
    "Meet the neighbors → https://www.courtyard-collective.com/meet-the-neighbors",
    "",
    "The Courtyard Collective · Tbilisi, Georgia",
  );
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
