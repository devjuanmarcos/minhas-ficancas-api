import { Request, Response } from "express";
import { supabase } from "../services/suprabaseClient";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const accessToken = data?.session?.access_token;
  const refreshToken = data?.session.refresh_token;

  if (!accessToken) {
    return res.status(400).json({ error: "Token não encontrado" });
  }

  return res.status(200).json({ access_token: accessToken, refreshToken });
};
