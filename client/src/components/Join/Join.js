import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeRoom = (e) => {
    setRoom(e.target.value);
  };

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={onChangeName}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="joinInput mt-20"
            type="text"
            onChange={onChangeRoom}
          />
        </div>
        {/* Query strings used to pass data through URL/parameters
        Will vbe able to read name and room in chat component
        onCLick event will prevent user from entering a room without filling in name and room inputs */}
        <Link
          onClick={(event) => (!name || !room ? event.preventDefault() : null)}
          to={`/chat?name=${name}&room=${room}`}
        >
          <button className="button mt-20" type="submit">
            Sign in
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
