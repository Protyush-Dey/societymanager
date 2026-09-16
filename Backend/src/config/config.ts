import dotenv from "dotenv";

dotenv.config();

interface Config {
  mongoUrl: string;
}

export const config: Config = {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017",
};

console.log(
  "==> MONGO_URL:",
  config.mongoUrl ? "Found" : "Missing"
);