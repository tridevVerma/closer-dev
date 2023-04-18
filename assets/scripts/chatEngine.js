class chatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBoxId = chatBoxId;
        this.userEmail = userEmail;

        this.socket = io.connect(`http://localhost:5000`);

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        const self = this;
        this.socket.on('connect', function(){
            console.log("Connection established using sockets...")

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'closer'
            });

            self.socket.on('user_joined', function(data){
                console.log(data)
            })
        });

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

        self.socket.on('receive-msg', function(data){
            
            let userType = 'f-text';
            if(data.userEmail == self.userEmail){
                userType = 'u-text';
            }

            let newMsg = `<li class='${userType}'><p>${data.message}</p></li>`

            $('.display-msgs > ul').append(newMsg);
        })


    }
}