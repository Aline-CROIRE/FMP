// src/index.ts
import express from 'express';
import authRouter from './routes/auth';
import usersRouter from './routes/users'; // Import the new users router

const main = async () => {
    // ... (database connection code)

    const app = express();
    app.use(express.json());

    // --- API Routes ---
    app.use('/api/auth', authRouter); // For login, password reset, etc.
    app.use('/api/users', usersRouter);  // For creating/managing users

    // ... (listen code)
};

main();