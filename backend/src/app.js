import express from "express";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import morgan from "morgan";
import notFound from "./middleware/notFound.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import cors from "cors";

const app = express();

app.set("etag", false);
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
