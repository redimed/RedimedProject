/**
 * Created by Minh on 11/5/2014.
 */
var squel = require('squel');
squel.useFlavour('mysql');

var model_sql = {

    wa_new_progress_id:function(){
        var querybuilder = squel.select()
            .from("th_progress_assessment")
            .field('progress_id')
            .order('progress_id',false)
            .limit(1);
        return querybuilder.toString();
    },

    wa_get_ass_by_id: function(assid){
        var querybuilder = squel.select()
            .from("th_progress_assessment")
            //.field("DATE_FORMAT(examDate, '%d-%m-%Y')", 'examDate')
            //.field('examDate')
            .where("progress_id = ?", assid);
        return querybuilder.toString();
    },

    wa_get_patient_info:function(patientid){
        var querybuilder = squel.select()
            .from("cln_patients")
            .where("Patient_id = ?",patientid);
        return querybuilder.toString();
    },

    wa_get_doctor_info:function(doctorid){
        var querybuilder = squel.select()
            .from("doctors")
            .where("doctor_id = ?",doctorid);
        return querybuilder.toString();
    },

    wa_get_calendar_info:function(calid){
        var querybuilder = squel.select()
            .from("cln_appointment_calendar")
            .where("CAL_ID = ?",calid);
        return querybuilder.toString();
    },

    wa_get_company_info:function(compid){
        var querybuilder = squel.select()
            .from("companies")
            .where("id = ?",compid);
        return querybuilder.toString();
    }
};

module.exports = {

    postInsertAs: function(req, res){
        var waprogress = req.body;
        console.log(req.body);

        var sql = model_sql.wa_new_progress_id();
        var k_sql = res.locals.k_sql;

        k_sql.exec(sql,function(data){
            var query = squel.insert()
                .into('th_progress_assessment')
                .set('AssessmentName','Progress Assessment')
                .set('reportlocal','WA');

            for(var key in waprogress){
                if(waprogress[key]){
                    query.set(key ,waprogress[key]);
                }
            }
            console.log(query.toString());

            k_sql.exec(query.toString(),function(){
                console.log("Insert data successfully!");
                res.end();
            },function(err){
                console.log(err);
                res.end();
            });
        }, function(err){
            console.log(err);
            res.end();
        });
    },
    postSelectAs: function(req,res){
        var assId = req.body.assessID;

        var sql = model_sql.wa_get_ass_by_id(assId);
        var k_sql = res.locals.k_sql;

        k_sql.exec(sql, function (data) {
            console.log(data[0].examDate);

            for(var key in data[0]){
                if(data[0][key] instanceof Date){
                    data[0][key] = data[0][key].getFullYear() + '-' + (data[0][key].getMonth()+1) + '-' + data[0][key].getDate();
                }
            }

            var sql2 = model_sql.wa_get_calendar_info(data[0].cal_id);
            k_sql.exec(sql2,function(data2){
                var sql3 = model_sql.wa_get_doctor_info(data2[0].DOCTOR_ID);
                k_sql.exec(sql3,function(data3){
                    var sql4 = model_sql.wa_get_patient_info(data2[0].Patient_id);
                    k_sql.exec(sql4, function(data4){
                        for(var key in data4[0]){
                            if(data4[0][key] instanceof Date){
                                data4[0][key] = data4[0][key].getFullYear() + '-' + (data4[0][key].getMonth()+1) + '-' + data4[0][key].getDate();
                            }
                        }

                        var sql5 = model_sql.wa_get_company_info(data4[0].company_id);
                        k_sql.exec(sql5, function(data5){
                            var returnValue = {
                                assessment: data[0],
                                doctor: data3[0],
                                patient: data4[0],
                                company: data5[0]
                            };
                            res.json(returnValue);
                        });


                    });
                });
            });

            //if(console.data.examDate instanceof Date){
            //    console.log("YES");
            //}
            //else{
            //    console.log("NO");
            //}


        }, function (err) {
            console.log(err);
            res.end();
        });
    },
    postEditAs: function(req, res){
        var waprogress = req.body;
        console.log(req.body);
        var k_sql = res.locals.k_sql;
        var query = squel.update()
            .table("th_progress_assessment");
        for(var key in waprogress){
            query.set(key ,waprogress[key]);
        }
        query.where("progress_id = ?", waprogress.progress_id);
        k_sql.exec(query.toString(),function(){
            console.log("Edit data successfully!");
            res.end();
        },function(err){
            console.log(err);
            res.end();
        });
    },
    postTest: function(req, res){
        console.log('Test success!');
        res.end();
    }
};/**
 * Created by Minh on 11/12/2014.
 */
