const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
// const User = require('../models/user');
const path = require('path');
const fs = require('fs');



module.exports.create = async (req,res) => {
  
    try {
       
        Post.uploadPost(req, res, (err) => {
            if(err){ 
                console.log('*************** Error in multer ************', err);
                req.flash('error', err.toString());
                return res.redirect('back');
            }

            let post = new Post();

            post.content = req.body.content;
            post.user = req.user._id;
            
            if(req.file){
                
               post.picture = Post.postPath+'/'+req.file.filename;
            }
           
            Post.create(post);
            req.flash('success', "Post published!");
            return res.redirect('back');
        })
        
       
    } catch(err){
        req.flash('error', err);
        console.log(`Error in creating post, ${err}`);
        return res.redirect('back');
    }
}



// module.exports.create = async function(req, res) {

//     try{
//         let post = await Post.create({
//             content: req.body.content,
//             user: req.user._id
//         });

//         if (req.xhr){
//             // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
//             post = await post.populate('user', 'name');

//             return res.status(200).json({
//                 data: {
//                     post: post
//                 },
//                 message: "Post created!"
//             });
//         }

//         req.flash('success', 'Post Published!');
//         return res.redirect('back');

//     } catch (err) {
//         req.flash('error', err);
//         // added this to view the error on console as well
//         console.log(err);
//         return res.redirect('back');
//     }
// }


module.exports.destroy = async function(req, res) {

    try{
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id) {

            if(post.picture){
                fs.unlinkSync(path.join(__dirname,'..',post.picture));
            }

            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();
            await Comment.deleteMany({post: req.params.id});


            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted"
                });
            }


            req.flash('success', 'Post Deleted!');

            return res.redirect('back');
        }
        else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    } catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}