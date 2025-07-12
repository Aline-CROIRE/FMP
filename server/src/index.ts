// src/index.ts
import "reflect-metadata";
import express from 'express';
import { createConnection } from "typeorm";

const main = async () => {
  const app = express();
  app.use(express.json()); // Middleware to parse JSON bodies

  // Database connection (we will configure this later)
  // await createConnection(); 

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

main().catch(err => {
  console.error(err);
});