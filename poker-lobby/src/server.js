require('dotenv').config();
const io = require('socket.io').listen(process.env.PORT);

io.on('connection', (client) => {
    console.log('Client connected...');
    client.on('join', (data) => {
        console.log(data);
    });
});
