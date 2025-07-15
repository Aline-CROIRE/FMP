// src/app/login/page.tsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer, Card, Input, Button, Logo, InputGroup, Label, FormWrapper } from '@/components/Styled';
import { lightTheme } from '@/styles/theme';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        }
    };

    return (
        <PageContainer>
            <Card>
                <Logo>FINANCE<span>MGR</span></Logo>
                <form onSubmit={handleSubmit}>
                    <FormWrapper>
                        <InputGroup>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        {error && <p style={{ color: lightTheme.colors.redError, marginTop: '1rem', textAlign: 'center', fontSize: lightTheme.fontSizes.sm }}>{error}</p>}
                    </FormWrapper>
                </form>
            </Card>
        </PageContainer>
    );
}