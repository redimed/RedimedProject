/**
 * Created by meditech on 24/09/2014.
 */
var db = require('../models');
module.exports = {

    newIDS: function(req,res)
    {
        db.sequelize.query("INSERT INTO `cln_idas_headers` (PATIENT_ID,CAL_ID,IDAS_ID,DF_CODE,ITEM_ID,ISENABLE) SELECT 2,12211,h.IDAS_DF_ID,h.DF_CODE,h.ITEM_ID,h.ISENABLE FROM `sys_idas_headers` h").success(function(){
            db.sequelize.query("INSERT INTO `cln_idas_groups` (PATIENT_ID,CAL_ID,IDAS_GROUP_ID,IDAS_ID,ORD,GROUP_NAME,USER_TYPE,ISENABLE) SELECT 2,12211,IDAS_GROUP_ID,IDAS_DF_ID,ORD,GROUP_NAME,USER_TYPE,ISENABLE FROM `sys_idas_groups`").success(function(){
                db.sequelize.query("INSERT INTO `cln_idas_lines` (PATIENT_ID,CAL_ID,IDAS_LINE_ID,IDAS_GROUP_ID,ORD,QUESTION,YES_NO,ISENABLE) SELECT 2,12211,IDAS_LINE_ID,IDAS_GROUP_ID,ORD,QUESTION,YES_NO,ISENABLE FROM `sys_idas_lines`").success(function(){
                    res.json({status:"success"});
                });
            });
        }).error(function(err){
            res.json({status:"fail"});
        });
    },

    loadIDS: function(req,res){
        var data = [];
        db.sequelize.query("SELECT h.`IDAS_ID` FROM `cln_idas_headers` h WHERE h.`ISENABLE` = 1 ;",null,{raw:true}).success(function(dataH){
            db.sequelize.query("SELECT g.`IDAS_GROUP_ID`,g.`IDAS_ID`,g.`GROUP_NAME`,g.`USER_TYPE` FROM `cln_idas_groups` g WHERE g.`ISENABLE` = 1 ORDER BY g.`ORD`;",null,{raw:true}).success(function(dataG){
                db.sequelize.query("SELECT l.`IDAS_LINE_ID`, l.`IDAS_GROUP_ID`, l.`QUESTION`,l.`YES_NO` FROM `cln_idas_lines` l WHERE l.`ISENABLE` = 1 ORDER BY l.`ORD`;",null,{raw:true}).success(function(dataL){
                    data = [{"Header": dataH, "Group" : dataG,"Line": dataL}];
                    res.json(data);
                });
            });
        })
            .error(function(err){
                res.json({status:"fail"});
            })
    }
};



