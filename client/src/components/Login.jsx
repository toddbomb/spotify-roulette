import React from 'react';

function Login(props) {
  const handleLoginClick = () => {
    // Trigger Spotify authentication flow or redirect to the backend route for Spotify authentication
    window.location.href = 'http://localhost:8888/login';
  };

  return (
    <>
      <div>
        <h1 className='game-title'>Spotify Roulette!</h1>
        <p className='subtitle'>Ever played Photo Roulette? This game is like that, except with Spotify liked songs. Find out which of your friends has the best or worst music tastes...</p>
      </div>

      <div className='button-container'>
        <button onClick={handleLoginClick}>Login with Spotify</button>
        <button onClick={() => props.onLogin()}>Click me once you've logged in and are ready to play.</button>
      </div>

      <div className='users-container'>
        <h3>Logged in users:</h3>
        <ul className='user-list'>
          {props.users ?         
            props.users.map((user) => {
              return (
                <li className='username' key={user.username}>{user.username}</li>
              )
            })
          : ""}
        </ul>
      </div>
    </>
  );
}

export default Login;
