import * as rrweb from "@yunyu/rrweb-patched";
import debounce from "lodash.debounce";

const port = chrome.runtime.connect({ name: "tab" });
let stopFn = null;

let queue = [];
const debouncedFlush = debounce(
  () => {
    console.log(queue);
    queue = [];
  },
  40,
  {
    leading: true,
    maxWait: 60,
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
