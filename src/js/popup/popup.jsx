import React, { useEffect, useState } from "react";
import icon from "../../img/icon-128.png";
import { hot } from "react-hot-loader";
import cuid from "cuid";

const HostView = ({ roomName }) => {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8082");

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "makeRoom", roomName }));
    });

    return () => ws.close();
  }, []);

  return <div>Hosting {roomName}</div>;
};

const App = () => {
  // undefined | { connected: boolean, hosting: boolean, roomName: string }
  const [room, setRoom] = useState(undefined);
  const writeRoom = (room) => chrome.storage.local.set({ currentRoom: room });

  useEffect(() => {
    chrome.storage.local.get(["currentRoom"], (result) => {
      console.log("get result", result);
      if (result.currentRoom) {
        setRoom(result.currentRoom);
      } else {
        setRoom({ connected: false });
      }
    });

    const listener = (request, sender, sendResponse) => {
      if (request.msg === "something_completed") {
        //  To do something
        setRecv((recv) => [...recv, request.data.content]);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return room ? (
    <div style={{ padding: 24 }}>
      {room.connected ? (
        room.hosting ? (
          <HostView roomName={room.roomName} />
        ) : (
          <h1>askdhjkoashdas</h1>
        )
      ) : (
        <>
          <div
            style={{
              display: "flex",
              width: "300px",
              paddingBottom: "24px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <input type="text" placeholder="Enter room code" />
            <button style={{ flexShrink: 0, margin: 0, marginLeft: 8 }}>
              Join
            </button>
          </div>
          <div style={{ paddingTop: "24px" }}>
            <button
              style={{ margin: 0, width: "100%" }}
              onClick={() => {
                const hostingRoom = {
                  connected: true,
                  hosting: true,
                  roomName: cuid.slug(),
                };
                setRoom(hostingRoom);
                writeRoom(hostingRoom);
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
