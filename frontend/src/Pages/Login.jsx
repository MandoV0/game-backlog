import { useState } from 'react';
import APIService from '../Services/APIService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const response = await APIService.login(username, password);
      console.log('Login response:', response);
      if (response.status === 200) {
        setStatus('Login successful.');
      }
    } catch (error) {
      setStatus('Login failed!!!!');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Login;
