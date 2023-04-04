const { WebSocketServer } = require('ws');
const fs = require('fs');


const wss = new WebSocketServer({ port: 8080 });
var base = [];
var numberOfClients = 0;
var memeReceived = [];
var numberMemeReceived = 0;
var new_game = true;
var playersReady = 0;
const skipBaseLimits = {};
const ready = {};
var clientID;
var countVote = {};



//countdowns
var lobbyCountdown = 3;
var gameCountdown = 30;
var voteCountdown = 10;

var skipNumber = 50;


wss.on('connection', function connection(ws) {
    let clientID = ws._socket.remotePort;
    ready[clientID] = false;
    memeReceived[clientID] = false;
    if (ready[clientID] === false) {
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
                        sendWss("NUMBER_PLAYERS_READY", playersReady);
                    }

                    if (playersReady === numberOfClients) {
                        initCountdown("GAME_STARTS_IN", lobbyCountdown);
                        //run sendRandomBase after 25 seconds
                        setTimeout(() => {
                            sendRandomBase(wss);
                        }, lobbyCountdown * 1000);
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
                        sendWss("NUMBER_PLAYERS_READY", playersReady);
                    }
                    break;
                case "SKIP_BASE":
                    if (playersReady === numberOfClients) {
                        const clientID = ws._socket.remotePort;
                        console.log("Client " + clientID + " skipped base")
                        if (!skipBaseLimits[clientID] && skipBaseLimits[clientID] !== 0) {
                            skipBaseLimits[clientID] = skipNumber;
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
                    console.log("Meme done")
                    clientID = ws._socket.remotePort;
                    if (memeReceived[clientID] === false) {
                        console.log("Meme received from client " + clientID)
                        memeReceived[clientID] = true;
                        numberMemeReceived++;
                        let readData = fs.readFileSync('./receivedMeme.json', 'utf8');
                        readData = JSON.parse(readData);
                        dataParsed.payload = addClientID(clientID, dataParsed.payload);
                        readData.push(dataParsed.payload);
                        storeMeme(readData);
                        console.log("meme received nummber: " + numberMemeReceived + " / " + numberOfClients + "")
                        if (numberMemeReceived === numberOfClients) {
                            console.log("All meme received")
                            voteMeme();
                        }
                    }
                    break;
                case "UPVOTE":
                    if (!countVote[dataParsed.payload.clientID]){
                        countVote[dataParsed.payload.clientID] = 0;
                    }
                    countVote[dataParsed.payload.clientID] += 1;
                    console.log("countVote", countVote)
                    break;
                case "DOWNVOTE":
                    if (!countVote[dataParsed.payload.clientID]){
                        countVote[dataParsed.payload.clientID] = 0;
                    }
                    countVote[dataParsed.payload.clientID] -= 1;
                    console.log("countVote", countVote)
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
        sendWss("NUMBER_PLAYERS_READY", playersReady);
    });
});


function addClientID(clientID, payload) {
    payload.clientID = clientID;
    return payload;
}

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
        console.log("obj", obj)
        client.send(JSON.stringify(obj));
        initCountdown("COUNTDOWN", gameCountdown);
    });
}

function initCountdown(text, time) {
    let counter = time;
    const intervalId = setInterval(() => {
        counter--;
        sendWss(text, counter);
        if (counter === 0) {
            clearInterval(intervalId);
        }
    }, 1000);
}

function voteMeme() {
    console.log("Voting meme")
    let readData = fs.readFileSync('./receivedMeme.json', 'utf8');
    readData = JSON.parse(readData);
    let i = 0;
    sendWss("VOTE", readData[i]);
    initCountdown("COUNTDOWN", voteCountdown);
    i++;
    const intervalId = setInterval(() => {
        initCountdown("COUNTDOWN", voteCountdown);
        sendWss("VOTE", readData[i]);
        i++;
        if (i === readData.length) {
            clearInterval(intervalId);
        }
    }, 11000);
    setTimeout(() => {
        let data = [];
        data = calculateScore(readData);
        data.sort((a,b) => b.score - a.score)
        console.log("data", data)
        sendWss("SCORE", data );
    }, 11000 * (readData.length));

numberMemeReceived = 0;
memeReceived = [];
cleanReceivedMeme();
}

function calculateScore(readData) {
    let newData = [];
    newData = readData;
    for (let i = 0; i < newData.length; i++) {
        Object.keys(countVote).forEach(function(key, index) {
            console.log(key, countVote[key]);
            console.log(newData[i].clientID)
            if (parseInt(key) === newData[i].clientID) {
                newData[i].score = countVote[key];
            }
            console.log("newData", newData)
          });
    }
    return newData;
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