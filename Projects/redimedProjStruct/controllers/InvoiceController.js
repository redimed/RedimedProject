/**
 * created by: tan, manh
 * creation date: 16-6-2015
 */
var kiss=require('./kissUtilsController');
var moment=require('moment');
var errorCode=require('./errorCode');
var controllerCode="RED_INVOICE_V3";
module.exports =
{

	/**
	 * tannv.dts@gmail.com
	 * Lay thong tin invoice header
	 * creation date: 16-6-2015
	 */
	getInvoiceHeader:function(req,res)
	{
		var fHeader="invoiceController->getInvoiceHeader";
		var functionCode="FN-TN-001";
		var invoiceHeaderId=kiss.checkData(req.body.invoiceHeaderId)?req.body.invoiceHeaderId:'';
		if(!kiss.checkListData(invoiceHeaderId))
		{
			kiss.exlog(fHeader,"Loi data truyen den");
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
			return;
		}
		var sql=
			" SELECT `invoiceHeader`.*,claim.`Injury_name`,                                              "+
			" patient.`First_name`,patient.`Sur_name`,patient.`Middle_name`,                             "+
			" company.`Company_name`,                                                                    "+
			" insurer.`insurer_name`,                                                                    "+
			" doctor.`doctor_id`,                                                                        "+
			" site.`Site_name`,                                                                          "+
			" dept.`CLINICAL_DEPT_NAME`,                                                                 "+
			" service.`SERVICE_NAME`                                                                     "+
			" FROM `cln_invoice_header` invoiceHeader                                                    "+
			" LEFT JOIN `cln_claims` claim ON invoiceHeader.`claim_id`=claim.`Claim_id`                  "+
			" INNER JOIN `cln_patients` patient ON `invoiceHeader`.`Patient_id`=patient.`Patient_id`     "+
			" LEFT JOIN `companies` company ON `invoiceHeader`.`Company_id`=company.`id`                 "+
			" LEFT JOIN `cln_insurers` insurer ON `invoiceHeader`.`Insurer_id`=insurer.`id`              "+
			" INNER JOIN `doctors` doctor ON `invoiceHeader`.`DOCTOR_ID`=doctor.`doctor_id`              "+
			" INNER JOIN `redimedsites` site ON `invoiceHeader`.`SITE_ID`=site.`id`                      "+
			" INNER JOIN `cln_clinical_depts` dept ON invoiceHeader.`DEPT_ID`=dept.`CLINICAL_DEPT_ID`    "+
			" INNER JOIN `sys_services` service ON invoiceHeader.`SERVICE_ID`=service.`SERVICE_ID`       "+
			" WHERE invoiceHeader.`header_id`=?                                                          ";
		kiss.executeQuery(req,sql,[invoiceHeaderId],function(rows){
			if(rows.length>0)
			{
				res.json({status:'success',data:rows[0]});
			}
			else
			{
				kiss.exlog(fHeader,"Khong co invoice header tuong ung voi id");
				res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
			}
		},function(err){
			kiss.exlog(fHeader,"Loi truy van lay thong tin invoice Header",err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
		})
	},

	/**
	 * create by: tannv.dts@gmail.com
	 * Lay cac line cua invoice header
	 */
	getInvoiceListLines:function(req,res)
	{
		var fHeader="invoiceController->getInvoiceListLines";
		var functionCode="FN-TN-002";
		var invoiceHeaderId=kiss.checkData(req.body.invoiceHeaderId)?req.body.invoiceHeaderId:'';
		if(!kiss.checkListData(invoiceHeaderId))
		{
			kiss.exlog(fHeader,"Loi data truyen den");
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
			return;
		}
		var sql=
			" SELECT `invoiceLine`.*,                                                "+
			" item.`ITEM_NAME`                                                       "+
			" FROM `cln_invoice_lines` invoiceLine                                   "+
			" INNER JOIN `inv_items` item ON invoiceLine.`ITEM_ID`=item.`ITEM_ID`    "+
			" WHERE invoiceLine.`HEADER_ID`=? AND invoiceLine.`IS_ENABLE`=1          ";
		kiss.executeQuery(req,sql,[invoiceHeaderId],function(rows){
			res.json({status:'success',data:rows});
		},function(err){
			kiss.exlog(fHeader,"Loi truy van lay thong tin invoice Header",err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
		});

	}
}