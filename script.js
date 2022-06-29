const File = require('./model/file');
const fs = require('fs');

const connectDB = require('./config/db');
connectDB();

async function deleteFiles(){
    //getting 24 hrs before dates
    const pastDate = new Date(Date.now()-(24*60*60*1000));
    //getting 24 hrs before files
    const files = await File.find({createdAt: {$lt: pastDate}});

    if(files.length){
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`Succesfully deleted file ${file.filename}`);
            } catch (err) {
                console.log(`Error while deleting file ${file.filename}, the error is: ${err}`);
            }
        }
        console.log('All Files before 24 hrs are deleted Succesfully!');
    }
}

deleteFiles().then(process.exit);