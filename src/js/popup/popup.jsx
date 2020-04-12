import React, { useEffect, useState, useRef } from "react";
import icon from "../../img/icon-128.png";
import { hot } from "react-hot-loader";
import cuid from "cuid";

const HostView = ({ roomName, onStop }) => {
  const [showCopied, setShowCopied] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", margin: "12px 12px 0px 12px" }}>
        <span style={{ paddingRight: "6px" }}>Hosting</span>
        <span
          style={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => {
            navigator.clipboard.writeText(roomName);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 1500);
          }}
        >
          {roomName}
        </span>
      </div>
      <div
        style={
          showCopied
            ? {
                transition: "opacity .4s",
                opacity: ".8",
              }
            : { transition: "opacity .4s", opacity: "0" }
        }
      >
        copied!
      </div>
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
