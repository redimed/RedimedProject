/**
 * tannv.dts@gmail.com
 * 11-12-2014
 */
module.exports =
{
    exlog:function(data1,data2)
    {
        console.log("\n\nBEGIN ISO LOG-------------------------------");
        console.log(JSON.stringify(data1));
        console.log(JSON.stringify(data2));
        console.log("END ISO LOG---------------------------------\n\n");
    },

    /**
     * tannv.dts@gmail.com
     * reference: http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
     */
    pad:function(num, size) 
    {
	    var s = "000000000" + num;
	    return s.substr(s.length-size);
	},

    isoConst:{
        checkInStatus:{
            lock:'LOCK',
            unlock:'UNLOCK'
        }
    }
}