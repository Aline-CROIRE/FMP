// src/index.ts
import "reflect-metadata";
import express from 'express';
import { createConnection } from "typeorm";
import cors from 'cors'; // <-- 1. IMPORT CORS
import { config } from "./config/config";
import { User } from "./entity/User";
import { Budget } from "./entity/Budget";
import { Category } from "./entity/Category";
import { Item } from "./entity/Item";
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import budgetsRouter from './routes/budget';

const main = async () => {
    try {
        await createConnection({
            type: "postgres",
            host: config.dbHost,
            port: config.dbPort,
            username: config.dbUsername,
            password: config.dbPassword,
            database: "fmp_db",
            entities: [User, Budget, Category, Item],
            synchronize: true,
            logging: false,
        });
        console.log("✅ Database connected successfully!");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        return;
    }

    const app = express();

    // --- 2. CONFIGURE AND USE CORS MIDDLEWARE ---
    // This should come before your routes.
    app.use(cors({
        origin: 'http://localhost:3000', // Allow requests only from your frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Explicitly allow PATCH
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    }));
    
    // This middleware must come after CORS
    app.use(express.json());

    // --- API Routes ---
    app.use('/api/users', usersRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/budgets', budgetsRouter);

    app.listen(config.port, () => {
        console.log(`🚀 Server is listening on http://localhost:${config.port}`);
    });
};

main();