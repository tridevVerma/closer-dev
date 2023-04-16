class PostComments{
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comment-form`);
        this.createComment(postId);

        // method to add ajax deletion to posts which are already present

        let classThis = this;
        $(this.postContainer).find('.delete-comment-btn').each(function(index, btnLink){
            classThis.deleteComment(btnLink);
        } );
        $(this.postContainer).find('.like-comment-btn').each(function(index, btnLink){
            classThis.likeComment(btnLink);
        })
    }

    createComment = function(postId){
        let classThis = this;
        $(this.newCommentForm).submit(e => {
            e.preventDefault();

            $.ajax({
                type: "POST",
                url: "/users/comments/create",
                data: $(this.newCommentForm).serialize(),
                success: function(data){
                    let newComment = classThis.newCommentDom(data.data.comment, data.data.username);
                    let commentsList = $(`#comment-post-id-${postId}`);
                    $(commentsList).prepend(newComment);
                    classThis.deleteComment($(newComment).find('.delete-comment-btn'));
                    $(classThis.newCommentForm)[0].reset();
                    classThis.notifyMsg("Comment created!!", "success");
                },
                error: function(error){
                    classThis.notifyMsg(error.responseText, "error");
                }
            })
        })
        
    }

    newCommentDom = function(comment, username){
        return $(`<li id="comment-${comment._id}">
        <p><strong>${username} : </strong>&nbsp;${comment.content}</p>
        <a class="like-comment-btn" href="/users/like/?type=Comment&id=${comment._id}">
            <i class="fa-regular fa-thumbs-up"></i>
            <span class="comment-likes-count">0</span>
        </a>
        <a href="/users/comments/destroy/${comment._id}" class="delete-comment-btn">x</a>
    </li>`)
    }
    
    deleteComment = function(deleteLink){
        let classThis = this;
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:"get",
                url:$(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    classThis.notifyMsg("Comment removed!!", "success");
                },
                error: function(err){
                    classThis.notifyMsg(err.responseText, "error");
                }
            })
        })
    }

    // like/dislike comment

    likeComment(likeLink){
        let classThis = this;
        $(likeLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(likeLink).prop('href'),
                success: function(data){
                    $(likeLink).children('.comment-likes-count').text(data.count);
                    classThis.notifyMsg("comment liked", "success");
                },
                error: function(err){
                    classThis.notifyMsg(err.responseText, "error");
                }
            })
        })
    }

    // method to call noty

    notifyMsg = function(textMsg, typeMsg){
        new Noty({
            theme : 'relax' , 
            text: textMsg,
            type: typeMsg,
            layout : "topRight",
            timeout : 1500
            
        }).show();
    }
    
}
