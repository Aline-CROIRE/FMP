// src/entity/Item.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Category } from "./Category";

@Entity("items")
export class Item {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ type: "int", default: 1 })
    quantity!: number;

    @Column({ nullable: true })
    period?: string; // e.g., "3 months"

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
    unitPrice!: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0.00 })
    totalPrice!: number;
    
    // --- Relationships ---
    @ManyToOne(() => Category, category => category.items)
    category!: Category;
}