const { WebSocketServer } = require('ws');
const fs = require('fs');


const wss = new WebSocketServer({ port: 8080 });
var base = [];
var numberOfClients = 0;
var memeReceived = 0;


wss.on('connection', function connection(ws) {
    numberOfClients++;
    //send base to client
    sendWss("BASE", base);

    ws.on('message', function message(data) {
        
        numberOfClients = wss.clients.size;
        try {
            dataParsed = JSON.parse(data);
            switch (dataParsed.type) {
                case "MEME_DONE":
                    memeReceived++;
                    let readData = fs.readFileSync('./receivedMeme.json', 'utf8');
                    readData = JSON.parse(readData);
                    readData.push(dataParsed.payload);
                    storeMeme(readData);
                    console.log("Meme received from client " + memeReceived);
                    console.log("Number of clients: " + numberOfClients);
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
});


function voteMeme() {
    let readData = fs.readFileSync('./receivedMeme.json', 'utf8');
    sendWss("VOTE", readData);
    memeReceived = 0;
    cleanReceivedMeme();

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
