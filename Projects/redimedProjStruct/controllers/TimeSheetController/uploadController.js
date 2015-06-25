 //EXPORTS MODEL
 var db = require("../../models");
 var mkdirp = require('mkdirp');
 var fs = require('fs');
 var moment = require('moment');
 //END
 module.exports = {
         UploadFile: function(req, res) {
             var id_task_week = null;
             var tagetFolder = 'UploadFile\\allFileUploadTimeSheet\\' + req.body.userId;
             tagetFolder = __dirname.substr(0, __dirname.search("controllers")) + tagetFolder;
             mkdirp(tagetFolder, function(err) {
                         if (err) {
                             console.log("*****ERROR:" + err + "*****");
                         }
                         var tmp_path = req.files.file.path;
                         var taget_path = tagetFolder + "\\" + req.files.file.name;
                         fs.rename(tmp_path, taget_path, function(err) {
                                 if (err) {
                                     throw err;
                                     res.json({
                                         status: "error"
                                     });
                                     return;
                                 }
                                 fs.unlink(tmp_path, function() {
                                         if (err) {
                                             throw err;
                                             res.json({
                                                 status: "error"
                                             });
                                             return;
                                             else {
                                                 //INSERT PATH FILE
                                                 db.time_task_file.max('file_id')
                                                     .success(function(maxId) {
                                                         db.time_task_file.create({
                                                                 file_id: maxId + 1,
                                                                 path_file: taget_path,
                                                                 file_name: req.files.file.name,
                                                                 file_size: req.files.file.size,
                                                                 created_by: req.body.userId
                                                             })
                                                             .success(function(result) {
                                                                 console.log("Upload file to " + taget_path + " - " + req.files.file.size + ' byte');
                                                                 res.json({
                                                                     status: "success",
                                                                     file_id: maxId + 1
                                                                 });
                                                                 return;
                                                             })
                                                             .error(function(err) {
                                                                 console.log("*****ERROR:" + err + "*****");
                                                                 res.json({
                                                                     status: "error"
                                                                 });
                                                                 return;
                                                             });
                                                     })
                                                     .error(function(err) {
                                                         console.log("*****ERROR:" + err + "*****");
                                                         res.json({
                                                             status: "error"
                                                         });
                                                         return;
                                                     });
                                                 //END INSERT
                                             }
                                         });
                                 });
                         });

                 },
                 DeleteFile: function(req, res) {
                     var fileId = req.body.fileId;
                     db.sequelize.query("DELETE FROM time_item_file WHERE time_item_file.file_id=:fileId", null, {
                             raw: true
                         }, {
                             fileId: fileId
                         })
                         .success(function(isDelTimeItemFile) {
                             db.sequelize.query("DELETE FROM time_task_file WHERE time_task_file.file_id=:fileId", null, {
                                     raw: true
                                 }, {
                                     fileId: fileId
                                 })
                                 .success(function(isDelTimeTaskFile) {
                                     res.json({
                                         status: "success"
                                     });
                                 })
                                 .error(function(err) {
                                     console.log("*****ERROR:" + err + "*****");
                                     res.json({
                                         status: "error"
                                     });
                                 });
                         })
                         .error(function(err) {
                             console.log("*****ERROR:" + err + "*****");
                             res.json({
                                 status: "error"
                             });
                         });
                 }
         };
