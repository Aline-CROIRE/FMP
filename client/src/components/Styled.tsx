// src/components/Styled.tsx
'use client';
import styled from 'styled-components';

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: ${({ theme }) => theme.spacing.xl};
`;

export const Card = styled.div`
    background-color: ${({ theme }) => theme.colors.bgSecondary};
    padding: ${({ theme }) => theme.spacing.xxl};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.shadows.soft};
    width: 100%;
    max-width: 450px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    animation: fadeIn 0.5s ease-out;
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
`;

export const FormWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const Label = styled.label`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const Input = styled.input`
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    color: ${({ theme }) => theme.colors.textHeading};
    font-size: ${({ theme }) => theme.fontSizes.md};
    transition: ${({ theme }) => theme.transitions.main};

    &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.borderFocus};
        box-shadow: ${({ theme }) => theme.shadows.soft};
    }
`;

export const Button = styled.button`
    width: 100%;
    font-weight: 700;
    padding: 0.85rem 1.5rem;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: none;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.main};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.bgPrimary}; // Text color contrasts with primary bg
    font-size: ${({ theme }) => theme.fontSizes.md};
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
        background-color: ${({ theme }) => theme.colors.primaryHover};
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.disabled};
        color: ${({ theme }) => theme.colors.textMuted};
        cursor: not-allowed;
        transform: translateY(0);
        box-shadow: none;
    }
`;

export const Logo = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textHeading};
    text-align: center;
    letter-spacing: 1px;
    margin-bottom: ${({ theme }) => theme.spacing.xl};

    span {
        color: ${({ theme }) => theme.colors.primary};
    }
`;