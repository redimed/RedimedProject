var db = require('../models');
var rlobEmailController=require('./rlobEmailController');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');
var moment=require('moment');
var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');

module.exports =
{
    /**
     * Xu ly dat lich co khoan thoi gian hon 1 session dc chon
     * tannv.dts@gmail.com
     */
	// -------------------------------------------------------
	
	/**
	 * Lay danh sach cac phien lam viec trong mot ngay
	 * Cac phien lam viec nay phai co periodTime>periodTimeDefault
	 * tannv.dts@gmail.com
	 */
	getListAppointmentAfterTime:function(req,res)
	{
		var doctorId=kiss.checkData(req.body.doctorId)?req.body.doctorId:'';
		var siteId=kiss.checkData(req.body.siteId)?req.body.siteId:'';
		var selectedAppFromTime=kiss.checkData(req.body.selectedAppFromTime)?
							moment(new Date(req.body.selectedAppFromTime)).format("YYYY-MM-DD HH:mm:ss"):null;

		var periodTimeDefault=rlobUtil.periodTimeDefault;
		if(!kiss.checkListData(doctorId,siteId,selectedAppFromTime))
		{
			kiss.exlog("getAllAppointmentInDate","Loi data truyen den");
			res.json({status:'fail'});
			return;
		}
		var sql=
			" SELECT calendar.*,MINUTE(TIMEDIFF(calendar.`TO_TIME`,calendar.`FROM_TIME`)) AS `PERIOD_TIME`   "+
			" FROM `cln_appointment_calendar` calendar                                                       "+
			" WHERE calendar.`DOCTOR_ID`=? AND calendar.`SITE_ID`=?                                          "+
			" 	AND MINUTE(TIMEDIFF(calendar.`TO_TIME`,calendar.`FROM_TIME`)) >=?                            "+
			" 	AND calendar.`FROM_TIME`=>?                                                             ";
		kiss.executeQuery(req,sql,[doctorId,siteId,periodTimeDefault,selectedAppFromTime],function(rows){
			res.json({status:'success',data:rows});
		},function(err){
			kiss.exlog("getAllAppointmentInDate","Loi truy van",err);
			res.json({status:'fail'});
		});

	}	

}