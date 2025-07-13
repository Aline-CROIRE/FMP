// src/components/Modal.tsx
'use client';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

const ModalContent = styled.div`
    background-color: ${theme.colors.bgPrimary};
    border: 1px solid ${theme.colors.border};
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 600px; // A bit wider for budget forms
    position: relative;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    @keyframes slideIn { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: ${theme.colors.textMuted};
    font-size: 1.5rem;
    cursor: pointer;
    transition: ${theme.transitions.main};
    &:hover { color: white; }
`;

const ModalTitle = styled.h2`
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: ${theme.colors.textHeading};
    font-size: ${theme.fontSizes.xl};
`;

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;
    const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={handleContentClick}>
                <CloseButton onClick={onClose}>×</CloseButton>
                <ModalTitle>{title}</ModalTitle>
                {children}
            </ModalContent>
        </ModalBackdrop>
    );
}