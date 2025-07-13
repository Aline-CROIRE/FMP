// src/app/dashboard/users/page.tsx
'use client';
import { useEffect, useState, useMemo } from 'react';
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
const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
`;

const PageTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: ${theme.colors.textLight};
    margin: 0;
`;

const CreateButton = styled.button`
    background: ${theme.colors.primary};
    color: white;
    font-weight: bold;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: ${theme.borderRadius};
    cursor: pointer;
    transition: ${theme.transitions.main};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
        background-color: ${theme.colors.primaryHover};
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.main};
    }
`;

const TableContainer = styled.div`
    background-color: ${theme.colors.bgSecondary};
    border-radius: ${theme.borderRadius};
    box-shadow: ${theme.shadows.main};
    overflow: hidden;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: ${theme.colors.textLight};

    th, td {
        padding: 1.25rem 1.5rem;
        text-align: left;
    }

    thead tr {
        background-color: ${theme.colors.bgSecondary};
        border-bottom: 2px solid ${theme.colors.borderFocus};
    }
    
    th {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.8rem;
        color: ${theme.colors.textMuted};
    }

    tbody tr {
        border-bottom: 1px solid ${theme.colors.border};
        transition: ${theme.transitions.main};
        &:last-child { border-bottom: none; }
        &:hover { background-color: ${theme.colors.bgSecondary}; }
    }
    
    td .role-badge {
        display: inline-block;
        padding: 0.25rem 0.6rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: capitalize;
        
        &.admin { background-color: ${theme.colors.redError}; color: white; }
        &.program-manager { background-color: #2b6cb0; color: white; }
        &.finance-manager { background-color: #285e61; color: white; }
    }
`;

const ActionButton = styled.button`
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: ${theme.borderRadius};
    cursor: pointer;
    margin-right: 0.5rem;
    font-weight: 600;
    transition: ${theme.transitions.main};
    &:hover { transform: scale(1.05); }
`;

const EditButton = styled(ActionButton)`
    background-color: transparent;
    border: 1px solid ${theme.colors.primary};
    color: ${theme.colors.primary};
    &:hover { background-color: ${theme.colors.primary}; color: white; }
`;

const DeleteButton = styled(ActionButton)`
    background-color: transparent;
    border: 1px solid ${theme.colors.redError};
    color: ${theme.colors.redError};
    &:hover { background-color: ${theme.colors.redError}; color: white; }
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

    const fetchUsers = useMemo(() => async () => {
        try {
            setLoading(true);
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
            await fetchUsers();
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
            await fetchUsers();
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
            await fetchUsers();
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

    // Specific protection for this page
    if (currentUser?.role !== 'admin') {
        return (
            <div>
                <PageTitle>Access Denied</PageTitle>
                <p style={{ color: theme.colors.textMuted }}>This page is for administrators only.</p>
            </div>
        );
    }

    if (loading) return <p style={{ color: 'white' }}>Loading user data...</p>;
    if (error) return <p style={{ color: theme.colors.redError }}>{error}</p>;

    return (
        <div>
            <PageHeader>
                <PageTitle>User Management</PageTitle>
                <CreateButton onClick={() => setIsCreateModalOpen(true)}>+ Create New User</CreateButton>
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
                    <ActionButton onClick={() => setIsDeleteModalOpen(false)} style={{backgroundColor: theme.colors.bgSecondary, color: theme.colors.textLight}}>Cancel</ActionButton>
                    <DeleteButton onClick={handleDeleteUser} disabled={isSubmitting} style={{backgroundColor: theme.colors.redError, color: 'white'}}>
                        {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                    </DeleteButton>
                </div>
            </Modal>
        </div>
    );
}