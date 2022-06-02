const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req,res){

    try{
        let post = await Post.find({user: req.params.id})
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
    
        // let signInUserFriends;
        // if(req.user){
        //  signInUserFriends = await User.findById(req.user._id)
        //  .populate('friendship', 'name email avatar');
        // }

        let signInUserFriends = await User.find({ friendship: req.params.id }).populate('friendship', 'name email avatar');
    
        let signin_User = await User.findById(req.params.id);
    
        return res.render('user_profile',{
            title : "profile",
            profile_user : signin_User,
            posts : post,
            all_users : user,
            all_friends : signInUserFriends
        });


    }catch(err){
        console.log('ERROR',err);
        return;
    }
  
}


module.exports.update = async function (req, res) {
    // if(req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, {name: req.body.name, email: req.body.email}, function(err, user) {
    //         req.flash('success', 'Profile Updated!');
    //         return res.redirect('back');
    //     });
    // }
    // else {
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }

    if (req.user.id == req.params.id) {

        try {

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err) {
                if(err) {console.log('****Multer Error: ', err)}

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file) {

                    if(user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }
        catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }

    }
    else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Etilaicos | Sign Up"
    });
}


// render the sign in page
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Etilaicos | Sign In"
    });
}

// get the sign up data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { req.flash('error', err); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { req.flash('error', err); return }

                return res.redirect('/users/sign-in');
            })
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}


module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'You have logged out!');

    return res.redirect('/');
}