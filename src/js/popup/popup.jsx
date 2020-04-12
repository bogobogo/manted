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

const HostView = ({ roomName, onStop, viewerCount }) => {
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
          margin: "12px 12px 6px 12px",
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
      <div>{viewerCount} connected</div>
    </div>
  );
};

const App = () => {
  const socket = useRef(null);
  // undefined | { connected: boolean, hosting: boolean, roomName: string }
  const [room, updateRoom] = useState(undefined);
  const [roomCode, setRoomCode] = useState("");
  const [viewerCount, setViewerCount] = useState(0);

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

      if (msg.type === "viewerCount") {
        setViewerCount(msg.value);
      } else {
        updateRoom(msg);
      }
    });
  }, []);

  return room ? (
    <div style={{ padding: 24, width: "300px" }}>
      {room.status !== "DISCONNECTED" ? (
        room.status === "HOSTING" ? (
          <HostView
            roomName={room.roomName}
            viewerCount={viewerCount}
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
