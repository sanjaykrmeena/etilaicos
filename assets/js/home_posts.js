
{
    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post Published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
    let newPostDom = function (post) {
        // CHANGE :: show the count of zero likes on this post
        return $(`<li id="post-${post._id}">
                    
                <small id="post-delete-btn">
                    <a class="delete-post-button" href="/posts/destroy/${ post._id }" style="text-decoration: none;">
                    <img src="/images/circle-minus-solid.svg" alt="delete">
                    </a>
                </small>
                
                    
                <small>
                   <a href="/users/profile/${ post.user.id }" style="text-decoration: none; color: black;">
                      <strong>${ post.user.name }</strong>
                   </a>
                </small>
                <p></p>
                ${ post.content }
                <br>
                <img src=" ${ post.picture } alt="img" width="100">
                <p></p>
                <small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                       <i class="fas fa-solid fa-heart"></i> 0
                    </a>
                </small>
                <p></p>

                <div class="post-comments">
                    
                        <form id="post-${ post._id }-comments-form" action="comments/create" method="post">
                          <input type="text" name="content" placeholder="Type Here to add comment... " required
                          style="border-radius: 10px; height: 30px; width: 77%; outline: none; border: none; background-color: honeydew;">
                          <input type="hidden" name="post" value="${ post._id }">
                          <input type="submit" value="Add Comment" class="comment-btn">
                        </form>
            
            
                        <div class="post-comments-list">
                           <ul id="post-comments-${ post._id }">
                            
                           </ul>
                        </div>
                </div>
                
            </li>`)
    }


    // method to delete a post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });

        });
    }





    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function () {
        $('#posts-list-container>ul>li').each(function () {
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();
}


// <!-- importing this script for creating the comments -->
// <script src="/js/home_posts.js"></script>
// <script src="/js/home_post_comments.js"></script>