import { useState } from 'react';
import APIService from '../Services/APIService';
import '../Styles/Login.css';

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
    <div className="login-page">
      <div className='login-container'>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit} className='login-form'>
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
          <button className='login-button' type="submit">Login</button>
        </form>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
};

export default Login;
