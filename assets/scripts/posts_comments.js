{


    let createComment = function(e, form){
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/users/comments/create",
            data: $(form).serialize(),
            success: function(data){
                let newComment = newCommentDom(data.data.comment, data.data.username);
                let commentsList = $(`#comment-post-id-${data.data.comment.post}`);
                $(commentsList).prepend(newComment);
                deleteComment($(' .delete-comment-btn', newComment));
                notifyMsg("Comment created!!", "success");
            },
            error: function(err){
                notifyMsg(err.responseText, "error");
            }
        })
    }

    let newCommentDom = function(comment, username){
        return $(`<li id="comment-${comment._id}">
        <strong>${username} : </strong>
        &nbsp;
        ${comment.content}
        <a href="/users/comments/destroy/${comment._id}">x</a>
    </li>`)
    }

    // method to add ajax deletion to posts which are already present

    let addAjaxDeletion = function(commentDeleteLinks){
        for(let link of commentDeleteLinks){
            deleteComment(link);
        }
    }

    let deleteComment = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:"get",
                url:$(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    notifyMsg("Comment removed!!", "success");
                },
                error: function(err){
                    notifyMsg(err.responseText, "error");
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

    $(document).ready(function(){

        addAjaxDeletion($('.delete-comment-btn'));
        $('.new-comment-form').each(function(index, form){
            $(form).submit((e) => createComment(e, form))  
        })
    })

}