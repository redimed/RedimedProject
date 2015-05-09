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
                res.json({status:'success',data:rows[0]});
            }
            else
            {
                var sql="insert into MEDI_SESSION set ?";
                var insertData={
                    SESSION_CODE:currentDateString,
                    NOTE:'dat com',
                    ISENABLE:1,
                    STATUS:'OPENING'
                }
                kiss.executeQuery(req,sql,[insertData],function(result){
                    res.json({status:'success',data:insertData});
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

    getChosenFoods:function(req,res)
    {
        var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
        if(!kiss.checkListData(postData.SESSION_CODE,postData.USER_ID))
        {
            kiss.exlog("getChosenFoods","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT booking.*,foodlist.`NAME`,foodlist.`COST`                               "+
            " FROM `medi_food_booking` booking                                               "+
            " INNER JOIN `medi_food_list` foodlist ON booking.`FOOD_ID`=foodlist.`FOOD_ID`   "+
            " WHERE booking.`SESSION_CODE`=? AND booking.`USER_ID`=?                         ";
        kiss.executeQuery(req,sql,[postData.SESSION_CODE,postData.USER_ID],function(rows){
            res.json({status:'success',data:rows});
        },function(err){
            kiss.exlog("getChosenFoods","Loi truy van select",err);
            res.json({status:'fail'});
        });
    },

    addItemToCart:function(req,res)
    {
        var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
        if(!kiss.checkListData(postData.FOOD_ID,postData.USER_ID,postData.SESSION_CODE))
        {
            kiss.exlog("addItemToCart","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var insertInfo={
            FOOD_ID:postData.FOOD_ID,
            USER_ID:postData.USER_ID,
            SESSION_CODE:postData.SESSION_CODE
        }
        var sql= "insert into MEDI_FOOD_BOOKING set ?";
        kiss.executeQuery(req,sql,[insertInfo],function(result){
            res.json({status:'success'});
        },function(err){
            kiss.exlog("addItemToCart","Loi truy van insert",err);
            res.json({status:'fail'});
        });
    },

    cancelItem:function(req,res)
    {
        var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
        if(!kiss.checkListData(postData.SESSION_CODE,postData.USER_ID,postData.FOOD_ID))
        {
            kiss.exlog("cancelItem","Loi data truyen den");
            res.json({status:"fail"});
            return;
        }
        var sql="DELETE FROM `medi_food_booking` WHERE `SESSION_CODE`=? AND `USER_ID`=? AND `FOOD_ID`=?";
        kiss.executeQuery(req,sql,[postData.SESSION_CODE,postData.USER_ID,postData.FOOD_ID],function(result){
            res.json({status:'success'});
        },function(err){
            kiss.exlog("cancelItem","Loi truy van delete",err);
            res.json({status:'fail'});
        });
    },

    getAllBookingOfSession:function(req,res)
    {
        var sessionCode=kiss.checkData(req.body.sessionCode)?req.body.sessionCode:'';
        if(!kiss.checkListData(sessionCode))
        {
            kiss.exlog("getAllBookingOfSession","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT booking.*,`foodlist`.`NAME`,foodlist.`COST`,u.`user_name`,u.Booking_Person   "+
            " FROM `medi_food_booking` booking                                                    "+
            " INNER JOIN `medi_food_list` foodlist ON booking.`FOOD_ID`=foodlist.`FOOD_ID`        "+
            " INNER JOIN users u ON booking.`USER_ID`=u.`id`                                      "+
            " WHERE booking.`SESSION_CODE`=?                                                      ";
        kiss.executeQuery(req,sql,[sessionCode],function(rows){
            res.json({status:'success',data:rows});
        },function(err){
            kiss.exlog("getAllBookingOfSession","Loi truy van select",err);
            res.json({status:'fail'});
        },true);
    },

    changeSessionStatus:function(req,res)
    {
        var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
        if(!kiss.checkListData(postData.SESSION_CODE,postData.STATUS))
        {
            kiss.exlog("changeSessionStatus","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var updateInfo={
            STATUS:postData.STATUS
        }
        var sql="update medi_session set ? where SESSION_CODE=?";
        kiss.executeQuery(req,sql,[updateInfo,postData.SESSION_CODE],function(result){
            res.json({status:'success'});
        },function(err){
            kiss.exlog("changeSessionStatus","Loi truy van update",err);
            res.json({status:'fail'});
        });

    }
    
}
