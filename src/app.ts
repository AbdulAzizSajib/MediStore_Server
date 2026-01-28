import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";
import categoryRouter from "./modules/category/category.router";
import medicineRouter from "./modules/medicine/medicine.router";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/category", categoryRouter);
app.use("/api/medicine", medicineRouter);

export default app;
