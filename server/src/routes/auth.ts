// src/routes/auth.ts
import { Router } from 'express';
import { getRepository, MoreThan } from 'typeorm';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/config';
import { sendEmail } from '../services/mailService'; // We only need the sendEmail function

const router = Router();
const userRepository = () => getRepository(User);

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }
    try {
        const user = await userRepository().findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const payload = { user: { id: user.id, name: user.name, role: user.role } };
        jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const user = await userRepository().findOne({ where: { email: req.body.email } });
        if (!user) {
            // We still send a success response to prevent email enumeration attacks
            return res.status(200).json({ success: true, message: 'If a user with that email exists, a password reset link has been sent.' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await userRepository().save(user);

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; // This link will go to our frontend app
        const message = `You requested a password reset. Please click the following link to set a new password. This link is valid for 15 minutes.\n\n${resetUrl}`;
        
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request - Financial Manager Platform',
            text: message,
        });

        res.status(200).json({ success: true, message: 'If a user with that email exists, a password reset link has been sent.' });
    } catch (err) {
        // Generic error for the client, detailed error is logged on the server by the mail service
        res.status(500).json({ message: 'Error processing request.' });
    }
});

// @route   PUT /api/auth/reset-password/:token
router.put('/reset-password/:token', async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    try {
        const user = await userRepository().findOne({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: MoreThan(new Date()),
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({ message: 'Password is required and must be at least 6 characters.' });
        }
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(req.body.password, salt);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await userRepository().save(user);
        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
