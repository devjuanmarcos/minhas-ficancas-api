import express from "express";
import bodyParser from "body-parser";
import router from "./routes/transacoes";
import { corsMiddleware } from "./middlewares/corsMiddleware";

const app = express();
const port = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(bodyParser.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
