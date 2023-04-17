{
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
    })
}
