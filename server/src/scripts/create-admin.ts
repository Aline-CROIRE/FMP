// scripts/create-admin.ts
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { User, UserRole } from "../entity/User";
import bcrypt from "bcryptjs";
import * as readline from 'readline';

// This creates a command-line interface to ask for input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const createAdmin = async () => {
    try {
        console.log("Connecting to database...");
        await createConnection(); // Connects using ormconfig.json
        console.log("Database connected.");

        const userRepository = getRepository(User);

        rl.question("Enter Admin Name: ", (name) => {
            rl.question("Enter Admin Email: ", (email) => {
                rl.question("Enter Admin Password: ", async (password) => {
                    if (!name || !email || !password) {
                        console.error("Name, email, and password are required.");
                        rl.close();
                        return;
                    }

                    console.log("Checking for existing admin...");
                    const existingAdmin = await userRepository.findOne({ where: { email } });
                    if (existingAdmin) {
                        console.error("An admin with this email already exists.");
                        rl.close();
                        return;
                    }

                    console.log("Hashing password...");
                    const salt = await bcrypt.genSalt(10);
                    const passwordHash = await bcrypt.hash(password, salt);

                    const admin = userRepository.create({
                        name,
                        email,
                        passwordHash,
                        role: UserRole.ADMIN, // Set the role to ADMIN
                    });

                    await userRepository.save(admin);

                    console.log("✅ Admin user created successfully!");
                    rl.close();
                    process.exit(0); // Exit the script
                });
            });
        });
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        process.exit(1);
    }
};

createAdmin();