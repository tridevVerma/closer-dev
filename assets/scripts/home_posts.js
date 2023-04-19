{

    // method to submit the form data for new post using AJAX
    function createPost(){
        const newPostForm = $('#new-post-form');

        $(newPostForm).submit(e => {
            e.preventDefault();

            $.ajax({
                type:"POST",
                url:"/users/posts/create",
                data: $(newPostForm).serialize(),
                success: function(data){
                    
                    // Create and append new-post UI to posts-list
                    let newPost = newPostDom(data.data.post, data.data.username);
                    $('.show-posts>ul').prepend(newPost);

                    // Call listener to activate delete-post functionality
                    deletePost($(' .delete-post-btn', newPost));

                    // Initiate new-comment-container attached to newly created post
                    new PostComments(data.data.post._id);

                    // Empty post-form
                    $(newPostForm)[0].reset();

                    // Call listener to activate like-post functionality
                    likePost($(newPost).find('.like-post-btn'));
                    notifyMsg("Post published!!", "success");
                },
                error: function(err){
                    notifyMsg(err.responseText, "error");
                }
            })
        })
        
    };

    // method to create Post-UI in DOM

    let newPostDom = function(post, username){
        return $(`<li id="post-${post._id}">
        <div class="title-close">
            <h3>${post.title} - <span class="post-user-name">${username}</span></h3>
            <a class="like-post-btn" href="/users/like/?type=Post&id=${post._id}">
                <span>Likes</span>
                &nbsp;
                <span class="post-likes-count">0</span>
            </a>
            <a href="/users/posts/destroy/${post._id}" class="delete-post-btn">
                <i class="fa-solid fa-trash"></i>
            </a>
            
        </div>
        <p>${post.content}</p>
        <div class="comments-section">
            
            <form id="post-${post._id}-comment-form" method="POST" action="/users/comments/create" class="new-comment-form">
                <input type="text" name="comment-content" placeholder="Comment here ....">
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Submit">
            </form>
            
            <div class="show-comments">
                <ul id="comment-post-id-${post._id}">
                    
                </ul>
            </div>
        </div>
        
    </li>`)

    }

    // method to delete a post from DOM

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: "get",
                url: $(deleteLink).prop('href'),
                success: function(data){

                    // Remove post from DOM
                    $(`#post-${data.data.post_id}`).remove();
                    notifyMsg("Post and associated comments deleted!!", "success");
                },
                error: function(err){
                    notifyMsg(err.responseText, "error");
                }
            })
        })
    }

    // method to like post
    let likePost = function(likeLink){
        $(likeLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: "get",
                url: $(likeLink).prop('href'),
                success: function(data){
                    // Get and provide Total likes count on a post
                    $(likeLink).children('.post-likes-count').text(data.count);

                    // Check if post is liked or disliked then create toast message
                    notifyMsg(data.likeAdded ? "You just liked the post" : "You just disliked the post", "success");
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

    let addAjax = function(){
        $('.show-posts>ul>li').each(function(index, post){

            // Add listener for deleting and liking the post
            deletePost($(post).find('.delete-post-btn'));
            likePost($(post).find('.like-post-btn'));

            // create new-comment-container attached to each post
            let postId = $(post).prop('id').split('-')[1];
            new PostComments(postId);
        })
    }

    // Call listener to activate creating, deleting, liking on the post
    createPost();
    addAjax();
    
}