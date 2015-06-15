/**
 * tannv.dts@gmail.com
 */
var kiss={
	concat:function()
	{
		var str="";
		for (var i = 0; i < arguments.length; i++) 
	    {
	       	str=str+arguments[i];
	    }
	    return str;
	},

	msToTimer:function(num)
	{
		var timerItem={
            x:null,
            hour:null,
            minute:null,
            second:null,
            display:null
        }
        timerItem.x=num;
        timerItem.hour=Math.floor(timerItem.x/3600);
        var temp=timerItem.x%3600;
        timerItem.minute=Math.floor(temp/60);
        var temp=timerItem.x%60;
        timerItem.second=temp;

        var pad=function(num, size) 
        {
            var s = "000000000" + num;
            return s.substr(s.length-size);
        }

    	timerItem.display=pad(timerItem.hour,2)+":"+pad(timerItem.minute,2)+":"+pad(timerItem.second,2);
    	return timerItem;
	}
}