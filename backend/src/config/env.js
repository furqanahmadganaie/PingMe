import dotenv from "dotenv";

dotenv.config({ quiet: true });

const requiredVariables = ["JWT_SECRET", "CLIENT_URL"];
const missingVariables = requiredVariables.filter(
  (name) => !process.env[name]?.trim()
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVariables.join(", ")}`
  );
}

export const env = {
  clientUrl: process.env.CLIENT_URL.trim().replace(/\/$/, ""),
  jwtSecret: process.env.JWT_SECRET.trim(),
  port: Number(process.env.PORT) || 4000,
};
