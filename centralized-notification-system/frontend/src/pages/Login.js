import React, {useState} from 'react';
import { post } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const r = await post('/auth/login', { username, password });
    if (r.token) {
      localStorage.setItem('token', r.token);
      localStorage.setItem('user', JSON.stringify(r.user));
      nav('/dashboard');
    } else {
      alert(r.error || 'login failed');
    }
  };

  return (
    <form onSubmit={submit} className="form">
      <h3>Login</h3>
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
