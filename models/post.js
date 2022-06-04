const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const POST_PATH = path.join('/uploads/posts/pictures');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the array of id's of all comments in this post schema
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    picture:{
        type: String
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Like'
    }]
}, {timestamps: true});


let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '..', POST_PATH))
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+'-'+Date.now());
    }
})

postSchema.statics.uploadPost = multer({
    storage: storage ,
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
       
        if(ext!=='.png' && ext!=='.jpg' && ext!=='.gif' && ext!=='.jpeg'){
            return cb(new Error('Only images are allowed'))
        }
        return cb(null, true);
    } 
}).single('picture');

postSchema.statics.postPath = POST_PATH;

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
