import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/logo.png'; 
import { useEffect, useState } from 'react';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

 
  
    function clickHandler() {
      navigate('/');
    }
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo" onClick={clickHandler}/>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        {!isLoggedIn && <Link to="/scanner" className="nav-link">Scanner</Link>}
        {isLoggedIn && <Link to="/generator" className="nav-link">Generator</Link>}
      </div>

      <div className="navbar-right">
        <button onClick={handleLoginLogout} className="nav-button">
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
}
