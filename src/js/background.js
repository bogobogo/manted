import "../img/icon-128.png";
import "../img/icon-34.png";

/* 
type ConnectionState = {
    status: "HOSTING" | "VIEWING"
    roomName: string
} | { status: "DISCONNECTED" }
*/
let connectionState = { status: "DISCONNECTED" };

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    port.postMessage(connectionState);
    port.onMessage.addListener((newConnectionState) => {
      connectionState = newConnectionState;
    });
  }
});
