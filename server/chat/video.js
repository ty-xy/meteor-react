// 使用Google的stun服务器
// const iceServer = {
//     iceServers: [{
//         url: 'stun:stun.l.google.com:19302',
//     }],
// };
// 兼容浏览器的PeerConnection写法
// const PeerConnection = (window.PeerConnection ||
//                     window.webkitPeerConnection00 ||
//                     window.webkitRTCPeerConnection ||
//                     window.mozRTCPeerConnection);
// 与后台服务器的WebSocket连接
// let server = new WebSocketServer();
// 创建PeerConnection实例
// const pc = new PeerConnection(iceServer);
// const WebSocket = require('ws');

// const ws = new WebSocket('ws://192.168.1.128:3000/websocket');

// ws.on('open', () => {
//     console.log('connected');
//     ws.send(Date.now());
// });

// ws.on('message', msg => console.log(msg));
