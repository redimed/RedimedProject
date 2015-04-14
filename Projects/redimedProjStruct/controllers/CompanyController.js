var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var _ = require('lodash');
var S = require('string');
var db = require('../models');

module.exports = {
    postDisableInsurer :function(req,res){
        var postData = req.body.data;
        var sql = 
                knex('company_insurers')
                .update('isEnable', 0)
                .where('insurer_id',postData.id)
                .toString()
                db.sequelize.query(sql)
                .success(function(data){
                    res.json({data: data,sql:sql});
                })
                .error(function(error){
                    res.json(500, {error: error,sql:sql});
                })
    },
    postUpCompanyPatient : function(req,res){
        var postData = req.body.data;
        var sql = 
                knex('cln_patients')
                .update('company_id', postData.id)
                .where('Patient_id',postData.patient_id)
                .toString()
                db.sequelize.query(sql)
                .success(function(data){
                    res.json({data: data});
                })
                .error(function(error){
                    res.json(500, {error: error});
                })
    },
    postRemoveInsurer : function(req,res){
       var postData = req.body.data;
        var sql = knex('company_insurers')
            .where('insurer_id', postData.insurer_id)
            .del()
            .toString();

        db.sequelize.query(sql)
        .success(function(del){
            res.json({data: del});
        })
        .error(function(error){
            res.json(500, {error: error});
        }) 
    },
    postRemove :function(req,res){
        var postData = req.body.data;
        var sql = knex('patient_companies')
            .where('company_id', postData.company_id)
            .del()
            .toString();

        db.sequelize.query(sql)
        .success(function(del){
            res.json({data: del});
        })
        .error(function(error){
            res.json(500, {error: error});
        })
    },
    postEdit : function(req,res){
        var postData = req.body.data;
            var errors = [];
            var required = [
                {field: 'Company_name', message: 'Company Name required'}
            ]
            _.forIn(postData, function(value, field){
                _.forEach(required, function(field_error){
                    if(field_error.field === field && S(value).isEmpty()){
                        errors.push(field_error);
                        return;
                    }
                })
            })

            if(errors.length > 0){
                res.status(500).json({errors: errors});
                return;
            }
            var fatherId = postData.fatherId == null || postData.fatherId == '' ? null : postData.fatherId;
            var status = postData.status == '' ? 'Pending' : postData.status;
            var sql =
            knex('companies')
            .update({
                Company_name: postData.Company_name,
                Industry: postData.Industry,
                Addr: postData.Addr,
                postcode: postData.postCode,
                State: postData.State,
                Description: postData.Description,
                country: postData.country,
                result_email: postData.result_email,
                invoice_email: postData.invoice_email,
                PO_number: postData.PO_number,
                isProject:  postData.isProject == '1' ? 1 : 0 ,
                isCalendar :postData.isCalendar == '1' ? 1 :0,
                father_id: fatherId,
                report_to_email: postData.report_to_email,
                default_status : postData.default_status,
                isInvoiceEmailToUser:  postData.isInvoiceEmailToUser == '1' ? 1 : 0,
                isAddContactEmailToResult:  postData.isAddContactEmailToResult == '1' ? 1 : 0,
                IMA : postData.IMA,
                Site_name : postData.Site_name,
                Medic_contact_no : postData.Medic_contact_no,
                Email : postData.Email,
                CODE : postData.CODE,
                Phone : postData.Phone,
                Site_medic : postData.Site_medic,
                User_id : postData.User_id,
                isPO:  postData.isPO == '1' ? 1 : 0,
                isExtra:  postData.isExtra == '1' ? 1 : 0,        
            })
            .where({'id':postData.id})
            .toString()
            db.sequelize.query(sql)
            .success(function(data){
                        var sql1 =
                                knex('company_insurers')
                              .where('company_id', postData.id)
                              .del()
                              .toString()
                              db.sequelize.query(sql1)
                              .success(function(data1){
                                    var company_insurers_array = [];
                                    _.forEach(postData.listInsurerid, function(id){
                                        company_insurers_array.push({insurer_id: id.id, company_id: postData.id,isEnable:1});
                                    })  
                                   
                                    if(company_insurers_array.length > 0){
                                        var sql2 =
                                             knex('company_insurers')
                                            .insert(company_insurers_array)
                                            .toString()
                                            db.sequelize.query(sql2)
                                            .success(function(data){
                                                res.json({'status': 'success', 'data': data});
                                            })
                                            .error(function(error){
                                                res.json(500, {error: error, sql: sql2});
                                            })
                                    }
                              })
                             .error(function(error){
                                res.json(500, {error: error, sql: sql2});
                            })
            })
             .error(function(error){
                res.json(500, {error: error});
            })

    },
	postList: function(req, res){
		var postData = req.body.data;
        var pagination = req.body.pagination;
		var sql = knex
		.select('companies.*')
		.from('companies')
        .limit(postData.limit)
        .offset(postData.offset)
		.innerJoin('patient_companies', 'companies.id', '=', 'patient_companies.company_id')
		.where(
			'patient_companies.patient_id', postData.patient_id
		)
        .toString();
        var sql_count = knex('cln_insurers')
            .count('id as a')
            .toString();
        db.sequelize.query(sql)
        .success(function(detail){
            db.sequelize.query(sql_count)
            .success(function(count){
                    var sql1 = knex
                             .select('*')
                             .from('cln_patients')
                             .where('cln_patients.Patient_id', postData.patient_id)
                             .toString()
                             db.sequelize.query(sql1)
                             .success(function(data1){
                                res.json({data: detail, count: count[0].a,data1:data1});
                             })
                             .error(function(error){
                                res.json(500, {'status': 'error', 'message': error});
                            })
            })
            .error(function(error){
                res.json(500, {'status': 'error', 'message': error});
            })
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': error});
        })
	},
    postAdd : function(req,res){
            var postData = req.body.data;
           var errors = [];
            var required = [
                {field: 'Company_name', message: 'Company Name required'}
            ]

            if(postData.PO_number % 1 !== 0){
                errors.push({field: 'PO_number', message: 'PO_number must be number'});
            }
            if(postData.postcode % 1 !== 0){
                errors.push({field: 'postcode', message: 'Post code must be number'});
            }
             if(postData.latitude % 1 !== 0){
                errors.push({field: 'latitude', message: 'Latitude must be number'});
            }
            if(postData.longitude % 1 !== 0){
                errors.push({field: 'longitude', message: 'Longitude code must be number'});
            }

            _.forIn(postData, function(value, field){
                _.forEach(required, function(field_error){
                    if(field_error.field === field && S(value).isEmpty()){
                        errors.push(field_error);
                        return;
                    }
                })
            })

            if(errors.length > 0){
                res.status(500).json({errors: errors});
                return;
            }
            var fatherId = postData.fatherId == null || postData.fatherId == '' ? null : postData.fatherId;
            var sql =
            knex('companies')
            .insert({
                Company_name: postData.Company_name,
                Industry: postData.Industry,
                Addr: postData.Addr,
                postcode: postData.postCode,
                State: postData.State,
                Description: postData.Description,
                latitude : postData.latitude,
                longitude :postData.longitude,
                country: postData.country,
                result_email: postData.result_email,
                invoice_email: postData.invoice_email,
                PO_number: postData.PO_number,
                isProject:  postData.isProject == '1' ? 1 : 0 ,
                isCalendar :postData.isCalendar == '1' ? 1 :0,
                father_id: postData.parent_id,
                report_to_email: postData.report_to_email,
                default_status : postData.default_status,
                isInvoiceEmailToUser:  postData.isInvoiceEmailToUser == '1' ? 1 : 0,
                isAddContactEmailToResult:  postData.isAddContactEmailToResult == '1' ? 1 : 0,
                IMA : postData.IMA,
                Site_name : postData.Site_name,
                Medic_contact_no : postData.Medic_contact_no,
                Email : postData.Email,
                CODE : postData.CODE,
                Insurer :postData.Insurer,
                Phone : postData.Phone,
                Site_medic : postData.Site_medic,
                User_id : postData.User_id,
                isPO:  postData.isPO == '1' ? 1 : 0,
                isExtra:  postData.isExtra == '1' ? 1 : 0,
                parent_id:postData.parent_id
                
            })
            .toString()
            db.sequelize.query(sql)
            .success(function(data){
                var sql1 =
                 knex('companies')
                 .max('id as id')
                 .toString()
                 db.sequelize.query(sql1)
                    .success(function(data){
                               var company_insurers_array = [];
                                _.forEach(postData.listInsurerid, function(insurer_id){
                                    company_insurers_array.push({insurer_id: insurer_id, company_id: data[0].id,isEnable:1});
                                })

                                if(company_insurers_array.length > 0){
                                    
                                    var sql2 =
                                         knex('company_insurers')
                                        .insert(company_insurers_array)
                                        .toString()
                                        db.sequelize.query(sql2)
                                        .success(function(data){
                                            res.json({'status': 'success', 'data': data});
                                        })
                                        .error(function(error){
                                            res.json(500, {error: error});
                                        })
                                }
                                 var sql3 =
                                         knex('patient_companies')
                                        .insert({
                                                patient_id:postData.patient_id,
                                                company_id:data[0].id
                                             })
                                        .toString()
                                        db.sequelize.query(sql3)
                                        .success(function(data){ 
                                            res.json({'status': 'success', 'data': data});
                                        })
                                         .error(function(error){
                                            res.json(500, {error: error});
                                        })
                        res.json({'status': 'success', 'data': data});
                        
                    })
                    .error(function(error){
                        res.json(500, {error: error});
                    })
            })
             .error(function(error){
                res.json(500, {error: error});
            })
        },//end postAdd
    postlistInsurer: function(req, res){
        var postData = req.body.data;
        var sql = knex
        .select('*')
        .from('cln_insurers')
        .whereNotIn('cln_insurers.id', postData.insurerArray)
        .limit(postData.limit)
        .offset(postData.offset)
        .toString();
        var sql_count = knex('cln_insurers')
            .count('id as a')
            .toString();
        db.sequelize.query(sql)
        .success(function(detail){
            db.sequelize.query(sql_count)
            .success(function(count){
                res.json({data: detail, count: count[0].a});
            })
            .error(function(error){
                res.json(500, {'status': 'error', 'message': error});
            })
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': error});
        })
    },
    postListParent: function(req, res){
        var postData = req.body.data;
        console.log("------------->",postData.data);
        var sql = 
         knex('companies')
        .whereRaw('companies.id <> '+postData.Company_id)
        .limit(postData.limit)
        .offset(postData.offset)
        .toString();
        var sql_count = knex('companies')
            .count('id as a')
            .toString();

        db.sequelize.query(sql)
        .success(function(detail){
            db.sequelize.query(sql_count)
            .success(function(count){
                res.json({data: detail, count: count[0].a});
            })
            .error(function(error){
                res.json(500, {'status': 'error', 'message': error});
            })
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': error});
        })
    },
    postbyCompanyId: function(req, res){
        var postData = req.body.data;
            var sql 
                    = knex
                    .select('*')
                    .from('companies')
                    .where({id:postData.id})
                    .toString()
                    db.sequelize.query(sql)
                    .success(function(data){
                       var sql1
                            =knex
                            .select('cln_insurers.*')
                            .from('company_insurers')
                            .where({company_id:postData.id})
                            .where('company_insurers.isEnable',1)
                            .innerJoin('cln_insurers','company_insurers.insurer_id','=', 'cln_insurers.id')
                            .toString()
                            db.sequelize.query(sql1)
                            .success(function(data1){
                                var sql2 = knex
                                        .select('Company_name')
                                        .from('companies')
                                        .where({id:data[0].parent_id})
                                        .toString()
                                        db.sequelize.query(sql2)
                                        .success(function(data2){
                                             if(data2.length <= 0)
                                             {
                                                data2 = [{Company_name:null}];
                                             } 
                                            res.json({'status': 'success', 'data': data,'data1':data1,'data2':data2});
                                        })
                                        .error(function(error){
                                            res.json(500, {'status': 'error', 'message': 'error'});
                                        })
                                
                            })
                            .error(function(error){
                                res.json(500, {'status': 'error', 'message': 'error',sql:sql1});
                            })
                    })
                    .error(function(error){
                        res.json(500, {'status': 'error', 'message': 'error'});
                    })
    },
   ///////////Ben Tan
    getDetail: function(req, res){
        var company_id = req.body.company_id;

        var sql = "SELECT * FROM companies WHERE id="+company_id;
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: err, sql: sql});
                    return;
                }
                res.json({status: 'success', data: data[0]});
            });
        });
    },
    companyList: function(req,res){
        db.Company.findAll()
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'})
            })

    },
    subCompany: function(req,res)
    {
        var id = req.body.id;
        db.Company.findAll({where:{father_id: id}},{raw:true}).success(function(data){
            res.json({status:'success',rs:data});
        }).error(function(err){
            res.json({status:'error',err:err});
        })
    },
    companyInfo: function(req,res){
        var id = req.body.comId;
        db.Company.find({where:{id:id}},{raw:true}).success(function(data){
            res.json(data);
        }).error(function(err){
            res.json({status:'error'});
        })
    },
    insert: function(req,res){
        var info = req.body.info;

        var fatherId = info.fatherId == null || info.fatherId == '' ? null : info.fatherId;
        var status = info.status == '' ? 'Pending' : info.status;

        db.Company.create({
            Company_name: info.companyName,
            Industry: info.industry,
            Addr: info.addr,
            postcode: info.postCode,
            State: info.state,
            Description: info.description,
            country: info.country,
            PO_number: info.poNum,
            isInvoiceEmailToUser:  info.isInvoice == '1' ? 1 : 0,
            invoice_email: info.invoiceEmail,
            isAddContactEmailToResult:  info.isResult == '1' ? 1 : 0,
            result_email: info.resultEmail,
            report_to_email: info.reportEmail,
            default_status: status,
            isProject:  info.isProject == '1' ? 1 : 0 ,
            isPO:  info.isPO == '1' ? 1 : 0,
            isExtra:  info.isExtra == '1' ? 1 : 0,
            father_id: fatherId
        },{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    edit: function(req,res){
        var info = req.body.info;
        var comId = info.id;

        db.Company.update({
            Company_name: info.companyName,
            Industry: info.industry,
            Addr: info.addr,
            postcode: info.postCode,
            State: info.state,
            Description: info.description,
            country: info.country,
            PO_number: info.poNum,
            isInvoiceEmailToUser:  info.isInvoice == '1' ? 1 : 0,
            invoice_email: info.invoiceEmail,
            isAddContactEmailToResult:  info.isResult == '1' ? 1 : 0,
            result_email: info.resultEmail,
            report_to_email: info.reportEmail,
            default_status: info.status,
            isProject:  info.isProject == '1' ? 1 : 0 ,
            isExtra:  info.isExtra == '1' ? 1 : 0,
            isPO:  info.isPO == '1' ? 1 : 0
        },{id:comId})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }

}