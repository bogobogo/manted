import * as rrweb from "@yunyu/rrweb-patched";
import debounce from "lodash.debounce";

const port = chrome.runtime.connect({ name: "tab" });
let stopFn = null;

let queue = [];
const debouncedFlush = debounce(
  () => {
    queue = [];
  },
  50,
  {
    leading: true,
    maxWait: 100,
  }
);

port.onMessage.addListener((msg) => {
  console.log("Received action ", msg.action);
  if (msg.action === "startRecording") {
    stopFn = rrweb.record({
      emit(event, isCheckout) {
        queue.push([event, isCheckout]);
        debouncedFlush();
        if (isCheckout !== undefined) {
          debouncedFlush.flush();
        }
      },
      checkoutEveryNth: 100,
    });
  } else if (msg.action === "stopRecording") {
    stopFn && stopFn();
  }
});
