import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const dummyEmail = 'admin@example.com';
    const dummyPassword = 'admin123';

    if (email === dummyEmail && password === dummyPassword) {
      localStorage.setItem('token', 'dummyToken');
      alert('Login Successful');
      navigate('/');
      window.location.reload(); 
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
