//var db = require('../../models');
//
//module.exports = {
//
//    insert: function(req,res){
//        var info = req.body.info;
//
//        var fatherId = info.fatherId == null || info.fatherId == '' ? null : info.fatherId;
//        var status = info.status == '' ? 'Pending' : info.status;
//
//        db.Company.create({
//            Company_name: info.companyName,
//            Industry: info.industry,
//            Addr: info.addr,
//            postcode: info.postCode,
//            State: info.state,
//            Description: info.description,
//            country: info.country,
//            PO_number: info.poNum,
//            isInvoiceEmailToUser: info.isInvoice == '' || info.isInvoice == null ? 0 : 1,
//            invoice_email: info.invoiceEmail,
//            isAddContactEmailToResult: info.isResult == '' || info.isResult == null ? 0 : 1,
//            result_email: info.resultEmail,
//            report_to_email: info.reportEmail,
//            default_status: status,
//            isProject: info.isProject == '' || info.isProject == null ? 0 : 1 ,
//            isPO: info.isPO == '' || info.isPO == null ? 0 : 1,
//            father_id: fatherId
//        },{raw:true})
//            .success(function(data){
//                res.json({status:'success'});
//            })
//            .error(function(err){
//                res.json({status:'error'});
//                console.log(err);
//            })
//    }
//};