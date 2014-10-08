/**
 * Created by meditech on 24/09/2014.
 */
var db = require('../models');
module.exports = {

    newMA: function(req,res)
    {
        db.sequelize.query("INSERT INTO `cln_ma_headers` (Patient_id,CAL_ID,MA_ID,DF_CODE,ISENABLE, DESCRIPTION) SELECT 2,12211,h.QUEST_DF_ID,h.`DF_CODE`,h.`ISENABLE`,h.DESCRIPTION  FROM `sys_ma_df_headers` h;").success(function(){
            db.sequelize.query("INSERT INTO `cln_ma_group` (PATIENT_ID, CAL_ID, GROUP_ID, GROUP_NAME, MA_ID,USER_TYPE,ISENABLE) SELECT 2,12211,g.`GROUP_ID`, g.`GROUP_NAME`,g.`QUEST_DF_ID`,g.`USER_TYPE`,g.`ISENABLE` FROM `sys_ma_df_group` g;").success(function(){
                db.sequelize.query("INSERT INTO `cln_ma_lines` (PATIENT_ID,CAL_ID,MA_LINE_ID,QUESTION,VAL1_NAME,VAL2_NAME,YES_NO,ORD,GROUP_ID,ISENABLE) SELECT 2,12211,l.MA_LINE_ID, l.QUESTION, l.VAL1_NAME, l.VAL2_NAME, l.YES_NO, l.ORD, l.GROUP_ID,l.ISENABLE FROM `sys_ma_df_lines` l;").success(function(){
                    res.json({status:"success"});
                });
            });
        }).error(function(err){
            res.json({status:"fail"});
        });
    },

    loadMA: function(req,res){
        var data = [];
        db.sequelize.query("SELECT h.MA_ID,h.DESCRIPTION,h.DF_CODE FROM `cln_ma_headers` h WHERE h.`ISENABLE` = 1;",null,{raw:true}).success(function(dataH){
            db.sequelize.query("SELECT g.GROUP_ID, g.GROUP_NAME, g.MA_ID, g.USER_TYPE FROM `cln_ma_group` g WHERE g.ISENABLE = 1;",null,{raw:true}).success(function(dataG){
                db.sequelize.query("SELECT l.MA_LINE_ID,l.QUESTION,l.VAL1_NAME,l.VAL2_NAME,l.YES_NO,l.GROUP_ID,l.ISENABLE FROM `cln_ma_lines` l WHERE l.ISENABLE = 1 ORDER BY l.ORD ;",null,{raw:true}).success(function(dataL){
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



