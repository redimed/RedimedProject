/**
 * Created by meditech on 9/3/2014.
 */
function getDateString(date)
{
    return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
}

function getDateTimeSQLString(date)
{
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate() +" "+date.getHours()+":"+date.getMinutes();
}
function getTimeString(date)
{
    return date.getHours()+":"+date.getMinutes();
}

function getDayString(date)
{
    var weekday=new Array(7);
    weekday[0]="Mon";
    weekday[1]="Tue";
    weekday[2]="Wed";
    weekday[3]="Thur";
    weekday[4]="Fri";
    weekday[5]="Sat";
    weekday[6]="Sun";
    return weekday[date.getDay()];
}