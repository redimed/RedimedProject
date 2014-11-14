var squel = require("squel");
squel.useFlavour('mysql');

var model_sql = {
    sql_get_by_id: function (patient_id) {
        var querybuilder = squel.select().from('cln_patients');
        querybuilder.where('Patient_id = ?', patient_id);
        return querybuilder.toString();
    }

};

module.exports = {
     postSearch: function(req, res){
        var limit = (req.body.limit)?req.body.limit:10;
        var offset = (req.body.offset)?req.body.offset:0;
        var data = (req.body.data)?req.body.data:{};
        var doctor_id = (req.body.doctor_id)?req.body.doctor_id:0;

        if(data.First_name){
            var params = "WHERE ";
            for(var key in data){
                if(key !== "DATE"){
                    if(data[key] === null)
                        data[key] = "";
                    params += "IFNULL(p."+key+", 1) LIKE '%"+data[key]+"%' AND ";
                }else{
                    var str_date = "";
                    for(var key2 in data[key]){
                        if(data[key][key2].from_map !== null && data[key][key2].to_map !== null){
                            str_date += "p."+key2;
                            str_date += " BETWEEN '"+data[key][key2].from_map+"' AND '"+data[key][key2].to_map+"' AND ";
                        }
                    }
                    params += str_date;
                }
            }

            // CUT AND STRING
            params = params.substring(0, params.length - 5);
            // END CUT AND STRING
        }else{
            params = "";
        }

        var k_sql = res.locals.k_sql;

        var sql = "SELECT p.Patient_id, p.Title, p.First_name, p.Sur_name, p.Middle_name, p.Post_code, p.Address1"+
                    " FROM cln_patients p "+
                    " INNER JOIN cln_appointment_calendar cac ON cac.Patient_id=p.Patient_id AND DOCTOR_ID="+doctor_id
                    +" "+params+
                    " ORDER BY p.Creation_date DESC "+
                    " LIMIT "+limit+
                    " OFFSET "+offset;

        k_sql.exec(sql, function (data) {
            k_sql.exec("SELECT COUNT(p.Patient_id) AS count "+
                            " FROM cln_patients p "+
                            " INNER JOIN cln_appointment_calendar cac ON cac.Patient_id=p.Patient_id AND DOCTOR_ID="+doctor_id
                            +" "+params, function(rowsCount){
                                var count = rowsCount[0].count;
                                res.json({count:count, results:data});    
                            })
        }, function (err) {
            res.json(err);
        });
    },
    getGetById: function (req, res) {
        var patient_id = req.query.patient_id;

        if(!patient_id){
            res.end();
            return;
        }


        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_get_by_id(patient_id);

        k_sql.exec_row(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });

    },


}
