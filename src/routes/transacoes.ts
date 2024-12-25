import { Router } from "express";
import {
  atualizarInvestimento,
  criarInvestimento,
  criarTransacao,
  investimentos,
  listarCategoriasInvestimento,
  listarGastosGanhosFixos,
  listarSubCategoriasPorId,
  listarTransacoes,
  removerInvestimento,
  removerTransacao,
  resumoMensal,
} from "../controllers/transacoesController";
import { loginUser, LoginUserWithToken } from "../controllers/authController";
import { verifyToken } from "../middlewares/verificarToken";

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/login", asyncHandler(loginUser));
router.post("/login-with-id", asyncHandler(LoginUserWithToken));

router.post("/transacoes", verifyToken, asyncHandler(criarTransacao));
router.get("/transacoes", asyncHandler(listarTransacoes));
router.delete("/transacoes/:id", verifyToken, asyncHandler(removerTransacao));
router.get("/transacoes/fixos", asyncHandler(listarGastosGanhosFixos));
router.get("/resumo-mensal", asyncHandler(resumoMensal));
router.get(
  "/subcategorias/:categoria_id",
  asyncHandler(listarSubCategoriasPorId)
);

router.get("/investimentos", asyncHandler(investimentos));
router.get("/investimentos/:id", asyncHandler(investimentos));
router.post("/investimentos", verifyToken, asyncHandler(criarInvestimento));
router.delete(
  "/investimentos/:id",
  verifyToken,
  asyncHandler(removerInvestimento)
);
router.put(
  "/investimentos/:id",
  verifyToken,
  asyncHandler(atualizarInvestimento)
);
router.get(
  "/investimentos-categorias",
  asyncHandler(listarCategoriasInvestimento)
);

export default router;
