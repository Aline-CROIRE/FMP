// src/components/dashboard/BudgetStatusChart.tsx
'use client';
import styled, { useTheme, DefaultTheme } from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Styled Components ---
const ChartWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.bgSecondary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ theme }) => theme.spacing.lg};
    box-shadow: ${({ theme }) => theme.shadows.soft};
    height: 400px;
`;

const Title = styled.h3`
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textHeading};
`;

const NoDataMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${({ theme }) => theme.colors.textMuted};
`;

// --- Chart Configuration ---
const getChartColors = (theme: DefaultTheme) => ({
    // Using the monochrome theme now
    approved: '#34D399', // A clear green for success
    pending_approval: '#FBBF24', // A clear yellow for pending
    changes_requested: '#F59E0B', // A clear orange for changes
    rejected: theme.colors.redError, // Use the theme's error red
    draft: theme.colors.textMuted, // Use a muted gray for drafts
});

// --- Type Definitions ---
interface ChartData {
    name: string;
    value: number;
}
interface BudgetStatusChartProps {
    data: ChartData[];
}

// --- The Main Component ---
export default function BudgetStatusChart({ data }: BudgetStatusChartProps) {
    const currentTheme = useTheme(); // Hook to get the current theme object
    const COLORS = getChartColors(currentTheme);

    if (!data || data.length === 0) {
        return (
            <ChartWrapper>
                <Title>Budgets by Status</Title>
                <NoDataMessage>
                    <p>No budget data to display.</p>
                </NoDataMessage>
            </ChartWrapper>
        );
    }

    return (
        <ChartWrapper>
            <Title>Budgets by Status</Title>
            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                        animationDuration={800}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[entry.name.toLowerCase().replace(/ /g, '_') as keyof typeof COLORS] || currentTheme.colors.textMuted} 
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: currentTheme.colors.bgTertiary,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.textLight,
                            borderRadius: currentTheme.borderRadius,
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
}