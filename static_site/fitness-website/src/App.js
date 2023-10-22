import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import FitnessImage1 from './fitness-image-1.jpg';
import FitnessImage2 from './fitness-image-2.jpg';
import FitnessImage3 from './fitness-image-3.jpg';

const API_ENDPOINT = "/fitness_chatbot";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [responses, setResponses] = useState(["Ask me a fitness question."]);
  const [isSending, setIsSending] = useState(false);
  const [toddIsTyping, setToddIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const trainers = [
    {
      name: "Alexa Smith",
      experience: "5 years",
      history: "Specializes in high-intensity workouts and weightlifting.",
      interests: "Loves rock climbing, reading, and yoga.",
      image: FitnessImage1
    },
    {
      name: "John Doe",
      experience: "7 years",
      history: "Expert in mobility exercises and endurance training.",
      interests: "Passionate about trail running, cycling, and cooking.",
      image: FitnessImage2
    },
    {
      name: "Lucy Liu",
      experience: "4 years",
      history: "Focused on holistic fitness including mind-body connection.",
      interests: "Enjoys meditation, swimming, and travel.",
      image: FitnessImage3
    }
  ];

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
    <Router>
      <div className="app">
        <header>
          <h1>Berserker Fitness</h1>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            &#9776;
          </button>
          <nav className={menuOpen ? 'active' : ''}>
            <ul className="menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/our-trainers">Our Trainers</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/our-trainers" element={<OurTrainers trainers={trainers} />} />
          <Route path="/" element={<Home />} />
        </Routes>
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
        <p>© 2023 Berserker Fitness. All rights reserved.</p>
      </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
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
          <img src={FitnessImage1} alt="Fitness client 1" />
          <img src={FitnessImage2} alt="Fitness client 2" />
          <img src={FitnessImage3} alt="Fitness client 3" />
        </section>
      </header>
    </div>
  );
}

function AboutUs() {
  return (
    <section id="about-us" className="about-us">
      <h2 className="section-title">About Us</h2>
      <p>
        At Berserker Fitness, we're committed to pushing the boundaries of fitness. Inspired by some of the most intense training regimens, our gym offers a variety of workouts designed to challenge and transform your body and mind. Whether you're a beginner or an experienced athlete, our state-of-the-art facility and passionate community are here to support your fitness journey.
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <h2 className="section-title">Contact Us</h2>
      <p>
        Phone: (123) 456-7890 <br />
        Email: <a href="mailto:info@berserkerfitness.com">info@berserkerfitness.com</a><br />
        Address: 313 Golfview Crest, Tega Cay, SC 29708
      </p>
      <div>
        <iframe
          title="Berserker Fitness Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.133980936453!2d-81.02821868531099!3d35.02465788035203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8856a02e28a13cef%3A0x51d70ab0d7de5e40!2s313%20Golfview%20Crest%2C%20Tega%20Cay%2C%20SC%2029708%2C%20USA!5e0!3m2!1sen!2sus!4v1634465122893"
          width="600"
          height="450"
          style={{border:0}}
          allowFullScreen=""
          loading="lazy">
        </iframe>
      </div>
    </section>
  );
}

function OurTrainers({ trainers }) {
  return (
    <section id="our-trainers" className="our-trainers">
      <h2 className="section-title">Our Trainers</h2>
      {trainers.map((trainer, index) => (
        <div key={index} className="trainer">
          <img src={trainer.image} alt={trainer.name} />
          <div className="trainer-details">
            <h3>{trainer.name}</h3>
            <p><strong>Experience:</strong> {trainer.experience}</p>
            <p><strong>History:</strong> {trainer.history}</p>
            <p><strong>Interests:</strong> {trainer.interests}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default App;
