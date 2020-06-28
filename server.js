const express = require('express');
const formidable = require('formidable');
const mv = require('mv');
const serveIndex = require('serve-index');
const glob = require('glob');
const cors = require('cors');


const app=express();

app.use(cors());
app.post('/upload',handleUpload);

app.use('/',express.static('public'),serveIndex('public', {'icons': true}));

app.get('/getfnames',getFileNames);





function handleUpload(req,res){
    let form=new formidable.IncomingForm();
    form.parse(req,(err,field,files)=>{
        console.log(files.filetoupload.path);
        let fpath=`${__dirname}/public/files/${files.filetoupload.name}`;
        console.log(`saving to ${fpath}`);
        mv(files.filetoupload.path,fpath,err=>{
            if(!err)
            console.log(err);
        });
        res.json('file uploaded');
        res.end();
    }  );
}

function getFileNames(req,res){
    console.log('/getfnames');
    glob('*',{cwd:'public/files'},(err,fnames)=>{
        res.json(fnames);
    });
}

function handleHome(req,res){
    res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="upload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
}

app.listen(8080);