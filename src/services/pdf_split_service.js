const {PDFDocument} =  require('pdf-lib');
const assert = require('assert');
const mongodb = require('mongodb');
const path = require("path");
const { Readable } = require('stream');
const { readFileSync, writeFileSync} = require("fs");

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.MONGO_DB;

const client = new mongodb.MongoClient(uri);
const db = client.db(dbName);
var bucket = new mongodb.GridFSBucket(db);

/**
 * Save the data into DB. 
 * @param {*} data 
 * @param {*} newName 
 */
async function save_file (data,newName) {
    client.connect(function(error) {
        assert.ifError(error);
        new Readable({
            read(){
                this.push(data);
                this.push(null);
            }
          }).
          pipe(bucket.openUploadStream(newName)).
          on('error', function(error) {
            console.log('failed to post the file: ' + newName);
            assert.ifError(error);
          }).
          on('finish', function() {
            console.log('file: ' + newName + ' posted');
          });
      });
}


module.exports = {
    split_service : async function (fileObj) {
        try{
            let fileName = path.basename(fileObj.originalname);
            let extName = path.extname(fileName)
            const document = await PDFDocument.load(readFileSync(fileObj.path));
            let pages = document.getPages();
            let pageLength = pages.length;
        
            for (let index = 0; index < pageLength; index++) {
                const subDoc = await PDFDocument.create();
                const [copiedPage] = await subDoc.copyPages(document, [index])
                subDoc.addPage(copiedPage);
                let byteArr = await subDoc.save();
                let newName = fileName + (index + 1 ) + extName;
                // writeFileSync(newName, byteArr);
                await save_file(byteArr,newName);
            }
        } catch(err) {
            console.log("Exception:", err)
            return false;
        }
        return true;
    },
}

