import { Router } from "express";
import {
  criarTransacao,
  listarGastosGanhosFixos,
  listarSubCategoriasPorId,
  listarTransacoes,
  removerTransacao,
  resumoMensal,
} from "../controllers/transacoesController";
import { loginUser } from "../controllers/authController";

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/transacoes", asyncHandler(criarTransacao));
router.get("/transacoes", asyncHandler(listarTransacoes));
router.delete("/transacoes/:id", asyncHandler(removerTransacao));
router.get("/resumo-mensal", asyncHandler(resumoMensal));
router.get(
  "/subcategorias/:categoria_id",
  asyncHandler(listarSubCategoriasPorId)
);
router.get("/transacoes/fixos", asyncHandler(listarGastosGanhosFixos));
router.post("/login", asyncHandler(loginUser));

export default router;
