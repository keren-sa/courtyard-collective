/**
 * Submit the inquiry as a Wix CRM contact via @wix/crm's appendOrCreateContact.
 *
 * The actual email is sent by a Wix Automation configured in the dashboard:
 *   Wix Dashboard → Automations → New automation
 *     Trigger:  "Contact submits a form"  (or "Label added" if you want to scope it)
 *     Action:   "Send an email"  (compose template referencing {{firstName}} etc.)
 *
 * Once the automation is set up, Wix sends the email from your verified
 * sender on its own — no Resend, no API key, no separate provider.
 */
import { createClient, OAuthStrategy } from "@wix/sdk";
import { contacts, submittedContact } from "@wix/crm";

const clientId = process.env.WIX_CLIENT_ID;

let wix: ReturnType<typeof createClient> | null = null;
function client() {
  if (!clientId) return null;
  if (!wix) {
    wix = createClient({
      modules: { contacts, submittedContact },
      auth: OAuthStrategy({ clientId }),
    });
  }
  return wix;
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

const INQUIRY_LABEL_KEY = "custom.courtyard-inquiry";

export async function sendInquiryConfirmation(
  data: InquiryConfirmation,
): Promise<{ ok: true; contactId?: string } | { ok: false; reason: string }> {
  const c = client();
  if (!c) return { ok: false, reason: "WIX_CLIENT_ID not set" };

  const [firstName, ...rest] = data.name.trim().split(/\s+/);
  const lastName = rest.join(" ");
  const interest = formatInterest(data.apartmentOrCourtyardOfInterest);
  const timelineLabel = data.timeline ? (TIMELINE_LABEL[data.timeline] ?? data.timeline) : "";

  const notes = [
    interest && `Interest: ${interest}`,
    data.howYouLikeToLive && `How they like to live: ${data.howYouLikeToLive}`,
    timelineLabel && `Timeline: ${timelineLabel}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const submitter: any = (c as any).submittedContact;
    const result = await submitter.appendOrCreateContact({
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
            "contacts.displayByLastName": notes,
          },
        },
      },
    });
    return { ok: true, contactId: (result as any)?.contactId };
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
