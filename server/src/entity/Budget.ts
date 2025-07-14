// src/entity/Budget.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Category } from "./Category";

export enum BudgetStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  APPROVED = "approved",
  REJECTED = "rejected",
  CHANGES_REQUESTED = "changes_requested", 
}

@Entity("budgets")
export class Budget {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "varchar", nullable: true })
  program!: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0.0 })
  totalAmount!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0.0 })
  amountUsed!: number;

  @Column({
    type: "enum",
    enum: BudgetStatus,
    default: BudgetStatus.DRAFT,
  })
  status!: BudgetStatus;

  @Column({ type: "text", nullable: true })
  statusComment!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


  @ManyToOne(() => User, (user) => user.budgets, { nullable: true })
  @JoinColumn({ name: "userId" })
  createdBy?: User;

  @Column({ type: "uuid", nullable: true })
  userId?: string;


  @OneToMany(() => Category, (category) => category.budget, {
    cascade: true,
    eager: true,
  })
  categories!: Category[];
}
