import React from 'react'

function PlayerButton (props) {
    
    return (
        <button className="player-button" id={props.playerName} onClick={() => props.onClick(props.playerName, props.song)}> {props.playerName}</button>
    )
}
export default PlayerButton;
