var _ = require('lodash-node');

module.exports = function(io) {
    var userList = [];
    io.on('connection', function (socket) {

        socket.on('checkLogin',function(username){

            if (_.findIndex(userList, { username: username }) != -1) {
                socket.emit('isError', 'You are already connected.');
                return;
            }

            socket.emit('isSuccess');

        });

        socket.on('login_successful',function(id,username){
            userList.push({id:id,username:username,socket: socket.id});
            io.sockets.emit('online',userList);
            //socket.broadcast.emit('online', userList);
        })

        socket.on('sendMessage', function (username, message) {


            var currentUser = _.find(userList, { socket: socket.id });
            if (!currentUser) { return; }

            var contact = _.find(userList, { username: username });
            if (!contact) { return; }

            console.log("================ Call From: "+currentUser.username+" - "+currentUser.socket);

            console.log("================ Call To: "+contact.username+" - "+contact.socket);

            io.to(contact.socket)
                .emit('messageReceived', currentUser.username, message);
        });

        socket.on('logout', function (username) {
            var index = _.findIndex(userList, { username: username });
            if (index !== -1) {
                userList.splice(index, 1);
                io.sockets.emit('online',userList);
            }
        });

        //socket.on('disconnect', function () {
        //    var index = _.findIndex(userList, { socket: socket.id });
        //    if (index !== -1) {
        //        userList.splice(index, 1);
        //        io.sockets.emit('online',userList);
        //    }
        //});

    });



};