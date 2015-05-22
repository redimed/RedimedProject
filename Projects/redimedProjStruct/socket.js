var _ = require('lodash-node');
var db = require('./models');
var parser = require('socket.io-cookie');
var useragent = require('express-useragent');

var apiKey = "45200062";
var apiSecret = "60d69ce10fe492342fc7fc6ae7dc382e78ff085f";

var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, apiSecret);

module.exports = function(io,cookie,cookieParser) {
    var userList = [];
    var ua = null;

    io.use(parser);

    io.on('connection', function (socket) {

        var header = socket.request.headers;
        var source = header['user-agent'];
        ua = useragent.parse(source);

        socket.on("shareImage",function(id,callUser){
            db.User.find({where:{id: callUser}},{raw:true})
                .success(function(user){
                    io.to(user.socket)
                        .emit('receiveImage',id);
                })
        })

        socket.on("shareFile",function(id,fileName,callUser){
            db.User.find({where:{id: callUser}},{raw:true})
                .success(function(user){
                    io.to(user.socket)
                        .emit('receiveFile',id,fileName);
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

        socket.on('checkApp',function(id){
            if(id){
                db.User.find({where:{id:id}},{raw:true})
                    .success(function(user){
                        if(user)
                        {
                            if(user.socket == null){
                                db.User.update({
                                    socket: socket.id
                                },{id:id})
                                    .success(function(){
                                        getOnlineUser();
                                    })
                                    .error(function(err){
                                        console.log(err);
                                    })
                            }
                            // else
                            // {
                            //     if(user.socket != socket.id){
                            //         io.to(socket.id).emit("isLoggedIn");
                            //     }
                            //     getOnlineUser();
                            // }
                        }

                    })
                    .error(function(err){
                        console.log(err);
                    })
            }
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
                       
                        if(user.socket == null){
                            socket.emit('isSuccess');
                        }
                        else
                        {
                            socket.emit('isError');
                        }
                        
                    }

                })
                .error(function(err){
                    console.log(err);
                })


            // socket.emit('isSuccess');

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

        socket.on('disconnect', function (reason) {

            db.User.find({where:{socket:socket.id}},{raw:true})
                .success(function(user){
                    if(user)
                    {
                        db.UserType.find({where:{ID:user.user_type}},{raw:true})
                            .success(function(type){
                                if(type.user_type == 'Driver')
                                    io.sockets.emit('driverLogout',user.id);

                                if(user.socket == socket.id)
                                {
                                     db.sequelize.query("UPDATE `users` SET `socket` = NULL, socketMobile = NULL WHERE socket = ?", null, {raw: true}, [socket.id])
                                        .success(function () {
                                            getOnlineUser();
                                        })
                                        .error(function (err) {
                                            console.log(err);
                                        })
                                }

                                if(user.socketMobile == socket.id)
                                {
                                    db.sequelize.query("UPDATE `users` SET socketMobile = NULL WHERE socketMobile = ?", null, {raw: true}, [socket.id])
                                        .success(function () {
                                            getOnlineUser();
                                        })
                                        .error(function (err) {
                                            console.log(err);
                                        })
                                }


                               
                            })
                            .error(function (err) {
                                console.log(err);
                            })
                    }

                })
                .error(function (err) {
                    console.log(err);
                })

                socket.removeAllListeners();

        });


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




