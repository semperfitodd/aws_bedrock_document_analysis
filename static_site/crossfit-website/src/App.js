import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import './App.css';
import CrossfitImage1 from './crossfit-image-1.jpg';
import CrossfitImage2 from './crossfit-image-2.jpg';
import CrossfitImage3 from './crossfit-image-3.jpg';

const API_ENDPOINT = "/fitness_chatbot";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [responses, setResponses] = useState(["Ask me a fitness question."]);
  const [isSending, setIsSending] = useState(false);
  const [toddIsTyping, setToddIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // to handle chatbot expand/collapse on mobile

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [responses]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setToddIsTyping(true);
    try {
      const response = await axios.post(API_ENDPOINT, {
        question: chatMessage
      });
      const completionText = response.data.completion;
      setResponses([...responses, chatMessage, completionText]);
      setChatMessage("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setResponses([...responses, "Sorry, I couldn't process that. Please try again."]);
    }
    setIsSending(false);
    setToddIsTyping(false);
  };

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

      {isChatOpen ? (
        <div className="chatbot">
          <header>
            Todd - your fitness AI
            <button className="minimize-button" onClick={() => setIsChatOpen(false)}>−</button>
          </header>
          <div className="chatbot-messages" ref={chatContainerRef}>
            {responses.map((msg, idx) => (
              <div key={idx} className={idx % 2 === 0 ? "user-message" : "bot-message"}>
                {msg}
              </div>
            ))}
            {toddIsTyping && <div className="bot-message">Todd is typing...</div>}
          </div>
          <form onSubmit={handleChatSubmit}>
            <input
              type="text"
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" disabled={isSending}>Send</button>
          </form>
        </div>
      ) : (
        <button className="chatbot-button" onClick={() => setIsChatOpen(true)}>Ask me a fitness question</button>
      )}

      <footer>
        <p>© 2023 CrossFit Viking. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
