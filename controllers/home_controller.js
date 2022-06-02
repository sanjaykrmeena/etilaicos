const Post = require('../models/post');
const User = require('../models/user');
const friendship = require('../models/friendship');

module.exports.home = async function(req,res){
    try{

        let post = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user likes'
            }
        })
        .populate('likes');
        // console.log('---------->',post);
        

        let user = await User.find({});

        let signInUserFriends;
        if(req.user){
         signInUserFriends = await User.findById(req.user._id)
         .populate('friendship', 'name email avatar');
        }


       
        return res.render('home',{
            title:"Etilaicos | Home",
            posts : post,
            all_users : user,
            all_friends : signInUserFriends
        });
    }catch(err){
        console.log('ERROR',err);
        return;
    }
                
}


// module.exports.actionName = function(req, res){}


// using then
// Post.find({}).populate('comments').then(function());

// let Post = Post.find({}).populate('comments').exec();

// posts.then()