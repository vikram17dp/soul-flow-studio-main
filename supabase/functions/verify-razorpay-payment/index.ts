
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-RAZORPAY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) {
      throw new Error("Razorpay secret not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    logStep("Verification request received", { orderId: razorpay_order_id, paymentId: razorpay_payment_id });

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(razorpayKeySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (expectedSignature !== razorpay_signature) {
      logStep("Signature verification failed");
      throw new Error("Invalid payment signature");
    }

    logStep("Signature verified successfully");

    // Get payment record
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payments')
      .select('*, packages(*)')
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .single();

    if (paymentError || !paymentData) {
      throw new Error("Payment record not found");
    }

    // Update payment status
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentData.id);

    if (updateError) {
      throw new Error("Failed to update payment status");
    }

    logStep("Payment status updated to completed");

    // Create user subscription
    const packageData = paymentData.packages;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + packageData.duration_months);

    const { error: subscriptionError } = await supabaseClient
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        package_id: packageData.id,
        payment_id: paymentData.id,
        status: 'active',
        starts_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        credits_remaining: packageData.class_credits
      });

    if (subscriptionError) {
      logStep("Subscription creation error", { error: subscriptionError });
      throw new Error("Failed to create subscription");
    }

    logStep("Subscription created successfully", { expiresAt: expiresAt.toISOString() });

    return new Response(JSON.stringify({
      success: true,
      subscription: {
        package_name: packageData.name,
        expires_at: expiresAt.toISOString(),
        credits_remaining: packageData.class_credits
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
