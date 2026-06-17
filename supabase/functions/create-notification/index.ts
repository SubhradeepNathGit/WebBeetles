import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
};

const ALLOWED_TYPES = new Set(["success", "info", "warning", "error"]);
const ALLOWED_USER_TYPES = new Set(["student", "admin", "instructor"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
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

    const body = await req.json();
    const title = String(body.title || "").trim();
    const message = String(body.message || "").trim();
    const type = ALLOWED_TYPES.has(body.type) ? body.type : "info";
    const userType = String(body.user_type || "").trim();
    const userId = body.user_id ? String(body.user_id) : null;
    const link = body.link ? String(body.link) : null;

    if (!title || !message || !ALLOWED_USER_TYPES.has(userType)) {
      return new Response("Invalid notification data", { status: 400, headers });
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        title,
        message,
        type,
        is_read: false,
        user_type: userType,
        user_id: userId,
        link,
      })
      .select()
      .single();

    if (error) {
      console.error("Notification insert error:", error);
      return new Response("Database error", { status: 500, headers });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return new Response(errorMessage, { status: 500, headers });
  }
});
