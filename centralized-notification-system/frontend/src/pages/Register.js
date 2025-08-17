import React, {useState} from 'react';
import { post } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [username,setUsername]=useState('');
  const [name,setName]=useState('');
  const [password,setPassword]=useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const r = await post('/auth/register', { username, name, password });
    if (r.user) {
      alert('registered, please login');
      nav('/login');
    } else {
      alert(r.error || 'register failed');
    }
  };

  return (
    <form onSubmit={submit} className="form">
      <h3>Register</h3>
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
