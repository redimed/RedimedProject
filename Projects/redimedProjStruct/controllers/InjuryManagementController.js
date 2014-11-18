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
        console.log(req.files.file);
    }
};