import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import Confetti from 'react-confetti';


const thisusernumber = (Math.floor(Math.random() * (100 - 1 + 1)) + 1);

function App() {


  const [showConfetti, setShowConfetti] = useState(false);
  const [messages, setMessages] = useState([]);  // Holds messages from Firestore
  const [input, setInput] = useState('');        // Input field state

  // Fetch messages from Firestore when the app loads
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe(); // Unsubscribe from Firestore listener on unmount
  }, []);

  // Handles the input change
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      handleSendMessage();
    }
  }

  // Handles message submission (stores the message in Firestore)
  const handleSendMessage = async () => {
    if (input.trim()) {
      await addDoc(collection(db, 'messages'), {
        text: input,
        user: 'User ' + thisusernumber.toString(),
        timestamp: new Date(),
      });
      
      setInput(''); // Reset the input field after sending
    }
  };

  return (
<>
    {showConfetti && <Confetti />}
    <div className="chat-app" style={styles.chatApp}>
      <h1>WhatsApp, but better</h1>
      <div className="chat-box" style={styles.chatBox}>
        {messages.map((message) => (
          <div key={message.id} className="message" style={styles.message}>
            <strong>{message.user}: </strong> {message.text}
          </div>
        ))}
      </div>
      <div className="input-container" style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onKeyPress={handleKeyPress}
          onChange={handleChange}
          placeholder="Type a secret message..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
    </>
  );
}

const styles = {
  chatApp: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  chatBox: {
    border: '1px solid #ccc',
    padding: '20px',
    marginBottom: '20px',
    maxWidth: '500px',
    height: '300px',
    overflowY: 'scroll',
    backgroundColor: '#f9f9f9',
    margin: '0 auto',
    borderRadius: '10px',
  },
  message: {
    textAlign: 'left',
    marginBottom: '10px',
    background: '#58ff46',
    padding: '12px',
    borderRadius: '15px'
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50px'
  },
  input: {
    padding: '10px',
    width: '400px',
    border: '1px solid #ccc',
    borderRadius: '10px 0 0 10px',
    fontSize: '16px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#61dafb',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '0 10px 10px 0',
  },
  
};

export default App;
