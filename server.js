require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const filesRoute = require('./routes/files');
const downloadsRoute = require('./routes/downloads');
const saveRoute = require('./routes/save');

//CORS Setting
const CorsOptions = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
};
  
app.use(cors(CorsOptions));
app.set('view engine', 'ejs');
app.set('views',__dirname+'/views');
app.use(express.static('public'));
app.use(express.json());


app.get('/',(req,res)=>{
    res.json({homePage:'Welcome to HomePage!'});
})

app.use('/api/files',filesRoute);
app.use('/downloads',downloadsRoute);
app.use('/downloads/save',saveRoute);

//Databse Configuration
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server is listening on Port ${PORT}..`);
})

