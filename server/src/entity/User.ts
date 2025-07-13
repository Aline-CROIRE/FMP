// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// We define an "enum" for the user roles to prevent typos
export enum UserRole {
    ADMIN = "admin",
    PROGRAM_MANAGER = "program_manager",
    FINANCE_MANAGER = "finance_manager"
}

@Entity("users") // Explicitly name the table "users"
export class User {
    @PrimaryGeneratedColumn("uuid") // A unique ID like "a1b2c3d4-..."
    id!: string;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "varchar" })
    passwordHash!: string; // We will never store plain text passwords

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.FINANCE_MANAGER
    })
    role!: UserRole;

    @Column({ default: false })
    isEmailVerified!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

     @Column({ type: "varchar", nullable: true, select: false }) // select: false prevents it from being returned by default
    passwordResetToken?: string;

    @Column({ type: "timestamp", nullable: true })
    passwordResetExpires?: Date;
}