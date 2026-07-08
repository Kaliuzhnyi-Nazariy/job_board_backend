import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user";
import jobRoutes from "./routes/job";
import candidateRoutes from "./routes/candidate";
import applicationRoutes from "./routes/applications";
import cvRouters from "./routes/cv";
import subscriptionsRouters from "./routes/subscriptions";
import errorRoute from "./routes/error";
import { errorHandler } from "./helper/errorHandler";

const { FRONTEND_URL } = process.env;

if (!FRONTEND_URL) throw errorHandler(500, "No frontend link");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", FRONTEND_URL],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);

app.use((req, res, next) => {
  if (req.originalUrl === "/api/subscriptions/subscribe/webhook") {
    return next();
  }
  express.json()(req, res, next);
});

app.use("/api/user", userRoutes);

app.use("/api/job", jobRoutes);

app.use("/api/candidate", candidateRoutes);

app.use("/api/application", applicationRoutes);

app.use("/api/cv", cvRouters);

app.use("/api/subscriptions", subscriptionsRouters);

app.use(errorRoute.notFoundError);

app.use(errorRoute.errorRoute);

export default app;
