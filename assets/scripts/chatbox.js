{
    $('.chat-now').click(function (e) {
        e.preventDefault();
        const self = $(this);

        $.ajax({
            type: 'get',
            url: self.prop('href'),
            success: function (data) {
                console.log(data);
                const chat = new chatEngine('chat-engine', data.email);
                const newChat = newChatBox(data.name);
                $('.chat-engine').empty().prepend(newChat);
                showHide();
                chat.connectionHandler()
            },
            error: function (err) {
                console.log("Error while starting chatting:", err);
            }
        })
    });

    function newChatBox(name) {
        return `<div class="chat-heading">
        <h4>${name}</h4>
        <a href="#" class="display hide">
            <i class="fa-solid fa-chevron-down"></i>
        </a>
        <a href="#" class="remove-chat-box">
            <i class="fa-solid fa-xmark"></i>
        </a>
    </div>
    <div class="chat-container">
        <div class="display-msgs">
            <ul>
                <li class="f-text">
                    <p>Hi there, I am ${name}</p>
                </li>
                <li class="u-text">
                    <p>Hello</p>
                </li>
                
            </ul>
        </div>
        <div class="new-msg-form-container">
            <form action="#" method="post" id="new-msg-form">
                <input type="text" name="newMsgText" id="newMsgText" placeholder="Write your message...">
                <button type="submit" id="send-msg">
                    <span>Send</span>
                    <i class="fa-sharp fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </div>
    </div>`
    }

    function showHide(){
        const showHideBtn = $('.display');
        const chatContainer = $('.chat-container');

        const showIcon = `<i class="fa-solid fa-chevron-up"></i>`;
        const hideIcon = `<i class="fa-solid fa-chevron-down"></i>`;

        showHideBtn.click(function(e){
            e.preventDefault();
            if(showHideBtn.hasClass('hide')){
                chatContainer.hide();
                showHideBtn.addClass('show').removeClass('hide').empty().prepend(showIcon);
            }
            else if(showHideBtn.hasClass('show')){
                chatContainer.show();
                showHideBtn.addClass('hide').removeClass('show').empty().prepend(hideIcon);
            }
        });
    }
}
