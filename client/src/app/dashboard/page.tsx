// src/app/dashboard/page.tsx
'use client';
import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import StatCard from '@/components/dashboard/StatCard';
import BudgetStatusChart from '@/components/dashboard/BudgetStatusCard';
import { theme } from '@/styles/theme';

const PageWrapper = styled.div`
    animation: fadeIn 0.5s ease-out;
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
const PageTitle = styled.h1`
    font-size: ${theme.fontSizes.xxl};
    font-weight: 700;
    margin-bottom: ${theme.spacing.xl};
`;
const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${theme.spacing.lg};
`;
const ChartGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
    margin-top: ${theme.spacing.xl};
`;

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

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount).replace('RWF', 'RWF ');

    const renderDashboardContent = () => {
        if (loading || !summary) return <p>Loading dashboard data...</p>;
        
        const mainStats = (
            <Grid>
                <StatCard title="Total Approved Budget" value={formatCurrency(summary.totalApprovedAmount)} />
                <StatCard title="Budgets Pending Approval" value={summary.statusCounts.pending_approval || 0} />
                <StatCard title="Total Budgets Tracked" value={summary.totalBudgets} />
            </Grid>
        );

        switch(user?.role) {
            case 'admin':
            case 'program_manager':
                return <><Grid>
                    {mainStats.props.children}
                    <StatCard title="Rejected Budgets" value={summary.statusCounts.rejected || 0} />
                    </Grid>
                    <ChartGrid><BudgetStatusChart data={chartData} /></ChartGrid>
                    </>
            case 'finance_manager':
            case 'viewer':
                return mainStats;
            default:
                return <p>Welcome! Your dashboard is being set up.</p>;
        }
    };

    return (
        <PageWrapper>
            <PageTitle>Dashboard Overview</PageTitle>
            {renderDashboardContent()}
        </PageWrapper>
    );
}