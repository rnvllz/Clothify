import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "DELETE, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const { userId, adminEmail, code } = await req.json();

    if (!userId || !adminEmail || !code) {
      return new Response(
        JSON.stringify({ error: "userId, adminEmail, and code are required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Skip OTP validation if using password-confirmed flow
    if (code !== 'password-confirmed') {
      // Verify OTP exists and is valid
      const { data: otpRecord, error: otpError } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("email", adminEmail.toLowerCase())
        .eq("code", code)
        .single();

      if (otpError || !otpRecord) {
        console.warn(`OTP not found for ${adminEmail}:`, otpError);
        return new Response(
          JSON.stringify({ error: "Invalid or expired verification code" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Check expiry
      if (new Date(otpRecord.expires_at) < new Date()) {
        // Delete expired OTP
        await supabase.from("otp_codes").delete().eq("id", otpRecord.id);
        return new Response(
          JSON.stringify({ error: "Verification code has expired" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Consume OTP
      const { error: deleteOtpError } = await supabase.from("otp_codes").delete().eq("id", otpRecord.id);
      if (deleteOtpError) {
        console.warn("Failed to delete OTP:", deleteOtpError);
      }
    }

    // Delete the user from auth using service role
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error("Delete user error:", deleteAuthError);
      return new Response(
        JSON.stringify({ error: deleteAuthError.message || "Failed to delete user" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Delete user_roles entry
    const { error: deleteRoleError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);
    if (deleteRoleError) {
      console.warn("Failed to delete user role:", deleteRoleError);
    }

    console.log(`Successfully deleted user ${userId}`);

    return new Response(
      JSON.stringify({ success: true, message: "Member deleted successfully" }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error in delete-member function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
