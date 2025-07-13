// src/app/dashboard/layout.tsx
'use client';
import { ReactNode, useEffect } from 'react'; // <-- Import useEffect
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/styles/theme';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


// --- Styled Components for the Layout ---
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

const NavLink = styled(Link)`
    color: ${theme.colors.textMuted};
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
    overflow-y: auto;
`;

const Header = styled.header`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: ${theme.spacing.xxl};
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
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

    &:hover {
        color: ${theme.colors.redError};
    }
`;


// --- The Layout Component ---
export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // --- THIS IS THE FIX ---
    // We use a useEffect hook to handle redirection.
    // This ensures that the navigation happens AFTER the component has rendered.
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);


    // While loading or if not authenticated yet, we show a loader or nothing.
    // This prevents the main layout from trying to render while we decide to redirect.
    if (isLoading || !isAuthenticated) {
        return (
            <div style={{
                height: '100vh',
                display: 'grid',
                placeContent: 'center',
                backgroundColor: theme.colors.bgPrimary
            }}>
                Loading...
            </div>
        );
    }

    // --- This JSX only renders if the user is authenticated ---
    return (
        <DashboardWrapper>
            <Sidebar>
                <SidebarHeader>
                    <Logo>FINANCE<span>MGR</span></Logo>
                </SidebarHeader>
                <Nav>
                    <NavLink href="/dashboard/users">User Management</NavLink>
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