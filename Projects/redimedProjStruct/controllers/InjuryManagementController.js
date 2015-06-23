var db = require('../models');

var fs = require('fs');
var util = require("util");
var mime = require("mime");
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var gcm = require('node-gcm');
var apns = require('apn');
var mkdirp = require('mkdirp');
var moment = require('moment');
var _ = require('lodash-node');
var bcrypt = require('bcrypt-nodejs');

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

var sender = new gcm.Sender('AIzaSyDsSoqkX45rZt7woK_wLS-E34cOc0nat9Y');

var options = {
        cert: './key/APN/PushCert.pem',                                                    
        key:  './key/APN/PushKey.pem',                                                     
        passphrase: '123456',                              
        production: false,                                 
        port: 2195,                                    
        rejectUnauthorized: true,                                                                    
        cacheLength: 1000,                              
        autoAdjustCache: true,                         
    }

var apnsConnection = new apns.Connection(options);

function log(type) {
    return function() {
        console.log(type, arguments);
    }
}

apnsConnection.on('error', log('error'));
apnsConnection.on('transmitted', log('transmitted'));
apnsConnection.on('timeout', log('timeout'));
apnsConnection.on('connected', log('connected'));
apnsConnection.on('disconnected', log('disconnected'));
apnsConnection.on('socketError', log('socketError'));
apnsConnection.on('transmissionError', log('transmissionError'));
apnsConnection.on('cacheTooSmall', log('cacheTooSmall')); 
apnsConnection.on('completed',log('completed'));

module.exports = {
      patientByUser: function(req,res){
        var userId = req.body.user;

        db.Patient.find({where:{user_id:userId}},{raw:true})
          .success(function(rs){
              res.json({status:'success',data:rs})
          })
          .error(function(err){
              res.json({status:'error'});
              console.log(err);
          })
      },
      register: function(req,res){
        var info = req.body.user;
        var patient = req.body.patient;
        
        info.password = bcrypt.hashSync(info.password);

        db.UserType.find({where:{user_type:'Patient'}},{raw:true})
          .success(function(type){
              info.user_type = type.ID;
              info.isEnable = 1;

              db.User.max('id')
                .success(function(max){
                    info.id = max + 1;
                    db.User.create(info)
                      .success(function(){
                          patient.user_id = info.id;
                          db.Patient.create(patient)
                            .success(function(){
                              res.json({status:'success'});
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
          var userId =  req.body.userId;

          db.IMInjury.create({
              patient_id: imInfo.Patient_id,
              user_submit: userId,
              doctor_id: imInfo.doctor_id,
              cal_id: imInfo.cal_id,
              injury_date: imInfo.injury_date,
              injury_description: imInfo.injury_description,
              STATUS: imInfo.cal_id == null || typeof imInfo.cal_id === 'undefined' ?"New":null,
              pickup_address: imInfo.cal_id == null || typeof imInfo.cal_id === 'undefined' ? (imInfo.infoMaps.format_address == null || typeof imInfo.infoMaps.format_address === 'undefined' ? null : imInfo.infoMaps.format_address) : null,
              latitude: imInfo.cal_id == null || typeof imInfo.cal_id === 'undefined' ?  (imInfo.infoMaps.lat == null || typeof imInfo.infoMaps.lat === 'undefined' ? null : imInfo.infoMaps.lat) : null,
              longitude: imInfo.cal_id == null || typeof imInfo.cal_id === 'undefined' ? (imInfo.infoMaps.lng == null || typeof imInfo.infoMaps.lng === 'undefined' ? null : imInfo.infoMaps.lng) : null
          },{raw:true})
              .success(function(data){
                  db.IMInjury.find({where:data.dataValues},{raw:true})
                      .success(function(rs){
                          if(imInfo.cal_id != null)
                          {
                              var pId = imInfo.Patient_id;
                              var aId = imInfo.cal_id;

                              var sqlCompany = "SELECT p.*,c.Company_name FROM cln_patients p INNER JOIN companies c ON p.company_id = c.id WHERE p.Patient_id = ?";
                              var sqlPatient = "SELECT p.* FROM cln_patients p WHERE p.Patient_id = ?";

                              db.sequelize.query((typeof imInfo != 'undefined' && imInfo.user_type == 'Patient') ? sqlPatient : sqlCompany,null,{raw:true},[pId])
                                  .success(function(pData){
                                      if(pData)
                                      {
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
                                      }
                                      
                                  })
                                  .error(function(err){
                                      console.log(err);
                                  })
                          }
                          else
                          {
                            db.Appointment.max('CAL_ID')
                              .success(function(max)
                              {
                                  var id = max + 1;
                                  db.Appointment.create({
                                    SITE_ID: 1,
                                    FROM_TIME: moment.utc(),
                                    TO_TIME: moment.utc()
                                  })
                                  .success(function(){
                                      db.ApptPatient.create({
                                        Patient_id: imInfo.Patient_id,
                                        CAL_ID: id,
                                        appt_status: 'Injury',
                                        injury_id: rs.injury_id
                                      })
                                      .success(function(){
                                        console.log("Success");
                                      })
                                      .error(function(err){
                                        console.log(err);
                                      })
                                  })
                                  .error(function(err){
                                      console.log(err);
                                  })
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

        var injury_id = req.body.injury_id;
        var description = req.body.description;

        if(typeof injury_id !== 'undefined')
        {
              var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
              var targetFolder=prefix+'uploadFile\\'+'InjuryManagement\\'+'injuryID_'+injury_id;
              var targetFolderForSave='.\\uploadFile\\'+'InjuryManagement\\'+'injuryID_'+injury_id;

              mkdirp(targetFolder, function(err) {
                  if(req.files)
                  {
                    var tmp_path = req.files.file.path;

                    console.log(req.files.file.name);

                    var target_path =targetFolder+ "\\" + req.files.file.name;
                    var target_path_for_save=targetFolderForSave+ "\\" + req.files.file.name
                    fs.rename(tmp_path, target_path, function(err) {
                        if (err) throw err;
                        fs.unlink(tmp_path, function() {
                            if (err) throw err;
                        });
                    });

                    db.IMInjuryImage.create({
                        injury_id: injury_id,
                        img_url: target_path_for_save,
                        description: description
                    })
                        .success(function(data){
                            res.json({status:'success'});
                        })
                        .error(function(err){
                            res.json({status:'error'});
                            console.log(err);
                        })
                  }
              });
        }

        
    },
    injuryList: function(req,res){
        db.sequelize.query("SELECT i.*,p.*, u.user_name as driverUser, u.Booking_Person as driverName, CONCAT(IFNULL(p.Title,''), ' . ', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName " +
                            "FROM `im_injury` i " +
                            "INNER JOIN `cln_patients` p ON i.`patient_id` = p.`Patient_id` " +
                            "LEFT JOIN users u ON u.id = i.driver_id " +
                            "WHERE i.`cal_id` IS NULL ORDER BY  i.`STATUS` = 'New' DESC, i.`STATUS` = 'Waiting' DESC, i.`STATUS` = 'Done' DESC, i.`injury_date` DESC",null,{raw:true})
            .success(function(data){
                res.json({status:'success',data:data})
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    injuryListByPatient: function(req,res){
      var patient_id = req.body.patient_id;
        db.sequelize.query("SELECT i.*,p.*, u.user_name as driverUser, u.Booking_Person as driverName " +
                            "FROM `im_injury` i " +
                            "INNER JOIN `cln_patients` p ON i.`patient_id` = p.`Patient_id` " +
                            "LEFT JOIN users u ON u.id = i.driver_id " +
                            "WHERE i.`cal_id` IS NULL AND i.patient_id = ? "+
                            "ORDER BY  i.`STATUS` = 'New' DESC, i.`STATUS` = 'Waiting' DESC, i.`STATUS` = 'Done' DESC, i.`injury_date` DESC",null,{raw:true},[patient_id])
            .success(function(data){
                res.json({status:'success',data:data})
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    searchByDate: function(req,res){
        var from = req.body.from;
        var to = req.body.to;

        db.sequelize.query("SELECT i.*,p.*, u.user_name as driverUser, u.Booking_Person as driverName, CONCAT(IFNULL(p.Title,''), ' . ', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName " +
        "FROM `im_injury` i " +
        "INNER JOIN `cln_patients` p ON i.`patient_id` = p.`Patient_id` " +
        "LEFT JOIN users u ON u.id = i.driver_id " +
        "WHERE i.`cal_id` IS NULL AND i.injury_date BETWEEN ? AND ? ORDER BY  i.`STATUS` = 'New' DESC, i.`STATUS` = 'Waiting' DESC, i.`STATUS` = 'Done' DESC, i.`injury_date` DESC",null,{raw:true},[from,to])
            .success(function(data){
                res.json({status:'success',data:data})
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    searchByDatePatient: function(req,res){
        var from = req.body.from;
        var to = req.body.to;
        var patient_id = req.body.patient_id;

        db.sequelize.query("SELECT i.*,p.*, u.user_name as driverUser, u.Booking_Person as driverName " +
        "FROM `im_injury` i " +
        "INNER JOIN `cln_patients` p ON i.`patient_id` = p.`Patient_id` " +
        "LEFT JOIN users u ON u.id = i.driver_id " +
        "WHERE i.`cal_id` IS NULL AND i.patient_id = ? AND i.injury_date BETWEEN ? AND ? ORDER BY  i.`STATUS` = 'New' DESC, i.`STATUS` = 'Waiting' DESC, i.`STATUS` = 'Done' DESC, i.`injury_date` DESC",null,{raw:true},[patient_id,from,to])
            .success(function(data){
                res.json({status:'success',data:data})
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    injuryById: function(req,res){
        var injury_id = req.body.injury_id;

        db.sequelize.query("SELECT i.*,p.*,CONCAT(IFNULL(p.Title,''), ' . ', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName,c.Company_name as CompanyName,c.Addr as CompanyAddr, c.Industry FROM `im_injury` i INNER JOIN `cln_patients` p ON i.`patient_id` = p.`Patient_id` INNER JOIN companies c ON c.id = p.company_id WHERE i.`injury_id` = ?",null,{raw:true},[injury_id])
            .success(function(data){
                if(data.length > 0)
                {
                  db.IMInjuryImage.findAll({where:{injury_id: injury_id}},{raw:true})
                    .success(function(rs){
                        if(rs.length > 0)
                        {
                            var imgArr = [];
                            for(var i=0; i<rs.length ; i++)
                            {
                              if(rs[i].img_url!=null || rs[i].img_url!='')
                                  imgArr.push({id:rs[i].id, desc: rs[i].description});
                            }
                            if(imgArr.length > 0)
                              data[0].injuryImg = imgArr;
                        }
                        res.json({status:'success',data:data})
                    })
                }
                else
                  res.json({status:'error',error:err})
                
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    injuryImageById: function(req,res) {
        var imageId = req.param('imageId');

        db.IMInjuryImage.find({where: {id: imageId}}, {raw: true})
            .success(function(data){
              if(data)
              {
                if(data.img_url!=null || data.img_url!='')
                {
                    fs.exists(data.img_url,function(exists){
                      if (exists) {
                        res.sendfile(data.img_url);
                      } else {
                        res.sendfile("./uploadFile/no-image.png");
                      }
                    })
                    
                }
              }
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    editInjury: function(req,res)
    {
        var info = req.body.info;
        var id = req.body.injury_id;
        var geolocation = req.body.geo;

        db.IMInjury.update(info,{injury_id:id})
            .success(function(){
                if(info.STATUS == 'Done'){
                    db.IMInjury.find({where:{injury_id:id}},{raw:true})
                        .success(function(im){
                            db.DriverInjury.update({
                                STATUS:'Done'
                            },{driver_id: im.driver_id, patient_id:im.patient_id})
                                .success(function(){
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
                }
                if(info.STATUS == 'Waiting')
                {
                    db.IMInjury.find({where:{injury_id:id}},{raw:true})
                        .success(function(im){

                            db.sequelize.query("SELECT p.*,CONCAT(IFNULL(p.Title,''), '.', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName FROM `cln_patients` p WHERE p.`Patient_id` = ?",null,{raw:true},[im.patient_id])
                                .success(function(data)
                                {
                                   var time = (geolocation.duration / 60);

                                    // ==============GCM PUSH==============
                                    var message = new gcm.Message();
                                    message.addData('title','REDiMED');
                                    message.addData('message',data[0].FullName+" will be picked up in "+ time +" minutes.");
                                    message.addData('injury_id',id);
                                    message.addData('time',time);
                                    message.addData('soundname','notification.wav');
                                    message.collapseKey = 'REDiMED';
                                    message.delayWhileIdle = true;
                                    message.timeToLive = 3;

                                    // =============APN PUSH=============
                                    var notify = new apns.Notification();
                                    notify.expiry = Math.floor(Date.now() / 1000) + 3600; 
                                    notify.badge = 1;
                                    notify.sound = 'notification.wav';
                                    notify.alert = data[0].FullName+" will be picked up in "+ time +" minutes.";
                                    notify.payload = {'messageFrom': 'REDiMED'}; 

                                    var androidToken = [];
                                    var iosToken = [];

                                    db.UserToken.find({where: {user_id:im.user_submit}}, {raw: true})
                                        .success(function (data) {
                                            if(data)
                                            {
                                                if (data.android_token != null)
                                                    androidToken.push(data.android_token);
                                                if (data.ios_token != null)
                                                    iosToken.push(data.ios_token);

                                                if(androidToken.length > 0)
                                                {
                                                  sender.send(message, androidToken, 4, function (err,result) {
                                                      if(err)
                                                          console.log("ERROR:",err);
                                                      else
                                                          console.log("SUCCESS:",result);
                                                  });
                                                }

                                                if(iosToken.length > 0)
                                                  apnsConnection.pushNotification(notify, iosToken);
                                            }
                                        })
                                        .error(function (err) {
                                            console.log(err);
                                        })

                                })
                                .error(function(err){
                                    res.json({status:'error',error:err})
                                })

                            db.DriverInjury.create({
                                driver_id: im.driver_id,
                                patient_id: im.patient_id,
                                STATUS : 'Picking',
                                pickup_date: new Date()
                            })
                                .success(function(){
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
                }

                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    getListDriverOnline: function(req,res){
        db.UserType.find({where:{user_type:'Driver'}},{raw:true})
            .success(function(rs){
                db.User.findAll({where:["socket IS NOT NULL and user_type = ?",rs.ID],attributes:['id','user_name','Booking_Person']},{raw:true})
                    .success(function(data){
                        res.json({data:data});
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
    allocateDriver: function(req,res){
        var driverId = req.body.driverId;
        var patientId = req.body.patientId;
        var injuryId = req.body.injuryId;

        db.IMInjury.find({where:{injury_id: injuryId}},{raw:true})
            .success(function(injury){

                //=====GCM Push=======
                var message = new gcm.Message();
                message.addData('title','EMERGENCY');
                message.addData('message','You have new patient to pickup!');
                message.addData('injury_id',injuryId);

                if(injury.latitude != null)
                    message.addData('lat',injury.latitude);
                if(injury.longitude != null)
                    message.addData('lng',injury.longitude);

                message.addData('soundname','beep.wav');
                message.collapseKey = 'EMERGENCY';
                message.delayWhileIdle = true;
                message.timeToLive = 3;

                // =============APN PUSH=============
                var notify = new apns.Notification();
                notify.expiry = Math.floor(Date.now() / 1000) + 3600; 
                notify.badge = 1;
                notify.sound = 'beep.wav';
                notify.alert = "You have new patient to pickup!";
                notify.payload = {'messageFrom': 'REDiMED'}; 

                var androidToken = [];
                var iosToken = [];
                db.UserType.find({where:{user_type:'Driver'}},{raw:true})
                    .success(function(type){
                        db.UserToken.find({where: {user_type: type.ID,user_id:driverId}}, {raw: true})
                            .success(function (data) {
                                if(data)
                                {
                                    if (data.android_token != null)
                                        androidToken.push(data.android_token);
                                    if (data.ios_token != null)
                                        iosToken.push(data.ios_token);

                                    if(androidToken.length > 0)
                                    {
                                      sender.send(message, androidToken, 4, function (err,result) {
                                          if(err)
                                              console.log("ERROR:",err);
                                          else
                                              console.log("SUCCESS:",result);
                                      });
                                    }
                                    
                                    if(iosToken.length > 0)
                                       apnsConnection.pushNotification(notify, iosToken);
                                }
                            })
                            .error(function (err) {
                                console.log(err);
                            })
                    })
                    .error(function (err) {
                        console.log(err);
                    })
            })
            .error(function (err) {
                console.log(err);
            })
    },
    getOnlineUsers: function(req,res){
        var userList = [];
        db.User.findAll({where: "socket IS NOT NULL"},{raw:true})
            .success(function(data){
                if(data)
                {
                    for (var i = 0; i < data.length; i++) {
                        userList.push({
                            id: data[i].id,
                            username: data[i].user_name,
                            socket: data[i].socket,
                            fullName: data[i].Booking_Person
                        });
                    }
                    res.json({data:userList});
                }
            })
            .error(function(err){
                console.log(err);
            })
    },
    getInjuryByCompany: function(req,res){
        var companyId = req.body.companyId;

        db.sequelize.query("SELECT i.*,p.*,CONCAT(IFNULL(p.Title,''), ' . ', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName,c.Company_name as CompanyName,c.Addr as CompanyAddr, c.Industry FROM `im_injury` i " +
                            "INNER JOIN `cln_patients` p ON i.`patient_id` = p.`Patient_id` " +
                            "INNER JOIN companies c ON c.id = p.company_id " +
                            "WHERE c.id = ?",null,{raw:true},[companyId])
            .success(function(data){
                res.json({status:'success',data:data})
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    getDevices: function(req,res){
      db.MedicalDevice.findAll({raw: true})
            .success(function(data){
                var arr = [];

                for(var i=0; i<data.length; i++)
                {
                    arr.push({id: data[i].id,
                              // device_id:data[i].device_id,
                              // device_img:data[i].device_img!=null || data[i].device_img!='' ? base64Image(data[i].device_img):'',
                              device_name:data[i].device_name});
                }

                res.json({status:'success',data:arr});
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    loadSideMenu: function(req,res)
    {
      db.sequelize.query("SELECT m.Menu_Id, m.Type AS MenuIcon,m.Description,IFNULL(m.Definition,' ') AS MenuDefinition,IFNULL(f.Definition,' ') AS Definition,IFNULL(m.Parent_Id,-1) AS Parent_Id,f.Type,m.isEnable,m.`isMobile` "+
                          "FROM redi_menus m LEFT OUTER JOIN redi_functions f ON m.function_id = f.function_id "+
                          "WHERE m.isEnable = 1 "+
                          "AND m.`isMobile` = 1 "+
                          "AND (m.`description` LIKE 'Injury Management' "+
                          "OR m.`parent_id` = (SELECT Menu_Id FROM redi_menus WHERE `description` LIKE 'Injury Management' AND isEnable = 1 AND isMobile = 1))",null,{raw:true})
          .success(function(data){
              res.json(data);
          })
          .error(function(err){
              res.json({status:'fail',
                  error:err});
          })
    }
};

function base64Image(src) {
    var data;
    try{
        data = fs.readFileSync(src).toString("base64");
        return util.format("data:%s;base64,%s", mime.lookup(src), data);
    }
    catch(err){
        if (err.code !== 'ENOENT')
            return null;
    }
}

function getDistance(p1,p2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(p2.lat-p1.lat);  // deg2rad below
    var dLon = deg2rad(p2.lng-p1.lng);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(p1.lat)) * Math.cos(deg2rad(p2.lat)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}




