import * as rrweb from "@yunyu/rrweb-patched";
import debounce from "lodash.debounce";

const port = chrome.runtime.connect({ name: "tab" });
let stopFn = null;

let queue = [];
const flush = () => {
  queue = [];
};
const debouncedFlush = debounce(flush, 50, {
  leading: true,
  maxWait: 100,
});

port.onMessage.addListener((msg) => {
  if (msg.action === "startRecording") {
    stopFn = rrweb.record({
      emit(event, isCheckout) {
        queue.push([event, isCheckout]);
        if (isCheckout !== undefined) {
          flush();
        } else {
          debouncedFlush();
        }
      },
      checkoutEveryNth: 100,
    });
  } else if (msg.action === "stopRecording") {
    console.log("Recording stopped");
    stopFn && stopFn();
  }
});
