const express = require('express');
const pdf_split_svc = require('../services/pdf_split_service')
const multer = require('multer')
const upload = multer({dest:'uploads/'})

const app = express();


app.post('/split', upload.single('file'), function (req, res, next) {
    if(pdf_split_svc.split_service(req.file)){
        res.send("posted")
    } else {
        res.send("failed")
    }
})

module.exports = {
    app,
}