import "../img/icon-128.png";
import "../img/icon-34.png";

/* 
type ConnectionState = {
    status: "HOSTING"
    roomName: string
} | { status: "DISCONNECTED" }
*/
let connectionState = { status: "DISCONNECTED" };
let ws = null;

/*
STRING { tabId?: number, windowId?: number }
*/

let currentActiveTab = "";
const getTabKey = (tabInfo) => [tabInfo.tabId, tabInfo.windowId].join(",");

chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([res]) => {
  if (res) {
    currentActiveTab = getTabKey({ tabId: res.id, windowId: res.windowId });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const newActiveTab = getTabKey(activeInfo);

  if (currentActiveTab !== newActiveTab) {
    const portForCurrentActiveTab = portsForTabs.get(currentActiveTab);
    if (portForCurrentActiveTab) {
      portForCurrentActiveTab.postMessage({ action: "stopRecording" });
    }

    currentActiveTab = newActiveTab;

    const portForNewActiveTab = portsForTabs.get(newActiveTab);
    if (portForNewActiveTab && connectionState.status === "HOSTING") {
      portForNewActiveTab.postMessage({ action: "startRecording" });
    }
  }
});

const portsForTabs = new Map();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    port.postMessage(connectionState);
    port.onMessage.addListener((newConnectionState) => {
      connectionState = newConnectionState;

      // Always assume there is port for active tab
      const portForActiveTab = portsForTabs.get(currentActiveTab);
      if (portForActiveTab) {
        if (newConnectionState.status === "HOSTING") {
          ws = new WebSocket("ws://localhost:8082");
          console.log("ws init");
          ws.addEventListener("open", () => {
            ws.send(
              JSON.stringify({
                type: "makeRoom",
                roomName: newConnectionState.roomName,
              })
            );
            portForActiveTab.postMessage({ action: "startRecording" });
          });

          ws.addEventListener("message", (msg) => {
            console.log(msg);
            const { type, ...message } = JSON.parse(msg.data);
            if (type === "viewerCount") {
              console.log("vc", message.value);
              port.postMessage({ type, value: message.value });
              chrome.browserAction.setBadgeText({ text: "" + message.value });
            }
          });
        } else {
          portForActiveTab.postMessage({ action: "stopRecording" });
          ws && ws.close();
          ws = null;
        }
      }
    });
  } else if (port.name === "tab") {
    const tabInfo = getTabKey({
      tabId: port.sender.tab.id,
      windowId: port.sender.tab.windowId,
    });
    portsForTabs.set(tabInfo, port);

    port.onMessage.addListener((frames) => {
      if (tabInfo === currentActiveTab && ws) {
        ws.send(JSON.stringify({ type: "frames", frames }));
      }
    });
    port.onDisconnect.addListener(() => portsForTabs.delete(tabInfo));

    console.log("Content script connect", tabInfo, currentActiveTab);

    if (tabInfo === currentActiveTab) {
      if (connectionState.status === "HOSTING") {
        port.postMessage({ action: "startRecording" });
      }
    }
  }
});
