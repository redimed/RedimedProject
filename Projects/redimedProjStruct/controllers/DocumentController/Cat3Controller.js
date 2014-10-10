/**
 * Created by thanh on 10/10/2014.
 */
var db = require('../../models');

module.exports = {
    insertCat3: function (req, res) {
        var info = req.body.info;
        console.log("Info: " + info); //return server input by user, can delete when finish
        db.Category3.create({
            cat_id: 1,
            cal_id: null,
            patient_id: null,
            q1_4: null,
            q1_4_c: null,
            q1_5_1: null,
            q1_5_2: null,
            q1_5_3: null,
            s3_q1_1_1: null,
            s3_q1_1_2: null,
            s3_q1_2_1: null,
            s3_q1_2_2: null,
            s3_q1_3: null,
            s3_q1_4: null,
            s3_q2_1_1: null,
            s3_q2_1_2: null,
            s3_q2_1_3: null,
            s3_q2_1_4: null,
            s3_q2_1_5: null,
            s3_q2_1_6: null,
            s3_q2_1_7: null,
            s3_q2_1_8: null,
            s3_q2_2_1: null,
            s3_q2_2_2: null,
            s3_q2_2_3: null,
            s3_q2_2_4: null,
            s3_q2_2_5: null,
            s3_q2_2_6: null,
            s3_q2_2_7: null,
            s3_q2_2_8: null,
            s3_q2_3: null,
            s3_q3_1: null,
            s3_q3_2: null,
            s3_q3_3_1: null,
            s3_q3_3_2: null,
            s3_q3_4_1: null,
            s3_q3_4_2: null,
            s3_q3_5: null,
            s3_q3_6: null,
            s3_q4: null,
            s3_q5_1_1_1: null,
            s3_q5_1_1_2: null,
            s3_q5_1_1_3: null,
            s3_q5_1_1_4: null,
            s3_q5_1_2: null,
            s3_q5_2: null,
            s3_q5_3: null,
            s3_q5_4: null,
            s3_q5_5: null,
            s3_q5_6: null,
            s3_q6_c: null,
            s3_q6_1: null,
            s3_q6_2_1: null,
            s3_q6_2_2: null,
            s3_q6_3_1: null,
            s3_q6_3_2: null,
            s3_q6_4_1: null,
            s3_q6_4_2: null,
            s3_q6_5_1: null,
            s3_q6_5_2: null,
            s3_q6_6_1: null,
            s3_q6_6_2: null,
            s3_q6_7_1: null,
            s3_q6_7_2: null,
            s3_q6_8_1: null,
            s3_q6_8_2: null,
            s3_q6_9_1: null,
            s3_q6_9_2: null,
            s3_q7_1: null,
            s3_q7_2: null,
            s4_c: null,
            s4_1: null,
            s4_2: null,
            r1_1: null,
            r1_2: null,
            r1_3: null,
            r1_4_y: null,
            r1_5: null,
            r1_6: null,
            r1_7: null,
            r1_8: null,
            r1_8_c: null,
            r2_1: null,
            r2_2: null,
            r2_2_y: null,
            r2_3: null,
            r2_4: null,
            r2_5: null,
            r2_6: null,
            r2_7_c: null,
            r3_1: null,
            r3_2_c: null,
            r4_1: null,
            r4_2_c: null,
            r5_1: null,
            r5_2: null,
            DocId: null,
            q1_5_3_c: null,
            PATIENT_SIGNATURE: null,
            PATIENT_DATE: null,
            DOCTOR_ID: null

        }, {raw: true})
            .success(function (data) {
                res.json({status: "success"});
            }).error(function (err) {
                console.log("ERROR: " + err);//return error to server, can delete when finish
                res.json({status: "fail"});
            });
    }
}