var _ = require('lodash-node');
var db = require('./models');
var parser = require('socket.io-cookie');
var useragent = require('express-useragent');

var users = [];
module.exports = function(io,cookie,cookieParser) {
    var userList = [];
    var ua = null;

    io.use(parser);

    io.on('connection', function (socket) {

        console.log("IP: ",socket.request.connection.remoteAddress);

        var header = socket.request.headers;
        var source = header['user-agent'];
        ua = useragent.parse(source);

        console.log(ua);

        socket.on('checkApp',function(id){
            // if(id){
            //     db.User.find({where:{id:id}},{raw:true})
            //         .success(function(user){
            //             if(user)
            //             {
            //                 if(user.socket == null){
            //                     db.User.update({
            //                         socket: socket.id
            //                     },{id:id})
            //                         .success(function(){
            //                             getOnlineUser();
            //                         })
            //                         .error(function(err){
            //                             console.log(err);
            //                         })
            //                 }
            //                 else
            //                 {
            //                     if(user.socket != socket.id){
            //                         io.to(socket.id).emit("isLoggedIn");
            //                     }
            //                     getOnlineUser();
            //                 }
            //             }

            //         })
            //         .error(function(err){
            //             console.log(err);
            //         })
            // }
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
            // db.User.find({where:{user_name:username}},{raw:true})
            //     .success(function(user){
            //         if(user)
            //         {
                       
            //             if(user.socketMobile == null){
            //                 socket.emit('isSuccess');
            //             }
            //             else
            //             {
            //                 socket.emit('isError');
            //             }
                        
            //         }

            //     })
            //     .error(function(err){
            //         console.log(err);
            //     })


            socket.emit('isSuccess');

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

        socket.on('getSocket',function(username){
            db.User.find({where:{user_name:username}},{raw:true})
                .success(function(user){
                    socket.emit('returnSocket',user.socket);
                })
                .error(function(err){
                    console.log(err);
                })
        })

        socket.on('sendMessage', function (currUser,contactUser, message) {
            db.User.find({where:{id: currUser}},{raw:true})
                .success(function(currentUser){
                    if(currentUser)
                    {
                        db.User.find({where:{id:contactUser}},{raw:true})
                            .success(function(contact){
                                if(contact)
                                {
                                    io.to(contact.socket)
                                        .emit('messageReceived',currentUser.id ,currentUser.user_name, message);

                                    console.log("Current User: "+currentUser.user_name+" ---- "+ JSON.stringify(message));
                                    console.log("Contact User: "+contact.user_name+" ---- "+JSON.stringify(message));
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

        socket.on('logout', function (username,id,userType,info) {
           db.sequelize.query("UPDATE `users` SET `socket` = NULL WHERE `user_name`=? AND `id`=?",null,{raw:true},[username,id])
                .success(function(){
                   if(info != null && typeof info !== 'undefined')
                   {
                       var data = info[0];
                       if(typeof data.platform !== 'undefined' && data.platform != null && data.platform.toLowerCase() == 'android')
                       {
                           db.UserToken.update({
                               android_token: null
                           },{user_id:data.info.id})
                               .success(function(){
                                   if(userType == 'Driver')
                                       io.sockets.emit('driverLogout',id);

                                   socket.emit('logoutSuccess');
                                   getOnlineUser();
                               })
                               .error(function(err){
                                   console.log(err);
                               })
                       }
                       else if(typeof data.platform !== 'undefined' && data.platform != null && data.platform.toLowerCase() == 'ios')
                       {
                           db.UserToken.update({
                               ios_token: null
                           },{user_id:data.info.id})
                               .success(function(){
                                   if(userType == 'Driver')
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

            socket.removeAllListeners();

            db.User.find({where:{socket:socket.id}},{raw:true})
                .success(function(user){
                    if(user)
                    {
                        db.UserType.find({where:{ID:user.user_type}},{raw:true})
                            .success(function(type){
                                if(type.user_type == 'Driver')
                                    io.sockets.emit('driverLogout',user.id);

                                db.sequelize.query("UPDATE `users` SET `socket` = NULL WHERE socket = ?", null, {raw: true}, [socket.id])
                                    .success(function () {
                                        getOnlineUser();
                                    })
                                    .error(function (err) {
                                        console.log(err);
                                    })
                            })
                            .error(function (err) {
                                console.log(err);
                            })
                    }

                })
                .error(function (err) {
                    console.log(err);
                })


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




