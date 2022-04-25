const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

// SETTING UP SOCKET IO AND THE SERVER
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) =>{
    console.log('a user is connected:', socket.id);

    // EMITTING THE MESSAGES DIV GETTING CLEARED ON ALL USERS HTML
    socket.on('divCleared', (data) => {
        io.emit('changeDiv', { clearDiv: data.clearDiv });
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected:', socket.id);
    });
});

// SETTING UP THE DATABASE CONNECTION AND MONGOOSE
const mongoose = require('mongoose');
// DATABASE NAME - 'test'; COLLECTION - 'messages'
const dbUrl = 'mongodb+srv://davidK:mongoDBdavid3nter1ng66532@cluster0.k8xoe.mongodb.net/test?retryWrites=true&w=majority';   
// LOCALHOST: 'mongodb://localhost:27017/chatdb' --> LOCALHOST TESTING DB
/* const Message = mongoose.model('Message', {
    name: String,
    message: String
}); */
const Message = require('./models/Message').Message;

mongoose.connect(dbUrl, (error) => {
    if (error) {
        console.log(error);
    };
    console.log('Connection to MongoDB established...');
});


// USING GET TO READ ALL OF THE MESSAGES FROM THE DB - API
app.get('/messages', (req, res) => {
    Message.find({ }, (err, messages) => {
      res.send(messages);
    });
});
  
// POSTING/SAVING THE MESSAGES TO THE DB - API 
app.post('/messages', (req, res) => {
    const message = new Message(req.body);
    const savedMessage = message.save()
    io.emit('message', req.body);
});

// DELETING ALL MESSAGES FROM THE DB - API
app.delete('/messages', (req, res) => {
    Message.deleteMany({ }, (err) => {
        if (err) {
            console.log(err);
        };
    });
});

// SERVING THE INDEX HTML PAGE
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    };
    console.log('Server running on port:', server.address().port);
});