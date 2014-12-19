var db = require('../models');

var fs = require('fs');
var util = require("util");
var mime = require("mime");
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var gcm = require('node-gcm');
var mkdirp = require('mkdirp');


var OTKEY = "45110172";
var OTSECRET = "2c6760b523e735a60c125af9d1a8a1f906bbd4c9";

var OpenTok = require('opentok'),
    opentok = new OpenTok(OTKEY, OTSECRET);



var transport = nodemailer.createTransport(smtpTransport({
    host: "mail.redimed.com.au", // hostname
    secure: false,
    port: 25, // port for secure SMTP
    auth: {
        user: "programmer2",
        pass: "Hello8080"
    },
    tls: {rejectUnauthorized: false},
    debug:true
}));

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

            db.Patient.findAll({where:["Email LIKE ?",email]},{raw:true})
                .success(function(data){
                    res.json({status:'success',data:data});
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
              STATUS: "New",
              pickup_address: imInfo.infoMaps.format_address == null || typeof imInfo.infoMaps.format_address == 'undefined' ? null : imInfo.infoMaps.format_address,
              latitude:  imInfo.infoMaps.lat == null || typeof imInfo.infoMaps.lat == 'undefined' ? null : imInfo.infoMaps.lat,
              longitude: imInfo.infoMaps.lng == null || typeof imInfo.infoMaps.lng == 'undefined' ? null : imInfo.infoMaps.lng
          },{raw:true})
              .success(function(data){
                  db.IMInjury.find({where:data.dataValues},{raw:true})
                      .success(function(rs){
                          //Start Push GCM Android
                          if(imInfo.cal_id == null || typeof imInfo.cal_id == 'undefined') {
                              var date = new Date();
                              var dateString =  date.getUTCDate()+ "/" + (date.getUTCMonth()+1) + "/" + date.getUTCFullYear() + " - " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();

                              var sender = new gcm.Sender('AIzaSyDsSoqkX45rZt7woK_wLS-E34cOc0nat9Y');
                              var message = new gcm.Message();
                              message.addData('title','EMERGENCY');
                              message.addData('message','You have an emergency case! - Time: '+dateString);
                              message.addData('injury_id',rs.injury_id);
                              message.addData('soundname','beep.wav');
                              message.collapseKey = 'EMERGENCY';
                              message.delayWhileIdle = true;
                              message.timeToLive = 3;
                              var registrationIds = [];

                              db.UserToken.findAll({where: {user_type: 'Driver'}}, {raw: true})
                                  .success(function (data) {
                                      for (var i = 0; i < data.length; i++) {
                                          if (data[i].android_token != null)
                                              registrationIds.push(data[i].android_token);
                                      }

                                      sender.send(message, registrationIds, 4, function (err,result) {
                                          if(err)
                                          {
                                              console.log("ERROR:",err);
                                          }
                                          else
                                          {
                                              console.log("SUCCESS:",result);
                                          }

                                      });
                                  })
                                  .error(function (err) {
                                      console.log(err);
                                  })
                          }
                          //End Push GCM Android

                          if(imInfo.cal_id != null)
                          {
                              var pId = imInfo.Patient_id;
                              var aId = imInfo.cal_id;

                              db.sequelize.query("SELECT p.*,c.Company_name FROM cln_patients p INNER JOIN companies c ON p.company_id = c.id WHERE p.Patient_id = ?",null,{raw:true},[pId])
                                  .success(function(pData){
                                      db.sequelize.query("SELECT c.*,r.Site_name,r.Site_addr FROM cln_appointment_calendar c LEFT JOIN redimedsites r ON c.SITE_ID = r.id WHERE CAL_ID = ?",null,{raw:true},[aId])
                                          .success(function(aData){
                                              var date = new Date(aData[0].FROM_TIME);
                                              var dateString =  date.getUTCDate()+ "/" + (date.getUTCMonth()+1) + "/" + date.getUTCFullYear() + " - " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();

                                              var mailOptions = {
                                                  from: "REDiMED <healthscreenings@redimed.com.au>", // sender address.  Must be the same as authenticated user if using Gmail.
                                                  to: pData[0].Email, // receiver
                                                  subject: "Confirmation for appointment of "+pData[0].Company_name+" # "+pData[0].Title+'.'+pData[0].First_name+' '+pData[0].Sur_name+' '+pData[0].Middle_name, // Subject line
                                                  html: "Please see below for details regarding your Medical Assessment at RediMED<br>"+
                                                  "<br>Your medical assessment has been booked at the following:</b><br>"+
                                                  "Date / Time: <b>" + dateString +"</b> <br>" +
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
											  console.log(mailOptions);

                                              transport.sendMail(mailOptions, function(error, response){  //callback
                                                  if(error){
                                                      console.log(error);
                                                      res.json({status:"fail"});
                                                  }else{
                                                      console.log("Message sent: " + response.message);
                                                      res.json({status:"success"});
                                                  }
                                                  transport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                                              });

                                          })
                                          .error(function(err){
                                              console.log(err);
                                          })
                                  })
                                  .error(function(err){
                                      console.log(err);
                                  })
                          }

                          res.json({status:'success',injury_id:rs.injury_id});

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
    },
    deleteToken: function(req,res){
        var data = req.body.info[0];


        if(data.platform != null && data.platform.toLowerCase() == 'android')
        {
            db.UserToken.destroy({
                user_id : data.info.id,
                user_type: data.info.user_type,
                android_token: data.token
            })
                .success(function(){res.json({status:'Success'});})
                .error(function(err){res.json({status:'Error',error:err});})
        }
        else if(data.platform != null && data.platform.toLowerCase() == 'ios')
        {
            db.UserToken.destroy({
                user_id : data.info.id,
                user_type: data.info.user_type,
                ios_token: data.token
            })
                .success(function(){res.json({status:'Success'});})
                .error(function(err){res.json({status:'Error',error:err});})
        }


    },
    injuryList: function(req,res){
        db.sequelize.query("SELECT i.*,p.* FROM `im_injury` i INNER JOIN `cln_patients` p ON i.`patient_id` = p.`Patient_id` WHERE i.`cal_id` IS NULL ORDER BY  i.`STATUS` = 'New' DESC, i.`STATUS` = 'Waiting' DESC, i.`STATUS` = 'Done' DESC, i.`injury_date` DESC",null,{raw:true})
            .success(function(data){
                res.json({status:'success',data:data})
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    injuryById: function(req,res){
        var injury_id = req.body.injury_id;

        db.sequelize.query("SELECT i.*,p.* FROM `im_injury` i INNER JOIN `cln_patients` p ON i.`patient_id` = p.`Patient_id` WHERE i.`injury_id` = ?",null,{raw:true},[injury_id])
            .success(function(data){
                res.json({status:'success',data:data})
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    injuryImageById: function(req,res) {
        var injury_id = req.body.injury_id;

        db.IMInjuryImage.findAll({where: {injury_id: injury_id}}, {raw: true})
            .success(function(data){
                var arr = [];

                for(var i=0; i<data.length; i++)
                {
                    arr.push({image:base64Image(data[i].image),description:data[i].description});
                }

                res.json({status:'success',data:arr});
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    editInjury: function(req,res)
    {
        var info = req.body.info;
        var id = req.body.injury_id;
        db.IMInjury.update(info,{injury_id:id})
            .success(function(){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    testPushGCM: function(req,res)
    {
        var date = new Date();
        var dateString =  date.getUTCDate()+ "/" + (date.getUTCMonth()+1) + "/" + date.getUTCFullYear() + " - " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();

        var sender = new gcm.Sender('AIzaSyDsSoqkX45rZt7woK_wLS-E34cOc0nat9Y');
        var message = new gcm.Message();
        message.addData('title','EMERGENCY');
        message.addData('message','You have an emergency case!');
        message.addData('message','You have an emergency case! - Time: '+dateString);
        message.addData('soundname','beep.wav');
        message.collapseKey = 'EMERGENCY';
        message.delayWhileIdle = true;
        message.timeToLive = 3;
        var registrationIds = [];

        db.UserToken.findAll({where: {user_type: 'Driver'}}, {raw: true})
            .success(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].android_token != null)
                        registrationIds.push(data[i].android_token);
                }

                sender.send(message, registrationIds, 4, function (err,result) {
                    if(err)
                    {
                        console.log("ERROR:",err);
                        res.json({status:'error'});
                    }
                    else
                    {
                        console.log("SUCCESS:",result);
                        res.json({status:'success'});
                    }

                });
            })
            .error(function (err) {
                console.log(err);
            })
    },
    makeCall: function(req,res){
        var userId = req.body.user_id;
        db.UserToken.find({where:{user_id: userId}},{raw:true})
            .success(function(data){
                var token = opentok.generateToken(data.roomSession,{ role: 'moderator' });
                res.json({
                    apiKey: OTKEY,
                    sessionId: data.roomSession,
                    token: token
                })
            })
            .error(function(err){
                res.json(err);
                console.log(err);
            })
    }
};

function base64Image(src) {
    var data = fs.readFileSync(src).toString("base64");
    return util.format("data:%s;base64,%s", mime.lookup(src), data);
}




