/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var db = require('../models');
var mkdirp = require('mkdirp');
var fs = require('fs');
module.exports = {
      search : function(req,res) {
          var comId = req.body.companyId;
          db.sequelize.query("SELECT p.Patient_id, p.Title, p.First_name, p.Sur_name, p.Middle_name, p.DOB, p.Mobile FROM cln_patients p WHERE p.company_id = ?", null, {raw: true},[comId])
              .success(function (data) {
                  res.json({status: 'success', rs: data});
              })
              .error(function (err) {
                  res.json({status: 'error', err: err});
                  console.log(err);
              })
      },
      getById: function(req,res){
          var id = req.body.id;
          db.Patient.find({where:{Patient_id: id}},{raw:true})
              .success(function(data){
                  res.json(data);
              })
              .error(function(err){
                  res.json('error');
                  console.log(err);
              })
      },
      checkMobile: function(req,res){
          var mobile = req.body.mobile;

          db.Patient.count({where:["Mobile LIKE ?",mobile]})
              .success(function(c){
                  res.json({status:'success',count:c});
              })
              .error(function(err){
                  res.json({status:'success'});
                  console.log(err);
              })
      },
        checkEmail: function(req,res){
            var email = req.body.email;

            db.Patient.count({where:["Email LIKE ?",email]})
                .success(function(c){
                    res.json({status:'success',count:c});
                })
                .error(function(err){
                    res.json({status:'success'});
                    console.log(err);
                })
        },
      submitInjury: function(req,res){
          var imInfo = req.body.info;

          db.IMInjury.create({
              patient_id: imInfo.patient_id,
              driver_id: imInfo.driver_id,
              doctor_id: imInfo.doctor_id,
              cal_id: imInfo.cal_id,
              injury_date: imInfo.injury_date,
              injury_description: imInfo.injury_description,
              STATUS: imInfo.STATUS
          },{raw:true})
              .success(function(data){
                  res.json({status:'success'});
              })
              .error(function(err){
                  res.json({status:'error'});
                  console.log(err);
              })
      },
    uploadInjuryPic: function(req,res){
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+'upload-file\\'+'InjuryManagement\\'+'pID'+req.body.patient_id+'\\iID'+injury_id;
        var targetFolderForSave='upload-file\\'+'InjuryManagement\\'+'pID'+req.body.patient_id+'\\iID'+injury_id;

        //Params
        console.log(req.body.a);

        mkdirp(targetFolder, function(err) {
            var tmp_path = req.files.file.path;

            var target_path =targetFolder+ "\\" + req.files.file.name;
            var target_path_for_save=targetFolderForSave+ "\\" + req.files.file.name
            // move the file from the temporary location to the intended location
            fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;
                // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                fs.unlink(tmp_path, function() {
                    if (err) throw err;
                    console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes')
                    //res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
                });
            });

        });

    }
};
