/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var db = require('../models');
var mkdirp = require('mkdirp');
var fs = require('fs');
var f = require('./functions.js');


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
              patient_id: imInfo.Patient_id,
              driver_id: imInfo.driver_id,
              doctor_id: imInfo.doctor_id,
              cal_id: imInfo.cal_id,
              injury_date: imInfo.injury_date,
              injury_description: imInfo.injury_description,
              STATUS: imInfo.STATUS
          },{raw:true})
              .success(function(data){
                  db.IMInjury.max('injury_id')
                      .success(function(max){
                          if(imInfo.cal_id != null)
                          {
                              var pId = imInfo.Patient_id;
                              var aId = imInfo.cal_id;

                              db.sequelize.query("SELECT p.*,c.Company_name FROM cln_patients p INNER JOIN companies c ON p.company_id = c.id WHERE p.Patient_id = ?",null,{raw:true},[pId])
                                  .success(function(pData){
                                      db.sequelize.query("SELECT c.*,r.Site_name,r.Site_addr FROM cln_appointment_calendar c LEFT JOIN redimedsites r ON c.SITE_ID = r.id WHERE CAL_ID = ?",null,{raw:true},[aId])
                                          .success(function(aData){
                                              var mailOptions = {
                                                  from: "REDiMED <healthscreenings@redimed.com.au>", // sender address.  Must be the same as authenticated user if using Gmail.
                                                  to: pData[0].Email, // receiver
                                                  subject: "Confirmation for appointment of "+pData[0].Company_name+" # "+pData[0].Title+'.'+pData[0].First_name+' '+pData[0].Sur_name+' '+pData[0].Middle_name, // Subject line
                                                  html: "Please see below for details regarding your Medical Assessment at RediMED<br>"+
                                                  "<br>Your medical assessment has been booked at the following:</b><br>"+
                                                  "Date / Time: <b>" + new Date(aData[0].FROM_TIME).format("dd/MM/yyyy - hh:mm:ss") +"</b> <br>" +
                                                  "Location: <b>REDiMED " + aData[0].Site_name + "</b><br>" +
                                                  "<br>" +
                                                  "<b>Please ensure you arrive 15 minutes prior to your appointment time to complete any paperwork required.</b>" +
                                                  "<br>" +
                                                  "- Please bring current photo ID (driver's license/passport/proof of age card). Failure to provide this will mean we will not be able to complete the medical and you will have to reschedule. <br>" +
                                                  "- Please be 15 minutes early to your appointment, to complete any paperwork required.<br>" +
                                                  "- Candidate needs to wear enclosed shoes such as sneakers and comfortable, loose fitting clothing or clothing suitable for the gym (for medical and functional assessment only).<br>" +
                                                  "- If you are having a hearing assessment and need to have at least 16 hours of relatively quiet time before your appointment (no prolonged loud noises and avoid anything louder than a vacuum cleaner).<br>" +
                                                  "- For any queries, please call 92300990.<br>"

                                              };

                                              f.sendMail(mailOptions);


                                          })
                                          .error(function(err){
                                              console.log(err);
                                          })
                                  })
                                  .error(function(err){
                                      console.log(err);
                                  })
                          }

                          res.json({status:'success',injury_id:max});
                      })
                      .error(function(err){
                          res.json({status:'error'});
                          console.log(err);
                      })
              })
              .error(function(err){
                  res.json({status:'error'});
                  console.log(err);
              })

      },
    uploadInjuryPic: function(req,res){

        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+'uploadFile\\'+'InjuryManagement\\'+'injuryID_'+req.body.injury_id;
        var targetFolderForSave='.\\uploadFile\\'+'InjuryManagement\\'+'injuryID_'+req.body.injury_id;

        mkdirp(targetFolder, function(err) {
            var tmp_path = req.files.file.path;

            var target_path =targetFolder+ "\\" + req.files.file.name;
            var target_path_for_save=targetFolderForSave+ "\\" + req.files.file.name
            fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;
                fs.unlink(tmp_path, function() {
                    if (err) throw err;
                });
            });

            db.IMInjuryImage.create({
                injury_id: req.body.injury_id,
                image: target_path_for_save,
                description: req.body.description
            })
                .success(function(data){
                    res.json({status:'success'});
                })
                .error(function(err){
                    res.json({status:'error'});
                    console.log(err);
                })

        });



    }
};

