/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
module.exports = {
    //Begin---NewMH--Medical History//
    newMH: function (req, res) {
        db.sequelize.query("INSERT IGNORE  INTO `cln_mh_df_lines` SELECT 1, 1, L.* FROM `sys_mh_df_lines` L")
            .success(function () {
                db.sequelize.query("INSERT IGNORE INTO `cln_mh_df_line_subquestions` SELECT 1, 1, S.* FROM"
                    + "`sys_mh_df_line_subquestions` S").success(function () {
                    db.sequelize.query("INSERT IGNORE INTO `cln_mh_df_headers` SELECT 1, 1, H.*, 1,1,1,1,1,1,1,1 FROM"
                        + "`sys_mh_df_headers` H").success(function () {
                        db.sequelize.query("INSERT IGNORE INTO `cln_mh_df_groups` SELECT 1, 1, G.* FROM"
                            + "`sys_mh_df_groups` G").success(function () {
                            res.json({status: "success"});
                        }).error(function (err) {
                            console.log("ERROR: " + err);
                            res.json({status: "fail"});
                        });
                    }).error(function (err) {
                        console.log("ERROR: " + err);
                        res.json({status: "fail"});
                    });
                }).error(function (err) {
                    console.log("ERROR: " + err);
                    res.json({status: "fail"});
                });
            }).error(function (err) {
                console.log("ERROR: " + err);
                res.json({status: "fail"});
            });
    },
//End---NewMH--Medical History//
    //Begin--loadMH--Medical History//
    loadMH: function (req, res) {
        var data = [];
        db.sequelize.query('SELECT H.`MH_DF_ID`, H.`DESCRIPTION` FROM `cln_mh_df_headers` H;', null, {raw: true})
            .success(function (dataH) {
                db.sequelize.query('SELECT G.`GROUP_ID`, G.`MH_DF_ID`, G.`GROUP_NAME` FROM `cln_mh_df_groups` G;', null, {raw: true}).success(function (dataG) {
                    db.sequelize.query('SELECT L.`MH_LINE_ID`, L.`GROUP_ID`, L.`QUESTION`, L.`ORD`, L.`ISDETAILS_ANSWER_IFYES` FROM `cln_mh_df_lines` L;', null, {raw: true}).success(function (dataL) {
                        db.sequelize.query('SELECT S.`MH_LINE_SUB_ID`, S.`MH_LINE_ID`, S.`QUESTION`, S.`ORD` FROM `cln_mh_df_line_subquestions` S;', null, {raw: true}).success(function (dataS) {
                            data = [
                                {"Header": dataH, "Group": dataG, "Line": dataL, "Subquestion": dataS}
                            ];
                            res.json(data);
                        }).error(function (err) {
                            res.json({status: "fail"});
                        });
                    }).error(function (err) {
                        res.json({status: "fail"});
                    });
                }).error(function (err) {
                    res.json({status: "fail"});
                });
            }).error(function (err) {
                res.json({status: "fail"});
            });
    }
//End--loadMH--Medical History//

};