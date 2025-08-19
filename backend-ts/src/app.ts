import express from "express";
import gameRoutes from "./routes/game.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use("/games", gameRoutes);

app.use(errorHandler);

export default app;