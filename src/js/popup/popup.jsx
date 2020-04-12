import React, { useEffect, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import cuid from "cuid";

const ToolTip = ({ text }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        borderRadius: "4px",
        background: "#555555",
        color: "white",
        padding: "2px 4px",
        fontSize: "12px",
      }}
    >
      {text}
    </div>
  );
};

const HostView = ({ roomName, onStop }) => {
  const [toolTip, setToolTip] = useState("");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {toolTip != "" ? <ToolTip text={toolTip} /> : <></>}
      <div
        onMouseEnter={() => {
          setToolTip("click to copy");
        }}
        onMouseLeave={() => {
          setToolTip("");
        }}
        onClick={() => {
          navigator.clipboard.writeText(roomName);
          setToolTip("copied!");
        }}
        style={{
          display: "flex",
          marginTop: "16px",
          marginBottom: "24px",
          cursor: "pointer",
        }}
      >
        <span style={{ paddingRight: "6px" }}>Meeting Code:</span>
        <span style={{ fontWeight: "bold" }}>{roomName}</span>
      </div>

      <button
        class="error"
        style={{ width: "100%", marginTop: "6px" }}
        onClick={onStop}
      >
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
    socket.current.onMessage.addListener((msg) => updateRoom(msg));
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
              onClick={() => {
                if (roomCode != "") {
                  window.open(
                    "http://localhost:8082/?roomName=" + roomCode,
                    "_blank"
                  );
                }
              }}
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
