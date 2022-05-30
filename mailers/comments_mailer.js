const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'etilaicos',
        to: comment.user.email,
        subject: "New Comment Published!",
        html: htmlString
    }, (err, infor) => {
        if(err) {
            console.log('Error in sending mail', err);
            return;
        }

        // console.log('Mail delivered');
        return;
    });
}