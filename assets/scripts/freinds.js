{
    // *********** Add Freind **********
    const addFreind = function(){
        $('.add-freind-btn').click(function(e){
            e.preventDefault();
            const globalThis = $('.add-freind-btn');
            $.ajax({
                type: 'get',
                url: $(this).prop('href'),
                success: function(data){
                    notifyMsg(`${data.newFreind} added to your freindlist`, "success");

                    // Replace add-freind button with remove-freind
                    const removeLink = `<a class="remove-freind-btn" href="/users/remove-freind/${data.id}">Remove Freind</a>`
                    globalThis.replaceWith(removeLink);

                    // Call remove-freind listener
                    removeFreind();
                },
                error: function(err){
                    console.log(err);
                    notifyMsg("error while adding freind", "error");
                }
            })
        })
    }

    // *********** Remove Freind **********
    const removeFreind = function(){
        $('.remove-freind-btn').click(function(e){
            e.preventDefault();
            const globalThis = $('.remove-freind-btn');
            $.ajax({
                type: 'get',
                url: $(this).prop('href'),
                success: function(data){
                    notifyMsg(`${data.freind} removed from your freindlist`, 'success');

                    // Replace add-freind button with remove-freind
                    const addLink = `<a class="add-freind-btn" href="/users/add-freind/${data.id}">Add Freind</a>`
                    globalThis.replaceWith(addLink);

                    // Call add-freind listener
                    addFreind();
                },
                error: function(err){
                    console.log(err);
                    notifyMsg("error while removing freind", "error");
                }
            })
        })
    }

    // method to call noty
    let notifyMsg = function(textMsg, typeMsg){
        new Noty({
            theme : 'relax' , 
            text: textMsg,
            type: typeMsg,
            layout : "topRight",
            timeout : 1500
            
        }).show();
    }

    // Call add-freind and remove-freind listener globally
    addFreind();
    removeFreind();
}