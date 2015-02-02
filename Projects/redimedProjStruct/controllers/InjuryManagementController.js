var db = require('../models');

var fs = require('fs');
var util = require("util");
var mime = require("mime");
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var gcm = require('node-gcm');
var mkdirp = require('mkdirp');

var _ = require('lodash-node');

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

          console.log(imInfo);

          db.IMInjury.create({
              patient_id: imInfo.Patient_id,
              user_submit: imInfo.userId,
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
    injuryById: function(req,res){
        var injury_id = req.body.injury_id;

        db.sequelize.query("SELECT i.*,p.*,CONCAT(IFNULL(p.Title,''), ' . ', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName,c.Company_name as CompanyName,c.Addr as CompanyAddr, c.Industry FROM `im_injury` i INNER JOIN `cln_patients` p ON i.`patient_id` = p.`Patient_id` INNER JOIN companies c ON c.id = p.company_id WHERE i.`injury_id` = ?",null,{raw:true},[injury_id])
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
                    arr.push({imgId:data[i].injury_image_id,image:data[i].image!=null || data[i].image!='' ? base64Image(data[i].image):'',description:data[i].description});
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
                            var p1 = {lat: im.latitude,lng:im.longitude};
                            var p2 = geolocation;

                            console.log("==========Distance: ",getDistance(p1,p2)+" km ");
                            console.log("==========Time: ", ((getDistance(p1,p2) / 45) * 60)+" minutes ");



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
                        res.json(data);
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

        var sender = new gcm.Sender('AIzaSyDsSoqkX45rZt7woK_wLS-E34cOc0nat9Y');
        var message = new gcm.Message();
        message.addData('title','EMERGENCY');
        message.addData('message','You have new patient to pickup!');
        message.addData('injury_id',injuryId);
        message.addData('soundname','beep.wav');
        message.collapseKey = 'EMERGENCY';
        message.delayWhileIdle = true;
        message.timeToLive = 3;
        var registrationIds = [];

        db.UserType.find({where:{user_type:'Driver'}},{raw:true})
            .success(function(type){
                db.UserToken.find({where: {user_type: type.ID,user_id:driverId}}, {raw: true})
                    .success(function (data) {
                        if(data)
                        {
                            if (data.android_token != null)
                                registrationIds.push(data.android_token);

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
                        }

                    })
                    .error(function (err) {
                        console.log(err);
                    })
            })
            .error(function (err) {
                console.log(err);
            })
        res.json({status:'success'});


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

        db.UserType.find({where:{user_type:'Driver'}},{raw:true})
            .success(function(type){
                db.UserToken.findAll({where: {user_type: type.ID}}, {raw: true})
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
            })
            .error(function (err) {
                console.log(err);
            })


    },
    getOnlineUsers: function(req,res){
        var userList = [];
        db.User.findAll({where: "socket IS NOT NULL"},{raw:true})
            .success(function(data){
                for (var i = 0; i < data.length; i++) {
                    userList.push({
                        id: data[i].id,
                        username: data[i].user_name,
                        socket: data[i].socket,
                        img: data[i].img
                    });
                }
                res.json(userList);
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




