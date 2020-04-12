import * as rrweb from "@yunyu/rrweb-patched";
import debounce from "lodash.debounce";

const port = chrome.runtime.connect({ name: "tab" });
let stopFn = null;

let queue = [];
const debouncedFlush = debounce(
  () => {
    port.postMessage(queue);
    console.log(queue.some(([, isCheckout]) => isCheckout));
    queue = [];
  },
  40,
  {
    leading: true,
    maxWait: 60,
  }
);

let queueImmediateFlush = false;

port.onMessage.addListener((msg) => {
  console.log("Received action ", msg.action);
  if (msg.action === "startRecording") {
    stopFn = rrweb.record({
      emit(event, isCheckout) {
        queue.push([event, isCheckout !== undefined]);
        debouncedFlush();
        if (isCheckout !== undefined) {
          queueImmediateFlush = true;
        }
        if (queueImmediateFlush) {
          queueImmediateFlush = false;
          debouncedFlush.flush();
        }
      },
      checkoutEveryNth: 200,
    });
  } else if (msg.action === "stopRecording") {
    stopFn && stopFn();
  }
});
