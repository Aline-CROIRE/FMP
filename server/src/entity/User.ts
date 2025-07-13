import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Budget } from "./Budget";

// Define user roles using enum
export enum UserRole {
  ADMIN = "admin",
  PROGRAM_MANAGER = "program_manager",
  FINANCE_MANAGER = "finance_manager",
}

@Entity("users") // Explicitly name the table "users"
export class User {
  @PrimaryGeneratedColumn("uuid") // Generates unique user IDs
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar" })
  passwordHash!: string; // Store only hashed passwords

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.FINANCE_MANAGER,
  })
  role!: UserRole;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Optional fields for password reset feature
  @Column({ type: "varchar", nullable: true, select: false })
  passwordResetToken?: string;

  @Column({ type: "timestamp", nullable: true })
  passwordResetExpires?: Date;

  // 👇 This fixes the "user.budgets" error in Budget.ts
  @OneToMany(() => Budget, (budget) => budget.createdBy)
  budgets!: Budget[];
}
