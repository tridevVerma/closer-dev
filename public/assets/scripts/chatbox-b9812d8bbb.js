{function newChatBox(n){return`<div class="chat-heading">\n        <h4>${n}</h4>\n        <a href="#" class="display hide">\n            <i class="fa-solid fa-chevron-down"></i>\n        </a>\n        <a href="#" class="remove-chat-box">\n            <i class="fa-solid fa-xmark"></i>\n        </a>\n    </div>\n    <div class="chat-container">\n        <div class="display-msgs">\n            <ul>\n                <li class="f-text">\n                    <p>Hi there, I am ${n}</p>\n                </li>\n                <li class="u-text">\n                    <p>Hello</p>\n                </li>\n                \n            </ul>\n        </div>\n        <div class="new-msg-form-container">\n            <form action="#" method="post" id="new-msg-form">\n                <input type="text" name="newMsgText" id="newMsgText" placeholder="Write your message...">\n                <button type="submit" id="send-msg">\n                    <span>Send</span>\n                    <i class="fa-sharp fa-solid fa-paper-plane"></i>\n                </button>\n            </form>\n        </div>\n    </div>`}function showHide(){const n=$(".display"),e=$(".chat-container");n.click((function(s){s.preventDefault(),n.hasClass("hide")?(e.hide(),n.addClass("show").removeClass("hide").empty().prepend('<i class="fa-solid fa-chevron-up"></i>')):n.hasClass("show")&&(e.show(),n.addClass("hide").removeClass("show").empty().prepend('<i class="fa-solid fa-chevron-down"></i>'))}))}$(".chat-now").click((function(n){n.preventDefault();const e=$(this);$.ajax({type:"get",url:e.prop("href"),success:function(n){const e=new chatEngine("chat-engine",n.email),s=newChatBox(n.name);$(".chat-engine").empty().prepend(s),showHide(),e.connectionHandler()},error:function(n){console.log("Error while starting chatting:",n)}})}))}