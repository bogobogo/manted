import React, { useEffect, useState, useRef } from "react";
import icon from "../../img/icon-128.png";
import { hot } from "react-hot-loader";
import cuid from "cuid";

const HostView = ({ roomName, onStop }) => {
  return (
    <div>
      <div>Hosting {roomName}</div>
      <button class="error" style={{ width: "100%" }} onClick={onStop}>
        Stop sharing
      </button>
    </div>
  );
};

const App = () => {
  const socket = useRef(null);
  // undefined | { connected: boolean, hosting: boolean, roomName: string }
  const [room, updateRoom] = useState(undefined);
  const [roomCode, setRoomCode] = useState("");
  const setRoom = (room) => {
    console.log("setroom called");
    updateRoom(room);
    socket.current.postMessage(room);
  };

  useEffect(() => {
    console.log("connecting");
    socket.current = chrome.runtime.connect({ name: "popup" });
    socket.current.onMessage.addListener((msg) => {
      console.log("received msg from popup", msg);
      updateRoom(msg);
    });
  }, []);

  return room ? (
    <div style={{ padding: 24, width: "300px" }}>
      {room.status !== "DISCONNECTED" ? (
        room.status === "HOSTING" ? (
          <HostView
            roomName={room.roomName}
            onStop={() => {
              setRoom({ status: "DISCONNECTED" });
            }}
          />
        ) : (
          <div>{JSON.stringify(room)}</div>
        )
      ) : (
        <>
          <div
            style={{
              display: "flex",
              paddingBottom: "24px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <input
              value={roomCode}
              type="text"
              placeholder="Enter room code"
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button
              style={{ flexShrink: 0, margin: 0, marginLeft: 8 }}
              onClick={() =>
                window.open(
                  "http://localhost:8082/?roomName=" + roomCode,
                  "_blank"
                )
              }
            >
              Join
            </button>
          </div>
          <div style={{ paddingTop: "24px" }}>
            <button
              style={{ margin: 0, width: "100%" }}
              onClick={() => {
                setRoom({
                  status: "HOSTING",
                  roomName: cuid.slug(),
                });
              }}
            >
              Make Room
            </button>
          </div>
        </>
      )}
    </div>
  ) : null;
};

export default hot(module)(App);
