import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function App(){
  return (
    <div className="container">
      <header className="header">
        <h2>Notification Service</h2>
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/dashboard">Dashboard</Link> | <Link to="/sample">Sample App</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
