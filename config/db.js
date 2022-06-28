require('dotenv').config();
const mongoose = require('mongoose');

function connectDB(){
    //Connecting To database
    mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true});

    const db = mongoose.connection;
    db.on('error', error=>console.error(error));
    db.once('open',()=>console.log('Connected to database..'));
}

module.exports = connectDB;