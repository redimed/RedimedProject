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

}