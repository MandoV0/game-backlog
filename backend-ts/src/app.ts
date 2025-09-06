import express from "express";
import gameRoutes from "./routes/game.routes";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";

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

// Routes
app.use("/api/v1/games", gameRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;