import React from "react";
import ReactPlayer from "react-player";

const Player = (props) => (

    <div className="player-wrapper">
        <ReactPlayer
            url={props.url}
            className="react-player"
            width="100%"
            height="100%"
            playing={props.playing}
            controls={props.controls}
        />
    </div>
);

export default Player;
