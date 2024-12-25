import cors from "cors";

export const corsMiddleware = cors({
  origin: ["*"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["*"],
  preflightContinue: false, // Não continuar o processamento da pre-flight se for um sucesso
  optionsSuccessStatus: 204, // Responde com 204 em vez de 200 em pre-flight, se sucesso
  credentials: true, // Permite o envio de cookies e autenticação
  maxAge: 86400, // Tempo de cache para pre-flight requests (em segundos)
});
