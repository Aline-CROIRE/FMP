// src/routes/users.ts
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { User, UserRole } from '../entity/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { protect, authorizeAdmin } from '../middleware/authMiddleware';
import { AuthRequest } from '../middleware/authMiddleware'; // This type is needed for req.user
import { sendEmail } from '../services/mailService';
import multer from 'multer';
import { storage as cloudinaryStorage } from '../utils/cloudinary';

const upload = multer({ storage: cloudinaryStorage });
const router = Router();

// --- Profile Route for Logged-in User ---
// @route   PUT /api/users/profile
// @desc    Update user's own profile (name, email, picture)
// @access  Private
router.put('/profile', protect, upload.single('profilePicture'), async (req: AuthRequest, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        const userRepository = getRepository(User);
        const userToUpdate = await userRepository.findOne({ where: { id: req.user.id } });
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { name, email } = req.body;
        userToUpdate.name = name || userToUpdate.name;
        userToUpdate.email = email || userToUpdate.email;

        if (req.file) {
            userToUpdate.profilePictureUrl = req.file.path;
        }

        await userRepository.save(userToUpdate);

        const { passwordHash, ...updatedUser } = userToUpdate;
        res.json(updatedUser);

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error updating profile." });
    }
});

// --- Admin-Only User Management ---

// POST /api/users - Create a user
router.post('/', protect, authorizeAdmin, async (req: AuthRequest, res) => {
    const { name, email, role } = req.body;
    if (!name || !email || !role || !Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: 'Please provide valid name, email, and role.' });
    }
    try {
        const userRepository = getRepository(User);
        if (await userRepository.findOne({ where: { email } })) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }
        const tempPassword = crypto.randomBytes(4).toString('hex');
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        const user = userRepository.create({ name, email, role, passwordHash });
        await userRepository.save(user);

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
router.get('/', protect, authorizeAdmin, async (req, res) => {
    const users = await getRepository(User).find({
        select: ["id", "name", "email", "role", "createdAt", "profilePictureUrl"]
    });
    res.json(users);
});

// GET /api/users/:id - Get single user
router.get('/:id', protect, authorizeAdmin, async (req, res) => {
    const user = await getRepository(User).findOne({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { passwordHash, ...userResponse } = user;
    res.json(userResponse);
});

// PUT /api/users/:id - Update user (by Admin)
router.put('/:id', protect, authorizeAdmin, async (req, res) => {
    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, role } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await userRepository.save(user);
        const { passwordHash, ...userResponse } = updatedUser;
        res.json(userResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE /api/users/:id - Delete user (by Admin)
router.delete('/:id', protect, authorizeAdmin, async (req, res) => {
    const result = await getRepository(User).delete(req.params.id);
    if (result.affected === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
});

router.put('/profile', protect, upload.single('profilePicture'), async (req: AuthRequest, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        const userRepository = getRepository(User);
        const userToUpdate = await userRepository.findOne({ where: { id: req.user.id } });
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { name, email } = req.body;
        userToUpdate.name = name || userToUpdate.name;
        userToUpdate.email = email || userToUpdate.email;

        // If multer and Cloudinary were successful, req.file will exist
        if (req.file) {
            console.log('✅ File uploaded to Cloudinary:', req.file.path);
            userToUpdate.profilePictureUrl = req.file.path;
        }
        
        await userRepository.save(userToUpdate);
        
        const { passwordHash, ...updatedUser } = userToUpdate;
        res.json(updatedUser);

    } catch (error: any) {
        // Provide more detailed error logging on the server
        console.error("--- PROFILE UPDATE FAILED ---");
        console.error("User:", req.user.id);
        console.error("Request Body:", req.body);
        console.error("File Info:", req.file);
        console.error("Error:", error);
        console.error("--- END OF ERROR ---");
        res.status(500).json({ message: "Server error while updating profile." });
    }
});

export default router;
