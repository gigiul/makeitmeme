const { WebSocketServer } = require('ws');
const fs = require('fs');


const wss = new WebSocketServer({ port: 8080 });
var base = [];
var numberOfClients = 0;
var memeReceived = 0;
var new_game = true;
var playersReady = 0;
const skipBaseLimits = {};
const ready = {};
var clientID;


wss.on('connection', function connection(ws) {
    clientID = ws._socket.remotePort;
    ready[clientID] = false;
    if (ready[clientID] === undefined) {
        numberOfClients++;
    }
    //send a random base to client
    console.log("Ready: " + playersReady + " / " + numberOfClients);

    ws.on('message', function message(data) {

        numberOfClients = wss.clients.size;

        try {
            dataParsed = JSON.parse(data);
            switch (dataParsed.type) {
                case "READY":
                    clientID = ws._socket.remotePort;
                    if (!ready[clientID]) {
                        ready[clientID] = true;
                        playersReady++;
                    }
                    if (ready[clientID]) {
                        console.log("Ready: " + playersReady + " / " + numberOfClients);
                    }
                    
                    if (playersReady === numberOfClients) {
                        sendRandomBase(wss);
                    }
                    break;
                case "NOT_READY":
                    clientID = ws._socket.remotePort;
                    if (ready[clientID]) {
                        ready[clientID] = false;
                        playersReady--;
                    }
                    if (!ready[clientID]) {
                        console.log("Ready: " + playersReady + " / " + numberOfClients);
                    }
                    break;
                case "SKIP_BASE":
                    if (playersReady === numberOfClients) {
                        const clientID = ws._socket.remotePort;
                        console.log("Client " + clientID + " skipped base")
                        if (!skipBaseLimits[clientID] && skipBaseLimits[clientID] !== 0) {
                            skipBaseLimits[clientID] = 3;
                        }
                        if (skipBaseLimits[clientID] > 0) {
                            console.log(skipBaseLimits[clientID])
                            skipBaseLimits[clientID]--;
                            sendSingleClient(ws, "SKIP_LEFT", "You have " + skipBaseLimits[clientID] + " skips left");
                            skipBase(ws);
                        } else {
                            sendSingleClient(ws, "SKIP_LIMIT", "You have reached the limit of skips");
                        }
                    }
                    break;
                case "MEME_DONE":
                    memeReceived++;
                    let readData = fs.readFileSync('./receivedMeme.json', 'utf8');
                    console.log(dataParsed.payload)
                    readData = JSON.parse(readData);
                    readData.push(dataParsed.payload);
                    storeMeme(readData);
                    if (memeReceived === numberOfClients) {
                        voteMeme();
                    }
                    break;
                case "UPVOTE":
                    break;
                case "DOWNVOTE":
                    break;
                default:
                    console.log("Unknown message type");
            }
        } catch (e) {
            console.error(e);
        }
    });

    ws.on('error', console.error);

    ws.on('close', function close() {
        console.log('disconnected');
        numberOfClients = wss.clients.size;
        if (playersReady > 0) {
            playersReady--;
        }
        console.log("Ready: " + playersReady + " / " + numberOfClients);
    });
});

function skipBase(ws) {
    //send a random base to single client
    let parsedBase = JSON.parse(base);
    let randomBase = parsedBase[Math.floor(Math.random() * parsedBase.length)];
    let obj = {};
    obj.type = "SKIP_BASE";
    obj.payload = randomBase;
    ws.send(JSON.stringify(obj));
}

function sendRandomBase(wss) {
    let parsedBase = JSON.parse(base);
    wss.clients.forEach(function each(client) {
        let randomBase = parsedBase[Math.floor(Math.random() * parsedBase.length)];
        let obj = {};
        obj.type = "START_GAME";
        obj.payload = randomBase;
        client.send(JSON.stringify(obj));
        initCountdown();
    });
}

function initCountdown() {
    let counter = 10;
    const intervalId = setInterval(() => {
      counter--;
    sendWss("COUNTDOWN", counter);
      if (counter === 0) {
        clearInterval(intervalId);
      }
    }, 1000);
}

function voteMeme() {
    let readData = fs.readFileSync('./receivedMeme.json', 'utf8');
    sendWss("VOTE", readData);
    memeReceived = 0;
/*     cleanReceivedMeme();
 */
}

function cleanReceivedMeme() {
    fs.writeFileSync('./receivedMeme.json', "[]", err => {
        if (err) {
            console.error(err);
        }
    });
}

fs.readFile('./base.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    base = data;
    return;
});


function storeMeme(content) {
    let stringToStore = JSON.stringify(content);
    fs.writeFileSync('./receivedMeme.json', stringToStore, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}


////////////// UTILITY //////////////////////

wss.broadcast = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};

function sendWss(type, data) {
    let obj = {};
    obj.type = type;
    obj.payload = data;
    wss.broadcast(JSON.stringify(obj));
}

function sendSingleClient(ws, type, data) {
    let obj = {};
    obj.type = type;
    obj.payload = data;
    ws.send(JSON.stringify(obj));
}