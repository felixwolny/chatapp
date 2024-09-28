import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import './style.css';

const thisusernumber = (Math.floor(Math.random() * (100 - 1 + 1)) + 1);

function App() {
  const [inRoom, setInRoom] = useState(false);  // Track if user is in a room
  const [currentRoom, setCurrentRoom] = useState(null); // Track the current room
  const [rooms, setRooms] = useState([]);       // Store list of rooms
  const [messages, setMessages] = useState([]);  // Store messages in the current room
  const [input, setInput] = useState('');        // Message input
  const [newRoomName, setNewRoomName] = useState(''); // New room name
  const [newRoomPassword, setNewRoomPassword] = useState(''); // New room password
  const [importance, setImportance] = useState('none'); // Room importance

  // Fetch rooms from Firestore
  useEffect(() => {
    const q = query(collection(db, 'rooms'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  // Fetch messages when user enters a room
  useEffect(() => {
    if (currentRoom) {
      const q = query(collection(db, `rooms/${currentRoom.id}/messages`), orderBy('timestamp'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });
      return () => unsubscribe();
    }
  }, [currentRoom]);

  // Create a new room
  const handleCreateRoom = async () => {
    if (newRoomName.trim()) {
      await addDoc(collection(db, 'rooms'), {
        name: newRoomName,
        password: newRoomPassword || null,
        importance: importance,
      });
      setNewRoomName('');
      setNewRoomPassword('');
      setImportance('none');
    }
  };

  // Enter a room
  const handleEnterRoom = (room) => {
    if (room.password) {
      const enteredPassword = prompt("Enter room password:");
      if (enteredPassword !== room.password) {
        alert("Wrong password!");
        return;
      }
    }
    setInRoom(true);
    setCurrentRoom(room);
  };

  // Handle message input change
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  // Send a message
  const handleSendMessage = async () => {
    if (input.trim()) {
      await addDoc(collection(db, `rooms/${currentRoom.id}/messages`), {
        text: input,
        user: 'User ' + thisusernumber.toString(),
        timestamp: new Date(),
      });
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-app">
      {/* Room Selection */}
      <div className="opening" style={inRoom ? { display: 'none' } : { display: 'initial' }}>
        <h1>Choose a room or create one</h1>
        <div className="room-list">
          {rooms.map((room) => (
            <div key={room.id} className="room-item">
              <span>{room.name} (Importance: {room.importance})</span>
              <button onClick={() => handleEnterRoom(room)}>Join</button>
            </div>
          ))}
        </div>
        <h2>Create a new room</h2>
        <div className='roomcreation'>
     
          <input
            type="text"
            placeholder="Room Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (optional)"
            value={newRoomPassword}
            onChange={(e) => setNewRoomPassword(e.target.value)}
          />
          <select value={importance} onChange={(e) => setImportance(e.target.value)}>
            <option value="none">None</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>
          <button onClick={handleCreateRoom}>Create Room</button>
        </div>
      </div>




      {/* Chat Interface */}
      <div className="chatinterface" style={inRoom ? { display: 'initial' } : { display: 'none' }}>
        <h1>Chat in Room: {currentRoom?.name}</h1>
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
    </div>
  );
}

const styles = {
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
