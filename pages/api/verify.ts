import { kv } from "@vercel/kv";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return new Response(JSON.stringify({ error: "Missing email or code" }), { status: 400 });

    const storedCode = await kv.get(`otp:${email}`);
    if (!storedCode) return new Response(JSON.stringify({ error: "OTP expired or not found" }), { status: 400 });

    if (storedCode !== code) return new Response(JSON.stringify({ error: "Invalid code" }), { status: 400 });

    await kv.del(`otp:${email}`);

    return new Response(JSON.stringify({ message: "OTP verified successfully" }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error", message: err.message }), { status: 500 });
  }
}
