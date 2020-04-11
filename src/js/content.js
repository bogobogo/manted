import * as rrweb from "@yunyu/rrweb-patched";

console.log("hello 3");
console.log(rrweb);

const port = chrome.runtime.connect({ name: "tab" });
port.onMessage.addListener((msg) => console.log(msg));
