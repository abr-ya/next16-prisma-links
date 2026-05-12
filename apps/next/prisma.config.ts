import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 validates config at tooling time; codegen does not connect. Allow fresh installs without `.env`:
const codegenFallbackDatabaseUrl = "postgresql://prisma-codegen:prisma-codegen@127.0.0.1:5432/__codegen_placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? codegenFallbackDatabaseUrl,
  },
});
