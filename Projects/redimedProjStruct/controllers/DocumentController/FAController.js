/**
 * Created by meditech on 24/09/2014.
 */
var db = require('../../models');
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
    }
};



