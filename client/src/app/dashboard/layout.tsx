// src/app/dashboard/layout.tsx
'use client';
import { ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/styles/theme';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// --- Styled Components ---

const DashboardWrapper = styled.div`
    display: flex;
    min-height: 100vh;
`;

const Sidebar = styled.aside`
    width: 260px;
    background-color: ${theme.colors.bgPrimary};
    border-right: 1px solid ${theme.colors.border};
    padding: ${theme.spacing.lg};
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    
    @media (max-width: 768px) {
        display: none; // Sidebar is hidden on mobile for simplicity
    }
`;

const SidebarHeader = styled.div`
    margin-bottom: ${theme.spacing.xxl};
`;

const Logo = styled.h1`
    font-size: ${theme.fontSizes.lg};
    font-weight: 700;
    color: ${theme.colors.textHeading};
    text-align: center;
    letter-spacing: 1px;
    span {
        color: ${theme.colors.primary};
    }
`;

const Nav = styled.nav`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
    color: ${({ $isActive, theme }) => $isActive ? theme.colors.textLight : theme.colors.textMuted};
    background-color: ${({ $isActive, theme }) => $isActive ? theme.colors.bgSecondary : 'transparent'};
    text-decoration: none;
    font-size: ${theme.fontSizes.md};
    font-weight: 500;
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius};
    transition: ${theme.transitions.main};

    &:hover {
        background-color: ${theme.colors.bgSecondary};
        color: ${theme.colors.textLight};
    }
`;

const MainContent = styled.main`
    flex-grow: 1;
    padding: ${theme.spacing.xl} ${theme.spacing.xxl};
    margin-left: 260px; // Offset for the fixed sidebar
    
    @media (max-width: 768px) {
        margin-left: 0;
        padding: ${theme.spacing.lg};
    }
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding-top: ${theme.spacing.lg};
    border-top: 1px solid ${theme.colors.border};
`;

const UserName = styled.span`
    font-weight: 600;
    color: ${theme.colors.textLight};
`;

const LogoutButton = styled.button`
    background: transparent;
    color: ${theme.colors.textMuted};
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: ${theme.fontSizes.sm};
    transition: ${theme.transitions.main};
    margin-left: auto;

    &:hover {
        color: ${theme.colors.redError};
    }
`;


// --- The Layout Component ---

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div style={{height: '100vh', display: 'grid', placeContent: 'center', backgroundColor: theme.colors.bgPrimary}}>
                Loading...
            </div>
        );
    }

    // Determine which links to show based on user role
    const canManageBudgets = user?.role === 'admin' || user?.role === 'finance_manager' || user?.role === 'program_manager';
    const canViewBudgets = user?.role === 'viewer';
    const isAdmin = user?.role === 'admin';

    return (
        <DashboardWrapper>
            <Sidebar>
                <SidebarHeader>
                    <Logo>FINANCE<span>MGR</span></Logo>
                </SidebarHeader>
                <Nav>
                    <NavLink href="/dashboard" $isActive={pathname === '/dashboard'}>
                        Overview
                    </NavLink>
                    {(canManageBudgets || canViewBudgets) && (
                        <NavLink href="/dashboard/budgets" $isActive={pathname.includes('/budgets')}>
                            Budgets
                        </NavLink>
                    )}
                    {isAdmin && (
                        <NavLink href="/dashboard/users" $isActive={pathname.includes('/users')}>
                            User Management
                        </NavLink>
                    )}
                </Nav>
                <UserProfile>
                    <UserName>{user?.name}</UserName>
                    <LogoutButton onClick={logout}>Logout</LogoutButton>
                </UserProfile>
            </Sidebar>
            <MainContent>
                {children}
            </MainContent>
        </DashboardWrapper>
    );
}