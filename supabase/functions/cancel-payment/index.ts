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

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response("Unauthorized", { status: 401, headers });
    }

    const { purchaseId } = await req.json();

    if (!purchaseId) {
      return new Response("Missing purchaseId", { status: 400, headers });
    }

    // Update purchase status to 'failed' or 'cancelled'
    const { error } = await supabase
      .from("purchases")
      .update({ payment_status: "cancelled" })
      .eq("id", purchaseId)
      .eq("user_id", user.id); // Security check: ensure it's their own purchase

    if (error) {
      console.error("Cancel order error:", error);
      return new Response("Database error", { status: 500, headers });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(err.message || "Server error", { status: 500, headers });
  }
});
