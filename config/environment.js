const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});


const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'etilaicos_development',
    google_client_id: "257653657013-gqnubqq6p0b4suiti4ifj46jn12tafsn.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'etilaicos', 
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.ETILAICOS_ASSET_PATH,
    session_cookie_key: process.env.ETILAICOS_SESSION_COOKIE_KEY,
    db: process.env.ETILAICOS_DB,
    google_client_id: process.env.ETILAICOS_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.ETILAICOS_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.ETILAICOS_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.ETILAICOS_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}


module.exports = eval(process.env.ETILAICOS_ENVIRONMENT) == undefined ? 'development' : eval(process.env.ETILAICOS_ENVIRONMENT);