/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
module.exports = {
    //Begin--NewAUD2--Audiogram 2//
    newAUD2: function (req, res) {
        db.sequelize.query("INSERT IGNORE INTO `cln_sa_df_headers` SELECT 1, 1, H.`SA_ID`, H.`SA_NAME`, H.`ISENABLE`,"
            + "H.`SA_CODE`, H.`CREATED_BY`, H.`CREATION_DATE`, H.`LAST_UPDATED_BY`, H.`LAST_UPDATE_DATE`, 1, 1,"
            + "H.`REPORT_TYPE`, H.`RECIPIENT_NAME`, 1, 1, H.`LOCATION_ID` FROM `sys_sa_df_headers` H;")
            .success(function () {
                db.sequelize.query("INSERT IGNORE INTO `cln_sa_df_sections` SELECT  1, 1, S.`SECTION_ID`, S.`SA_ID`,"
                    + "S.`SECTION_NAME`, S.`ORD`, S.`USER_TYPE`, S.`ISENABLE`, S.`CREATED_BY`, S.`CREATION_DATE`,"
                    + "S.`LAST_UPDATED_BY`, S.`LAST_UPDATE_DATE` FROM `sys_sa_df_sections` S").success(function () {
                    db.sequelize.query("INSERT IGNORE INTO `cln_sa_df_lines` SELECT 1, 1, L.LINE_ID, L.SECTION_ID,"
                        + "L.SA_ID, L.NAME, L.VALUE_RIGHT, L.VALUE_LEFT, L.ISENABLE, L.CREATED_BY, L.CREATION_DATE,"
                        + "L.LAST_UPDATED_BY,L.LAST_UPDATE_DATE FROM `sys_sa_df_lines` L").success(function () {
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
//End--NewAUD2--Audiogram 2//
//Begin--LoadAUD2--Audiogram 2//
    loadAUD2: function (req, res) {
        var data = [];
        db.sequelize.query("SELECT SA_ID, SA_NAME FROM CLN_SA_DF_HEADERS", null, {raw: true}).success(function (dataH) {
            db.sequelize.query("SELECT SA_ID, SECTION_ID, SECTION_NAME FROM CLN_SA_DF_SECTIONS WHERE SECTION_ID = 7", null, {raw: true}).success(function (dataS) {
                db.sequelize.query("SELECT LINE_ID, SECTION_ID, NAME, VALUE_RIGHT, VALUE_LEFT FROM CLN_SA_DF_LINES", null, {raw: true}).success(function (dataL) {
                    data = [
                        {"Header": dataH, "Section": dataS, "Line": dataL}
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
    }
//End--LoadAUD2--Audiogram 2//
};