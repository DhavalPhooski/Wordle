
import './App.css';
import WordleGrid from './Components/WorldeGrid';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './Components/Login';
import RoomModule from './Components/RoomModule';

function App() {
  const [session, setSession] = useState(null);

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
            onClick={async () => { await supabase.auth.signOut(); }}
          >
            Logout
          </button>
          <RoomModule user={session.user} />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
