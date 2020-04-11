import React, { useEffect, useState } from "react";
import icon from "../../img/icon-128.png";
import { hot } from "react-hot-loader";

const GreetingComponent = () => {
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
    <div>
      {recv.map((msg) => (
        <p>{msg}</p>
      ))}
    </div>
  );
};

export default hot(module)(GreetingComponent);
