var _ = require('lodash-node');

module.exports = function(io) {
    var userList = [];
    io.on('connection', function (socket) {
        socket.on('checkLogin',function(username){

            if (_.findIndex(userList, { username: username }) != -1) {
                socket.emit('isError', 'You are already connected.');
            }
            else
            {
                socket.emit('isSuccess');
            }

        });

        socket.on('login_successful',function(id,username){
            userList.push({id:id,username:username,socket: socket.id});

            socket.emit('online', userList);

        })

        socket.on('sendMessage', function (id) {
            var currentUser = _.find(userList, { socket: socket.id });
            if (!currentUser) { return; }

            var contact = _.find(userList, { id: id });
            if (!contact) { return; }

            io.to(contact.socket)
                .emit('messageReceived', currentUser.id);
        });

        socket.on('disconnect', function (id) {
            var index = _.findIndex(userList, { id: id });
            if (index !== -1) {
                userList.splice(index, 1);
                socket.emit('online', userList);
            }
        });

    });
};