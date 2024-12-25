import { Router } from "express";
import {
  criarTransacao,
  listarGastosGanhosFixos,
  listarSubCategoriasPorId,
  listarTransacoes,
  removerTransacao,
  resumoMensal,
} from "../controllers/transacoesController";
import { loginUser, LoginUserWithToken } from "../controllers/authController";
import { verifyToken } from "../middlewares/verificarToken";

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/transacoes", verifyToken, asyncHandler(criarTransacao));
router.get("/transacoes", asyncHandler(listarTransacoes));
router.delete("/transacoes/:id", asyncHandler(removerTransacao));
router.get("/resumo-mensal", asyncHandler(resumoMensal));
router.get(
  "/subcategorias/:categoria_id",
  asyncHandler(listarSubCategoriasPorId)
);
router.get("/transacoes/fixos", asyncHandler(listarGastosGanhosFixos));
router.post("/login", asyncHandler(loginUser));
router.post("/login-with-id", asyncHandler(LoginUserWithToken));

export default router;
