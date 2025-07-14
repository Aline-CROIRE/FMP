// src/components/dashboard/StatCard.tsx
'use client';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const Card = styled.div`
    background: linear-gradient(145deg, ${theme.colors.bgSecondary}, ${theme.colors.bgTertiary});
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    padding: ${theme.spacing.lg};
    box-shadow: ${theme.shadows.main};
    transition: ${theme.transitions.main};
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.5);
    }
`;
const Title = styled.h3`
    margin: 0 0 ${theme.spacing.sm} 0;
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.textMuted};
    font-weight: 500;
`;
const Value = styled.p`
    margin: 0;
    font-size: ${theme.fontSizes.xxl};
    font-weight: 700;
    color: ${theme.colors.textHeading};
`;
const Subtext = styled.p`
    margin: ${theme.spacing.xs} 0 0 0;
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.textMuted};
`;

interface StatCardProps { title: string; value: string | number; subtext?: string; }

export default function StatCard({ title, value, subtext }: StatCardProps) {
    return (
        <Card>
            <Title>{title}</Title>
            <Value>{value}</Value>
            {subtext && <Subtext>{subtext}</Subtext>}
        </Card>
    );
}