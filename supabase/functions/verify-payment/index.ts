import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import crypto from "node:crypto";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401, headers });
    }

    const { data: { user } } = await supabase.auth.getUser(authHeader);
    if (!user) {
      return new Response("Unauthorized", { status: 401, headers });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      items 
    } = await req.json();

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", Deno.env.get("RAZORPAY_KEY_SECRET"))
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return new Response("Invalid signature", { status: 400, headers });
    }

    // Update purchase status
    await supabase
      .from("purchases")
      .update({ payment_status: "paid", razorpay_payment_id })
      .eq("razorpay_order_id", razorpay_order_id);

    // Call RPC to enroll user in all courses and insert purchase items
    const { error: rpcError } = await supabase.rpc("enroll_multiple_courses", { 
      p_user_id: user.id, 
      p_razorpay_order_id: razorpay_order_id,
      p_items: items 
    });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      return new Response("Enrollment failed", { status: 500, headers });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response("Verification failed", { status: 500, headers });
  }
});
