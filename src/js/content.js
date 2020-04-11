import * as rrweb from "@yunyu/rrweb-patched";

const port = chrome.runtime.connect({ name: "tab" });
port.onMessage.addListener((msg) => {
  let stopFn = null;

  if (msg.action === "startRecording") {
    let i = 0;
    stopFn = rrweb.record({
      emit(event, isCheckout) {
        console.log(event, isCheckout, i++);
      },
      checkoutEveryNth: 100,
    });
  } else if (msg.action === "stopRecording") {
    console.log("Recording stopped");
    stopFn && stopFn();
  }
});
