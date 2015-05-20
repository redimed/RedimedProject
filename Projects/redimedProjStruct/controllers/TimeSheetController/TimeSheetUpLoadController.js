var mkdirp = require('mkdirp');
var fs = require('fs');
module.exports = {
    //UPLOAD FILE
    UploadFile: function(req, res) {
        var tagetFolder = '\\UploadFile\\allFileUploadTimeSheet\\' + req.body.userId;
        console.log(__dirname);
    },
    //END UPLOAD FILE
};
