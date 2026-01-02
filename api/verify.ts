import { kv } from "@vercel/kv";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Missing email or code" });

    const storedCode = await kv.get(`otp:${email}`);
    if (!storedCode) return res.status(400).json({ error: "OTP expired or not found" });

    if (storedCode !== code) return res.status(400).json({ error: "Invalid code" });

    // OTP valid → delete it
    await kv.del(`otp:${email}`);

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Server error", message: err.message });
  }
}
