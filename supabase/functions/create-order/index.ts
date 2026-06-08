import Razorpay from "https://esm.sh/razorpay@2.9.4";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
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

    // Extract just the JWT token (strip "Bearer " prefix)
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response("Unauthorized", { status: 401, headers });
    }

    const { total, cartItems, planName, isSubscription } = await req.json();

    if (!total || (!isSubscription && (!cartItems || cartItems.length === 0))) {
      return new Response("Invalid request data", { status: 400, headers });
    }

    const razorpay = new Razorpay({
      key_id: Deno.env.get("RAZORPAY_KEY_ID"),
      key_secret: Deno.env.get("RAZORPAY_KEY_SECRET"),
    });

    const order = await razorpay.orders.create({
      amount: Math.round(total * 100), // Razorpay expects amount in paise
      currency: "INR",
    });

    // Insert into purchases table with status 'created' and optional metadata
    const { data: purchaseData, error: purchaseError } = await supabase.from("purchases").insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount: total,
      payment_status: "created",
      metadata: isSubscription ? { plan_name: planName, is_subscription: true } : null
    }).select().single();

    if (purchaseError) {
      console.error("Purchase insert error:", purchaseError);
      return new Response("Database error", { status: 500, headers });
    }

    return new Response(JSON.stringify({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      purchaseId: purchaseData.id
    }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(err.message || "Server error", { status: 500, headers });
  }
});
