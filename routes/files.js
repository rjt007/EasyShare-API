const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../model/file');
const { v4: uuidv4 } = require('uuid');

//Location Setup
let storage = multer.diskStorage({
    destination: (req,file,callback)=> callback(null,'uploads/'),
    filename: (req,file,callback)=>{
        const uniqueFileName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        callback(null,uniqueFileName);
    }
})

//Upload
const upload = multer({
    storage,
    limits: {fileSize: 1E6*124}
}).single('myfile');

router.post('/',(req,res)=>{

    //Validate and Store File
    upload(req,res,async(err)=>{

        //Validate User Request
        if(!req.file){
            return res.json({error:'Enter the Correct File.'});
        }

        if(err){
            return res.status(500).send({error: err.message});
        }

        //Storing file info in database
        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            uuid: uuidv4(),
        })
        let response = await file.save();

        //Sending Response
        return res.json({file: `${process.env.APP_BASE_URL}/downloads/${response.uuid}`});
    })
})

//Send Mail Route
router.post('/send',async(req,res)=>{
    const {uuid, emailTo, emailFrom} = req.body;
    if(!uuid || !emailFrom || !emailTo){
        return res.status(400).json({error:'All fields are Required!'});
    }

    //Get File From DataBase
    const file = await File.findOne({uuid: uuid});
    //If sender already exist - Means email already sent.
    // if(file.senderEmail){
    //     return res.status(400).json({error:'Email Already Sent'});
    // }

    file.senderEmail = emailFrom;
    file.recieverEmail = emailTo;
    const response = await file.save();

    //Send Email Logic
    const sendEmail = require('../services/emailService');
    sendEmail({
        emailFrom: emailFrom,
        emailTo: emailTo,
        subject: `EasyShare File Sharing`,
        text: `${emailFrom} has sent you a email.`,
        html: `${require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/downloads/${file.uuid}`,
            size: parseInt(file.size/1000)+' KB',
            expires: '24 hours'
        })}` 
    })
    return res.json({success: true});
})

module.exports = router;