// src/app/dashboard/page.tsx
'use client';
import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import StatCard from '@/components/dashboard/StatCard';
import BudgetStatusChart from '@/app/dashboard/BudgetStatusChart';

const PageWrapper = styled.div`
    animation: fadeIn 0.5s ease-out;
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
const PageHeader = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;
const PageTitle = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textHeading};
`;
const WelcomeMessage = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;
const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
`;
const ChartGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-top: ${({ theme }) => theme.spacing.xl};
    align-items: flex-start;
`;

const AdminProgramManagerDashboard = ({ summary, chartData }: any) => (
    <>
        <Grid>
            <StatCard title="Total Approved Budget" value={new Intl.NumberFormat().format(summary.totalApprovedAmount) + ' RWF'} />
            <StatCard title="Pending Approval" value={summary.statusCounts.pending_approval || 0} />
            <StatCard title="Rejected Budgets" value={summary.statusCounts.rejected || 0} />
        </Grid>
        <ChartGrid>
            <BudgetStatusChart data={chartData} />
            {/* You could add another summary card here */}
            <StatCard title="Total Budgets Tracked" value={summary.totalBudgets} subtext="Across all statuses" />
        </ChartGrid>
    </>
);

const FinanceManagerViewerDashboard = ({ summary }: any) => (
     <Grid>
        <StatCard title="Total Approved Budget" value={new Intl.NumberFormat().format(summary.totalApprovedAmount) + ' RWF'} />
        <StatCard title="Pending Budgets" value={summary.statusCounts.pending_approval || 0} />
        <StatCard title="Total Budgets" value={summary.totalBudgets} />
    </Grid>
);

export default function DashboardPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/budgets/summary')
           .then(res => setSummary(res.data))
           .catch(err => console.error("Failed to fetch summary", err))
           .finally(() => setLoading(false));
    }, []);

    const chartData = useMemo(() => {
        if (!summary?.statusCounts) return [];
        return Object.entries(summary.statusCounts).map(([name, value]) => ({
            name: name.replace(/_/g, ' '),
            value: value as number,
        }));
    }, [summary]);

    const renderDashboard = () => {
        if (loading || !summary) return <p>Loading dashboard data...</p>;
        switch(user?.role) {
            case 'admin':
            case 'program_manager': return <AdminProgramManagerDashboard summary={summary} chartData={chartData} />;
            case 'finance_manager':
            case 'viewer': return <FinanceManagerViewerDashboard summary={summary} />;
            default: return <WelcomeMessage>Welcome! Your dashboard is ready.</WelcomeMessage>;
        }
    };

    return (
        <PageWrapper>
            <PageHeader>
                <PageTitle>Overview</PageTitle>
                <WelcomeMessage>Welcome back, {user?.name}. Here's the latest financial summary.</WelcomeMessage>
            </PageHeader>
            {renderDashboard()}
        </PageWrapper>
    );
}