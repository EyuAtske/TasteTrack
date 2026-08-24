const requiredEnvVariables = [
  "JWT_SECRET",
  "MONGO_URI",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

export const env = {
  JWT_SECRET: process.env.JWT_SECRET as string,
  MONGO_URI: process.env.MONGO_URI as string,
};