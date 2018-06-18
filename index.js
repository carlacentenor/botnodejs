var express = require('express');
var bodyParse = require('body-parser');
var request = require('request');

const APP_TOKEN = 'EAAIM30ZBXoioBAIz3LoYxvt8wgXsd0YZCi8oYVHYUXqQIXMno8ZBga1ZBg3ykJ9yCn3ZCG9g3iiUZBonHBPnldvKy9ovWMv1wtZBWug9kZA7rs7SsQUwxoaBdu8JU6qKEKLa2R7R9q7DZBWn5MVzwzpv9VTiireP5Y6ceBBVQNjZANJgZDZD';

var app = express();
app.use(bodyParse.json());

app.listen(3000, function () {
    console.log('el servidor esta encendido')
})

app.get('/', function (req, res) {
    res.send('hola mundo')
});

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'test_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('tu no tienes que entrar aqui')
    }
});
//validar los eventos
app.post('/webhook', function (req, res) {
    var data = req.body;
    if (data.object == 'page') {
        data.entry.forEach(element => {
            element.messaging.forEach(elementMessage => {
                if (elementMessage.message) {
                    receiveMessage(elementMessage);

                }

            });
        });
        res.sendStatus(200);
    }
});

function receiveMessage(event) {
    var senderID = event.sender.id;
    var messagetext = event.message.text;
    evaluaMessage(senderID, messagetext);
}

function evaluaMessage(messageID, text) {
    var evaluaMessage = '';
    if (isContain(text, 'ayuda')) {
        evaluaMessage = ' ohh en que te ayudo'
    } else {
        evaluaMessage = ' No te entiendo'
    }
    postMessage(messageID, evaluaMessage);
}

function isContain(sentence, word) {
    return sentence.indexOf(word) > -1;
}

function postMessage(idPost, textMessage) {
    var messageInfo = {
        recipient: {
            id: idPost
        },
        message: {
            text: textMessage
        }
    }
    callSendAPI(messageInfo);
}

function callSendAPI(messageData){
request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs:{access_token : APP_TOKEN},
    method :'POST',
    json:messageData
},function(error , response , data){
    if(error){
        console.log('no es posible');
    }else{
        console.log('el mensaje fue enviado')
    }
}
)
}