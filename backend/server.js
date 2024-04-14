import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import jwt from "jsonwebtoken";

// routes
import userRoutes from "./routes/userRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";

// models
import User from "./models/UserModel.js";

// configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["https://weathernaut.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Healthy" });
});

// middleware to verify if the user if authenticated
app.use("/", async (req, res, next) => {
  if (
    !(
      (req.originalUrl === "/user/register" && req.method === "POST") ||
      (req.originalUrl === "/user/login" && req.method === "POST")
    )
  ) {
    let token = req.headers.authorization;
    if (!token) {
      res.status(401).json("Unauthorized");
      return;
    }
    token = token.split(" ")[1];
    let payload = jwt.verify(token, "secret123");
    const userData = await User.findById(payload.id).select("-password");
    if (!userData) {
      res.status(401).json("Unauthorized");
      return;
    } else {
      req.user = userData;
      next();
      return;
    }
  } else {
    next();
  }
});

// setting up routes
app.use("/user", userRoutes);
app.use("/weather", weatherRoutes);

// mongoose setup
const PORT = process.env.PORT || 8080;
//connecting to mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    // starting the server
    app.listen(PORT, () => {
      console.log(`🚀Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`${error}. did not connect`);
  });
export default app;
