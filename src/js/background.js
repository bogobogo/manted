import "../img/icon-128.png";
import "../img/icon-34.png";

/* 
type ConnectionState = {
    status: "HOSTING" | "VIEWING"
    roomName: string
} | { status: "DISCONNECTED" }
*/
let connectionState = { status: "DISCONNECTED" };

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
  currentActiveTab = getTabKey(activeInfo);
});

const portsForTabs = new Map();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    port.postMessage(connectionState);
    port.onMessage.addListener((newConnectionState) => {
      connectionState = newConnectionState;

      if (newConnectionState.status === "HOSTING") {
        port.postMessage({ type: "startRecording" });
      }
    });
  } else if (port.name === "tab") {
    const tabInfo = getTabKey({
      tabId: port.sender.tab.id,
      windowId: port.sender.tab.windowId,
    });
    portsForTabs.set(tabInfo, port);
    port.onDisconnect.addListener(() => portsForTabs.delete(tabInfo));

    if (tabInfo === currentActiveTab) {
      if (connectionState.status === "HOSTING") {
        port.postMessage({ type: "startRecording" });
      }
    }
  }
});
