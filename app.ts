import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user";
import errorRoute from "./routes/error";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(cookieParser());

app.use("/api/user", userRoutes);

app.use(errorRoute.notFoundError);

app.use(errorRoute.errorRoute);

export default app;
