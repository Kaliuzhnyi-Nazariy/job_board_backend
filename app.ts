import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user";
import jobRoutes from "./routes/job";
import candidateRoutes from "./routes/candidate";
import applicationRoutes from "./routes/application";
import cvRouters from "./routes/cv";
import errorRoute from "./routes/error";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://job-board-eight-beta.vercel.app/",
      "https://job-board-eight-beta.vercel.app",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);

// app.use(cookieParser());

app.use("/api/user", userRoutes);

app.use("/api/job", jobRoutes);

app.use("/api/candidate", candidateRoutes);

app.use("/api/application", applicationRoutes);

app.use("/api/cv", cvRouters);

app.use(errorRoute.notFoundError);

app.use(errorRoute.errorRoute);

export default app;
