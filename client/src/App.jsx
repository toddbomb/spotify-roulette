import { useEffect, useState } from 'react';
import './App.css'
import { io } from 'socket.io-client';
import Login from './components/Login';
import Game from './components/Game';

const socket = io('http://localhost:8888/');


function App() {
  const [users, setUsers] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const handleLogin = () => {
    // set isLoggedIn to true upon successful login
    setIsLoggedIn(true);
  };

  async function fetchUsers() {
    try {
      const response = await fetch('http://localhost:8888/users');
      const data = await response.json();
      setUsers(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUsers();
    // Listen for 'usersUpdated' event from the backend
    socket.on('usersUpdated', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      // Clean up the event listener when component unmounts
      socket.off('usersUpdated');
    };
  }, []);

  return (
    <>
      <div className='content-wrapper'>
        {isLoggedIn ? <Game users={users}></Game>: <Login users={users} onLogin={handleLogin}></Login>}
      </div>

      <div>
        <footer>
          Made by Tushar Aggarwal
        </footer>
      </div>
    </>
  )
}

export default App
