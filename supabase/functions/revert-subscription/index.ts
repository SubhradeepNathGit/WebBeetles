import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Razorpay from "https://esm.sh/razorpay@2.9.4";

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
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify Admin Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...headers, "Content-Type": "application/json" } });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...headers, "Content-Type": "application/json" } });
    }

    // Verify if user is actually an admin
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .single();

    if (adminError || !adminData) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), { status: 403, headers: { ...headers, "Content-Type": "application/json" } });
    }

    const { student_id } = await req.json();

    if (!student_id) {
      return new Response(JSON.stringify({ error: "Missing required parameter: student_id" }), { status: 400, headers: { ...headers, "Content-Type": "application/json" } });
    }

    // Fetch all paid purchases for the student
    const { data: allPurchases, error: purchasesError } = await supabase
      .from("purchases")
      .select("razorpay_payment_id, amount, id, metadata")
      .eq("user_id", student_id)
      .eq("payment_status", "paid");

    if (purchasesError) {
      console.error("Failed to fetch purchases:", purchasesError);
      return new Response(JSON.stringify({ error: "Failed to fetch purchases" }), { status: 500, headers: { ...headers, "Content-Type": "application/json" } });
    }

    const subPurchases = (allPurchases || []).filter(p => p.metadata?.is_subscription === true);

    if (subPurchases.length === 0) {
      return new Response(JSON.stringify({ error: "No active subscription purchases found to refund" }), { status: 400, headers: { ...headers, "Content-Type": "application/json" } });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: Deno.env.get("RAZORPAY_KEY_ID"),
      key_secret: Deno.env.get("RAZORPAY_KEY_SECRET"),
    });

    let totalRefunded = 0;
    const refundIds = [];

    // Process all subscription purchases
    for (const purchase of subPurchases) {
      try {
        const refundResult = await razorpay.payments.refund(purchase.razorpay_payment_id, {
          amount: Math.round(purchase.amount * 100), // convert INR to paise
          notes: {
            reason: "Subscription reverted by admin",
            student_id: student_id
          }
        });
        
        refundIds.push(refundResult.id);
        totalRefunded += Number(purchase.amount);

        // Mark individual purchase as refunded
        await supabase
          .from("purchases")
          .update({ payment_status: "refunded" })
          .eq("id", purchase.id);

      } catch (refundErr) {
        console.error(`Razorpay refund failed for payment ${purchase.razorpay_payment_id}:`, refundErr);
      }
    }

    // Update Database: remove subscription from student
    const { error: studentUpdateError } = await supabase
      .from("students")
      .update({ subscription_plan: null })
      .eq("id", student_id);

    if (studentUpdateError) {
      console.error("Failed to update student plan:", studentUpdateError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Subscription successfully reverted and refunded",
      refund_ids: refundIds,
      total_refunded: totalRefunded
    }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers: { ...headers, "Content-Type": "application/json" } 
    });
  }
});
