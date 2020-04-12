# Manted

## Demo

[![](http://i3.ytimg.com/vi/TXcXdxd7H74/maxresdefault.jpg)](https://www.youtube.com/watch?v=TXcXdxd7H74)
https://www.youtube.com/watch?v=TXcXdxd7H74

Screen sharing quality can suck, especially for people on weaker connections. This is because most screen sharing implementations are encoding the screen as video frames, compressing them, sending them over the wire, and then decompressing them. This takes up a lot of additional latency (which must be traded off with quality), and lossy compression frequently makes things unreadable (this is particularly an issue with Tandem recently):

![](https://i.imgur.com/nOmcJSj.png)

What if instead of streaming video frames from the screen, we only streamed partial DOM updates from websites? That way, we can reproduce pixel-perfect versions of your active Chrome tab with extremely low latency and bandwidth consumption.

Welcome to Manted.

## Server repository

https://github.com/calderajs/manted-server

This contains the viewer frontend and the server.

## Libraries used

- A fork of rrweb (with fixes for live streaming event timing): https://github.com/yunyu/rrweb. We use this, in conjunction with some special snapshotting and replay code to make live sessions joinable instantly.
- Chrome extension boilerplate with React: https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate

# Building

- `yarn run start` to start, load unpacked chrome extension from manted/build
- `yarn run build` to build.

Unfortunately, I don't think we will be able to get this accepted by the Chrome Web Store in time, but we will be providing a zip file of the final version so you can try it out. The server has no validation whatsoever, so there's a good chance it'll crash under any load.
