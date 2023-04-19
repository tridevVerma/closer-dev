// *********** SERVER SIDE CONFIGURATION OF SOCKET.IO **********
module.exports.chatSockets = (chatServer) => {
    let io = require('socket.io')(chatServer);
    io.on('connection', function(socket){
        console.log("Connection established with server...", socket.id);

        socket.on('disconnect', function(){
            console.log("Connection removed with server...");
        });
        
        socket.on('join_room', function(data){
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send-msg', function(data){
            io.in(data.chatroom).emit('receive-msg', data);
        })
    })
}