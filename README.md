# Manted

Screen sharing quality can suck, especially for people on weaker connections. This is because most screen sharing implementations are encoding the screen as video frames, compressing them, sending them over the wire, and then decompressing them. This takes up a lot of additional latency (which must be traded off with quality), and lossy compression frequently makes things unreadable (this is particularly an issue with Tandem recently):

![](https://i.imgur.com/nOmcJSj.png)

What if instead of streaming video frames from the screen, we only streamed partial DOM updates from websites? That way, we can reproduce pixel-perfect versions of your active Chrome tab with extremely low latency and bandwidth consumption.

Welcome to Manted.

# Backend repository

https://github.com/calderajs/manted-server

# Libraries used

- A fork of rrweb (with fixes for live streaming event timing): https://github.com/yunyu/rrweb
- Chrome extension boilerplate with React: https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate
