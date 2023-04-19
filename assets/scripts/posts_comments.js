// *********** Class to create comment-container attached to each post **********
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

    // Create new comment

    createComment = function(postId){
        let classThis = this;
        $(this.newCommentForm).submit(e => {
            e.preventDefault();

            $.ajax({
                type: "POST",
                url: "/users/comments/create",
                data: $(this.newCommentForm).serialize(),
                success: function(data){
                    // Create new-comment UI and append it to comments-list
                    let newComment = classThis.newCommentDom(data.data.comment, data.data.username);
                    let commentsList = $(`#comment-post-id-${postId}`);
                    $(commentsList).prepend(newComment);
                    $(classThis.newCommentForm)[0].reset();

                    // Call listener to activate delete and like to new-comment
                    classThis.deleteComment($(newComment).find('.delete-comment-btn'));
                    classThis.likeComment($(newComment).find('.like-comment-btn'));
                    classThis.notifyMsg("Comment created!!", "success");
                },
                error: function(error){
                    classThis.notifyMsg(error.responseText, "error");
                }
            })
        })
        
    }

    // Creating UI of new-comment for DOM
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
    
    // Delete comment listener
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

    // like / dislike comment

    likeComment(likeLink){
        let classThis = this;
        $(likeLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(likeLink).prop('href'),
                success: function(data){
                    // Get and provide Total likes count on a comment
                    $(likeLink).children('.comment-likes-count').text(data.count);

                    // Check if comment is liked or disliked then create toast message
                    classThis.notifyMsg(data.likeAdded ? "comment liked" : "comment disliked", "success");
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
