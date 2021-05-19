const express = require('express');
const upload = require('express-fileupload');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(upload());

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/home2.html')
});


app.post('/', (req, res)=>{
    try {
        if (req.files){
            console.log(req.files);
            // fileuploadfield name of file input tag
            var file = req.files.fileuploadfield;
            console.log(file);
            var filename = file.name;
            const extension = path.extname(filename);
            const allowed_extension = /cpp/;
            if(!allowed_extension.test(extension)) throw "Unsupported extension";
            console.log(filename);
            file.mv('./uploads/'+filename,function(err) {
                if(err){
                    res.send(`<script>alert(${err})</script>`);
                } else {
                    res.send('<script>alert("File uploaded")</script>');
                }
            });
        } 
    } catch (err) {
        console.log(err);
        res.send(`<script>alert(${err})</script>`);
    }
});

app.listen(port, ()=> console.log(`Listening on port ${port}...`));