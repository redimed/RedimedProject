var async = require('async')
async.series([
    //Load user to get userId first
    function(callback) {

            console.log(1);
            callback();

    },
    //Load posts (won't be called before task 1's "task callback" has been called)
    function(callback) {
        console.log(2);
        callback();
    }
], function(err) { //This function gets called after the two tasks have called their "task callbacks"

});