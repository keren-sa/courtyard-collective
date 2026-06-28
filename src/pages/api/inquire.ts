import type { APIRoute } from "astro";
import { insertItem } from "../../lib/wix";

export const prerender = false;

interface InquiryBody {
  name?: string;
  email?: string;
  phone?: string;
  apartmentOrCourtyardOfInterest?: string;
  howYouLikeToLive?: string;
  timeline?: string;
}

export const POST: APIRoute = async ({ request }) => {
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
    name: body.name,
    email: body.email,
    phone: body.phone ?? "",
    apartmentOrCourtyardOfInterest: body.apartmentOrCourtyardOfInterest ?? "",
    howYouLikeToLive: body.howYouLikeToLive ?? "",
    timeline: body.timeline,
    submittedAt: new Date().toISOString(),
  };

  const result = await insertItem("Inquiries", payload);
  if (!result.ok) {
    console.warn("[inquire] insert failed:", result.reason, "payload:", payload);
  }

  return json({ ok: true }, 200);
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
