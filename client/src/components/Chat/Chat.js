import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// this helps us retrieve data from the url
import queryString from "query-string";

import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

import "./Chat.css";

// declare empty variable
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    // useEffect runs when the components renders
    // retrieve the DATA that users have entered when they joined the room
    // location comes from react router
    // location.search gives us back a url/paramters
    // pass in the array the only changes, ENDPOINT and location.search,
    // that will allow the page to reload
    const { name, room } = queryString.parse(location.search);

    // pass in an endpoint which is our server when a connection is made
    socket = io(ENDPOINT, {
      transports: ["websocket", "polling", "flashsocket"],
    });

    // states
    setName(name);
    setRoom(room);

    // this will emit events
    // pass in a string, "join", that the backend will recognize
    // callback function will initiate the callback function on the backend
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    // this return function will unmount/disconnect
    return () => {
      // emitting a disconnect event
      // the naming has to match on both sides
      socket.emit("disconnection");
      // this will turn off the single instance of a socket
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  // this useEffect will handle messages
  useEffect(() => {
    // collab with socket.emit on backend
    // deals with automated messages by admin when user enters room
    socket.on("message", (message) => {
      // this is adding any message by admin/user to messages array
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);

  // function for sending messages
  const sendMessage = (e) => {
    // prevents a browser refresh with a key press or click
    e.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }

    console.log(message, messages);
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
