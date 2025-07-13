// src/app/dashboard/budgets/BudgetCard.tsx
'use client';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { User } from '@/contexts/AuthContext';
import React from 'react';

// Type Definition for a single Budget
export interface Budget {
    id: string;
    name: string;
    program: string;
    totalAmount: number;
    amountUsed: number;
    status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'changes_requested';
    createdAt: string;
    userId: string; // ID of the user who created it
    statusComment?: string;
}

// Styled Components for the Card
const Card = styled.div`
    background-color: ${theme.colors.bgSecondary};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    padding: ${theme.spacing.lg};
    transition: ${theme.transitions.main};
    display: flex;
    flex-direction: column;
    cursor: pointer;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: ${theme.shadows.main};
        border-color: ${theme.colors.borderFocus};
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${theme.spacing.md};
`;

const BudgetName = styled.h3`
    font-size: ${theme.fontSizes.lg};
    font-weight: 600;
    margin: 0;
    color: ${theme.colors.textHeading};
`;

const StatusBadge = styled.span<{ status: string }>`
    display: inline-block;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: capitalize;
    background-color: ${({ status, theme }) => {
        const statusColors = {
            approved: theme.colors.primary,
            rejected: theme.colors.redError,
            pending_approval: '#d69e2e',
            changes_requested: '#b7791f',
            draft: theme.colors.bgTertiary,
        };
        return statusColors[status as keyof typeof statusColors] || theme.colors.bgTertiary;
    }};
    color: white;
`;

const CardBody = styled.div`
    color: ${theme.colors.textMuted};
    font-size: ${theme.fontSizes.sm};
    flex-grow: 1;
    margin: ${theme.spacing.lg} 0;
`;

const Amount = styled.p`
    font-size: ${theme.fontSizes.xxl};
    font-weight: 700;
    color: ${theme.colors.textLight};
    margin: 0;
`;

const AmountLabel = styled.p`
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.textMuted};
    margin-bottom: ${theme.spacing.xs};
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    height: 8px;
    background-color: ${theme.colors.bgTertiary};
    border-radius: 999px;
    margin-top: ${theme.spacing.lg};
    overflow: hidden;
`;

const ProgressBar = styled.div<{ percentage: number }>`
    width: ${({ percentage }) => percentage}%;
    height: 100%;
    background-color: ${theme.colors.primary};
    border-radius: 999px;
    transition: width 0.5s ease-in-out;
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid ${theme.colors.border};
    padding-top: ${theme.spacing.md};
    margin-top: ${theme.spacing.md};
`;

const EditButton = styled.button`
    background: transparent;
    border: 1px solid ${theme.colors.textMuted};
    color: ${theme.colors.textMuted};
    padding: 0.3rem 0.8rem;
    font-size: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    transition: ${theme.transitions.main};
    &:hover { background: ${theme.colors.bgTertiary}; color: white; border-color: white; }
`;

// Component Props
interface BudgetCardProps {
    budget: Budget;
    onClick: () => void;
    currentUser: User | null;
    onEdit: () => void;
}

// The Component
export default function BudgetCard({ budget, onClick, currentUser, onEdit }: BudgetCardProps) {
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card's onClick from firing
        onEdit();
    };

    const canEdit = currentUser?.id === budget.userId || currentUser?.role === 'admin';
    const usedPercentage = budget.totalAmount > 0 ? (budget.amountUsed / budget.totalAmount) * 100 : 0;
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'RWF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(budget.totalAmount)).replace('RWF', 'RWF ');

    return (
        <Card onClick={onClick}>
            <div>
                <CardHeader>
                    <BudgetName>{budget.name}</BudgetName>
                    <StatusBadge status={budget.status}>
                        {budget.status.replace(/_/g, ' ')}
                    </StatusBadge>
                </CardHeader>
                <CardBody>
                    <AmountLabel>Total Budget Amount</AmountLabel>
                    <Amount>{formattedAmount}</Amount>
                    <ProgressBarContainer>
                        <ProgressBar percentage={usedPercentage} />
                    </ProgressBarContainer>
                </CardBody>
            </div>
            <CardFooter>
                <span>{budget.program || 'General Budget'}</span>
                {canEdit && <EditButton onClick={handleEditClick}>Edit</EditButton>}
            </CardFooter>
        </Card>
    );
}