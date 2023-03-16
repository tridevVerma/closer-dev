{

    // method to submit the form data for new post using AJAX
    function createPost(e, newPostForm){
        
        e.preventDefault();

        $.ajax({
            type:"POST",
            url:"/users/posts/create",
            data: $(newPostForm).serialize(),
            success: function(data){
                let newPost = newPostDom(data.data.post, data.data.username);
                $('.show-posts>ul').prepend(newPost);
                deletePost($(' .delete-post-btn', newPost));
                notifyMsg("Post published!!", "success");
            },
            error: function(err){
                notifyMsg(err.responseText, "error");
            }
        })
    };

    // method to create post in DOM

    let newPostDom = function(post, username){
        console.log(post)
        return $(`<li id="post-${post._id}">
        <div class="title-close">
            <h3>${post.title} - <span class="post-user-name">${username}</span></h3>
            <a href="/users/posts/destroy/${post._id}" class="delete-post-btn"><h3>X</h3></a>
            
        </div>
        <p>${post.content}</p>
        <div class="comments-section">
            
            <form method="POST" action="/users/comments/create" class="new-comment-form">
                <input type="text" name="comment-content" placeholder="Comments here ....">
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

    // method to add ajax deletion to posts which are already present

    let addAjaxDeletion = function(postDeleteLinks){
        for(let link of postDeleteLinks){
            deletePost(link);
        }
    }

    // method to delete a post from DOM

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: "get",
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    notifyMsg("Post and associated comments deleted!!", "success");
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
        let newPostForm = $('#new-post-form');
        newPostForm.submit(e => createPost(e, newPostForm));
        addAjaxDeletion($('.delete-post-btn'));
    })
}