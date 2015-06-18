//EXPORTS MODEL
var db = require("../../models");
//END
module.exports = {
    DownloadFile: function(req, res) {
        var file_id = req.body.idFile;
        //FIND FILE DOWNLOAD
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
                    res.json({
                        status: "success",
                        result: result.path_file
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
        //END FIND FILE DOWNLOAD
    },
};
