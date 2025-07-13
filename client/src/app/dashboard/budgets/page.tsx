// src/app/dashboard/budgets/page.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import api from '@/services/api';
import { theme } from '@/styles/theme';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/Modal';
import BudgetForm, { BudgetFormData } from '@/components/BudgetForm';
import BudgetCard, { Budget } from './BudgetCard';
import BudgetDetailModal from './BudgetDetailModal';

// --- Styled Components ---
const PageWrapper = styled.div`
    animation: fadeIn 0.5s ease-out;
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.xl};
`;

const PageTitle = styled.h1`
    font-size: ${theme.fontSizes.xxl};
    font-weight: 700;
`;

const CreateButton = styled.button`
    background: linear-gradient(45deg, ${theme.colors.primary}, #00a040);
    color: white;
    font-weight: 600;
    font-size: ${theme.fontSizes.md};
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: ${theme.borderRadius};
    cursor: pointer;
    transition: ${theme.transitions.main};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    box-shadow: 0 4px 15px rgba(0, 100, 0, 0.25);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 7px 20px rgba(0, 100, 0, 0.35);
    }
`;

const BudgetGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: ${theme.spacing.lg};
`;

const NoBudgetsMessage = styled.div`
    text-align: center;
    padding: ${theme.spacing.xxl};
    background-color: ${theme.colors.bgSecondary};
    border-radius: ${theme.borderRadius};
    color: ${theme.colors.textMuted};
`;

// --- Main Page Component ---
export default function BudgetsPage() {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
    const [selectedBudget, setSelectedBudget] = useState<any | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchBudgets = useCallback(async () => {
        try {
            const { data } = await api.get('/budgets');
            setBudgets(data);
        } catch (error) {
            console.error("Failed to fetch budgets", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

    const handleCreateBudget = async (data: BudgetFormData) => {
        setIsSubmitting(true);
        try {
            await api.post('/budgets', data);
            setModalMode(null);
            await fetchBudgets();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to create budget.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditBudget = async (data: BudgetFormData) => {
        if (!selectedBudget) return;
        setIsSubmitting(true);
        try {
            await api.put(`/budgets/${selectedBudget.id}`, data);
            setModalMode(null);
            await fetchBudgets();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update budget.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setSelectedBudget(null);
        setModalMode('create');
    };

    const openEditModal = (budget: Budget) => {
        setSelectedBudget(budget);
        setModalMode('edit');
    };

    const handleViewDetails = async (budgetId: string) => {
        try {
            const { data } = await api.get(`/budgets/${budgetId}`);
            setSelectedBudget(data);
            setIsDetailModalOpen(true);
        } catch (error) {
            alert('Failed to fetch budget details.');
        }
    };
    
    const handleStatusChange = async (status: 'approved' | 'rejected' | 'changes_requested', comment: string) => {
        if (!selectedBudget) return;
        setIsSubmitting(true);
        try {
            await api.patch(`/budgets/${selectedBudget.id}/status`, { status, comment });
            setIsDetailModalOpen(false);
            await fetchBudgets();
        } catch (err: any) {
            alert(err.response?.data?.message || `Failed to update status.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageWrapper>
            <PageHeader>
                <PageTitle>Budgets</PageTitle>
                <CreateButton onClick={openCreateModal}>+ Create Budget</CreateButton>
            </PageHeader>
            {loading ? ( <p>Loading budgets...</p> ) : budgets.length === 0 ? (
                <NoBudgetsMessage>
                    <h2>No Budgets Found</h2>
                    <p>Click "Create New Budget" to get started.</p>
                </NoBudgetsMessage>
            ) : (
                <BudgetGrid>
                    {budgets.map(budget => (
                        <BudgetCard
                            key={budget.id}
                            budget={budget}
                            onClick={() => handleViewDetails(budget.id)}
                            currentUser={user}
                            onEdit={() => openEditModal(budget)}
                        />
                    ))}
                </BudgetGrid>
            )}

            <Modal
                isOpen={modalMode === 'create' || modalMode === 'edit'}
                onClose={() => setModalMode(null)}
                title={modalMode === 'edit' ? 'Edit Budget' : 'Create New Budget'}
            >
                <BudgetForm
                    onSubmit={modalMode === 'edit' ? handleEditBudget : handleCreateBudget}
                    isSubmitting={isSubmitting}
                    initialData={modalMode === 'edit' ? selectedBudget : undefined}
                />
            </Modal>
            
            <BudgetDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                budget={selectedBudget}
                onStatusChange={handleStatusChange}
                isSubmitting={isSubmitting}
            />
        </PageWrapper>
    );
}