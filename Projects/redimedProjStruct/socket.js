var _ = require('lodash-node');
var db = require('./models');
var parser = require('socket.io-cookie');
var useragent = require('express-useragent');

var apiKey = "45250512";
var apiSecret = "dbc771fe427700feea2e481c56457f6024c72088";

var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, apiSecret);

var gcm = require('node-gcm');
var apns = require('apn');
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

module.exports = function(io,cookie,cookieParser) {
    var userList = [];
    var ua = null;

    io.use(parser);

    io.on('connection', function (socket) {

        var header = socket.request.headers;
        var source = header['user-agent'];
        ua = useragent.parse(source);

        socket.on('notifyPatient',function(apptId){
            db.sequelize.query("SELECT p.Title,p.`First_name`,p.`Sur_name`,p.`Middle_name`, d.`NAME` as doctor_name "+
                                "FROM cln_appt_patients a "+
                                "INNER JOIN cln_patients p ON a.`Patient_id` = p.`Patient_id` "+
                                "INNER JOIN doctors d ON a.`actual_doctor_id` = d.`doctor_id` "+
                                "WHERE a.id = ?",null,{raw:true},[apptId])
                .success(function(data){
                    if(data.length > 0)
                    {
                        var item = data[0];
                        var arrName = [];
                        arrName.push(item.Title, item.First_name, item.Sur_name, item.Middle_name);

                        io.sockets.emit('receiveNotifyPatient',arrName.join(' '), item.doctor_name);
                    }
                })
        })

        socket.on('notifyDoctor',function(doctorId){
            db.Doctor.find({where:{doctor_id: doctorId}},{raw:true})
                .success(function(doctor){
                    if(doctor.User_id)
                    {
                        db.User.find({where:{id: doctor.User_id}},{raw:true})
                            .success(function(user){
                                if(user.socket)
                                    io.to(user.socket).emit('receiveNotifyDoctor');
                            })
                            .error(function(err){
                                console.log(err);
                            })
                    }
                })
                .error(function(err){
                    console.log(err);
                })
        })

        socket.on('notifyReceptionist',function(){
            db.UserType.find({where:{user_type: 'Receptionist'}},{raw:true})
                .success(function(type){
                    db.User.findAll({where:{user_type: type.ID}},{raw:true})
                        .success(function(users){
                            if(users.length > 0)
                            {
                                for(var i=0; i< users.length; i++)
                                {
                                    if(users[i].socket)
                                        io.to(users[i].socket).emit('receiveNotifyReceptionist');
                                }   
                            }
                        })
                        .error(function(err){
                            console.log(err);
                        })
                })
                .error(function(err){
                    console.log(err);
                })
        })

        socket.on("generateSession",function(id){
            opentok.createSession({mediaMode:"routed"},function(err, ses) {
                if (err) 
                    return console.log(err);

                var token = ses.generateToken({
                    role : 'moderator'
                });

                var opentokRoom = {
                    apiKey: apiKey,
                    sessionId: ses.sessionId,
                    token: token
                }

                socket.emit("generateSessionSuccess",opentokRoom);
            });
        });

        socket.on('sendMessage', function (currUser,contactUser, message) {
            db.User.find({where:{id: currUser}},{raw:true})
                .success(function(currentUser){
                    if(currentUser)
                    {
                        db.User.find({where:{id:contactUser}},{raw:true})
                            .success(function(contact){
                                if(contact)
                                {
                                    if(contact.socket)
                                    {
                                        if(message.type == 'call')
                                        {
                                           var token = opentok.generateToken(message.sessionId);

                                           message.apiKey = apiKey;
                                           message.token = token;

                                           io.to(contact.socket)
                                                .emit('messageReceived',currentUser.id ,currentUser.user_name, message);

                                            // ==============GCM PUSH==============
                                            var gcmMessage = new gcm.Message();
                                            gcmMessage.addData('title','REDiMED');
                                            gcmMessage.addData('message', currentUser.user_name+" Is Calling!");
                                            gcmMessage.addData('soundname','beep.wav');
                                            gcmMessage.collapseKey = 'REDiMED';
                                            gcmMessage.delayWhileIdle = true;
                                            gcmMessage.timeToLive = 3;

                                            // =============APN PUSH=============
                                            var notify = new apns.Notification();
                                            notify.expiry = Math.floor(Date.now() / 1000) + 3600; 
                                            notify.badge = 1;
                                            notify.sound = 'beep.wav';
                                            notify.alert = currentUser.user_name+" Is Calling!";
                                            notify.payload = {'messageFrom': 'REDiMED','type':'call'}; 

                                            var androidToken = [];
                                            var iosToken = [];

                                            db.UserToken.find({where:{user_id: contact.id}},{raw:true})
                                                .success(function(user){
                                                    if(user)
                                                    {
                                                        if(user.android_token != null)
                                                            androidToken.push(user.android_token);
                                                        if(user.ios_token != null)
                                                            iosToken.push(user.ios_token);

                                                        if(androidToken.length > 0)
                                                        {
                                                          sender.send(gcmMessage, androidToken, 4, function (err,result) {
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
                                                .error(function(err){
                                                    console.log(err);
                                                })
                                        }
                                        else
                                        {
                                            io.to(contact.socket)
                                                .emit('messageReceived',currentUser.id ,currentUser.user_name, message);
                                        }
                                    }

                                }
                            })
                            .error(function(err){
                                console.log(err);
                            })
                    }

                })
                .error(function(err){
                    console.log(err);
                })
        });


        socket.on('reconnected',function(id){
            db.User.update({
                socket: socket.id
            },{id:id})
                .success(function(){
                    getOnlineUser();
                })
                .error(function(err){
                    console.log(err);
                })
        })

        socket.on('forceLogin',function(username){

            db.User.find({where:{user_name: username}},{raw:true})
                .success(function(user){
                    if(user.socket != null)
                    {
                        db.User.update({
                            socket: null
                        },{user_name: username})
                            .success(function(){
                                io.to(user.socket).emit('forceLogout');
                                getOnlineUser();
                            })
                            .error(function(err){
                                console.log(err);
                            })
                    }
                })
                .error(function(err){
                    console.log(err);
                })

        })

        socket.on('checkLogin',function(username){
            db.User.find({where:{user_name:username}},{raw:true})
                .success(function(user){
                    if(user)
                    {
                        if(user.socket == null)
                            socket.emit('isSuccess');
                        else
                            socket.emit('isError');                        
                    }
                })
                .error(function(err){
                    console.log(err);
                })
        });

        socket.on('updateSocketLogin',function(username){
            db.User.update({
                socket: socket.id
            },{user_name: username})
                .success(function(){
                    getOnlineUser();
                    socket.emit('login_success')
                })
                .error(function(err){
                    console.log(err);
                })

        })


        socket.on('logout', function (username,id,userType,info) {
           db.sequelize.query("UPDATE `users` SET `socket` = NULL, socketMobile = NULL WHERE `user_name`=? AND `id`=?",null,{raw:true},[username,id])
                .success(function(){
                    
                   if(info != null && typeof(info) != "undefined")
                   {
                       var data = info[0];
                       if(data.platform !== undefined && data.platform != null && data.platform.toLowerCase() == 'android')
                       {
                           db.UserToken.update({
                               android_token: null
                           },{user_id:data.info.id})
                               .success(function(){
                                   if(userType != null && userType == 'Driver')
                                       io.sockets.emit('driverLogout',id);

                                   socket.emit('logoutSuccess');
                                   getOnlineUser();
                               })
                               .error(function(err){
                                   console.log(err);
                               })
                       }
                       else if(data.platform !== undefined && data.platform != null && data.platform.toLowerCase() == 'ios')
                       {
                           db.UserToken.update({
                               ios_token: null
                           },{user_id:data.info.id})
                               .success(function(){
                                   if(userType != null && userType == 'Driver')
                                       io.sockets.emit('driverLogout',id);

                                   socket.emit('logoutSuccess');
                                   getOnlineUser();
                               })
                               .error(function(err){
                                   console.log(err);
                               })
                       }
                   }
                   else
                   {
                       socket.emit('logoutSuccess');
                       getOnlineUser();
                   }

                })
                .error(function(err){
                    console.log(err);
                })
        });

        socket.on('location',function(data){
            var arr = {};

            db.sequelize.query("SELECT d.*,CONCAT(IFNULL(p.Title,''), ' . ', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName " +
                                "FROM driverInjury d INNER JOIN cln_patients p ON d.patient_id = p.Patient_id " +
                                "WHERE d.driver_id = ? AND d.STATUS = 'Picking' AND DATE(d.pickup_date) = DATE(CURDATE())",null,{raw:true},[data[0].id])
                .success(function(rs){
                    arr.location = data[0];
                    arr.patientList = rs;

                    io.sockets.emit('driverLocation',arr);
                })
                .error(function(err){
                    console.log(err);
                })
        })

        socket.on("onlineMeasureData",function(id,info){
            if(id)
            {
                db.User.find({where:{id:id}},{raw:true})
                    .success(function(user){
                        if(user)
                        {
                            if(user.socket != null)
                                io.to(user.socket).emit('getMeasureData',info);
                        }

                    })
                    .error(function(err){
                        console.log(err);
                    })
            }

        })

        socket.on('lostCookie',function(){
            db.sequelize.query("UPDATE `users` SET `socket` = NULL WHERE socket = ?",null,{raw:true},[socket.id])
                .success(function(){
                    getOnlineUser();
                })
                .error(function(err){
                    console.log(err);
                })
        })

        // socket.on('disconnect', function (reason) {

        //     db.User.find({where:{socket:socket.id}},{raw:true})
        //         .success(function(user){
        //             if(user)
        //             {
        //                 db.UserType.find({where:{ID:user.user_type}},{raw:true})
        //                     .success(function(type){
        //                         if(type.user_type == 'Driver')
        //                             io.sockets.emit('driverLogout',user.id);

        //                         if(user.socket == socket.id)
        //                         {
        //                              db.sequelize.query("UPDATE `users` SET `socket` = NULL, socketMobile = NULL WHERE socket = ?", null, {raw: true}, [socket.id])
        //                                 .success(function () {
        //                                     getOnlineUser();
        //                                 })
        //                                 .error(function (err) {
        //                                     console.log(err);
        //                                 })
        //                         }

        //                         if(user.socketMobile == socket.id)
        //                         {
        //                             db.sequelize.query("UPDATE `users` SET socketMobile = NULL WHERE socketMobile = ?", null, {raw: true}, [socket.id])
        //                                 .success(function () {
        //                                     getOnlineUser();
        //                                 })
        //                                 .error(function (err) {
        //                                     console.log(err);
        //                                 })
        //                         }


                               
        //                     })
        //                     .error(function (err) {
        //                         console.log(err);
        //                     })
        //             }

        //         })
        //         .error(function (err) {
        //             console.log(err);
        //         })

        //         socket.removeAllListeners();

        // });


        function getOnlineUser(){
            userList = [];
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
                    io.sockets.emit('online', userList);
                })
                .error(function(err){
                    console.log(err);
                })
        };
    });
};




