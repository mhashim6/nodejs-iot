const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');


const PORT = process.env.PORT || 9000;
const INDEX = path.join(__dirname, '/frontend/index.html');

const server = express()
.use(express.static(path.join(__dirname, "frontend")))
.use('/', (req, res) => {
    res.sendFile(INDEX)
}).listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new SocketServer({server});

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (msg) => {
        let data = JSON.parse(msg);

        switch (data.msgType) {
            case "auth":
                ws.userType = data.userType;
                ws.username = data.username;

                break;
            case "chat":
                wss.clients.forEach((c) => {
                    if (c.userType == 'user')
                        c.send(msg);
                });
                break;
            case "control":
                wss.clients.forEach((c) => {
                    if (c.userType == 'hw')
                        c.send(JSON.stringify({
                            msgType: data.msgType,
                            leds: msg.leds
                        }))
                });
                break;
        }
    });

    ws.on('close', () => console.log('Client disconnected'));
});
