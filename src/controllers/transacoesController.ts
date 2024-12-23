import { Request, Response } from "express";
import { supabase } from "../services/suprabaseClient";

export const criarTransacao = async (req: Request, res: Response) => {
  const { descricao, tipo, valor, fixo, categoria, mes_ano } = req.body;

  // Obtenha os tokens do cabeçalho da requisição
  const accessToken = req.headers["supabase.token"] as string;
  const refreshToken = req.headers["supabase.refresh_token"] as string;

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // Defina a sessão com os tokens
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessionError) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const { data, error } = await supabase.from("transacoes").insert({
    descricao,
    tipo,
    valor,
    fixo,
    categoria,
    mes_ano,
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
};

export const listarTransacoes = async (req: Request, res: Response) => {
  const { mes_ano } = req.query;

  const { data, error } = await supabase
    .from("transacoes")
    .select("*")
    .eq("mes_ano", mes_ano);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
};

export const removerTransacao = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Obtenha o access token do cabeçalho da requisição
  const accessToken = req.headers["supabase.token"] as string;
  const refreshToken = req.headers["supabase.refresh_token"] as string;

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // Defina a sessão com os tokens
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessionError) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  // Remova a transação
  const { data, error } = await supabase
    .from("transacoes")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
};

export const resumoMensal = async (req: Request, res: Response) => {
  const { mes_ano } = req.query;

  const { data, error } = await supabase
    .from("resumo_mensal")
    .select("*")
    .eq("mes_ano", mes_ano);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
};

export const listarSubCategoriasPorId = async (req: Request, res: Response) => {
  const { categoria_id } = req.params;

  if (!categoria_id) {
    return res.status(400).json({ error: "ID da categoria não fornecido" });
  }

  const { data, error } = await supabase
    .from("financas_subcategorias")
    .select("*")
    .eq("categoria_id", categoria_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
};
