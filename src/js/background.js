import "../img/icon-128.png";
import "../img/icon-34.png";

window.setInterval(() => {
  console.log("sending");
  chrome.runtime.sendMessage({
    msg: "something_completed",
    data: {
      subject: "Loading",
      content: "Just completed!",
    },
  });
}, 5000);
