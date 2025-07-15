'use client';
import styled from 'styled-components';
import { useTheme } from '@/contexts/ThemeContext';

const ToggleButton = styled.button`
    background: ${({ theme }) => theme.colors.bgSecondary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textMuted};
    width: 40px; height: 40px; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; transition: ${({ theme }) => theme.transitions.main};
    &:hover { color: ${({ theme }) => theme.colors.textHeading}; background: ${({ theme }) => theme.colors.bgTertiary}; }
`;

export default function ThemeToggle() {
    const { mode, toggleTheme } = useTheme();
    return (
        <ToggleButton onClick={toggleTheme} title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            {mode === 'light' ? '🌙' : '☀️'}
        </ToggleButton>
    );
}