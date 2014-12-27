var _ = require('lodash-node');

module.exports = function(io) {
    var userList = [];
    var users = [];

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
            console.log("Send Message ------------------> ",message);

            var currentUser = _.find(userList, { socket: socket.id });
            if (!currentUser) { return; }

            var contact = _.find(userList, { username: username });
            if (!contact) { return; }

            io.to(contact.socket)
                .emit('messageReceived', currentUser, message);
        });

        socket.on('logout', function (username) {
            var index = _.findIndex(userList, { username: username });
            if (index !== -1) {
                userList.splice(index, 1);
                io.sockets.emit('online',userList);
                //socket.broadcast.emit('online', userList);
            }
        });

        socket.on('disconnect', function () {
            var index = _.findIndex(userList, { socket: socket.id });
            if (index !== -1) {
                userList.splice(index, 1);
                io.sockets.emit('online',userList);
                //socket.broadcast.emit('online', userList);
            }
        });

    });

    //io.on('connection', function (socket) {
    //    socket.on('login', function (name) {
    //        // if this socket is already connected,
    //        // send a failed login message
    //        if (_.findIndex(users, { socket: socket.id }) !== -1) {
    //            socket.emit('login_error', 'You are already connected.');
    //        }
    //
    //        // if this name is already registered,
    //        // send a failed login message
    //        if (_.findIndex(users, { name: name }) !== -1) {
    //            socket.emit('login_error', 'This name already exists.');
    //            return;
    //        }
    //
    //        users.push({
    //            name: name,
    //            socket: socket.id
    //        });
    //
    //        socket.emit('login_successful', _.pluck(users, 'name'));
    //        socket.broadcast.emit('online', name);
    //
    //        console.log(name + ' logged in');
    //    });
    //
    //    socket.on('sendMessage', function (name, message) {
    //        var currentUser = _.find(users, { socket: socket.id });
    //        if (!currentUser) { return; }
    //
    //        var contact = _.find(users, { name: name });
    //        if (!contact) { return; }
    //
    //        io.to(contact.socket)
    //            .emit('messageReceived', currentUser.name, message);
    //    });
    //
    //    socket.on('disconnect', function () {
    //        var index = _.findIndex(users, { socket: socket.id });
    //        if (index !== -1) {
    //            socket.broadcast.emit('offline', users[index].name);
    //            console.log(users[index].name + ' disconnected');
    //
    //            users.splice(index, 1);
    //        }
    //    });
    //});

};