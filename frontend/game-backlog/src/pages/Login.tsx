import React, { useState } from 'react';
import { login } from '../services/API';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    try {
      const data = await login(email, password);
      console.log(data);

      setMessage('Login Complete!');
      setEmail('');
      setPassword('');

      window.location.href = '/';

    } catch (err: any) {
      setMessage(`Login Failed: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {
        <p>{message}</p>
      }
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}required/>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

