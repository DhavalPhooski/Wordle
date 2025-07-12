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
    <div className="login-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleEmailAuth} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      {error && <div className="login-error">{error}</div>}
      <button onClick={handleGoogleLogin} className="google-btn">
        Login with Google
      </button>
      <div className="login-toggle">
        {isRegister ? (
          <span>
            Already have an account?
            <button type="button" onClick={() => setIsRegister(false)}>Login</button>
          </span>
        ) : (
          <span>
            Don&apos;t have an account?
            <button type="button" onClick={() => setIsRegister(true)}>Register</button>
          </span>
        )}
      </div>
    </div>
  );
}

export default Login; 