import React, { useState } from 'react';
import './App.css';
import CrossfitImage1 from './crossfit-image-1.jpg';
import CrossfitImage2 from './crossfit-image-2.jpg';
import CrossfitImage3 from './crossfit-image-3.jpg';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app">
      <header>
        <h1>CrossFit Viking</h1>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </button>
        <nav className={menuOpen ? 'active' : ''}>
          <ul className="menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#our-trainers">Our Trainers</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="warmup">
          <h2 className="section-title">Warmup</h2>
          <p>Run 400m, 10 pull-ups, 10 sit-ups, 60 second squat hold</p>
        </section>

        <section className="wod">
          <h2 className="section-title">Workout</h2>
          <p>5 Rounds of: 10 Pull-ups, 20 Push-ups, 30 Air squats</p>
        </section>

        <section className="cashout">
          <h2 className="section-title">Cashout</h2>
          <p>200 ab mat sit-ups</p>
        </section>
      </main>
      <header>
        <h1>Our Clients</h1>
        <section className="clients">
          <img src={CrossfitImage1} alt="Crossfit client 1" />
          <img src={CrossfitImage2} alt="Crossfit client 2" />
          <img src={CrossfitImage3} alt="Crossfit client 3" />
        </section>
      </header>
      <footer>
        <p>© 2023 CrossFit Viking. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
