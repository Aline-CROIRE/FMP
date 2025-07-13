

// src/index.ts
import "reflect-metadata";
import express from 'express';
import { createConnection } from "typeorm";
import { config } from "./config/config";
import { User } from "./entity/User";
import usersRouter from './routes/users';
import authRouter from './routes/auth';

const main = async () => {
    try {
        await createConnection({
            type: "postgres",
            host: config.dbHost,
            port: config.dbPort,
            username: config.dbUsername,
            password: config.dbPassword,
            database: "fmp_db",
            entities: [User],
            synchronize: true,
            logging: false, // Set to true to see SQL queries in the console
        });
        console.log("✅ Database connected successfully!");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        return;
    }

    const app = express();
    app.use(express.json());

    // --- API Routes ---
    app.use('/api/users', usersRouter);
    app.use('/api/auth', authRouter);

    app.listen(config.port, () => {
        console.log(`🚀 Server is listening on http://localhost:${config.port}`);
    });
};

main();