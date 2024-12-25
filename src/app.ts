import express from "express";
import bodyParser from "body-parser";
import router from "./routes/transacoes";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["https://minhas-ficancas-api.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "supabase.token",
      "supabase.refresh_token",
    ],
  })
);
app.use(bodyParser.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
