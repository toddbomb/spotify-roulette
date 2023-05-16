import React, { useEffect, useState, useRef } from 'react';
import PlayerButton from './PlayerButton';

function Game(props) {
  const [song, setSong] = useState(null);
  const isFirstRender = useRef(true);
  const [score, setScore] = useState(0);

  async function fetchRandomSong() {
    if (!isFirstRender.current) return;

    try {
      const response = await fetch('http://localhost:8888/get-random');
      const data = await response.json();
      console.log(data);
      setSong(data);

    } catch (error) {
      console.log(error);
    }
  }

  const handlePlayerGuess = (playerName, song) => {
    var buttons = document.getElementsByClassName('player-button');

    if (playerName === song.user) {
      document.getElementById(playerName).style.backgroundColor = 'green';
      document.getElementById('score-text').innerText = "Nice job, you guessed right!"
      setScore((prev) => prev + 1);
    }
    else {
      document.getElementById(playerName).style.backgroundColor = 'red';
      document.getElementById('score-text').innerText = "You are wrong."
    }
    
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  
  }

  const handleNewRound = () => {
    var buttons = document.getElementsByClassName('player-button');
    for(let i = 0; i < buttons.length; i++) {
      buttons[i].style.backgroundColor = 'white';
      buttons[i].disabled = false;
    }
    document.getElementById('score-text').innerHTML = '';
    isFirstRender.current = true;
    fetchRandomSong()
  }

  useEffect(() => {
    fetchRandomSong();
    isFirstRender.current = false;
  }, []);

  return (
    <>
      <div>
        <p id='score-count'> Score: {score}</p>
      </div>
      <div className="spotify">
      {song ? <iframe 
        id='embed-song'
        src={`https://open.spotify.com/embed/track/${song.id}?utm_source=generator`}
        />: <h2></h2>}
      </div>

      <div className='player-button-container'>
        {props.users ? 
          props.users.map((user) => {
            return (
            <PlayerButton key={user.username} playerName={user.username} song={song} onClick={handlePlayerGuess}/>
            )
          })
        : ""}
      </div>

      <div className='new-round-container'>
      <button className='new-round-button' onClick={handleNewRound}> Click me to get a new song!</button>
      </div>

      <div>
        <p id='score-text'></p>
      </div>
    </>
    
  );
}

export default Game;