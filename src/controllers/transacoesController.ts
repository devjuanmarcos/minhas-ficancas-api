import { Request, Response } from "express";
import { supabase } from "../services/suprabaseClient";

export const criarTransacao = async (req: Request, res: Response) => {
  const {
    descricao,
    valor,
    fixo,
    categoria,
    data_completa,
    categoria_id,
    subcategoria_id,
  } = req.body;

  if (fixo === undefined) {
    fixo == false;
  }

  const newDate = new Date(data_completa);

  // Extraia o ano e o mês
  const mes_ano = `${newDate.getFullYear()}-${String(
    newDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const accessToken = req.headers["supabase.token"] as string;
  const refreshToken = req.headers["supabase.refresh_token"] as string;

  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessionError) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const { data, error } = await supabase.from("transacoes").insert({
    descricao,
    valor,
    fixo,
    categoria,
    mes_ano,
    data_completa,
    categoria_id,
    subcategoria_id,
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
};

export const listarTransacoes = async (req: Request, res: Response) => {
  const { mes_ano, last_three_months, categoria } = req.query;

  let filterQuery = supabase.from("transacoes").select("*");

  if (last_three_months === "true") {
    const currentDate = new Date();
    const months = [];

    for (let i = 0; i < 3; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const formattedMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      months.push(formattedMonth);
    }

    filterQuery = filterQuery.in("mes_ano", months);
  }

  if (mes_ano) {
    filterQuery = filterQuery.eq("mes_ano", mes_ano);
  }

  if (categoria) {
    filterQuery = filterQuery.eq("categoria_id", categoria);
  }

  const { data, error } = await filterQuery;

  if (error) {
    return res.status(400).json({ error: error.message });
  }

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

export const listarGastosGanhosFixos = async (req: Request, res: Response) => {
  const { sub_categoria_id, categoria_id } = req.query;

  try {
    let query = supabase.from("transacoes").select("*").eq("fixo", true);

    if (sub_categoria_id) {
      query = query.eq("subcategoria_id", sub_categoria_id);
    }

    if (categoria_id) {
      query = query.eq("categoria_id", categoria_id);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
