var mkdirp = require('mkdirp');
var fs = require('fs');
var moment = require('moment');
module.exports = {
    //UPLOAD FILE
    UploadFile: function(req, res) {
        var tagetFolder = 'UploadFile\\allFileUploadTimeSheet\\' + req.body.userId + '\\' + moment().format("X");
        tagetFolder = __dirname.substr(0, __dirname.search("controllers")) + tagetFolder;
        mkdirp(tagetFolder, function(err) {
            if (err) {
                console.log("*****ERROR:" + err + "*****");
            }
            var tmp_path = req.files.file.path;
            var taget_path = tagetFolder + "\\" + req.files.file.name;
            fs.rename(tmp_path, taget_path, function(err) {
                if (err) throw err;
                fs.unlink(tmp_path, function() {
                    if (err) throw err;
                    else {
                        console.log("Upload file to " + taget_path + " - " + req.files.file.size + ' byte');
                        res.json({
                            status: "success"
                        });
                    }
                });
            });
        });

    },
    //END UPLOAD FILE
};
