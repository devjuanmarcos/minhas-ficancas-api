import cors from "cors";

export const corsMiddleware = cors({
  origin: ["https://minhas-ficancas-api.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "supabase.token", "supabase.refresh_token"],
});
