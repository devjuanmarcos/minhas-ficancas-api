import { Request, Response, NextFunction } from "express";
import { supabase } from "../services/suprabaseClient";
import { User as SupabaseUser } from "@supabase/supabase-js";

export const verificarToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    // Anexando o usuário com o tipo correto à requisição
    req.user = data.user as SupabaseUser;

    next();
  } catch (err) {
    return res.status(500).json({ error: "Erro ao verificar o token" });
  }
};
