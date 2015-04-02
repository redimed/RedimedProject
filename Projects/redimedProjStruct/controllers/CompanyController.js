var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var _ = require('lodash');
var S = require('string');
var db = require('../models');

module.exports = {

	getList: function(req, res){
		var postData = req.body.data;
		var sql = knex
		.select('*')
		.from('companies')
		.innerJoin('patient_companies', 'companies.id', '=', 'patient_companies.company_id')
		.where(
			'patient_companies.patient_id', postData.patient_id
		)
		.toString()
		db.sequelize.query(sql)
		.success(function(detail){
			if(!detail) res.json(500, {'status': 'error', 'message': 'Cannot Get Detail'});
			res.json({'status': 'success', 'data': detail});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},
	// postAdd : function(req,res){
 //        var postData = req.body.data;

 //        var fatherId = postData.fatherId == null || postData.fatherId == '' ? null : postData.fatherId;
 //        var status = postData.status == '' ? 'Pending' : postData.status;
 //        var sql =
 //        knex('companies')
 //        .insert({
 //            Company_name: postData.Company_name,
 //            Industry: postData.Industry,
 //            Addr: postData.Addr,
 //            postcode: postData.postCode,
 //            State: postData.State,
 //            Description: postData.Description,
 //            country: postData.country,
 //            PO_number: postData.PO_number,
 //            isInvoiceEmailToUser:  postData.isInvoiceEmailToUser == '1' ? 1 : 0,
 //            invoice_email: postData.invoice_email,
 //            isAddContactEmailToResult:  postData.isAddContactEmailToResult == '1' ? 1 : 0,
 //            result_email: postData.result_email,
 //            report_to_email: postData.report_to_email,
 //            isProject:  postData.isProject == '1' ? 1 : 0 ,
 //            isPO:  postData.isPO == '1' ? 1 : 0,
 //            isExtra:  postData.isExtra == '1' ? 1 : 0,
 //            father_id: fatherId
 //        })
 //        .toString()
 //        db.sequelize.query(sql)
 //        .success(function(data){
 //            res.json({'status': 'success', 'data': data});
 //        })
 //        .error(function(error){
 //            res.json(500, {'status': 'error', 'message': error});
 //        })
 //    },//end postAdd
 postAdd : function(req,res){
        var postData = req.body.data;
        postData.listInsurerid;
        var fatherId = postData.fatherId == null || postData.fatherId == '' ? null : postData.fatherId;
        var status = postData.status == '' ? 'Pending' : postData.status;
        var sql =
        knex('companies')
        .insert({
            Company_name: postData.Company_name,
            Industry: postData.Industry,
            Addr: postData.Addr,
            postcode: postData.postCode,
            State: postData.State,
            Description: postData.Description,
            country: postData.country,
            PO_number: postData.PO_number,
            isInvoiceEmailToUser:  postData.isInvoiceEmailToUser == '1' ? 1 : 0,
            invoice_email: postData.invoice_email,
            isAddContactEmailToResult:  postData.isAddContactEmailToResult == '1' ? 1 : 0,
            result_email: postData.result_email,
            report_to_email: postData.report_to_email,
            isProject:  postData.isProject == '1' ? 1 : 0 ,
            isPO:  postData.isPO == '1' ? 1 : 0,
            isExtra:  postData.isExtra == '1' ? 1 : 0,
            father_id: fatherId
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
                                company_insurers_array.push({insurer_id: insurer_id, company_id: data[0].id});
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
                                        res.json(500, {'status': 'error', 'message': error});
                                    })
                            }
                    
                })
                .error(function(error){
                    res.json(500, {'status': 'error', 'message': error});
                    
                })//end sql1
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': error});
        })
    },//end postAdd
    postlistInsurer: function(req, res){
        var postData = req.body.data;
        var sql = knex
        .select('*')
        .from('cln_insurers')
        .toString()
        db.sequelize.query(sql)
        .success(function(detail){
            if(!detail) res.json(500, {'status': 'error', 'message': 'Cannot Get Detail'});
            res.json({'status': 'success', 'data': detail});
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': error});
        })
    },
    postListParent: function(req, res){
        var postData = req.body.data;
        var sql = knex
        .select('*')
        .from('companies')
        .toString()
        db.sequelize.query(sql)
        .success(function(detail){
            if(!detail) res.json(500, {'status': 'error', 'message': 'Cannot Get Detail'});
            res.json({'status': 'success', 'data': detail});
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': error});
        })
    },
    postbyCompanyId: function(req, res){
        var postData = req.body.data;
        var sql = knex
        .select('*')
        .from('companies')
        .where('id', postData.id)
        .toString()
        db.sequelize.query(sql)
        .success(function(detail){
            if(!detail) res.json(500, {'status': 'error', 'message': 'Cannot Get Detail'});
            res.json({'status': 'success', 'data': detail});
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': 'sao no ko ra'});
        })
    },
    ///////////
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