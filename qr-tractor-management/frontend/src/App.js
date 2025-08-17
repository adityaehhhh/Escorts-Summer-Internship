import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';  
import LoginForm from './components/Login';
import Scanner from './components/Scanner'; 
import Generator from './components/Generator'; 

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
