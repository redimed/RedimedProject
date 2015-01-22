var _ = require('lodash-node');
var db = require('./models');
var parser = require('socket.io-cookie');
//var parseCookie = require('connect').utils.parseCookie;

var users = [];
module.exports = function(io,cookie,cookieParser) {
    var userList = [];

    io.use(parser);

    io.on('connection', function (socket) {
        socket.on('checkApp',function(id){
            if(id != null){
                db.User.find({where:{id:id}},{raw:true})
                    .success(function(user){
                        if(user.socket == null){
                            db.User.update({
                                socket: socket.id
                            },{id:id})
                                .success(function(){
                                    console.log('success');
                                })
                                .error(function(err){
                                    console.log(err);
                                })
                        }
                        else
                        {
                            io.to(socket.id).emit("isLoggedIn");
                            console.log("error")
                        }
                    })
                    .error(function(err){
                        console.log(err);
                    })
            }
        })

        socket.on('checkLogin',function(username){
            db.User.find({where:{user_name:username}},{raw:true})
                .success(function(user){
                    if(user)
                    {
                        socket.emit('isSuccess');

                        //if(user.socket == null){
                        //    socket.emit('isSuccess');
                        //}
                        //else
                        //{
                        //    socket.emit('isError', 'You are already connected.');
                        //}
                    }

                })
                .error(function(err){
                    console.log(err);
                })
        });

        socket.on('checkUserSocket',function(id,username){
            db.User.find({where:{id:id,user_name:username}},{raw:true})
                .success(function(user){
                    if(user)
                    {
                        if(user.socket == null){
                            db.User.update({
                                socket: socket.id
                            },{id: id, user_name: username})
                                .success(function(){
                                    console.log('success');
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

        socket.on('login_successful',function(id,username){
            db.User.update({
                socket: socket.id
            },{id: id, user_name: username})
                .success(function(){
                    getOnlineUser();
                })
                .error(function(err){
                    console.log(err);
                })

        })

        socket.on('sendMessage', function (currUser,contactUser, message) {
            db.User.find({where:{user_name: currUser}},{raw:true})
                .success(function(currentUser){
                    db.User.find({where:{user_name:contactUser}},{raw:true})
                        .success(function(contact){
                            io.to(contact.socket)
                                .emit('messageReceived', currentUser.user_name, message);

                            console.log("Current User: "+currentUser.user_name+" ---- "+ JSON.stringify(message));
                            console.log("Contact User: "+contact.user_name+" ---- "+JSON.stringify(message));
                        })
                        .error(function(err){
                            console.log(err);
                        })
                })
                .error(function(err){
                    console.log(err);
                })
        });

        socket.on('logout', function (username,id,userType) {
           db.sequelize.query("UPDATE `users` SET `socket` = NULL WHERE `user_name`=? AND `id`=?",null,{raw:true},[username,id])
                .success(function(){
                   getOnlineUser();

                })
                .error(function(err){
                    console.log(err);
                })

            if(userType == 'Driver')
                io.sockets.emit('driverLogout',id);

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

            var headers = socket.request.headers;

            if(typeof headers.cookie !== 'undefined'){
                if(typeof headers.cookie.userInfo !== 'undefined'){
                    var userInfo = JSON.parse(headers.cookie.userInfo);
                    db.User.update({
                        socket: socket.id
                    },{id: userInfo.id, user_name: userInfo.user_name})
                        .success(function(){
                            console.log('success');
                        })
                        .error(function(err){
                            console.log(err);
                        })
                }
                else {
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
                }
            }
            else {
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

            }
        });

        function getOnlineUser(){
            userList = [];
            db.User.findAll({where: "socket IS NOT NULL"},{raw:true})
                .success(function(data){
                    for (var i = 0; i < data.length; i++) {
                        userList.push({
                            id: data[i].id,
                            username: data[i].user_name,
                            socket: data[i].socket
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




