// *********** CLASS TO INITIALIZE CHAT SOCKET ON CLIENT SIDE **********
class chatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBoxId = chatBoxId;
        this.userEmail = userEmail;

        this.socket = io.connect(`http://localhost:5000`);
    }

    // *********** HANDLE CHAT-BOX SERVICES **********
    connectionHandler(){
        const self = this;

        this.socket.on('connect', function(){
            console.log("Connection established using sockets...");

            // Emit event to ask everyone to join room with data
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'closer'
            });

            // Log if any user joins the chatroom
            self.socket.on('user_joined', function(data){
                console.log(data)
            })
        });

        // Emit / broadcast new message to everyone available in chatroom 
        $('#new-msg-form').submit(function(e){
            e.preventDefault();
            let msg = $('#newMsgText').val();

            if(msg != ''){
                self.socket.emit('send-msg',{
                    message: msg,
                    userEmail: self.userEmail,
                    chatroom: 'closer'
                });
                $('#newMsgText').val('');
            }
        });

        // On receiving message append new text to chat-box (including our own emitted message)
        self.socket.on('receive-msg', function(data){
            
            let userType = 'f-text';
            if(data.userEmail == self.userEmail){
                userType = 'u-text';
            }

            let newMsg = `<li class='${userType}'><p>${data.message}</p></li>`

            $('.display-msgs > ul').append(newMsg);
        });

        // If closed button clicked --> Disconnect socket and remove chat-box
        $('.remove-chat-box').click(function(e){
            e.preventDefault();
            self.socket.disconnect(true);
            $('.chat-engine').empty();
        });


    }
}