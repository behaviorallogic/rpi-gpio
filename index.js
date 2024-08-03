/*jslint node: true, sloppy: true, bitwise: true, nomen: true */
const { networkInterfaces } = require('os');
const Gpio = require('pigpio').Gpio;
const fs = require('fs');
const http = require('http');

const server = http.createServer(function (req, rsp) {
    rsp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    fs.createReadStream(__dirname + '/index.html').pipe(rsp);
});
const WebSocketServer = require('websocket').server;
const port = 3792;

const pins = {
    "3": {"gpio": 2, "connection": null, "on": 0},
    "5": {"gpio": 3, "connection": null, "on": 0},
    "7": {"gpio": 4, "connection": null, "on": 0},
    "8": {"gpio": 14, "connection": null, "on": 0},
    "10": {"gpio": 15, "connection": null, "on": 0},
    "11": {"gpio": 17, "connection": null, "on": 0},
    "12": {"gpio": 18, "connection": null, "on": 0},
    "13": {"gpio": 27, "connection": null, "on": 0},
    "15": {"gpio": 22, "connection": null, "on": 0},
    "16": {"gpio": 23, "connection": null, "on": 0},
    "18": {"gpio": 24, "connection": null, "on": 0},
    "19": {"gpio": 10, "connection": null, "on": 0},
    "21": {"gpio": 9, "connection": null, "on": 0},
    "22": {"gpio": 25, "connection": null, "on": 0},
    "23": {"gpio": 11, "connection": null, "on": 0},
    "24": {"gpio": 8, "connection": null, "on": 0},
    "26": {"gpio": 7, "connection": null, "on": 0},
    "29": {"gpio": 5, "connection": null, "on": 0},
    "31": {"gpio": 6, "connection": null, "on": 0},
    "32": {"gpio": 12, "connection": null, "on": 0},
    "33": {"gpio": 13, "connection": null, "on": 0},
    "35": {"gpio": 19, "connection": null, "on": 0},
    "36": {"gpio": 16, "connection": null, "on": 0},
    "37": {"gpio": 26, "connection": null, "on": 0},
    "38": {"gpio": 20, "connection": null, "on": 0},
    "40": {"gpio": 21, "connection": null, "on": 0}
};

const socketServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

server.listen(port, function () {
    console.log(`Connected to GPIO tool at http://${getIP()}:${port}`);
});

socketServer.on('connect', function(connection) {
    console.log('GPIO tool client connected');
});

function toggleOutputPin(pinid) {
    var pin = pins[pinid], digWrite = 0;

    if (!pin.connection) {
        try {
            pin.connection = new Gpio(pin.gpio, {mode: Gpio.OUTPUT});
        } catch(e) {
            console.log("GPIO not installed");
            return;
        }
    }
    if (!pin.on) {
        digWrite = 1;
    }
    pin.on = digWrite;
    pin.connection.digitalWrite(digWrite);
}

socketServer.on('request', function(req) {
    var conn = req.accept("", req.origin);
    conn.sendUTF("powerOn");

    conn.on('message', function(msg) {
        console.log("Received Message: " + msg.utf8Data);
        toggleOutputPin(msg.utf8Data);
    });
});

function getIP() {
    // From https://stackoverflow.com/a/8440736/468111
    const nets = networkInterfaces();
    const ips = [];
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                ips.push(net.address);
            }
        }
    }
    return ips[0];
}