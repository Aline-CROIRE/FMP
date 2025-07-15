// src/components/dashboard/StatCard.tsx
'use client';
import styled from 'styled-components';

// No "import { theme }" here. It's not needed.

const Card = styled.div`
    background: linear-gradient(145deg, ${({ theme }) => theme.colors.bgSecondary}, ${({ theme }) => theme.colors.bgTertiary});
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ theme }) => theme.spacing.lg};
    box-shadow: ${({ theme }) => theme.shadows.soft};
    transition: ${({ theme }) => theme.transitions.main};
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }
`;
const Title = styled.h3`
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 500;
`;
const Value = styled.p`
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textHeading};
`;
const Subtext = styled.p`
    margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textMuted};
`;

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
}

export default function StatCard({ title, value, subtext }: StatCardProps) {
    return (
        <Card>
            <Title>{title}</Title>
            <Value>{value}</Value>
            {subtext && <Subtext>{subtext}</Subtext>}
        </Card>
    );
}