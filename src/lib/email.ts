import { createClient, OAuthStrategy } from "@wix/sdk";
import { contacts, submittedContact } from "@wix/crm";
import { Resend } from "resend";

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

const INQUIRY_LABEL_KEY = "custom.courtyard-inquiry";

interface EnvOpts {
  clientId?: string;
  resendApiKey?: string;
  resendFrom?: string;
  resendReplyTo?: string;
}

export interface ProcessResult {
  ok: boolean;
  crm: { ok: boolean; contactId?: string; reason?: string };
  email: { ok: boolean; id?: string; reason?: string };
}

/**
 * Submit the buyer as a Wix CRM contact (so they're in the dashboard) AND
 * send a confirmation email via Resend. Both run in parallel; either failure
 * is reported per-channel but the overall response stays ok so the form UX
 * isn't blocked.
 */
export async function processInquiry(
  data: InquiryConfirmation,
  opts: EnvOpts = {},
): Promise<ProcessResult> {
  const [crm, email] = await Promise.all([
    submitToCrm(data, opts),
    sendEmail(data, opts),
  ]);
  return { ok: true, crm, email };
}

async function submitToCrm(
  data: InquiryConfirmation,
  opts: EnvOpts,
): Promise<{ ok: boolean; contactId?: string; reason?: string }> {
  const clientId = opts.clientId || process.env.WIX_CLIENT_ID;
  if (!clientId) return { ok: false, reason: "WIX_CLIENT_ID not resolved" };

  const [firstName, ...rest] = data.name.trim().split(/\s+/);
  const lastName = rest.join(" ");
  const interest = formatInterest(data.apartmentOrCourtyardOfInterest);
  const timelineLabel = data.timeline ? (TIMELINE_LABEL[data.timeline] ?? data.timeline) : "";

  try {
    const wix = createClient({
      modules: { contacts, submittedContact },
      auth: OAuthStrategy({ clientId }),
    });
    const result: any = await (wix as any).submittedContact.appendOrCreateContact({
      info: {
        name: { first: firstName, last: lastName },
        emails: { items: [{ email: data.email, primary: true, tag: "MAIN" }] },
        phones: data.phone
          ? { items: [{ phone: data.phone, primary: true, tag: "MOBILE" }] }
          : undefined,
        labelKeys: { items: [INQUIRY_LABEL_KEY] },
        extendedFields: {
          items: {
            "custom.interest": interest,
            "custom.how-you-like-to-live": data.howYouLikeToLive ?? "",
            "custom.timeline": timelineLabel,
          },
        },
      },
    });
    return { ok: true, contactId: result?.contactId };
  } catch (err: any) {
    return { ok: false, reason: err?.message ?? String(err) };
  }
}

async function sendEmail(
  data: InquiryConfirmation,
  opts: EnvOpts,
): Promise<{ ok: boolean; id?: string; reason?: string }> {
  const apiKey = opts.resendApiKey || process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY not set" };

  const from =
    opts.resendFrom ||
    process.env.RESEND_FROM ||
    "The Courtyard Collective <onboarding@resend.dev>";
  const replyTo = opts.resendReplyTo || process.env.RESEND_REPLY_TO;

  const interest = formatInterest(data.apartmentOrCourtyardOfInterest);
  const timelineLabel = data.timeline ? (TIMELINE_LABEL[data.timeline] ?? data.timeline) : undefined;

  try {
    const resend = new Resend(apiKey);
    const res: any = await resend.emails.send({
      from,
      to: data.email,
      reply_to: replyTo,
      subject: "We've got your courtyard inquiry, neighbor to neighbor.",
      html: renderHtml({
        name: data.name,
        email: data.email,
        phone: data.phone,
        interest,
        howYouLikeToLive: data.howYouLikeToLive,
        timeline: timelineLabel,
      }),
      text: renderText({
        name: data.name,
        email: data.email,
        phone: data.phone,
        interest,
        howYouLikeToLive: data.howYouLikeToLive,
        timeline: timelineLabel,
      }),
    } as any);
    return { ok: true, id: res?.data?.id };
  } catch (err: any) {
    return { ok: false, reason: err?.message ?? String(err) };
  }
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
