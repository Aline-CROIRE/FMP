// src/components/dashboard/BudgetStatusChart.tsx
'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps } from 'recharts';

const ChartWrapper = styled.div`
  background-color: ${theme.colors.bgSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.main};
  height: 400px;
`;

const Title = styled.h3`
  margin: 0 0 ${theme.spacing.lg} 0;
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
`;

const COLORS: { [key: string]: string } = {
  approved: theme.colors.primary,
  pending_approval: '#d69e2e',
  changes_requested: '#b7791f',
  rejected: theme.colors.redError,
  draft: theme.colors.bgTertiary,
};

interface ChartData {
  name: string;
  value: number;
}

interface BudgetStatusChartProps {
  data: ChartData[];
}

// Custom label renderer to safely handle undefined values
const renderLabel = ({ name, percent }: PieLabelRenderProps): string => {
  const displayName = typeof name === 'string' ? name : 'Unknown';
  const displayPercent = typeof percent === 'number' ? (percent * 100).toFixed(0) : '0';
  return `${displayName}: ${displayPercent}%`;
};

export default function BudgetStatusChart({ data }: BudgetStatusChartProps) {
  if (data.length === 0) {
    return (
      <ChartWrapper>
        <Title>Budgets by Status</Title>
        <p>No budget data to display.</p>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper>
      <Title>Budgets by Status</Title>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            labelLine={false}
            label={renderLabel}
          >
            {data.map((entry, index) => {
              const colorKey = entry.name.toLowerCase().replace(/ /g, '_');
              const fillColor = COLORS[colorKey] || '#8884d8';
              return <Cell key={`cell-${index}`} fill={fillColor} />;
            })}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
