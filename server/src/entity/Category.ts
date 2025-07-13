// src/entity/Category.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Budget } from "./Budget";
import { Item } from "./Item";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    // --- Relationships ---
    @ManyToOne(() => Budget, budget => budget.categories)
    budget!: Budget;

    @OneToMany(() => Item, item => item.category, { cascade: true, eager: true })
    items!: Item[];
}