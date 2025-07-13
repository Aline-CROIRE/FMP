// src/app/dashboard/users/page.tsx
'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import api from '@/services/api';
import { theme } from '@/styles/theme';
import Modal from '@/components/Modal';
import UserForm, { UserFormData } from '@/components/UserForm';
import { useAuth } from '@/contexts/AuthContext';

// --- Type Definition ---
interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'program_manager' | 'finance_manager';
    createdAt: string;
}

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
    color: ${theme.colors.textHeading};
`;

const CreateButton = styled.button`
    background: ${theme.colors.primary};
    color: white;
    font-weight: 600;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: ${theme.borderRadius};
    cursor: pointer;
    transition: ${theme.transitions.main};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    box-shadow: 0 4px 10px rgba(0, 100, 0, 0.2);

    &:hover {
        background-color: ${theme.colors.primaryHover};
        transform: translateY(-2px);
        box-shadow: 0 6px 14px rgba(0, 100, 0, 0.3);
    }
`;

const TableContainer = styled.div`
    background-color: ${theme.colors.bgSecondary};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    box-shadow: ${theme.shadows.main};
    overflow: hidden;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    
    th, td {
        padding: ${theme.spacing.lg} ${theme.spacing.xl};
        text-align: left;
    }

    thead tr {
        background-color: transparent;
        border-bottom: 1px solid ${theme.colors.border};
    }
    
    th {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: ${theme.fontSizes.xs};
        color: ${theme.colors.textMuted};
    }

    tbody tr {
        border-bottom: 1px solid ${theme.colors.border};
        transition: ${theme.transitions.main};
        &:last-child { border-bottom: none; }
        &:hover { background-color: ${theme.colors.bgTertiary}; }
    }
    
    td {
        color: ${theme.colors.textLight};
        font-weight: 500;
    }

    td .role-badge {
        display: inline-block;
        padding: 0.25rem 0.6rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: capitalize;
        
        &.admin { background-color: #c53030; color: white; }
        &.program-manager { background-color: #2b6cb0; color: white; }
        &.finance-manager { background-color: #285e61; color: white; }
    }
`;

const ActionButton = styled.button`
    background: transparent;
    border: none;
    border-radius: ${theme.borderRadius};
    cursor: pointer;
    padding: ${theme.spacing.sm};
    margin: 0 ${theme.spacing.xs};
    line-height: 1;
    transition: ${theme.transitions.main};
`;

const EditButton = styled(ActionButton)`
    color: ${theme.colors.textMuted};
    &:hover { background-color: ${theme.colors.bgTertiary}; color: ${theme.colors.primary}; }
`;

const DeleteButton = styled(ActionButton)`
    color: ${theme.colors.textMuted};
    &:hover { background-color: ${theme.colors.bgTertiary}; color: ${theme.colors.redError}; }
`;


// --- Main Page Component ---
export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            // No need to set loading to true here if it's already true initially
            const response = await api.get('/users');
            setUsers(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch users. You may not have permission.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreateUser = async (data: UserFormData) => {
        setIsSubmitting(true);
        try {
            await api.post('/users', data);
            setIsCreateModalOpen(false);
            await fetchUsers(); // Refresh the user list
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditUser = async (data: UserFormData) => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        try {
            await api.put(`/users/${selectedUser.id}`, data);
            setIsEditModalOpen(false);
            setSelectedUser(null);
            await fetchUsers(); // Refresh the user list
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        try {
            await api.delete(`/users/${selectedUser.id}`);
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
            await fetchUsers(); // Refresh the user list
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    if (currentUser?.role !== 'admin') {
        return (
            <PageWrapper>
                <PageTitle>Access Denied</PageTitle>
                <p style={{ color: theme.colors.textMuted }}>This page is for administrators only.</p>
            </PageWrapper>
        );
    }

    if (loading) return <p style={{ color: 'white' }}>Loading user data...</p>;
    if (error) return <p style={{ color: theme.colors.redError }}>{error}</p>;

    return (
        <PageWrapper>
            <PageHeader>
                <PageTitle>Users</PageTitle>
                <CreateButton onClick={() => setIsCreateModalOpen(true)}>+ Add User</CreateButton>
            </PageHeader>
            <TableContainer>
                 <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.role.replace('_', '-')}`}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <EditButton onClick={() => openEditModal(user)}>Edit</EditButton>
                                    <DeleteButton onClick={() => openDeleteModal(user)}>Delete</DeleteButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>

            {/* --- Modals --- */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New User">
                <UserForm onSubmit={handleCreateUser} isSubmitting={isSubmitting} />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User">
                {selectedUser && <UserForm onSubmit={handleEditUser} isSubmitting={isSubmitting} initialData={selectedUser} />}
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p style={{color: 'white'}}>Are you sure you want to delete the user "{selectedUser?.name}"?</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <ActionButton onClick={() => setIsDeleteModalOpen(false)} style={{backgroundColor: theme.colors.bgTertiary, color: theme.colors.textLight}}>Cancel</ActionButton>
                    <DeleteButton onClick={handleDeleteUser} disabled={isSubmitting} style={{backgroundColor: theme.colors.redError, color: 'white'}}>
                        {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                    </DeleteButton>
                </div>
            </Modal>
        </PageWrapper>
    );
}