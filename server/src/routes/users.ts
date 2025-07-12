// src/routes/users.ts
import { Router } from 'express';
import { createNewUser } from '../services/userService';
import { UserRole } from '../entity/User';

const router = Router();

// @route   POST /api/users
// @desc    Create a new user (Admin only)
// @access  Private (will be protected later)
router.post('/', async (req, res) => {
    const { name, email, role } = req.body;

    // Basic validation
    if (!name || !email || !role) {
        return res.status(400).json({ message: 'Please provide name, email, and role.' });
    }

    // Validate the role
    if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided.' });
    }

    try {
        const newUser = await createNewUser(name, email, role);
        return res.status(201).json(newUser);
    } catch (error: any) {
        // Check for the specific error we threw in our service
        if (error.message === 'User with this email already exists.') {
            return res.status(409).json({ message: error.message });
        }
        // Generic server error for other issues
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;