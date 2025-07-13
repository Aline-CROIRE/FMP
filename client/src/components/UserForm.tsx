// src/components/UserForm.tsx
'use client';
import { useState, useEffect, FormEvent } from 'react';
import styled from 'styled-components';
import { Input, Button } from './Styled'; // Reusing our styled components
import { theme } from '@/styles/theme';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Select = styled.select`
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    border: 1px solid ${theme.colors.borderLight};
    background-color: #5a5a5a;
    color: ${theme.colors.textLight};
    font-size: 1rem;
`;

export interface UserFormData {
    name: string;
    email: string;
    role: 'admin' | 'program_manager' | 'finance_manager';
}

interface UserFormProps {
    onSubmit: (data: UserFormData) => void;
    initialData?: UserFormData;
    isSubmitting: boolean;
}

export default function UserForm({ onSubmit, initialData, isSubmitting }: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        role: 'finance_manager',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <Select name="role" value={formData.role} onChange={handleChange}>
                <option value="finance_manager">Finance Manager</option>
                <option value="program_manager">Program Manager</option>
                <option value="admin">Admin</option>
            </Select>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save User'}
            </Button>
        </Form>
    );
}