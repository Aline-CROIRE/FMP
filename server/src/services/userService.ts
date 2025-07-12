// src/services/userService.ts
import { getRepository } from 'typeorm';
import { User, UserRole } from '../entity/User';
import bcrypt from 'bcryptjs';

// We'll generate a simple random password for now.
// In a real app, you might use a more robust generator library.
const generateTemporaryPassword = () => {
    return Math.random().toString(36).slice(-8);
};

export const createNewUser = async (name: string, email: string, role: UserRole) => {
    const userRepository = getRepository(User);

    // 1. Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
        // Throw an error that our route can catch
        throw new Error('User with this email already exists.');
    }

    // 2. Generate a temporary password
    const tempPassword = generateTemporaryPassword();
    console.log(`Generated temporary password for ${email}: ${tempPassword}`); // For debugging

    // 3. Hash the temporary password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    // 4. Create and save the new user
    const newUser = userRepository.create({
        name,
        email,
        role,
        passwordHash,
        // isEmailVerified will be false by default
    });

    await userRepository.save(newUser);

    // We will add email sending logic here later

    // Return the created user (without the password hash)
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};