/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
module.exports = {
    //Begin---newMRS--Medical Results Summary//
    newMRS: function (req, res) {
        db.sequelize.query("INSERT IGNORE INTO `cln_mrs_headers` SELECT H.`MRS_DF_ID`, 1, 1, H.`DF_CODE`, H.`ITEM_ID`,"
            + "H.`DESCRIPTION`, H.`ISENABLE`, H.`Created_by`, H.`Creation_date`, H.`Last_updated_by`,"
            + "H.`Last_update_date`, NULL, NULL, NULL, NULL FROM `sys_mrs_headers` H").success(function () {
            db.sequelize.query("INSERT IGNORE INTO `cln_mrs_groups` SELECT G.`MRS_GROUP_ID`, G.`MRS_DF_ID`, 1, 1,"
                + "G.`ORD`, G.`GROUP_NAME`, G.`USER_TYPE`, G.`ISENABLE`, G.`CREATED_BY`, G.`CREATION_DATE`,"
                + "G.`LAST_UPDATED_BY`, G.`LAST_UPDATE_DATE` FROM `sys_mrs_groups` G").success(function () {
                db.sequelize.query("INSERT IGNORE INTO `cln_mrs_lines` SELECT L.`MRS_LINE_ID`, L.`MRS_GROUP_ID`,"
                    + "L.`MRS_DF_ID`, 1, 1, L.`ORD`, L.`COMP_TYPE`, L.`QUEST_LABEL`, NULL, L.`ISCOMMENT`,"
                    + "L.`COMMENT_LABEL`, NULL, L.`ISREQ_COMMENT`, L.`ISENABLE`, L.`CREATED_BY`, L.`CREATION_DATE`,"
                    + "L.`LAST_UPDATED_BY`, L.`LAST_UPDATE_DATE` FROM `sys_mrs_lines` L").success(function () {
                    res.json({status: "success"});
                }).error(function (err) {
                    res.json({status: "fail"});
                });
            }).error(function (err) {
                res.json({status: "fail"});
            });
        }).error(function (err) {
            res.json({status: "fail"});
        });
    },
//End---newMRS--Medical Results Summary//
    //Begin--loadMRS--Medical Results Summary//
    loadMRS: function (req, res) {
        db.sequelize.query("SELECT H.`MRS_DF_ID`, H.`DESCRIPTION` FROM `cln_mrs_headers` H;", null, {raw: true}).success(function (dataH) {
            db.sequelize.query("SELECT G.`MRS_DF_ID`, G.`MRS_GROUP_ID`, G.`GROUP_NAME` FROM `cln_mrs_groups` G;", null, {raw: true}).success(function (dataG) {
                db.sequelize.query("SELECT L.`MRS_GROUP_ID`, L.`MRS_LINE_ID`, L.`QUEST_LABEL`, L.`ORD`, L.`COMP_TYPE`, L.`COMMENT_LABEL` FROM `cln_mrs_lines` L;", null, {raw: true}).success(function (dataL) {
                    db.sequelize.query("SELECT * FROM `cln_patients`;", null, {raw: true}).success(function (dataP) {
                        data = [
                            {"Header": dataH, "Patient": dataP, "Group": dataG, "Line": dataL}
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
//End--loadMRS--Medical Results Summary//
};