const express = require('express');
const router = express.Router();
const File = require('../model/file');

router.get('/:uuid',async(req,res)=>{
    try {
        const file = await File.findOne({uuid: req.params.uuid});
        if(!file){
            return res.render('download',{error: 'Link has been Expired'});
        }
        const filePath = `${__dirname}/../${file.path}`;
        return  res.download(filePath)
    } catch (err) {
        return res.render('download',{error: err.message});
    }
})

module.exports = router;