// src/app/dashboard/layout.tsx
'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { LuLayoutDashboard, LuUsers, LuWallet, LuLogOut, LuChevronDown } from "react-icons/lu";
import { UserCircle } from "lucide-react";

import ProfileEditModal from '@/components/ProfileEditModal';

// --- Styled Components ---

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100%;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentArea = styled.div`
  flex-grow: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const TopNavbar = styled.header`
  height: 70px;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  position: sticky;
  top: 0;
  z-index: 900;
`;

const PageContent = styled.main`
  padding: ${({ theme }) => theme.spacing.xl};
  flex-grow: 1;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Logo = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textHeading};
  text-align: center;
  letter-spacing: 1px;
  margin: 0 0 ${({ theme }) => theme.spacing.xxl} 0;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
    background: -webkit-linear-gradient(${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Nav = styled.nav`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ $isActive, theme }) => $isActive ? theme.colors.textHeading : theme.colors.textMuted};
  background-color: ${({ $isActive, theme }) => $isActive ? theme.colors.bgTertiary : 'transparent'};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: ${({ theme }) => theme.transitions.main};
  border: 1px solid transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgTertiary};
    color: ${({ theme }) => theme.colors.textHeading};
  }

  & > svg {
    font-size: 1.2rem;
    color: ${({ $isActive, theme }) => $isActive ? theme.colors.primary : theme.colors.textMuted};
    transition: color 0.2s ease-in-out;
  }
`;

const UserProfileMenu = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const ProfileTrigger = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius};
    transition: ${({ theme }) => theme.transitions.main};

    &:hover {
        background: ${({ theme }) => theme.colors.bgTertiary};
    }
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
    text-align: left;
    @media (max-width: 900px) {
        display: none;
    }
`;

const UserName = styled.p`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textHeading};
    margin: 0;
`;

const UserRole = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
    text-transform: capitalize;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 120%;
    right: 0;
    background: ${({ theme }) => theme.colors.bgSecondary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.shadows.medium};
    width: 220px;
    z-index: 1000;
    overflow: hidden;
    animation: fadeIn 0.2s ease-out;
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
`;

const DropdownItem = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textLight};
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: 500;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.main};

    &:hover {
        background: ${({ theme }) => theme.colors.bgTertiary};
        color: ${({ theme }) => theme.colors.textHeading};
    }
    & > svg {
        font-size: 1.1rem;
        color: ${({ theme }) => theme.colors.textMuted};
    }
`;

// --- The Layout Component ---
export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Effect to close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Effect to protect the route
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Render a loader while checking authentication status
    if (isLoading || !isAuthenticated) {
        return (
            <div style={{height: '100vh', display: 'grid', placeContent: 'center', backgroundColor: '#121212', color: 'white'}}>
                Loading...
            </div>
        );
    }

    // Determine permissions for showing navigation links
    const isAdmin = user?.role === 'admin';

    return (
        <>
            <DashboardWrapper>
                <Sidebar>
                    <Logo>F<span>MP</span></Logo>
                    <Nav>
                        <NavLink href="/dashboard" $isActive={pathname === '/dashboard'}>
                            <LuLayoutDashboard /> Overview
                        </NavLink>
                        <NavLink href="/dashboard/budgets" $isActive={pathname.includes('/budgets')}>
                            <LuWallet /> Budgets
                        </NavLink>
                        {isAdmin && (
                            <NavLink href="/dashboard/users" $isActive={pathname.includes('/users')}>
                                <LuUsers /> Users
                            </NavLink>
                        )}
                    </Nav>
                </Sidebar>
                <ContentArea>
                    <TopNavbar>
                        <UserProfileMenu ref={menuRef}>
                            <ThemeToggle />
                            <ProfileTrigger onClick={() => setIsMenuOpen(prev => !prev)}>
                                <Avatar src={user?.profilePictureUrl || '/default-avatar.png'} alt="User Avatar" />
                                <UserInfo>
                                    <UserName>{user?.name}</UserName>
                                    <UserRole>{user?.role.replace('_', ' ')}</UserRole>
                                </UserInfo>
                                <LuChevronDown style={{ color: '#888888' }} />
                            </ProfileTrigger>
                            {isMenuOpen && (
                                <DropdownMenu>
                                    <DropdownItem onClick={() => { setIsProfileModalOpen(true); setIsMenuOpen(false); }}>
                                        <UserCircle /> Edit Profile
                                    </DropdownItem>
                                    <DropdownItem onClick={logout}>
                                        <LuLogOut /> Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            )}
                        </UserProfileMenu>
                    </TopNavbar>
                    <PageContent>{children}</PageContent>
                </ContentArea>
            </DashboardWrapper>
            
            <ProfileEditModal 
                isOpen={isProfileModalOpen} 
                onClose={() => setIsProfileModalOpen(false)} 
            />
        </>
    );
}