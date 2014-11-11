var squel = require("squel");
squel.useFlavour('mysql');

var model_sql = {
    sql_patient_get_by_opt: function (limit, offset, search_data) {
        var query = squel.select()
                .from('cln_patients')
                .order('Creation_date', false)
                .limit(limit)
                .offset(offset);

        if (search_data.sex) {
            query.where('Sex = ?', search_data.sex);
        }

        for (var key in search_data) {
            if (search_data[key]) {
                query.where(key + " LIKE ?", search_data[key] + '%');
            }
        }

        return query.toString();
    },
    sql_patient_get_by_id: function (patient_id) {
        return squel.select().from('cln_patients')
                .where('Patient_id = ?', patient_id)
                .limit(1)
                .toString();

    },
    sql_acc_type_list: function () {
        var query = squel.select()
                .field('Account_id')
                .field('Account_name')
                .from('cln_account_type');
        return query.toString();
    }
    ,
    sql_private_fund_list: function () {
        var query = squel.select()
                .field('PF_id')
                .field('Fund_name')
                .from('cln_private_fund');
        return query.toString();
    }
    ,
    sql_provider_type_list: function () {
        var query = squel.select()
                .from('cln_provider_types');
        return query.toString();
    },

    sql_qualification_list: function(){
        var query = squel.select()
                .from('sys_qualifications')
                .where('Isenable = ?', 1);
        return query.toString();
    },
    
    sql_get_by_opt: function(search_opt){
        var limit = (search_opt.limit) ? search_opt.limit : 10;
        var offset = (search_opt.offset) ? search_opt.offset : 0;
        var search_data = search_opt.data;
        
        
        var query = squel.select()
                .from('cln_patients')
                .order('Creation_date', false)
                .limit(limit)
                .offset(offset);

        if (search_data.sex) {
            query.where('Sex = ?', search_data.sex);
            console.log(query.toString());
        }
        delete search_data.sex;

        for (var key in search_data) {
            if (search_data[key]) {
                query.where(key + " LIKE ?", search_data[key] + '%');
            }
        }
        
        return query.toString();
    }
};

module.exports = {
    getQualificationList: function(req, res){
        var sql = model_sql.sql_qualification_list();

        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: 'error'});
                    return;
                }
                res.json({status: 'success', list: data});
            });
        });
    },
    getProviderTypeList: function (req, res) {
        var sql = model_sql.sql_provider_type_list();
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: 'error'});
                    return;
                }
                res.json({status: 'success', list: data});
            });
        });
    },
    getTotals: function (req, res) {
        req.getConnection(function (err, connection) {
            var sql = 'SELECT COUNT(1) AS num FROM cln_patients';
            var query = connection.query(sql, function (err, rows) {
                if (err) {
                    res.json({status: 'error'});
                    return;
                }
                res.json({status: 'success', count: rows[0].num});
            });
        });
    },
    getByOptions: function (req, res) {
//        var search_opt = req.body.search;
//        var limit = (search_opt.limit) ? search_opt.limit : 10;
//        var offset = (search_opt.offset) ? search_opt.offset : 0;
//        var search_data = search_opt.data;
//
//        var query = squel.select()
//                .from('cln_patients')
//                .order('Creation_date', false)
//                .limit(limit)
//                .offset(offset);
//
//        if (search_data.sex) {
//            query.where('Sex = ?', search_data.sex);
//            console.log(query.toString());
//        }
//        delete search_data.sex;
//
//        for (var key in search_data) {
//            if (search_data[key]) {
//                query.where(key + " LIKE ?", search_data[key] + '%');
//            }
//        }

        var sql = model_sql.sql_get_by_opt(req.body.search);
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, rows) {
                if (err) {
                    res.json({status: 'error'});
                    return;
                }
                res.json({status: 'success', list: rows});
            });
        });
    },
    getById: function (req, res) {
        var patient_id = req.query.patient_id;

        if (!patient_id) {
            res.json({status: 'error', patient_id: patient_id});
            return;
        }

        var sql = squel.select().from('cln_patients')
                .where('Patient_id = ?', patient_id)
                .limit(1)
                .toString();
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: 'error2', err: err});
                    return;
                }
                res.json({status: 'success', data: data});
            });
        });

    },
    getAccountTypeList: function (req, res) {
        var query = squel.select()
                .field('Account_id')
                .field('Account_name')
                .from('cln_account_type');
        var sql = query.toString();
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: 'error'});
                    return;
                }
                res.json({status: 'success', list: data});
            });
        });
    },
    getPrivateFundList: function (req, res) {
        var query = squel.select()
                .field('PF_id')
                .field('Fund_name')
                .from('cln_private_fund');
        var sql = query.toString();
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: 'error'});
                    return;
                }
                res.json({status: 'success', list: data});
            });
        });
    },
    insert: function (req, res) {
        console.log(req.body);
        var patient_data = req.body.patient;

        if(!patient_data){
            res.json({status: 'error'});
            return;
        }


        var sql2 = squel.select().from('cln_patients').field("MAX(Patient_id) + 1", 'new_id').toString();
        req.getConnection(function (err, connection) {
            var query = connection.query(sql2, function (err, data) {
                if (err) {
                    res.json({status: 'error'});
                    console.log(err)
                    return;
                }
                var new_id = data[0].new_id;

                // END GET NEW_ID 

                var sqlbuilder = squel.insert()
                        .into("cln_patients")
                        .set('Isenable', 1)
                        .set('Patient_id', new_id);
                ;
                sqlbuilder.set('Creation_date', 'NOW()', {dontQuote: true});
                var patient_data = req.body.patient;


                for (var key in patient_data) {
                    if (patient_data[key] || patient_data[key] === 0 || patient_data[key] === '0')
                        sqlbuilder.set(key, patient_data[key]);
                }
                var sql = sqlbuilder.toString();

                var query = connection.query(sql, function (err, data) {
                    if (err) {
                        console.log(err);
                        res.json({status: 'error'});
                        return;
                    }else{
                        var query = connection.query("SELECT * FROM cln_patients WHERE Isenable=1 ORDER BY Creation_date DESC LIMIT 1", function(err, data){
                            if(err){
                                console.log(err);
                                res.json({status: 'error'});
                                return;
                            }else{
                                res.json({status: 'success', data: data[0]});
                            }        
                        });
                    }
                });
            });
        });



    },
    update: function (req, res) {
        var patient_id = req.body.patient.Patient_id;
        delete req.body.patient.Patient_id;

        if (!patient_id) {
            res.json({status: 'error1'});
            return;
        }

        var sqlbuilder = squel.update()
                .table("cln_patients")
                .where('patient_id = ?', patient_id)
                .set('Last_updated_by', 'NOW()', {dontQuote: true});
        ;

        var patient_data = req.body.patient;


        console.log(patient_data)

        for (var key in patient_data) {
            if (patient_data[key] || patient_data[key] === 0 || patient_data[key] === '0')
                sqlbuilder.set(key, patient_data[key]);
        }

        var sql = sqlbuilder.toString();
        console.log(sql);

        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: 'error2'});
                    return;
                }
                res.json({status: 'success', data: data});
            });
        });

    },
    test: function (req, res) {

        var sqlbuilder = squel.update()
                .table("cln_patients")
                .where('patient_id = ?', 1)
                .set('Last_updated_by', 'NOW()', {dontQuote: true});
        ;
        sqlbuilder.set('known_as', '123');
        var sql = sqlbuilder.toString();
        console.log(sql);
        res.json(sql);
    },
}




