
import './App.css';
import WordleGrid from './Components/WorldeGrid';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './Components/Login';
import RoomModule from './Components/RoomModule';

function App() {
  const [session, setSession] = useState(null);
  const [soloMode, setSoloMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      {session ? (
        <>
          <button
            style={{ position: 'absolute', top: 20, right: 20, padding: '8px 18px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
            onClick={async () => { await supabase.auth.signOut(); setSoloMode(false); }}
          >
            Logout
          </button>
          {!soloMode && !localStorage.getItem('activeRoomId') ? (
            <div style={{
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 4px 32px rgba(80, 80, 160, 0.10)',
              padding: '40px 32px 32px 32px',
              margin: '48px auto 0 auto',
              maxWidth: 420,
              minWidth: 320,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24
            }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3730a3', marginBottom: 8, letterSpacing: 1 }}>Wordle Multiplayer</h1>
              <div style={{ fontSize: '1.2rem', color: '#6366f1', marginBottom: 24, textAlign: 'center', fontWeight: 500 }}>
                Play solo or with friends!<br />Create a room, join a room, or challenge yourself.
              </div>
              <RoomModule user={session.user} />
              <button
                style={{ margin: '0 auto', width: '100%', maxWidth: 260, fontSize: '1.2rem', padding: '16px 0', borderRadius: 12, fontWeight: 700, background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)', boxShadow: '0 2px 8px rgba(80,80,160,0.08)' }}
                onClick={() => setSoloMode(true)}
              >
                Play Solo
              </button>
            </div>
          ) : soloMode ? (
            <WordleGrid />
          ) : (
            <RoomModule user={session.user} />
          )}
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
