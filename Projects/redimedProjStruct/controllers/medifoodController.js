/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */

var kiss=require('./kissUtilsController');
var moment=require('moment');

module.exports =
{
    createSession:function(req,res)
    {

        var currentDateString=moment().format("DD-MM-YYYY");

        var sql="select * from MEDI_SESSION where SESSION_CODE=?";
        kiss.executeQuery(req,sql,[currentDateString],function(rows){
            if(rows.length>0)
            {
                res.json({status:'success',data:rows[0].SESSION_CODE});
            }
            else
            {
                var sql="insert into MEDI_SESSION set ?";
                var insertData={
                    SESSION_CODE:currentDateString,
                    NOTE:'dat com',
                    ISENABLE:1
                }
                kiss.executeQuery(req,sql,[insertData],function(result){
                    res.json({status:'success',data:currentDateString});
                },function(err){
                    res.json({status:'fail'});
                })
            }
        },function(err){
            res.json({status:'fail'});
        });

    },

    getListFood:function(req,res)
    {
        var sql="select * from MEDI_FOOD_LIST where ISENABLE=1";
        kiss.executeQuery(req,sql,[],function(rows){
            res.json({status:'success',data:rows});
        },function(err){
            res.json({status:'fail'});
        })
    },

    book:function(req,res)
    {
        var postData=req.body.postData;
        //kiss.exFileJSON(postData,'postData.txt')
        kiss.executeInsert(req,'MEDI_FOOD_BOOKING',postData,function(result){
            res.json({status: 'success'});
        },function(err){
            res.status(500).json({status:'fail'});
        });
    }
    
}
