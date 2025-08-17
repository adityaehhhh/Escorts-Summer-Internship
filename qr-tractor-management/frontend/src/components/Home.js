import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';


export const Home = () => {

   const navigate = useNavigate();

  function clickHandler() {
    
    navigate('/login');
  }
  return (
    <div className="home-container">
      <h1>Welcome to Escorts Kubota !!</h1>
      <p>We are the leading tractor manufacturer in India, providing high-quality tractors and agricultural solutions.</p>
      <button onClick={clickHandler}>Get Started</button>
    </div>
  );
}

export default Home;
