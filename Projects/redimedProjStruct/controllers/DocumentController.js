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

        db.sequelize.query("SELECT s.`PATIENT_ID`,s.`CAL_ID`,s.`SECTION_NAME`, l.`QUESTION`, d.`QUESTION`,d.`VAL1_NAME`," +
            " d.`VAL1_ISVALUE`,d.`VAL2_NAME`,d.`VAL2_ISVALUE`, h.`FA_NAME`, c.`NAME`FROM `cln_fa_df_sections` AS s " +
            "INNER JOIN `cln_fa_df_lines` AS l ON s.`SECTION_ID` = " +
            "l.`SECTION_ID` INNER JOIN `cln_fa_df_line_details` AS d ON l.`LINE_ID` = d.`LINE_ID` INNER JOIN" +
            " `cln_fa_df_headers` AS h ON h.`FA_ID` = s.`FA_ID` INNER JOIN `cln_fa_df_comments` AS c ON c.`LINE_ID` " +
            "= l.`LINE_ID` ").success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })
    }

};



