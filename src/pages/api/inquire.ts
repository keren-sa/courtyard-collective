import type { APIRoute } from "astro";
import { insertItem } from "../../lib/wix";
import { processInquiry } from "../../lib/email";

export const prerender = false;

interface InquiryBody {
  name?: string;
  email?: string;
  phone?: string;
  apartmentOrCourtyardOfInterest?: string;
  howYouLikeToLive?: string;
  timeline?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = readEnv(locals);

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

  const payload = {
    name: body.name!,
    email: body.email!,
    phone: body.phone ?? "",
    apartmentOrCourtyardOfInterest: body.apartmentOrCourtyardOfInterest ?? "",
    howYouLikeToLive: body.howYouLikeToLive ?? "",
    timeline: body.timeline!,
    submittedAt: new Date().toISOString(),
  };

  const [cmsResult, inquiryResult] = await Promise.all([
    insertItem("Inquiries", payload),
    processInquiry(
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        apartmentOrCourtyardOfInterest: payload.apartmentOrCourtyardOfInterest,
        howYouLikeToLive: payload.howYouLikeToLive,
        timeline: payload.timeline,
      },
      env,
    ),
  ]);

  if (!cmsResult.ok) console.warn("[inquire] CMS insert failed:", cmsResult.reason);
  if (!inquiryResult.crm.ok) console.warn("[inquire] CRM submit failed:", inquiryResult.crm.reason);
  if (!inquiryResult.email.ok) console.warn("[inquire] email send failed:", inquiryResult.email.reason);

  return json(
    {
      ok: true,
      crm: inquiryResult.crm.ok,
      emailed: inquiryResult.email.ok,
    },
    200,
  );
};

function readEnv(locals: any) {
  const runtimeEnv = (locals as any)?.runtime?.env ?? {};
  return {
    clientId:
      (locals as any)?.WIX_CLIENT_ID ||
      runtimeEnv.WIX_CLIENT_ID ||
      process.env.WIX_CLIENT_ID,
    resendApiKey:
      (locals as any)?.RESEND_API_KEY ||
      runtimeEnv.RESEND_API_KEY ||
      process.env.RESEND_API_KEY,
    resendFrom:
      (locals as any)?.RESEND_FROM ||
      runtimeEnv.RESEND_FROM ||
      process.env.RESEND_FROM,
    resendReplyTo:
      (locals as any)?.RESEND_REPLY_TO ||
      runtimeEnv.RESEND_REPLY_TO ||
      process.env.RESEND_REPLY_TO,
  };
}

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
