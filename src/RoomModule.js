import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// import WordleGrid from '..Components/WordleGrid';
import WordleGrid from './WorldeGrid';

function RoomModule({ user }) {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');
  const [users, setUsers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [creator, setCreator] = useState(null);
  const [canRestart, setCanRestart] = useState(false);
  const [shouldLeave, setShouldLeave] = useState(false);
  const [restartCountdown, setRestartCountdown] = useState(10);

  useEffect(() => {
    if (!roomId) return;
    fetchUsers(roomId);
    fetchWinnerAndStarted(roomId);
    const interval = setInterval(() => {
      fetchUsers(roomId);
      fetchWinnerAndStarted(roomId);
    }, 2000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    let timer;
    if (winner && user.id === creator) {
      setCanRestart(false);
      setRestartCountdown(10);
      timer = setInterval(() => {
        setRestartCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanRestart(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCanRestart(false);
      setRestartCountdown(10);
    }
    return () => clearInterval(timer);
  }, [winner, user.id, creator]);

  useEffect(() => {
    if (!joined || started) return;
    setShouldLeave(false);
    const timer = setTimeout(() => {
      if (!started) setShouldLeave(true);
    }, 120000);
    return () => clearTimeout(timer);
  }, [joined, started]);

  useEffect(() => {
    if (shouldLeave) {
      setRoomId('');
      setJoined(false);
      setUsers([]);
      setWinner(null);
      setStarted(false);
      setCreator(null);
      setCanRestart(false);
    }
  }, [shouldLeave]);

  const fetchUsers = async (roomId) => {
    const { data } = await supabase.from('room_users').select('*').eq('room_id', roomId);
    setUsers(data || []);
  };

  const fetchWinnerAndStarted = async (roomId) => {
    const { data } = await supabase.from('rooms').select('winner,started,creator').eq('id', roomId).single();
    setWinner(data?.winner || null);
    setStarted(data?.started || false);
    setCreator(data?.creator || null);
  };

  const createRoom = async () => {
    setError('');
    const newRoomId = crypto.randomUUID();
    const { error: roomError } = await supabase.from('rooms').insert({ id: newRoomId, creator: user.id, started: false });
    if (roomError) {
      setError('Failed to create room.');
      return;
    }
    setRoomId(newRoomId);
    setJoined(true);
    setCreator(user.id);
    await supabase.from('room_users').insert({ room_id: newRoomId, user_id: user.id, username: user.email });
  };

  const joinRoom = async () => {
    setError('');
    const { data: room, error: roomError } = await supabase.from('rooms').select('*').eq('id', inputRoomId).single();
    if (roomError || !room) {
      setError('Room does not exist.');
      return;
    }
    setRoomId(inputRoomId);
    setJoined(true);
    setCreator(room.creator);
    await supabase.from('room_users').insert({ room_id: inputRoomId, user_id: user.id, username: user.email });
  };

  const startGame = async () => {
    await supabase.from('rooms').update({ started: true }).eq('id', roomId);
    setStarted(true);
  };

  const onWin = async () => {
    const { error } = await supabase.from('rooms').update({ winner: user.email }).eq('id', roomId);
    if (error) {
      console.log('Error updating winner:', error);
    } else {
      console.log('Winner updated to:', user.email);
    }
    setWinner(user.email);
  };

  const restartGame = async () => {
    await supabase.from('rooms').update({ winner: null, started: false }).eq('id', roomId);
    setWinner(null);
    setStarted(false);
    setCanRestart(false);
    setRestartCountdown(10);
  };

  if (shouldLeave) {
    return (
      <div style={{ color: '#d32f2f', fontWeight: 700, fontSize: 18, maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        Room expired, please leave and join again.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      {error && <div style={{ color: '#d32f2f', marginBottom: 12 }}>{error}</div>}
      {!joined ? (
        <>
          <button onClick={createRoom} style={{ marginBottom: 16, padding: '10px 20px', fontWeight: 600 }}>Create Room</button>
          <div style={{ margin: '16px 0' }}>or</div>
          <input
            value={inputRoomId}
            onChange={e => setInputRoomId(e.target.value)}
            placeholder="Enter Room ID"
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', marginRight: 8 }}
          />
          <button onClick={joinRoom} style={{ padding: '8px 18px', fontWeight: 600 }}>Join Room</button>
        </>
      ) : (
        <div>
          <h3>Room ID: {roomId}</h3>
          <div style={{ margin: '12px 0' }}>
            <strong>Users in Room:</strong>
            <ul>
              {users.map(u => <li key={u.user_id}>{u.username}</li>)}
            </ul>
          </div>
          {winner ? (
            <>
              <div style={{ color: '#388e3c', fontWeight: 700, fontSize: 18 }}>{winner} won! Room can be restarted soon.</div>
              {user.id === creator && !canRestart && (
                <div style={{ marginTop: 8, color: '#888', fontWeight: 600 }}>You can restart in {restartCountdown} seconds...</div>
              )}
              {user.id === creator && canRestart && (
                <button onClick={restartGame} style={{ marginTop: 16, padding: '8px 18px', fontWeight: 600 }}>Restart Game</button>
              )}
            </>
          ) : started ? (
            <WordleGrid roomId={roomId} user={user} onWin={onWin} />
          ) : user.id === creator ? (
            <button onClick={startGame} style={{ marginTop: 16, padding: '8px 18px', fontWeight: 600 }}>Start Game</button>
          ) : (
            <div style={{ marginTop: 16, color: '#888', fontWeight: 600 }}>Waiting for the creator to start the game...</div>
          )}
        </div>
      )}
    </div>
  );
}

export default RoomModule; 
