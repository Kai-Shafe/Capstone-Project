const io = require('socket.io')(3000);

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('message', (data) => {
        console.log('Received message from client:', data);
        socket.emit('response', 'Message received by server');
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});
