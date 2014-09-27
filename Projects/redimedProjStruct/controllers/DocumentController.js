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
        db.sequelize.query("SELECT h.`FA_ID`,h.`FA_NAME` FROM `cln_fa_df_headers` h").success(function(dataH){
            db.sequelize.query("SELECT s.`SECTION_ID`,s.`SECTION_NAME` FROM `cln_fa_df_sections` s;").success(function(dataS){
                db.sequelize.query("SELECT l.`LINE_ID`, l.`QUESTION` FROM `cln_fa_df_lines` l;").success(function(dataL){
                    db.sequelize.query("SELECT d.`DETAIL_ID`, d.`QUESTION` FROM `cln_fa_df_line_details` d;").success(function(dataD){
                        db.sequelize.query("SELECT c.`FA_COMMENT_ID`, c.`NAME` FROM `cln_fa_df_comments` c;").success(function(dataC){
                            data = [{"Header": dataH, "Section" : dataS,"Line": dataL,"Detail" : dataD,"Comment" : dataC}]
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



