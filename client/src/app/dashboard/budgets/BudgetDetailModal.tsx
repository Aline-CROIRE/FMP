// src/app/dashboard/budgets/BudgetDetailModal.tsx
'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '@/components/Modal';
import { theme } from '@/styles/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Budget } from './BudgetCard';
import { Input, Label } from '@/components/Styled';

// Type definition for a budget with full details
interface DetailedBudget extends Budget {
    categories: Array<{ 
        id: string; 
        name: string; 
        items: Array<{ 
            name: string; 
            quantity: number; 
            unitPrice: number; 
            totalPrice: number; 
        }> 
    }>;
}

// Styled Components
const DetailsWrapper = styled.div`
    max-height: 80vh;
    overflow-y: auto;
    padding-right: ${theme.spacing.md};
`;
const Section = styled.div`
    margin-bottom: ${theme.spacing.xl};
`;
const SectionTitle = styled.h3`
    font-size: ${theme.fontSizes.lg};
    font-weight: 600;
    color: ${theme.colors.textMuted};
    border-bottom: 1px solid ${theme.colors.border};
    padding-bottom: ${theme.spacing.sm};
    margin-top: 0;
    margin-bottom: ${theme.spacing.md};
`;
const CategoryTitle = styled.h4`
    font-size: ${theme.fontSizes.md};
    font-weight: 600;
    color: ${theme.colors.textLight};
    margin-bottom: ${theme.spacing.md};
`;
const ItemTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    th, td { text-align: left; padding: ${theme.spacing.md}; }
    thead { border-bottom: 1px solid ${theme.colors.border}; }
    th { font-size: ${theme.fontSizes.xs}; color: ${theme.colors.textMuted}; text-transform: uppercase; }
    tbody tr { border-bottom: 1px solid ${theme.colors.border}; }
    tbody tr:last-child { border-bottom: none; }
`;
const ActionFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.xl};
    padding-top: ${theme.spacing.lg};
    border-top: 1px solid ${theme.colors.border};
`;
const ActionButton = styled.button`
    font-weight: 600;
    border: none;
    padding: 0.7rem 1.4rem;
    border-radius: ${theme.borderRadius};
    cursor: pointer;
    transition: ${theme.transitions.main};
    &:hover { transform: translateY(-2px); }
    &:disabled { background: ${theme.colors.disabled}; cursor: not-allowed; transform: none; }
`;
const ApproveButton = styled(ActionButton)`
    background-color: ${theme.colors.primary};
    color: white;
    &:hover:not(:disabled) { background-color: ${theme.colors.primaryHover}; }
`;
const RejectButton = styled(ActionButton)`
    background-color: ${theme.colors.redError};
    color: white;
    &:hover:not(:disabled) { background-color: #c53030; }
`;
const ChangesButton = styled(ActionButton)`
    background-color: #d69e2e;
    color: white;
    &:hover:not(:disabled) { background-color: #b7791f; }
`;
const CommentBox = styled.div`
    background-color: ${theme.colors.bgPrimary};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    padding: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.xl};
    p { margin: 0; font-style: italic; }
    strong { color: ${theme.colors.textMuted}; font-style: normal; }
`;

// Component Props
interface BudgetDetailModalProps {
    budget: DetailedBudget | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (status: 'approved' | 'rejected' | 'changes_requested', comment: string) => void;
    isSubmitting: boolean;
}

// The Component
export default function BudgetDetailModal({ budget, isOpen, onClose, onStatusChange, isSubmitting }: BudgetDetailModalProps) {
    const { user } = useAuth();
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (budget) { setComment(''); }
    }, [budget]);

    if (!budget) return null;

    const canApprove = user?.role === 'program_manager' || user?.role === 'admin';
    const showApprovalActions = canApprove && (budget.status === 'pending_approval' || budget.status === 'draft' || budget.status === 'changes_requested');

    const handleAction = (status: 'approved' | 'rejected' | 'changes_requested') => {
        if ((status === 'rejected' || status === 'changes_requested') && !comment.trim()) {
            alert('A comment is required to reject or request changes.');
            return;
        }
        onStatusChange(status, comment);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US').format(Number(amount)) + ' RWF';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={budget.name}>
            <DetailsWrapper>
                {budget.statusComment && (
                    <CommentBox>
                        <p><strong>Last Comment:</strong> {budget.statusComment}</p>
                    </CommentBox>
                )}
                <Section>
                    <SectionTitle>Budget Breakdown</SectionTitle>
                    {budget.categories?.map(category => (
                        <div key={category.id} style={{marginBottom: theme.spacing.lg}}>
                            <CategoryTitle>{category.name}</CategoryTitle>
                            <ItemTable>
                                <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
                                <tbody>
                                    {category.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatCurrency(item.unitPrice)}</td>
                                            <td>{formatCurrency(item.totalPrice)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </ItemTable>
                        </div>
                    ))}
                </Section>
                {showApprovalActions && (
                    <Section>
                        <SectionTitle>Approval Action</SectionTitle>
                        <Label>Reason / Comments (Required for Reject or Changes Requested)</Label>
                        <Input as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Provide feedback..." />
                    </Section>
                )}
                {showApprovalActions && (
                    <ActionFooter>
                        <ChangesButton onClick={() => handleAction('changes_requested')} disabled={isSubmitting || !comment}>Request Changes</ChangesButton>
                        <RejectButton onClick={() => handleAction('rejected')} disabled={isSubmitting || !comment}>Reject</RejectButton>
                        <ApproveButton onClick={() => handleAction('approved')} disabled={isSubmitting}>Approve</ApproveButton>
                    </ActionFooter>
                )}
            </DetailsWrapper>
        </Modal>
    );
}