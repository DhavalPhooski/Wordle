import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      alert('Error logging in with Google: ' + error.message);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) setError(error.message);
      else alert('Registration successful! Please check your email to confirm.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      <div style={{
        maxWidth: 370,
        width: '100%',
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 32px rgba(80, 80, 160, 0.10)',
        padding: '40px 32px 32px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#3730a3', marginBottom: 8, letterSpacing: 1 }}>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleEmailAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 10 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: '12px 14px',
              border: '1.5px solid #e0e7ff',
              borderRadius: 8,
              fontSize: '1rem',
              outline: 'none',
              background: '#f1f5f9',
              color: '#222',
              transition: 'border 0.2s',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '12px 14px',
              border: '1.5px solid #e0e7ff',
              borderRadius: 8,
              fontSize: '1rem',
              outline: 'none',
              background: '#f1f5f9',
              color: '#222',
              transition: 'border 0.2s',
            }}
          />
          <button type="submit" style={{
            padding: '12px 0',
            background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 6,
            boxShadow: '0 2px 8px rgba(80, 80, 160, 0.08)',
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
          }}>
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        {error && <div style={{ color: '#d32f2f', marginBottom: 8, fontWeight: 500 }}>{error}</div>}
        <button onClick={handleGoogleLogin} style={{
          width: '100%',
          padding: '12px 0',
          background: 'linear-gradient(90deg, #ea4335 0%, #fbbc05 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: 10,
          boxShadow: '0 2px 8px rgba(234,67,53,0.08)',
          transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
        }}>
          Login with Google
        </button>
        <div style={{ marginTop: 8, fontSize: '1rem', color: '#444', fontWeight: 500 }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsRegister(false)} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', padding: 0, marginLeft: 2 }}>Login</button>
            </span>
          ) : (
            <span>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setIsRegister(true)} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', padding: 0, marginLeft: 2 }}>Register</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login; 