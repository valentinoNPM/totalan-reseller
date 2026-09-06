
import { useState, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import Login from './features/auth/Login';
import Master from './features/master/Master';
import Totalan from './features/totalan/Totalan';
import History from './features/history/History';

function RequireAuth({ children, session }: { children: ReactNode, session: Session | null }) {
  const location = useLocation();
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function Layout({ session }: { session: Session | null }) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: 'var(--spacing-4)', 
        backgroundColor: 'var(--color-primary)', 
        fontWeight: 'bold' 
      }}>
        <span>Totalan Reseller</span>
        {session && (
          <button onClick={handleLogout} style={{ padding: '4px 8px', minHeight: 'auto', fontSize: '14px' }}>
            Logout
          </button>
        )}
      </header>
      <main style={{ flex: 1, padding: 'var(--spacing-4)' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/totalan" replace />} />
          <Route path="/login" element={session ? <Navigate to="/totalan" replace /> : <Login />} />
          <Route path="/totalan" element={<RequireAuth session={session}><Totalan /></RequireAuth>} />
          <Route path="/riwayat" element={<RequireAuth session={session}><History /></RequireAuth>} />
          <Route path="/master" element={<RequireAuth session={session}><Master /></RequireAuth>} />
        </Routes>
      </main>
      {session && (
        <footer style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          padding: 'var(--spacing-3)', 
          borderTop: '1px solid var(--color-border)',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'var(--color-bg)'
        }}>
          <button onClick={() => navigate('/totalan')}>Totalan</button>
          <button onClick={() => navigate('/riwayat')}>Riwayat</button>
          <button onClick={() => navigate('/master')}>Master</button>
        </footer>
      )}
    </div>
  );
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Memuat...</div>;
  }

  return (
    <BrowserRouter>
      <Layout session={session} />
    </BrowserRouter>
  );
}

export default App;
