import { User } from "@supabase/supabase-js"; // Importar o tipo User corretamente

declare global {
  namespace Express {
    interface Request {
      user?: User; // Adicionando a propriedade user ao Request
    }
  }
}
