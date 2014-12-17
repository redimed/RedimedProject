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
    }
}