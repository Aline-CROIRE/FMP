// src/app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect until we're done loading the auth state
    if (!isLoading) {
      if (isAuthenticated && user) {
        // If logged in, redirect to the appropriate dashboard
        router.replace(user.role === 'admin' ? '/dashboard/users' : '/dashboard');
      } else {
        // If not logged in, redirect to the login page
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Render a simple loading screen while we determine the redirect
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#3a3a3a', color: 'white' }}>
      <h2>Loading...</h2>
    </div>
  );
}