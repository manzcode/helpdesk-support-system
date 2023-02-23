import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONT_END,
  })
);

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
