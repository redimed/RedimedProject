/**
 * Created by meditech on 24/09/2014.
 */
var db = require('../models');
module.exports = {

    newFA: function(req,res)
    {
        db.sequelize.query("INSERT INTO `cln_fa_df_sections` SELECT 2,12211,s.*  FROM `sys_fa_df_sections` s").success(function(){
            db.sequelize.query("INSERT INTO `cln_fa_df_lines` SELECT 2,12211,l.* FROM `sys_fa_df_lines` l").success(function(){
                db.sequelize.query("INSERT INTO `cln_fa_df_line_details` SELECT 2,12211,d.* FROM `sys_fa_df_line_details` d").success(function(){
                    db.sequelize.query("INSERT INTO `cln_fa_df_headers` SELECT 2,12211,h.* FROM  `sys_fa_df_headers` h").success(function(){
                        db.sequelize.query("INSERT INTO `cln_fa_df_comments` SELECT 2,12211,c.* FROM `sys_fa_df_comments` c").success(function(){
                            res.json({status:"success"});
                        });
                    });
                });
            });
        }).error(function(err){
            res.json({status:"fail"});
        });
    },

    loadFA: function(req,res){
        var data = [];
        db.sequelize.query("SELECT h.`FA_ID`,h.`FA_NAME` FROM `cln_fa_df_headers` h WHERE h.`ISENABLE` = 1",null,{raw:true}).success(function(dataH){
            db.sequelize.query("SELECT s.`SECTION_ID`,s.`SECTION_NAME` FROM `cln_fa_df_sections` s WHERE s.`ISENABLE` = 1 ORDER BY s.`ORD`;",null,{raw:true}).success(function(dataS){
                db.sequelize.query("SELECT l.`LINE_ID`, l.`QUESTION` AS LINE_NAME, l.`SECTION_ID`, l.`LineType`, l.`IsCommentsText`, l.`ISSCORE1`, l.`ISSCORE2`, l.`ISRATING1`, l.`ISRATING2`,l.`SCORE_TYPE1`, l.`SCORE_TYPE2`  FROM `cln_fa_df_lines` l WHERE l.`ISENABLE` =1 ORDER BY l.`ORD`;",null,{raw:true}).success(function(dataL){
                    db.sequelize.query("SELECT d.`DETAIL_ID`, d.`QUESTION` AS DETAIL_NAME, d.`LINE_ID`, d.`VAL1_NAME`, d.`VAL2_NAME`, d.`VAL1_ISVALUE`, d.`VAL2_ISVALUE`, d.`IsCommentText`,d.`VAL1_ISCHECKBOX`, d.`VAL2_ISCHECKBOX` FROM `cln_fa_df_line_details` d WHERE d.`ISENABLE` =1 ORDER BY d.`ORD`;",null,{raw:true}).success(function(dataD){
                        db.sequelize.query("SELECT c.`FA_COMMENT_ID`, c.`NAME`, c.`LINE_ID`, c.`Comment_Type` FROM `cln_fa_df_comments` c WHERE c.`ISENABLE` = 1;",null,{raw:true}).success(function(dataC){
                            data = [{"Header": dataH, "Section" : dataS,"Line": dataL,"Detail" : dataD,"Comment" : dataC}];
                            res.json(data);
                        });
                    });
                });
            });
        })
            .error(function(err){
                res.json({status:"fail"});
            })
    },

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
    },

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



