// **Socket.js:**
// **Description: Contains all handlers for socket.io, include emit and listener handlers.

var _ = require('lodash-node'); //**lodash-node: Lodash module bundles for Node.js
var db = require('./models'); //**Include models folder into this.
var parser = require('socket.io-cookie'); //**socket.io-cookie: Cookie parser middleware for socket.io

var apiKey = "45279332"; //**API Key use for OpenTok API (WebRTC)
var apiSecret = "8d7639ab2088de84784beab28b3167f78a08c674"; //**API Secret Key use for OpenTok API (WebRTC)

var OpenTok = require('opentok'), //**opentok: This is a WebRTC platform for embedding live video call into application.
    opentok = new OpenTok(apiKey, apiSecret); //**Create new OpenTok instance with API Key & API Secret

var gcm = require('node-gcm'); //**node-gcm: A Node.JS wrapper library-port for Google Cloud Messaging for Android
var apns = require('apn'); //**apn: An interface to the Apple Push Notification service for Node.js
var sender = new gcm.Sender('AIzaSyDsSoqkX45rZt7woK_wLS-E34cOc0nat9Y'); //**Create new instance of GCM with API Key

//**APN configure options
var options = {
        cert: 'key/APN/PushCert.pem',                                                    
        key:  'key/APN/PushKey.pem',                                                     
        passphrase: '123456',                              
        production: false,                                 
        port: 2195,                                    
        rejectUnauthorized: true,                                                                    
        cacheLength: 1000,                              
        autoAdjustCache: true,                         
    }

var apnsConnection = new apns.Connection(options); //**Create new instance of APN with above options

//** Start APN events handlers
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
//** End APN events handlers

// **==========Start Socket.io events handlers===========
// **params: {
//     io: socket.io instance,
//     cookie: cookie instance,
//     cookieParser: cookie-parser instance
// }**

module.exports = function(io,cookie,cookieParser) {
    var userList = []; //**Array contains all online users
    var driverArr = []; //**Array contains all drivers

    io.use(parser); //**Middleware for socket.io
    
    db.User.update({socket: null,token: null})
        .success(function(){
            console.log("=====Server Restart=====");
        })

    io.on('connection', function (socket) {
        socket.removeAllListeners();

        // **Function: getOnlineUser()
        // **Params: null
        // **Description: Get list of all online users and send to client
        function getOnlineUser(){
            userList = [];
            db.User.belongsTo(db.UserType,{foreignKey:'user_type'});
            db.User.findAll({where: "socket IS NOT NULL",include:[db.UserType]},{raw:true})
                .success(function(data){
                    for (var i = 0; i < data.length; i++) {
                        userList.push({
                            id: data[i].id,
                            username: data[i].user_name,
                            socket: data[i].socket,
                            img: data[i].img,
                            fullName: data[i].Booking_Person,
                            userType: data[i].UserType.user_type
                        });
                    }
                    io.sockets.emit('online', userList);
                    io.sockets.emit('driverLocation',driverArr);
                })
                .error(function(err){
                    console.log(err);
                })
        };

        function updateUser(options,conditions){
            db.User.update(options,typeof conditions != 'undefined' ? conditions : null)
                .success(function(){
                    getOnlineUser();
                })
                .error(function(err){
                    console.log(err);
                })
        };

        socket.on('reconnected',function(id){
            db.User.find({where:{id: id}},{raw:true})
                .success(function(user){
                    if(user)
                    {
                        socket.join(user.user_name.toLowerCase()+'--'+user.id);
                        updateUser({socket: socket.id},{id:id})
                    }
                })
        })

        socket.on('disconnect',function(){
            var roomObj = io.sockets.adapter.rooms;
            var arrUser = [];
            for (var key in roomObj) {
                if(key.indexOf('--') != -1)
                    arrUser.push(key.split('--')[1]);
            }

            if(driverArr.length > 0)
	   		{
	   		   driverArr = [];
	           io.sockets.emit('driverLocation',driverArr);
	   		}

            if(arrUser.length > 0)
                updateUser({socket: null},["id NOT IN (?)",arrUser]);
            else
                updateUser({socket: null});
        })

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
                    if(doctor)
                    {
                        if(doctor.User_id)
                        {
                            db.User.find({where:{id: doctor.User_id}},{raw:true})
                                .success(function(user){
                                    if(user)
                                        socket.to(user.user_name.toLowerCase()+'--'+user.id).emit('receiveNotifyDoctor');
                                })
                                .error(function(err){
                                    console.log(err);
                                })
                        }
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
                                    socket.to(users[i].user_name.toLowerCase()+'--'+users[i].id).emit('receiveNotifyReceptionist');
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

                var tokenOptions = {};
                tokenOptions.role = "moderator";

                var token = opentok.generateToken(ses.sessionId,tokenOptions);

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
                                            var tokenOptions = {};
                                            tokenOptions.role = "publisher";
                                            var jsonData = {'from': currentUser.user_name, 'to': contact.user_name};
                                            tokenOptions.data = JSON.stringify(jsonData);

                                           var token = opentok.generateToken(message.sessionId,tokenOptions);

                                           message.apiKey = apiKey;
                                           message.token = token;

                                            socket.to(contact.user_name.toLowerCase()+'--'+contact.id).emit('messageReceived',currentUser.id ,currentUser.user_name, message);

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
                                            socket.to(contact.user_name.toLowerCase()+'--'+contact.id).emit('messageReceived',currentUser.id ,currentUser.user_name, message);
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

        socket.on('forceLogin',function(username){
            db.User.find({where:{user_name: username}},{raw:true})
                .success(function(user){
                    if(user)
                    {
                        if(user.socket != null)
                        {
                            socket.to(user.user_name.toLowerCase()+'--'+user.id).emit('forceLogout');
                            updateUser({socket:null,token:null},{id:user.id});
                        }
                    }
                })
                .error(function(err){
                    console.log(err);
                })
        })

        socket.on('updateSocketLogin',function(id){
            db.User.find({where:{id: id}},{raw:true})
                .success(function(user){
                    if(user)
                    {
                        socket.join(user.user_name.toLowerCase()+'--'+user.id);
                        updateUser({socket: socket.id},{id: user.id});
                    }
                })
        })

        socket.on('logout', function (username,id,userType,info) {
            db.User.update({
                socket: null,
                token: null
            },{user_name:username, id: id})
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
                                   {
                                   		if(driverArr.length > 0)
                                   		{
                                   		   var index = _.findIndex(driverArr,{'id':id});
	                                       driverArr.splice(index,1);
	                                       io.sockets.emit('driverLocation',driverArr);
                                   		}
                                   }

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
                                    socket.leave(username+'--'+id);
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
            if(data[0].userType.toLowerCase() == 'driver')
            {
                db.sequelize.query("SELECT d.*, p.company_id, p.user_id ,CONCAT(IFNULL(p.Title,''), '.', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName, i.latitude, i.longitude " +
                                "FROM driverInjury d "+
                                "INNER JOIN cln_patients p ON d.patient_id = p.Patient_id " +
                                "INNER JOIN im_injury i ON i.patient_id = d.patient_id AND i.driver_id = d.driver_id "+
                                "WHERE d.driver_id = ? AND d.STATUS = 'Picking' AND i.`STATUS` = 'Picking' AND DATE(d.pickup_date) = DATE(CURDATE())",null,{raw:true},[data[0].id])
                .success(function(rs){
                    data[0].patientList = _.uniq(rs,'patient_id');
                    if(driverArr.length > 0)
                    {
                        var index = _.findIndex(driverArr,{'id':data[0].id});
                        if(index == -1)
                            driverArr.push(data[0])
                        else
                        {
                            driverArr[index].latitude = data[0].latitude;
                            driverArr[index].longitude = data[0].longitude;
                            driverArr[index].patientList = data[0].patientList;
                        }
                    }
                    else
                        driverArr.push(data[0])
                    io.sockets.emit('driverLocation',driverArr);
                })
                .error(function(err){
                    console.log(err);
                })
            }
            
        })

        socket.on("onlineMeasureData",function(id,info){
            if(id)
            {
                db.User.find({where:{id:id}},{raw:true})
                    .success(function(user){
                        if(user)
                            socket.to(user.user_name.toLowerCase()+'--'+user.id).emit('getMeasureData', info);
                    })
                    .error(function(err){
                        console.log(err);
                    })
            }

        })

        
    });
};
// **==========End Socket.io events handlers==============




