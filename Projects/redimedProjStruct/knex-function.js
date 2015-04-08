var main = {};
var S = require('string');
var moment = require('moment');

main.commonError = function(error, code, res){
	return res.status(500).json({error: error, code: code});
}

main.checkDate = function(date){
    if(!date) return false;
    var date_split = date.toString().split('/');

    if(!date_split) return false;
    if(date_split[0] > 32) return false;
    if(date_split[1] > 13) return false;

    return true;
}

main.checkTime = function(time){
    if(!time) return false;
    var time_split = time.toString().split(':');

    if(!time_split) return false;
    if(time_split[0] > 24) return false;
    if(time_split[1] > 60) return false;

    return true;
}

main.convertToSeconds = function(datetime){
    var time = S(datetime).right(5).s;
    var hour = S(time).left(2).s;
    var minute = S(time).right(2).s;

    return hour*3600+minute*60;
}

main.checkBetweenTimes = function(time, options){
    if(time >= options.from_time && time <= options.to_time) return true;
    return false;
}

main.ensureAuthorized = function(req, res, next){
	var bearerToken;
    var bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

main.addInterval = function(time, minutes){
    var hour = S(time).left(2);
    var minute = S(time).right(2);

    var seconds = hour*3600+minute*60+minutes*60;
    return seconds;
}

main.toHHMM = function (seconds) {
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    var time    = hours+':'+minutes;
    return time;
}

module.exports = main;