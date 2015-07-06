var db = require('../models');
var InvoiceLineModel = require('../v1_models/Cln_invoice_lines.js');
var kiss=require('./kissUtilsController');//tan add
var errorCode=require('./errorCode'); //tan add
var $q = require('q');//tan add
var invoiceUtil = require('./invoiceUtilController');//tan add
var moment=require('moment');//tan add

var ERP_REST = require('../helper/ERP_Rest');

var controllerCode="RED_INVOICEv2";//tan add

var inc_common_model =  [
	{ 
		model: db.Company , as: 'Company',
		attributes: ['Company_name'],
	},
	{ 
		model: db.Insurer , as: 'Insurer',
		attributes: ['insurer_name'],
	},
	{ 
		model: db.mdtRedimedsites , as: 'Site',
		attributes: ['Site_name'],
	},
	{ 
		model: db.Doctor , as: 'Doctor',
		attributes: ['NAME',"CLINICAL_DEPT_ID"],
	},
	{ 
		model: db.SysServices , as: 'Service',
		attributes: ['SERVICE_ID','SERVICE_NAME'],
	},
	{
		model: db.Appointment , as: 'Appointment',
		attributes: ['FROM_TIME','TO_TIME'],
	},
];

module.exports = {

	/**
	 * created by: unknown
	 * tannv.dts mark
	 * khoi tao cln_invoice_header
	 */
	postInit: function(req, res) {
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;
		var appt = null, patient = null, patient_claim = null;

		// GET APPT DEPTAIL
		db.Appointment.find({
			where: {CAL_ID: cal_id},
		}).then(function(data){
			appt = data;
			if( !appt) {
				res.json(500, {"status": "error", "message": 'Cannot found Appointment'});
				return;
			}
			// GET PATIENT DETAIL 
			return db.Patient.find(patient_id);
		}).then(function(data){
			patient = data;
			if( !patient) {
				res.json(500, {"status": "error", "message": 'Cannot found Patient'});
				return;
			}

			// GET PATIENT CLAIM DETAIL
			return db.mdtPatientClaim.find({
				where: {Patient_id: patient_id, CAL_ID: cal_id},
				include: [
					{ model: db.Claim , as: 'Claim' },
				]
			});
		})
		.then(function(data) {
			patient_claim = data;
			
			// GET INVOICE HEADER 
			return db.mdtInvoiceHeader.find({
				where: {
					cal_id: cal_id,
					Patient_id: patient_id
				}
			});
		})
		.then(function(header){
			var insurer_id = null, company_id = null, claim_id = null;

			company_id = patient.company_id;
			if(patient_claim && patient_claim.claim) {
				// insurer_id = patient_claim.claim.insurer_site;//tan frame
				insurer_id = patient_claim.claim.insurer_id;//tan add
				claim_id = patient_claim.Claim_id;
			}

			var invoice_header = {
				cal_id: cal_id,
				claim_id: claim_id,
				Patient_id: patient_id,
				Company_id: company_id,
				Insurer_id: insurer_id,
				DOCTOR_ID: appt.DOCTOR_ID,
				SERVICE_ID: appt.SERVICE_ID,
				SITE_ID: appt.SITE_ID,
				DEPT_ID: appt.CLINICAL_DEPT_ID,
				STATUS: 'enter'
			}

			// INSERT OR UPDATE
			if(!header) {
				return db.mdtInvoiceHeader.create(invoice_header);
			} else {
				return db.mdtInvoiceHeader.update(invoice_header, {
		            header_id: header.header_id
		        });
			}
		})
		.then(function(data){
			res.json({status: 'success', data: data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	/**
	 * created by: unknown
	 * tannv.dts mark
	 * ham nay se khong su dung nua
	 */
	postEnd: function(req, res) {
		// var header_id = 1;
		// var cal_id = 25626;
		// var patient_id = 469;

		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;
		

		db.mdtInvoiceHeader.find({
			where: {
				cal_id: cal_id,
				Patient_id: patient_id
			}
		}).then(function(data) {
			if(!data || !data.header_id) {
				res.json(500, {"status": "error", "message": 'Cannot found `Invoice header`'});
				return;
			}
			var header_id = data.header_id;
			var sql = InvoiceLineModel.sql_insert_from_appt_items(header_id, cal_id, patient_id);
			return db.sequelize.query(sql);
		})
		.then(function(data){
			res.json({status: 'success', data: data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postSearch: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
        var order = (req.body.order) ? req.body.order : null;

		var fields = req.body.fields;

		var search_data = req.body.search;
		var whereOpt = {};

		
		if(search_data && search_data.patient_id && search_data.cal_id) {
			whereOpt.Patient_id = search_data.patient_id;
			whereOpt.cal_id = search_data.cal_id;
			var inc_model = inc_common_model;
		} else {
			var inc_model = inc_common_model.concat([
				{
					model: db.Patient , as: 'Patient',
					attributes: ['Title', 'First_name', 'Sur_name']
				}
			]);

			if(search_data.STATUS) { // equal
				whereOpt.STATUS = search_data.STATUS;
			}

		}

		db.mdtInvoiceHeader.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			include: inc_model,
			order: order
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	/**
	 * tannv.dts@gmail.com mark
	 */
	postDetail: function(req, res) {
		var header_id = req.body.header_id;
		var inc_model = inc_common_model.concat([
			{ 
				model: db.Department , as: 'Department',
				attributes: ['CLINICAL_DEPT_NAME']
			},
			{
				model: db.Patient, as: 'Patient',
				attributes: ['Title', 'Sur_name', 'First_name', 'Middle_name']
			},
			{
				model: db.Claim, as: 'Claim', attributes: ['Injury_name','Insurer','insurer_id']
			},
			{ 
				model: db.mdtInvoiceLine , as: 'Lines',
				include:   [
					{ 
						model: db.InvItem , as: 'InvItem',
						attributes: ['ITEM_CODE', 'ITEM_NAME']
					},
				]
			}

		]);
		db.mdtInvoiceHeader.find({
			where: {header_id: header_id},
			include: inc_model
		}).success(function(result){
			res.json({"status": "success", "data": result});
		})
		.error(function(error){
			console.log(error)
			kiss.exlog(error);
			res.json(500, {"status": "error", "message": error});
		});
	},

	/**
	 * create by: unknown
	 * modify by:tannv.dts@gmail.com
	 */
	postUpdate: function(req, res) {
	 	var postData = req.body.data;	
	 	kiss.exlog(postData)
        var header_id =  req.body.header_id;

        db.mdtInvoiceHeader.find({
        	where: {header_id: header_id},
        }).then(function(header){
        	if(!header) {
        		res.json(500, {"status": "error", "message": 'Missing Header' });
        		return;
        	}

            return header.updateAttributes(postData);
        }).then(function (data) {
	        res.json({"status": "success", "data": data});
	    }).error(function (error) {
            res.json(500, {"status": "error", "message": error });
        })	
	},

	postAdd: function(req, res){
		var postData = req.body.data;	
		var lines = postData.lines;

		var amount = 0;
		for(var i = 0, len = lines.length; i < len; ++i) {
 			var line = lines[i];
 			line.AMOUNT = line.QUANTITY * line.PRICE;
 			amount += line.AMOUNT ;
 		} 
 		postData.AMOUNT = amount;

		db.mdtInvoiceHeader.create(postData)
		.success(function (header) {
			var header_id = header.header_id;
			for(var i = 0, len = lines.length; i < len; ++i) {
	 			lines[i].HEADER_ID = header_id;
	 		} 
			return db.mdtInvoiceLine.bulkCreate(lines)
		})
		.success(function(create){
			res.json({status: 'success'});
		})
		.error(function (error) {
            res.json(500, {'status': 'error','message': error });
        })
	},

	/**
	 * tannv.dts@gmail.com
	 * Luu thong tin invoice line
	 */
	postCreateInvoiceLine:function(req,res)
	{	
		var fHeader="v2_InvoiceController->postSaveInvoiceLine";
		var functionCode='FN002';
		var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
		
		var invoiceHeaderId=kiss.checkData(postData.invoiceHeaderId)?postData.invoiceHeaderId:'';
		var calId=kiss.checkData(postData.calId)?postData.calId:'';
		var patientId=kiss.checkData(postData.patientId)?postData.patientId:'';
		var invoiceLine=kiss.checkData(postData.invoiceLine)?postData.invoiceLine:{};
		var itemId=kiss.checkData(invoiceLine.ITEM_ID)?invoiceLine.ITEM_ID:'';
		var quantity=kiss.checkData(invoiceLine.QUANTITY)?invoiceLine.QUANTITY:1;
		var price=kiss.checkData(invoiceLine.PRICE)?invoiceLine.PRICE:0;
		var timeSpent=kiss.checkData(invoiceLine.TIME_SPENT)?invoiceLine.TIME_SPENT:0;
		var taxId=kiss.checkData(invoiceLine.TAX_ID)?invoiceLine.TAX_ID:null;
		var taxCode=kiss.checkData(invoiceLine.TAX_CODE)?invoiceLine.TAX_CODE:null;
		var taxRate=kiss.checkData(invoiceLine.TAX_RATE)?invoiceLine.TAX_RATE:null;

		if(!kiss.checkListData(invoiceHeaderId,calId,patientId,invoiceLine,itemId))
		{
			kiss.exlog(fHeader,"Loi data truyen den",[invoiceHeaderId,invoiceLineId]);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
			return;
		}

		var sql=
			" SELECT line.*                                                           "+
			" FROM `cln_invoice_lines` line                                           "+
			" WHERE line.`HEADER_ID`=? AND line.`ITEM_ID`=? AND line.`IS_ENABLE`=1    ";
		kiss.executeQuery(req,sql,[invoiceHeaderId,itemId],function(rows){
			if(rows.length>0)
			{
				//item da ton tai
				res.json({status:'exist'});
			}
			else
			{
				kiss.beginTransaction(req,function(){
					var sql="DELETE FROM `cln_invoice_lines` WHERE `HEADER_ID`=? AND `ITEM_ID`=?";
					kiss.executeQuery(req,sql,[invoiceHeaderId,itemId],function(result){
						var invoiceLineInsert={
							HEADER_ID:invoiceHeaderId,
							ITEM_ID:itemId,
							PRICE:price,
							QUANTITY:quantity,
							TIME_SPENT:timeSpent,
							AMOUNT:price*quantity,
							TAX_ID:taxId,
							TAX_CODE:taxCode,
							TAX_RATE:taxRate,
							IS_ENABLE:1
						}
						if(taxRate!=null)
							invoiceLineInsert.TAX_AMOUNT=price*quantity*taxRate;
						var sql="insert into cln_invoice_lines set ?";
						kiss.executeQuery(req,sql,[invoiceLineInsert],function(result){
							kiss.commit(req,function(){
								//tra ve data dong bo hoa
								invoiceLine.HEADER_ID=invoiceHeaderId;
								invoiceLine.line_id=result.insertId;
								invoiceLine.AMOUNT=invoiceLineInsert.AMOUNT;
								invoiceLine.IS_ENABLE=invoiceLineInsert.IS_ENABLE;
                                res.json({status:'success',data:invoiceLine});
                            },function(err){
                                kiss.exlog(fHeader,"Loi commit",err);
                                res.json({status:'fail',error:errorCode(controllerCode,functionCode,'TN006')});
                            })
						},function(err){
							kiss.exlog(fHeader,"Loi insert invoice line",err);
							kiss.rollback(req,function(){
								res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN005')});
							});
						});
					},function(err){
						kiss.exlog(fHeader,'Loi truy van xoa cln_invoice_lines cu',err);
						kiss.rollback(req,function(){
							res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN004')});
						});
					})
				},function(err){
					kiss.exlog(fHeader,"Khong the mo transaction",err);
					res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
				})
			}
		},function(err){
			kiss.exlog(fHeader,'Loi truy van kiem tra xem appt item co ton tai chua',err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
		});

	},

	postUpdateInvoiceLine:function(req,res)
	{
		var fHeader="v2_InvoiceController->postUpdateInvoiceLine";
		var functionCode='FN003';
		var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
		
		var invoiceLine=kiss.checkData(postData.invoiceLine)?postData.invoiceLine:{};
		var itemId=kiss.checkData(invoiceLine.ITEM_ID)?invoiceLine.ITEM_ID:'';
		var quantity=kiss.checkData(invoiceLine.QUANTITY)?invoiceLine.QUANTITY:1;
		var price=kiss.checkData(invoiceLine.PRICE)?invoiceLine.PRICE:0;
		var timeSpent=kiss.checkData(invoiceLine.TIME_SPENT)?invoiceLine.TIME_SPENT:0;
		var taxId=kiss.checkData(invoiceLine.TAX_ID)?invoiceLine.TAX_ID:null;
		var taxCode=kiss.checkData(invoiceLine.TAX_CODE)?invoiceLine.TAX_CODE:null;
		var taxRate=kiss.checkData(invoiceLine.TAX_RATE)?invoiceLine.TAX_RATE:null;

		var invoiceLineId=invoiceLine.line_id;
		
		if(!kiss.checkListData(invoiceLineId))
		{
			kiss.exlog(fHeader,'Loi data truyen den');
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN008')});
			return;
		}
		kiss.beginTransaction(req,function(){
			var sql="UPDATE `cln_invoice_lines` SET ? WHERE line_id=?";
			var invoiceLineUpdateInfo={
				TIME_SPENT:timeSpent,
				QUANTITY:quantity,
				PRICE:price,
				AMOUNT:price*quantity,
				TAX_ID:taxId,
				TAX_CODE:taxCode,
				TAX_RATE:taxRate,
				IS_ENABLE:1
			}
			if(taxRate)
				invoiceLineUpdateInfo.TAX_AMOUNT=price*quantity*taxRate;
			kiss.executeQuery(req,sql,[invoiceLineUpdateInfo,invoiceLineId],function(result){
				if(result.affectedRows>0)
				{
					kiss.commit(req,function(){
						res.json({status:'success'});
					},function(err){
						kiss.exlog(fHeader,'Loi commit update',err);
						res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN014')});
					})
				}
				else
				{
					kiss.exlog(fHeader,'Khong co invoice line tuong ung voi id duoc cap nhat');
					kiss.rollback(req,function(){
						res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN011')});
					});
				}
			},function(err){
				kiss.exlog(fHeader,'Loi cap nhat cln_invoice_lines',err);
				kiss.rollback(req,function(){
					res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN010')});
				});
			},true);
		},function(err){
			kiss.exlog(fHeader,'Khong the mo transaction update',err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN009')});
		});
	},

	/**
	 * tannv.dts@gmail.com
	 * update invoice header
	 */
	postSave:function(req,res)
	{
		var fHeader="v2_InvoiceController->postSave";
		var functionCode="FN004";
		var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
		var invoiceHeaderId=kiss.checkData(postData.header_id)?postData.header_id:'';
		var calId=kiss.checkData(postData.cal_id)?postData.cal_id:'';
		var patientId=kiss.checkData(postData.Patient_id)?postData.Patient_id:'';
		var claimId=kiss.checkData(postData.claim_id)?postData.claim_id:null;
		var companyId=kiss.checkData(postData.Company_id)?postData.Company_id:null;
		var insurerId=kiss.checkData(postData.Insurer_id)?postData.Insurer_id:null;
		var doctorId=kiss.checkData(postData.DOCTOR_ID)?postData.DOCTOR_ID:'';
		var siteId=kiss.checkData(postData.SITE_ID)?postData.SITE_ID:'';
		var deptId=kiss.checkData(postData.DEPT_ID)?postData.DEPT_ID:'';
		var serviceId=kiss.checkData(postData.SERVICE_ID)?postData.SERVICE_ID:'';
		var status=kiss.checkData(postData.STATUS)?postData.STATUS:'';

		kiss.beginTransaction(req,function(){
		var sql=
			" SELECT line.`HEADER_ID`, COUNT(line.`line_id`) AS TOTAL_LINES,   "+
			" SUM (line.`AMOUNT`) AS TOTAL_AMOUNT                              "+
			" FROM `cln_invoice_lines` line                                    "+
			" WHERE line.`HEADER_ID`=? AND line.`IS_ENABLE`=1                  "+
			" GROUP BY line.`HEADER_ID`                                        ";
			kiss.executeQuery(req,sql,[invoiceHeaderId],function(rows){
				if(rows.length>0)
				{
					var totalLine=rows[0].TOTAL_LINES;
					var totalAmount=rows[0].TOTAL_AMOUNT;
					if(totalLine>0)
					{
						var sql="UPDATE `cln_invoice_header` SET ? WHERE header_id= ?";
						var invoiceHeaderUpdateInfo={
							claim_id:claimId,
							Company_id:companyId,
							Insurer_id:insurerId,
							DOCTOR_ID:doctorId,
							SITE_ID:siteId,
							DEPT_ID:deptId,
							SERVICE_ID:serviceId,
							STATUS: status, 
							AMOUNT: totalAmount
						};
						kiss.exlog(invoiceHeaderUpdateInfo);
						kiss.executeQuery(req,sql,[invoiceHeaderUpdateInfo,invoiceHeaderId],function(result){
							if(result.affectedRows>0)
							{
								//tannv.dts 
								//29-06-2015
								//---------------------------------------------------------------------
								//---------------------------------------------------------------------
								//---------------------------------------------------------------------
								/*invoiceUtil.getNewInvoiceNumber(req,function(newInvoiceNo){
									db.mdtInvoiceHeader.update({INVOICE_NUMBER:newInvoiceNo},{header_id:header_id})
									.then(function(result){
										
									},function(err){

									});
								},function(err){

								})*/

								if(status=='done')
								{
									invoiceUtil.getNewInvoiceNumber(req,function(newInvoiceNo){
										var sql="UPDATE `cln_invoice_header` SET ? WHERE header_id= ?";
										var invoiceDate=moment();
										var invoiceHeaderUpdateDone={
											INVOICE_NUMBER:newInvoiceNo,
											INVOICE_DATE:invoiceDate.format("YYYY/MM/DD HH:mm:ss")
										}
										invoiceHeaderUpdateInfo.INVOICE_NUMBER=newInvoiceNo;
										invoiceHeaderUpdateInfo.INVOICE_DATE=invoiceDate.toDate();//javascript date
										kiss.executeQuery(req,sql,[invoiceHeaderUpdateDone,invoiceHeaderId],function(result){
											var customerInfo={};
											var listItemInfo=[];
											var listInvoiceLine=[];
											function getCustomerInfo()
											{
												console.log(">>>>>>>>>>>>>>>>>getCustomerInfo");
												var customerInfo={};
												var q = $q.defer();
												if(kiss.checkData(invoiceHeaderUpdateInfo.claim_id))
												{
													kiss.exlog(fHeader,">>>>>>>>>>>>>>>>>","this is insurer");
													//patient co insurer
													var sql="SELECT insurer.* FROM `cln_insurers` insurer WHERE insurer.`id`=?";
													kiss.executeQuery(req,sql,[invoiceHeaderUpdateInfo.Insurer_id],function(rows){
														if(rows.length>0)
														{
															var insurer=rows[0];
															customerInfo.pVsName=insurer.insurer_name;
															customerInfo.pAddress=insurer.address;
															customerInfo.pCusChar20=insurer.id;
															customerInfo.pCusNumber1=insurer.id;
															customerInfo.pVsSiteName=insurer.insurer_name;
															customerInfo.pAddressLine1=insurer.address;
															customerInfo.pCountry=insurer.country;
															customerInfo.pPhone=insurer.phone;
															q.resolve(customerInfo);
														}
														else
														{
															kiss.exlog(fHeader,'Khong ton tai thong tin insurer');
															kiss.rollback(req,function(){
																res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN008')});
															})
															q.reject();
														}
														
													},function(err){
														kiss.exlog(fHeader,'Loi truy van lay thong tin insurer',err);
														kiss.rollback(req,function(){
															res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN007')});
														})
														q.reject();
													})
												}else if(kiss.checkData(invoiceHeaderUpdateInfo.Company_id))
												{
													kiss.exlog(fHeader,">>>>>>>>>>>>>>>>>","this is company");
													var sql="SELECT company.* FROM `companies` company WHERE company.`id`=?";
													kiss.executeQuery(req,sql,[invoiceHeaderUpdateInfo.Company_id],function(rows){
														if(rows.length>0)
														{
															var company=rows[0];
															customerInfo.pVsName=company.Company_name;
															customerInfo.pAddress=company.Addr;
															customerInfo.pCusChar20=company.id;
															customerInfo.pCusNumber1=company.id;
															customerInfo.pVsSiteName=company.Company_name;
															customerInfo.pAddressLine1=company.Addr;
															customerInfo.pCountry=null;
															customerInfo.pPhone=company.Phone;
															q.resolve(customerInfo);
														}
														else
														{
															kiss.exlog(fHeader,'Khong ton tai thong tin company');
															kiss.rollback(req,function(){
																res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN010')});
															})
															q.reject();
														}
													},function(err){
														kiss.exlog(fHeader,'Loi truy van lay thong tin company',err);
														kiss.rollback(req,function(){
															res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN009')});
														})
														q.reject();
													});
												}
												else
												{
													kiss.exlog(fHeader,">>>>>>>>>>>>>>>>>","this is patient");
													var sql="SELECT patient.* FROM `cln_patients` patient WHERE patient.`Patient_id`=?";
													kiss.executeQuery(req,sql,[patientId],function(rows){
														if(rows.length>0){
															var patient=rows[0];
															customerInfo.pVsName=patient.First_name+' '+patient.Sur_name;
															customerInfo.pAddress=patient.Address1;
															customerInfo.pCusChar20=patient.Patient_id;
															customerInfo.pCusNumber1=patient.Patient_id;
															customerInfo.pVsSiteName=patient.First_name+' '+patient.Sur_name;
															customerInfo.pAddressLine1=patient.Address2;
															customerInfo.pCountry=patient.Country;
															customerInfo.pPhone=patient.Mobile;
															q.resolve(customerInfo);
														}
														else
														{
															kiss.exlog(fHeader,'Thong tin patient khong ton tai');
															kiss.rollback(req,function(){
																res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN012')});
															})
															q.reject();
														}
													},function(err){
														kiss.exlog(fHeader,'Loi truy van lay thong tin patient',err);
														kiss.rollback(req,function(){
															res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN011')});
														});
														q.reject();
													})
												}

												return q.promise;
											}

											function getListItemInfo()
											{
												
												console.log(">>>>>>>>>>>>>>>>>getListItemInfo");
												var q = $q.defer();
												var listItemInfo=[];
												var sql=
													" SELECT item.*                                                  "+
													" FROM `cln_invoice_lines` line                                  "+
													" INNER JOIN `inv_items` item ON line.`ITEM_ID`=item.`ITEM_ID`   "+
													" WHERE line.`HEADER_ID`=? AND line.`IS_ENABLE`=1;               ";
												kiss.executeQuery(req,sql,[invoiceHeaderId],function(rows){
													if(rows.length>0)
													{
														for(var i=0;i<rows.length;i++)
														{
															var row=rows[i];
															var item={};
															item.pOldItemNumber=row.ITEM_ID;
															item.pOldItemNumber2=row.ITEM_CODE;
															item.pPrimaryUom=row.UOM?row.UOM:'N/A';
															item.pItemName1=row.ITEM_NAME.length<=2000?row.ITEM_NAME:row.ITEM_NAME.substring(0,1997)+"...";
															listItemInfo.push(item);
														}
														//q.resolve({list:listItemInfo});
														q.resolve(listItemInfo);
													}
													else
													{
														kiss.exlog(fHeader,'invoice chua co items');
														kiss.rollback(req,function(){
															res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN014')});
														})
														q.reject();
													}
												},function(err){
													kiss.exlog(fHeader,'Loi truy van lay thong tin items',err);
													kiss.rollback(req,function(){
														res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN013')});
													})
													q.reject();
												});
												return q.promise;
											}

											function getListInvoiceLine()
											{
												console.log(">>>>>>>>>>>>>>>>>getListInvoiceLine");
												var q = $q.defer();
												var listInvoiceLine=[];
												var sql=
													" SELECT line.*,patient.`First_name`,patient.`Sur_name`,claim.`Claim_no`          "+              
													" FROM `cln_invoice_lines` line                                                   "+
													" INNER JOIN `cln_invoice_header` header ON line.`HEADER_ID`=header.`header_id`   "+
													" INNER JOIN `cln_patients` patient ON patient.`Patient_id`=header.`Patient_id`   "+
													" LEFT JOIN `cln_claims` claim ON header.`claim_id`=claim.`Claim_id`              "+
													" WHERE line.`HEADER_ID`=? AND line.`IS_ENABLE`=1                                 ";
												kiss.executeQuery(req,sql,[invoiceHeaderId],function(rows){
													if(rows.length>0)
													{
														for(var i=0;i<rows.length;i++)
														{
															var row=rows[i];
															var amount=kiss.checkData(row.AMOUNT)?row.AMOUNT:0;
															var taxAmount=kiss.checkData(row.TAX_AMOUNT)?row.TAX_AMOUNT:0;
															var item={
																headerId:invoiceHeaderId,
																lineId:row.line_id,
																invoiceNumber:invoiceHeaderUpdateInfo.INVOICE_NUMBER,
																invoiceDate:invoiceHeaderUpdateInfo.INVOICE_DATE,
																patientId:patientId,
																patientName:row.First_name+' '+row.Sur_name,
																companyId:companyId,
																insurerId:insurerId,
																claimNo:row.Claim_no,
																taxId:row.TAX_ID,
																taxRate:row.TAX_RATE,
																itemId:row.ITEM_ID,
																price:row.PRICE,
																quantity:row.QUANTITY,
																amount:amount,
																taxAmount:taxAmount,
																totalAmount:amount+taxAmount,
																status:invoiceUtil.invoiceErpStatus.open
															};
															listInvoiceLine.push(item);
														}
														q.resolve(listInvoiceLine);
													}
													else
													{
														kiss.exlog(fHeader,'Invoice chua co line');
														kiss.rollback(req,function(){
															res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN016')});
														})
														q.reject();
													}
												},function(err){
													kiss.exlog(fHeader,'Loi truy van lay thong tin invoice line',err);
													kiss.rollback(req,function(){
														res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN015')});
													});
													q.reject();
												});
												return q.promise;
											}

											getCustomerInfo()
											.then(function(data){
												customerInfo=data;
												return getListItemInfo();
											})
											.then(function(data){
												listItemInfo=data;
												return getListInvoiceLine();
											})
											.then(function(data){
												listInvoiceLine=data;
												ERP_REST.addInvoiceCustomer(customerInfo)
												.then(function(data){
													kiss.exFileJSON(data.data,'addInvoiceCustomer.txt');
													if(data.data==true)
													{
														kiss.exlog(fHeader,'Add customer to erp thanh cong');
														return ERP_REST.addInvoiceItems(listItemInfo);
													}
													else
													{
														kiss.exlog(fHeader,'Loi insert customer den erp');
														kiss.rollback(req,function(){
															res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN017')});
														});
													}
												})
												.then(function(data){
													kiss.exFileJSON(data.data,'addInvoiceItems.txt');
													if(data.data==true)
													{
														kiss.exlog(fHeader,'Add items to erp thanh cong');
														return ERP_REST.addInvoiceLines(listInvoiceLine);
													}
													else
													{
														kiss.exlog(fHeader,'Loi insert items den erp');
														kiss.rollback(req,function(){
															res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN018')});
														});
													}
												})
												.then(function(data){
													kiss.exFileJSON(data.data,'addInvoiceLines.txt');
													if(data.data==true)
													{
														kiss.exlog(fHeader,'Add lines to erp thanh cong');
														kiss.commit(req,function(){
															res.json({status:'success'});
														},function(err){
															kiss.exlog(fHeader,'Loi commit',err);
															res.json({status:'fail'});
														})
													}
													else
													{
														kiss.exlog(fHeader,'Loi insert lines den erp');
														kiss.rollback(req,function(){
															res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN019')});
														});
													}
												})
											})

											
										},function(err){
											kiss.exlog(fHeader,'Loi truy van cap nhat invoice number',err);
											kiss.rollback(req,function(){
												res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN006')});
											});
										});
									},function(err){
										kiss.exlog(fHeader,'Khong the tao invoice number',err);
										kiss.rollback(req,function(){
											res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN005')});
										})
									})
								}
								else
								{
									kiss.commit(req,function(){
										res.json({status:'success'});
									},function(err){
										kiss.exlog(fHeader,'Loi commit',err);
										res.json({status:'fail'});
									})
								}

							}
							else
							{
								kiss.exlog(fHeader,'Khong co invoice header nao duoc cap nhat');
								kiss.rollback(req,function(){
									res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN004')});
								})
							}

						},function(err){
							kiss.exlog(fHeader,'Loi truy van cap nhat cln_invoice_header',err);
							kiss.rollback(req,function(){
								res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
							});
						},true)
					}
					else
					{
						kiss.exlog(fHeader,"Invoice chua co item");
						res.json({status:'no-lines'});
					}
				}
				else
				{
					kiss.exlog(fHeader,'Khong co data tuong ung voi header');
					res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
				}
			},function(err){

			});
		},function(err){
			kiss.exlog(fHeader,"Khong the mo transaction",err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
		});


	},


	/**
	 * create by: unknown
	 * tan mark
	 * tan modify
	 * tan rem postSave->postSave2
	 */
	postSave2 : function(req, res) {
		var header_id = req.body.header_id;	
		var inv_status = req.body.status;
		var service_id = req.body.service_id;
		var lines = req.body.lines;
		var postData = req.body.postData;
		var DOCTOR_ID = postData.DOCTOR_ID;
		var claim_id = postData.claim_id;
		var Patient_id = postData.Patient_id;
		var Company_id = postData.Company_id;
		var Insurer_id = postData.Insurer_id;
		var SITE_ID = postData.SITE_ID;
		var DEPT_ID = postData.DEPT_ID;

		var header = null;
		var err_handle = function(err){
			console.log('ERROR: ', err)
			res.json({"status": "error", 'message': err});
		};

		// GET NEW ITEM 
		// var iLines = [];
		for(var i = 0, len = lines.length; i < len; ++i) {
			var line = lines[i];
			line.HEADER_ID = header_id;
			line.AMOUNT = line.QUANTITY * line.PRICE;
			// if(line.appt_item_id == null)
			// 	iLines.push(line);
		} 

		// DELETE LINES 
		db.mdtInvoiceLine.destroy({HEADER_ID: header_id})
		.then(function(data){
			// INSERT LINES
			return db.mdtInvoiceLine.bulkCreate(lines);
		}).then(function(data){
			// FIND HEADER
			return db.mdtInvoiceHeader.find({
			where: {header_id: header_id},
			include: [
				{ 
					model: db.mdtInvoiceLine , as: 'Lines',
					include: [
						{
							model: db.InvItem, as: 'InvItem',
						},
					]
				},
				{
					model: db.Company, as: 'Company',
				},
				{
					model: db.Insurer, as: 'Insurer',
				},
				{	
					model: db.mdtRedimedsites, as: 'Site',
				}, 
				{	
					model: db.Patient, as: 'Patient',
				},
			]})
		}).then(function(iheader){
			header = iheader;
			if(!header || !header.lines || header.lines.length == 0) {
				res.json(500, {"status": "error", "message": 'Missing header / lines'});
				return;
			}
			var amount = header.getAmount();
			// UPDATE AMOUNT & STATUS
	 		return db.mdtInvoiceHeader.update({AMOUNT: amount, STATUS: inv_status, SERVICE_ID:service_id,claim_id:claim_id,Patient_id:Patient_id,Company_id:Company_id,Insurer_id:Insurer_id,SITE_ID:SITE_ID,DOCTOR_ID:DOCTOR_ID,DEPT_ID:DEPT_ID}, {
	            header_id: header_id
	        });
		}).then(function(updated){

			if(inv_status !== 'done') {
				res.json({"status": "success"});
				return;
			}

			// SEND TO ERP
			// send patient 
			ERP_REST.push_customer(header)
			.then(function(response){
				response.data = JSON.parse(response.data);
				if(response.data.APEX_STATUS == 'success') {
					// send item 
					ERP_REST.push_items(header).then(function(response){
						// send invoice
						ERP_REST.push_invoice(header).then(function(response){
							res.json({"status": "success", "data": response});
						}, err_handle)
					}, err_handle)
				} else {
					res.json({"status": "error", "message": 'Can not push customer to ERP !!!'});
				}
			}, err_handle)
			// END SEND TO ERP
		}).error(err_handle);
	},

	getTest: function (req, res) {

		ERP_REST.get_all_invoice_line().then(function(response){
			console.log(response)
			res.json(response)
		}, function(err){
			res.json({err: err})
		});
	},

	/**
	 * tannv.dts@gmail.com
	 * xoa invoice line
	 */
	postRemoveInvoiceLine:function(req,res)
	{
		var fHeader="v2_InvoiceController->removeInvoiceLine";
		var functionCode="FN001";
		var postData=kiss.checkData(req.body.data)?req.body.data:{};
		var invoiceLineId=kiss.checkData(postData.invoiceLineId)?postData.invoiceLineId:'';
		if(!kiss.checkListData(invoiceLineId))
		{
			kiss.exlog(fHeader,'Loi truyen data den');
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN000')});
			return;
		}
		
		kiss.beginTransaction(req,function(){
			var sql="DELETE FROM `cln_invoice_lines` WHERE line_id=?";
			kiss.executeQuery(req,sql,[invoiceLineId],function(result){
				if(result.affectedRows>0)
				{
					kiss.commit(req,function(){
                        res.json({status:'success'});
                    },function(err){
                        kiss.exlog(fHeader,"Loi commit",err);
                        res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN006')});
                    })
				}
				else
				{
					kiss.exlog(fHeader,"Khong co data invoice line nao duoc xoa");
					res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
				}
			},function(err){
				kiss.exlog(fHeader,'Loi truy van xoa',err);
				res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
			});
		},function(err){
			kiss.exlog(fHeader,"Loi mo transaction",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
		})
	},

	/**
	 * tannv.dts@gmail.com
	 * save invoice line sheet (consultation)
	 */
	postSaveInvoiceLineSheet:function(req,res)
	{
		var fHeader="v2_InvoiceController->postSaveInvoiceLineSheet";
		var functionCode="FN005";
		var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
		var invoiceHeaderId=kiss.checkData(postData.invoiceHeaderId)?postData.invoiceHeaderId:'';
		var listLine=kiss.checkData(postData.listLine)?postData.listLine:[];
		var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
		var userId=userInfo.id;
		if(!kiss.checkListData(invoiceHeaderId,listLine,userId))
		{
			kiss.exlog(fHeader,'Loi data truyen den',postData);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
			return;
		}

		if(listLine.length>0)
		{
			var listLineInsert=[];
			for(var i=0;i<listLine.length;i++)
			{
				var item=listLine[i];
				if(item.IS_ENABLE==1)
				{
					item.CREATED_BY=userId;
					item.CREATION_DATE=kiss.getCurrentTimeStr();
					listLineInsert.push(item);
				}
			}
			kiss.exlog(listLineInsert)
			kiss.beginTransaction(req,function(){
				var sql="DELETE FROM `cln_invoice_lines` WHERE header_id=?";
				kiss.executeQuery(req,sql,[invoiceHeaderId],function(result){
					kiss.executeInsert(req,'cln_invoice_lines',listLineInsert,function(success){
						kiss.commit(req,function(){
							res.json({status:'success'});
						},function(err){
							kiss.exlog(fHeader,'Loi commit',err);
							res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN005')});
						})
					},function(err){
						kiss.exlog(fHeader,"Loi insert list invoice line",err);
						kiss.rollback(req,function(){
							res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
						});
					})
				},function(err){
					kiss.exlog(fHeader,'Loi xoa list line cu',err);
					kiss.rollback(req,function(){
						res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN004')});
					});
				})
			},function(err){
				kiss.exlog(fHeader,'Loi mo transaction',err);
				res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
			})
			
		}
		else
		{
			res.json({status:'non-data'});
		}

	},


	/**
	 * tannv.dts@gmail.com
	 * lay thong tin invoice header thong qua patientId va calId
	 * 25-06-2015
	 */
	postSelectInvoiceHeaderBySession:function(req,res)
	{
		var fHeader="v2_InvoiceController->postSelectInvoiceHeaderBySession";
		var functionCode="FN006";
		var patientId=kiss.checkData(req.body.patientId)?req.body.patientId:'';
		var calId=kiss.checkData(req.body.calId)?req.body.calId:'';
		if(!kiss.checkListData(patientId,calId))
		{
			kiss.exlog(fHeader,"Loi data truyen den",req.body);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
			return;
		}
		var sql="SELECT * FROM `cln_invoice_header` header WHERE header.`Patient_id`=? AND header.`cal_id`=?";
		kiss.executeQuery(req,sql,[patientId,calId],function(rows){
			res.json({status:'success',data:rows[0]})
		},function(err){
			kiss.exlog(fHeader,'Loi truy van lay thong tin invoice_header',err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
		});

	},

	/**
	 * tannv.dts@gmail.com
	 * lay cac invoice line tuong ung voi session
	 */
	postSelectInvoiceLinesBySession:function(req,res){
		var fHeader="v2_InvoiceController->postSelectInvoiceLinesBySession";
		var functionCode='FN007';
		var patientId=kiss.checkData(req.body.patientId)?req.body.patientId:'';
		var calId=kiss.checkData(req.body.calId)?req.body.calId:'';
		if(!kiss.checkListData(patientId,calId))
		{
			kiss.exlog(fHeader,"Loi data truyen den",req.body);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
			return;
		}

		var sql=
			" SELECT line.*                                                                  "+
			" FROM `cln_invoice_lines` line                                                  "+
			" INNER JOIN `cln_invoice_header` header ON line.`HEADER_ID`=header.`header_id`  "+
			" WHERE header.`Patient_id`=? AND header.`cal_id`=? AND line.`IS_ENABLE`=1       ";

		kiss.executeQuery(req,sql,[patientId,calId],function(rows){
			res.json({status:'success',data:rows});
		},function(err){
			kiss.exlog(fHeader,'Loi truy van lay thong tin invoice line thong qua patientId va calId',err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
		});
	}
}