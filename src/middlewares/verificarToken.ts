import { Request, Response, NextFunction } from "express";
import { supabase } from "../services/suprabaseClient";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers["supabase.token"] as string;
    const refreshToken = req.headers["supabase.refresh_token"] as string;
    if (!accessToken || !refreshToken) {
      res.status(403).json({ error: "Tokens não fornecidos" });
      return;
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      res.status(401).json({ error: "Não autorizado" });
      return; // Finaliza o middleware
    }

    // Tudo certo, continue para a próxima função
    next();
  } catch (error) {
    console.error("Erro no middleware de verificação de token:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
