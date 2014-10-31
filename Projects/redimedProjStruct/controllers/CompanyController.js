/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
module.exports = {
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
};