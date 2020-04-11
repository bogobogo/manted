import React, { useEffect, useState } from "react";
import icon from "../../img/icon-128.png";
import { hot } from "react-hot-loader";

const App = () => {
  const [recv, setRecv] = useState([]);

  useEffect(() => {
    const listener = (request, sender, sendResponse) => {
      if (request.msg === "something_completed") {
        //  To do something
        setRecv((recv) => [...recv, request.data.content]);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return (
    <div style={{ padding: 24 }}>
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
        <button style={{ margin: 0, width: "100%" }}>Make Room</button>
      </div>
    </div>
  );
};

export default hot(module)(App);