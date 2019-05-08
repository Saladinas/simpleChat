const express = require('express');
const bodyParser = require('body-parser');
let EventEmitter = require('events').EventEmitter
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const messageBus = new EventEmitter()

app.get('/messages', function (req, res) {
    const addMessageListener = (res) => {
        messageBus.once('message', function (newMessage) {
            res.json(newMessage)
        })
    }
    addMessageListener(res)
})

app.post('/messages', function (req, res) {
    messageBus.emit('message', req.body)
    res.status(200).end()
})

app.listen(port, () => console.log(`Listening on port ${port}`));