import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000"); // Change if deployment differs

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (message && name) {
      socket.emit("sendMessage", { name, text: message });
      setMessage("");
    }
  };

  return (
    <div className="App">
      <h1>Real Time Chat</h1>
      <input
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Type message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div className="chat">
        {chat.map((msg, idx) => (
          <div key={idx}><strong>{msg.name}:</strong> {msg.text}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
