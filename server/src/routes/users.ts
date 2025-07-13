// src/routes/users.ts
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { User, UserRole } from '../entity/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { protect, authorizeAdmin } from '../middleware/authMiddleware';
import { sendEmail } from '../services/mailService';

const router = Router();
const userRepository = () => getRepository(User);

// Protect all routes in this file and require Admin role
router.use(protect, authorizeAdmin);

// POST /api/users - Create a user
router.post('/', async (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email || !role || !Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: 'Please provide valid name, email, and role.' });
    }
    try {
        if (await userRepository().findOne({ where: { email } })) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }
        const tempPassword = crypto.randomBytes(4).toString('hex');
        const passwordHash = await bcrypt.hash(tempPassword, 10);
        
        const user = userRepository().create({ name, email, role, passwordHash });
        await userRepository().save(user);
        
        const message = `Welcome to the Financial Manager Platform!\n\nAn account has been created for you by an administrator.\n\nYour login details:\nEmail: ${email}\nTemporary Password: ${tempPassword}\n\nPlease log in and set a new password immediately.`;
        
        await sendEmail({
            to: user.email,
            subject: 'Welcome! Your Account has been Created',
            text: message,
        });

        const { passwordHash: _, ...userResponse } = user;
        res.status(201).json(userResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during user creation.' });
    }
});

// GET /api/users - Get all users
router.get('/', async (req, res) => {
    try {
        const users = await userRepository().find({ select: ["id", "name", "email", "role", "createdAt"] });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
    try {
        const user = await userRepository().findOne({ where: { id: req.params.id }, select: ["id", "name", "email", "role", "createdAt"] });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
    try {
        const user = await userRepository().findOne({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { name, email, role } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        const updatedUser = await userRepository().save(user);
        const { passwordHash, ...userResponse } = updatedUser;
        res.json(userResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
    try {
        const result = await userRepository().delete(req.params.id);
        if (result.affected === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;