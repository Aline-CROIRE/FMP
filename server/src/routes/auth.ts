// src/routes/auth.ts
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User'; // Import our User entity
import bcrypt from 'bcryptjs';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    // We will add the logic here in the next step
});

export default router;