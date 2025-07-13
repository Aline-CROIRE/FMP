// src/app/login/LoginForm.tsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/styles/theme';
import { PageContainer, Card, Input, Button, Logo, InputGroup, Label, FormWrapper } from '@/components/Styled';

export default function LoginForm() {
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        {error && <p style={{ color: theme.colors.redError, marginTop: '1rem', textAlign: 'center', fontSize: theme.fontSizes.sm }}>{error}</p>}
                    </FormWrapper>
                </form>
            </Card>
        </PageContainer>
    );
}