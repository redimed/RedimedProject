/**
 * Created by thanh on 10/10/2014.
 */
var db = require('../../models');

module.exports = {
    loadCat3: function (req, res) {
        var info = req.body.info; //get cal_id, patient_id
        db.Category3.findAll({where: {cal_id: info.cal_id, patient_id: info.patient_id}}, {raw: true})
            .success(function (data) {
                db.Patient.findAll({where: {patient_id: info.patient_id}}, {raw: true})
                    .success(function (patient) {
                        if (data.length === 0) {
                            var response = [
                                {"status": "findNull", "patient": patient}
                            ];
                            res.json(response);
                        }
                        else {
                            var response = [
                                {"status": "findFound", "data": data, "patient": patient}
                            ];
                            res.json(response);
                        }
                    }).error(function (err) {
                        console.log("ERROR:" + err);
                    })
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: "fail"});
            });
    },
    insertCat3: function (req, res) {
        var info = req.body.info;
        db.Category3.max('cat_id').success(function (maxId) {
            var cat_id = maxId + 1;
            db.Category3.create({
                cat_id: cat_id,
                cal_id: info.cal_id,
                patient_id: info.patient_id,
                q1_4: info.q1_4,
                q1_4_c: info.q1_4_c,
                q1_5_1: info.q1_5_1,
                q1_5_2: info.q1_5_2,
                q1_5_3: info.q1_5_3,
                s3_q1_1_1: info.s3_q1_1_1,
                s3_q1_1_2: info.s3_q1_1_2,
                s3_q1_2_1: info.s3_q1_2_1,
                s3_q1_2_2: info.s3_q1_2_2,
                s3_q1_3: info.s3_q1_3,
                s3_q1_4: info.s3_q1_4,
                s3_q2_1_1: info.s3_q2_1_1,
                s3_q2_1_2: info.s3_q2_1_2,
                s3_q2_1_3: info.s3_q2_1_3,
                s3_q2_1_4: info.s3_q2_1_4,
                s3_q2_1_5: info.s3_q2_1_5,
                s3_q2_1_6: info.s3_q2_1_6,
                s3_q2_1_7: info.s3_q2_1_7,
                s3_q2_1_8: info.s3_q2_1_8,
                s3_q2_2_1: info.s3_q2_2_1,
                s3_q2_2_2: info.s3_q2_2_2,
                s3_q2_2_3: info.s3_q2_2_3,
                s3_q2_2_4: info.s3_q2_2_4,
                s3_q2_2_5: info.s3_q2_2_5,
                s3_q2_2_6: info.s3_q2_2_6,
                s3_q2_2_7: info.s3_q2_2_7,
                s3_q2_2_8: info.s3_q2_2_8,
                s3_q2_3: info.s3_q2_3,
                s3_q3_1: info.s3_q3_1,
                s3_q3_2: info.s3_q3_2,
                s3_q3_3_1: info.s3_q3_3_1,
                s3_q3_3_2: info.s3_q3_3_2,
                s3_q3_4_1: info.s3_q3_4_1,
                s3_q3_4_2: info.s3_q3_4_2,
                s3_q3_5: info.s3_q3_5,
                s3_q3_6: info.s3_q3_6,
                s3_q4: info.s3_q4,
                s3_q5_1_1_1: info.s3_q5_1_1_1,
                s3_q5_1_1_2: info.s3_q5_1_1_2,
                s3_q5_1_1_3: info.s3_q5_1_1_3,
                s3_q5_1_1_4: info.s3_q5_1_1_4,
                s3_q5_1_2: info.s3_q5_1_2,
                s3_q5_2: info.s3_q5_2,
                s3_q5_3: info.s3_q5_3,
                s3_q5_4: info.s3_q5_4,
                s3_q5_5: info.s3_q5_5,
                s3_q5_6: info.s3_q5_6,
                s3_q6_c: info.s3_q6_c,
                s3_q6_1: info.s3_q6_1,
                s3_q6_2_1: info.s3_q6_2_1,
                s3_q6_2_2: info.s3_q6_2_2,
                s3_q6_3_1: info.s3_q6_3_1,
                s3_q6_3_2: info.s3_q6_3_2,
                s3_q6_4_1: info.s3_q6_4_1,
                s3_q6_4_2: info.s3_q6_4_2,
                s3_q6_5_1: info.s3_q6_5_1,
                s3_q6_5_2: info.s3_q6_5_2,
                s3_q6_6_1: info.s3_q6_6_1,
                s3_q6_6_2: info.s3_q6_6_2,
                s3_q6_7_1: info.s3_q6_7_1,
                s3_q6_7_2: info.s3_q6_7_2,
                s3_q6_8_1: info.s3_q6_8_1,
                s3_q6_8_2: info.s3_q6_8_2,
                s3_q6_9_1: info.s3_q6_9_1,
                s3_q6_9_2: info.s3_q6_9_2,
                s3_q7_1: info.s3_q7_1,
                s3_q7_2: info.s3_q7_2,
                s4_c: info.s4_c,
                s4_1: info.s4_1,
                s4_2: info.s4_2,
                r1_1: info.r1_1,
                r1_2: info.r1_2,
                r1_3: info.r1_3,
                r1_4_y: info.r1_4_y,
                r1_5: info.r1_5,
                r1_6: info.r1_6,
                r1_7: info.r1_7,
                r1_8: info.r1_8,
                r1_8_c: info.r1_8_c,
                r2_1: info.r2_1,
                r2_2: info.r2_2,
                r2_2_y: info.r2_2_y,
                r2_3: info.r2_3,
                r2_4: info.r2_4,
                r2_5: info.r2_5,
                r2_6: info.r2_6,
                r2_7_c: info.r2_7_c,
                r3_1: info.r3_1,
                r3_2_c: info.r3_2_c,
                r4_1: info.r4_1,
                r4_2_c: info.r4_2_c,
                r5_1: info.r5_1,
                r5_2: info.r5_2,
                DocId: info.DocId,
                q1_5_3_c: info.q1_5_3_c,
                PATIENT_SIGNATURE: info.PATIENT_SIGNATURE,
                PATIENT_DATE: info.PATIENT_DATE,
                DOCTOR_ID: info.DOCTOR_ID

            }, {raw: true})
                .success(function () {
                    res.json({status: "success"});
                }).error(function (err) {
                    console.log("ERROR:" + err);
                    res.json({status: "fail"});
                })
        }).error(function (err) {
            console.log("ERROR:" + err);
            res.json({status: "fail"});
        })

    },
    editCat3: function (req, res) {
        var info = req.body.info;
        db.Category3.update({
            cal_id: info.cal_id,
            patient_id: info.patient_id,
            q1_4: info.q1_4,
            q1_4_c: info.q1_4_c,
            q1_5_1: info.q1_5_1,
            q1_5_2: info.q1_5_2,
            q1_5_3: info.q1_5_3,
            s3_q1_1_1: info.s3_q1_1_1,
            s3_q1_1_2: info.s3_q1_1_2,
            s3_q1_2_1: info.s3_q1_2_1,
            s3_q1_2_2: info.s3_q1_2_2,
            s3_q1_3: info.s3_q1_3,
            s3_q1_4: info.s3_q1_4,
            s3_q2_1_1: info.s3_q2_1_1,
            s3_q2_1_2: info.s3_q2_1_2,
            s3_q2_1_3: info.s3_q2_1_3,
            s3_q2_1_4: info.s3_q2_1_4,
            s3_q2_1_5: info.s3_q2_1_5,
            s3_q2_1_6: info.s3_q2_1_6,
            s3_q2_1_7: info.s3_q2_1_7,
            s3_q2_1_8: info.s3_q2_1_8,
            s3_q2_2_1: info.s3_q2_2_1,
            s3_q2_2_2: info.s3_q2_2_2,
            s3_q2_2_3: info.s3_q2_2_3,
            s3_q2_2_4: info.s3_q2_2_4,
            s3_q2_2_5: info.s3_q2_2_5,
            s3_q2_2_6: info.s3_q2_2_6,
            s3_q2_2_7: info.s3_q2_2_7,
            s3_q2_2_8: info.s3_q2_2_8,
            s3_q2_3: info.s3_q2_3,
            s3_q3_1: info.s3_q3_1,
            s3_q3_2: info.s3_q3_2,
            s3_q3_3_1: info.s3_q3_3_1,
            s3_q3_3_2: info.s3_q3_3_2,
            s3_q3_4_1: info.s3_q3_4_1,
            s3_q3_4_2: info.s3_q3_4_2,
            s3_q3_5: info.s3_q3_5,
            s3_q3_6: info.s3_q3_6,
            s3_q4: info.s3_q4,
            s3_q5_1_1_1: info.s3_q5_1_1_1,
            s3_q5_1_1_2: info.s3_q5_1_1_2,
            s3_q5_1_1_3: info.s3_q5_1_1_3,
            s3_q5_1_1_4: info.s3_q5_1_1_4,
            s3_q5_1_2: info.s3_q5_1_2,
            s3_q5_2: info.s3_q5_2,
            s3_q5_3: info.s3_q5_3,
            s3_q5_4: info.s3_q5_4,
            s3_q5_5: info.s3_q5_5,
            s3_q5_6: info.s3_q5_6,
            s3_q6_c: info.s3_q6_c,
            s3_q6_1: info.s3_q6_1,
            s3_q6_2_1: info.s3_q6_2_1,
            s3_q6_2_2: info.s3_q6_2_2,
            s3_q6_3_1: info.s3_q6_3_1,
            s3_q6_3_2: info.s3_q6_3_2,
            s3_q6_4_1: info.s3_q6_4_1,
            s3_q6_4_2: info.s3_q6_4_2,
            s3_q6_5_1: info.s3_q6_5_1,
            s3_q6_5_2: info.s3_q6_5_2,
            s3_q6_6_1: info.s3_q6_6_1,
            s3_q6_6_2: info.s3_q6_6_2,
            s3_q6_7_1: info.s3_q6_7_1,
            s3_q6_7_2: info.s3_q6_7_2,
            s3_q6_8_1: info.s3_q6_8_1,
            s3_q6_8_2: info.s3_q6_8_2,
            s3_q6_9_1: info.s3_q6_9_1,
            s3_q6_9_2: info.s3_q6_9_2,
            s3_q7_1: info.s3_q7_1,
            s3_q7_2: info.s3_q7_2,
            s4_c: info.s4_c,
            s4_1: info.s4_1,
            s4_2: info.s4_2,
            r1_1: info.r1_1,
            r1_2: info.r1_2,
            r1_3: info.r1_3,
            r1_4_y: info.r1_4_y,
            r1_5: info.r1_5,
            r1_6: info.r1_6,
            r1_7: info.r1_7,
            r1_8: info.r1_8,
            r1_8_c: info.r1_8_c,
            r2_1: info.r2_1,
            r2_2: info.r2_2,
            r2_2_y: info.r2_2_y,
            r2_3: info.r2_3,
            r2_4: info.r2_4,
            r2_5: info.r2_5,
            r2_6: info.r2_6,
            r2_7_c: info.r2_7_c,
            r3_1: info.r3_1,
            r3_2_c: info.r3_2_c,
            r4_1: info.r4_1,
            r4_2_c: info.r4_2_c,
            r5_1: info.r5_1,
            r5_2: info.r5_2,
            DocId: info.DocId,
            q1_5_3_c: info.q1_5_3_c,
            PATIENT_SIGNATURE: info.PATIENT_SIGNATURE,
            PATIENT_DATE: info.PATIENT_DATE,
            DOCTOR_ID: info.DOCTOR_ID
        }, {cat_id: info.cat_id}).success(function () {
            res.json({status: 'success'});
        }).error(function (err) {
            console.log("ERROR:" + err);
            res.json({status: 'fail'});
        });
    }

}