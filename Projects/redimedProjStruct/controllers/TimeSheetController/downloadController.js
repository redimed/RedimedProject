//EXPORTS MODEL
var db = require("../../models");
var fs = require("fs");
var path = require("path");
var mime = require('mime');
//END
module.exports = {
    /*
    DownloadFile: download attach files
    input: id of file download
    output: - success: send file user download
            - fail: send message error
    */
    DownloadFile: function(req, res) {
        var file_id = req.params.idFile;
        db.time_task_file.find({
                where: {
                    file_id: file_id
                }
            }, {
                raw: true
            })
            .success(function(result) {
                if (result !== undefined &&
                    result !== null &&
                    result.length !== 0) {
                    var fileName = path.basename(result.path_file);
                    var mineType = mime.lookup(result.path_file);
                    res.setHeader('Content-type', mineType);
                    res.setHeader('Content-disposition', 'filename=' + fileName);
                    var readStream = fs.createReadStream(result.path_file);
                    //send file to client
                    readStream.on('open', function() {
                        readStream.pipe(res);
                    });
                    readStream.on('finish', function() {
                        file.close();
                    });
                    readStream.on('error', function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                    });
                    return;
                } else {
                    res.json({
                        status: "error"
                    });
                    return;
                }
            })
            .error(function(err) {
                console.log("****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },
};
