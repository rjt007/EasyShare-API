const express = require('express');
const router = express.Router();
const File = require('../model/file');

router.get('/:uuid',async(req,res)=>{
    try {
        const file = await File.findOne({uuid: req.params.uuid});
        if(!file){
            return res.render('download',{error: 'Link has been expired!'});
        }
        else{
            return res.render('download',{
                uuid: file.uuid,
                fileName: file.filename,
                fileSize: file.size,
                downloadLink: `${process.env.APP_BASE_URL}/downloads/save/${file.uuid}`
            });
        }
    } catch (err) {
        return res.render('download',{error: err.message});
    }
    
})

module.exports = router;