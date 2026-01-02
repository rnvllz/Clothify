import { kv } from "@vercel/kv";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const OTP_TTL_SECONDS = 300; // 5 minutes
const OTP_DEBUG = false;     // set true to log OTPs instead of sending

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email)
      return new Response(JSON.stringify({ error: "Missing email" }), { status: 400 });

    const code = crypto.randomInt(100000, 150000).toString();

    // Store OTP in KV with TTL
    await kv.set(`otp:${email}`, code, { ex: OTP_TTL_SECONDS });

    if (OTP_DEBUG) {
      console.log(`
        ==============================
        🔐 OTP DEBUG MODE
        📧 Email: ${email}
        🔢 Code: ${code}
        ==============================
      `);
    } else {
      await resend.emails.send({
        from: "no-reply@karlix.me",
        to: [email],
        subject: "Your Login Verification Code",
        html: `<p>Your verification code is <strong>${code}</strong>. It expires in 5 minutes.</p>`,
      });
    }

    return new Response(JSON.stringify({ message: "OTP sent to email" }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error", message: err.message }),
      { status: 500 }
    );
  }
}
