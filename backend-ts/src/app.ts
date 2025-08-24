import express from "express";
import gameRoutes from "./routes/game.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import statusRoutes from "./routes/status.routes";
import { errorHandler } from "./middlewares/error.middleware";
import cors from "cors";

const app = express();

app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use("/games", gameRoutes);

app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/statuses", statusRoutes);

app.use(errorHandler);

export default app;