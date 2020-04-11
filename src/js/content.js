import * as rrweb from "@yunyu/rrweb-patched";

const port = chrome.runtime.connect({ name: "tab" });
port.onMessage.addListener((msg) => {
  if (msg.action === "startRecording") {
    let i = 0;
    rrweb.record({
      emit(event, isCheckout) {
        console.log(event, isCheckout, i++);
      },
      checkoutEveryNth: 100,
    });
  }
});
