/**
 * Created by meditech on 9/21/2014.
 * Require: Cmoment.min.js
 */

function getTimeString(datetime)
{
    var d = moment(new Date(datetime));
//    return d.format("DD-MM-YYYY");
    return d.format("HH:mm")
}

function getShortDateString(datetime)
{
    var d=moment(new Date(datetime));
    return d.format("DD-MM-YYYY");
}