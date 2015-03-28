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
		var selectedDate=kiss.checkData(req.body.selectedAppFromTime)?
					moment(new Date(req.body.selectedAppFromTime)).format("YYYY-MM-DD"):null;
		var rlTypeId=kiss.checkData(req.body.rlTypeId)?req.body.rlTypeId:'';
		var periodTimeDefault=rlobUtil.periodTimeDefault;
		var 
		if(!kiss.checkListData(doctorId,siteId,selectedAppFromTime,rlTypeId))
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
			"   AND DATE(calendar.`FROM_TIME`)= ? "+
			" 	AND calendar.`FROM_TIME`>=?                                                             "+
			" ORDER BY calendar.FROM_TIME ASC ";
		kiss.executeQuery(req,sql,[doctorId,siteId,periodTimeDefault,selectedDate,selectedAppFromTime],function(rows){
			res.json({status:'success',data:rows});
		},function(err){
			kiss.exlog("getAllAppointmentInDate","Loi truy van",err);
			res.json({status:'fail'});
		},true);

	},

	handlePeriodTimeAppointmentCalendar:function(req,res)	
	{
		var doctorId=kiss.checkData(req.body.doctorId)?req.body.doctorId:'';
		var siteId=kiss.checkData(req.body.siteId)?req.body.siteId:'';
		var selectedAppFromTime=kiss.checkData(req.body.selectedAppFromTime)?
							moment(new Date(req.body.selectedAppFromTime)).format("YYYY-MM-DD HH:mm:ss"):null;
		var selectedDate=kiss.checkData(req.body.selectedAppFromTime)?
					moment(new Date(req.body.selectedAppFromTime)).format("YYYY-MM-DD"):null;
		var rlTypeId=kiss.checkData(req.body.rlTypeId)?req.body.rlTypeId:'';
		var periodTimeDefault=rlobUtil.periodTimeDefault;
		if(!kiss.checkListData(doctorId,siteId,selectedAppFromTime,rlTypeId))
		{
			kiss.exlog("handlePeriodTimeAppointmentCalendar","Loi data truyen den");
			res.json({status:'fail'});
			return;
		}

		if(!rlobUtil.periodTimeOfRlType[rlTypeId])
		{
			kiss.exlog("handlePeriodTimeAppointmentCalendar","RL Type khong hop le!");
			res.json({status:'fail'});
			return;
		}
		var periodRequire=rlobUtil.periodTimeOfRlType[rlTypeId].value;
		var sql=
			" SELECT calendar.*,MINUTE(TIMEDIFF(calendar.`TO_TIME`,calendar.`FROM_TIME`)) AS `PERIOD_TIME`   "+
			" FROM `cln_appointment_calendar` calendar                                                       "+
			" WHERE calendar.`DOCTOR_ID`=? AND calendar.`SITE_ID`=?                                          "+
			" 	AND MINUTE(TIMEDIFF(calendar.`TO_TIME`,calendar.`FROM_TIME`)) >=?                            "+
			"   AND DATE(calendar.`FROM_TIME`)= ? "+
			" 	AND calendar.`FROM_TIME`>=?                                                             "+
			" ORDER BY calendar.FROM_TIME ASC ";
		kiss.executeQuery(req,sql,[doctorId,siteId,periodTimeDefault,selectedDate,selectedAppFromTime],function(data){
			if(data.length>0)
			{
				var selectedItem=data[0];
                var selectedItemPeriodTime=moment(new Date(selectedItem.TO_TIME)).diff(moment(new Date(selectedItem.FROM_TIME)),'minutes');
                var periodLack=periodRequire-selectedItemPeriodTime;

                if(periodLack>0)
                {
                    var listY=[];
                    listY.push(selectedItem);
                    var previousToTime=moment(new Date(selectedItem.TO_TIME));
                    for(var i=1;i<data.length;i++)
                    {
                        var item=data[i];
                        var fromTime=moment(new Date(item.FROM_TIME));
                        if(fromTime.diff(previousToTime,'minutes')==0)
                        {
                            listY.push(item);
                            previousToTime=moment(new Date(item.TO_TIME));
                        }
                        else
                        {
                            break;
                        }
                    }

                    if(listY.length>1)
                    {
                    	var listChanged=[];
	                    //xu ly slot dau tien
	                    listY[0].TO_TIME=moment(new Date(listY[0].TO_TIME)).add(periodLack,"minutes").toDate();
	                    listChanged.push(listY[0]);
	                    for(var i=1;i<listY.length-1;i++)
	                    {
	                        var item=listY[i];
	                        var periodTime=moment(new Date(item.TO_TIME)).diff(moment(new Date(item.FROM_TIME)),'minutes');
	                        if(periodTime>=periodRequire)
	                        {
	                            item.FROM_TIME=moment(new Date(item.FROM_TIME)).add(periodLack,"minutes").toDate();
	                            listChanged.push(item);
	                            break;
	                        }
	                        else
	                        {
	                            item.FROM_TIME=moment(new Date(item.FROM_TIME)).add(periodLack,"minutes").toDate();
	                            item.TO_TIME=moment(new Date(item.TO_TIME)).add(periodLack,"minutes").toDate();
	                            listChanged.push(item);
	                        }
	                    }

	                    // for(var i=0;i<listChanged.length;i++)
	                    // {
	                    //     console.log(moment(new Date(listChanged[i].FROM_TIME)).format("HH:mm DD/MM/YYYY")+
	                    //         " "+moment(new Date(listChanged[i].TO_TIME)).format("HH:mm DD/MM/YYYY"));
	                    // }
	                    res.json({status:'success',data:listChanged});
                    }
                    else
                    {
                    	kiss.exlog("handlePeriodTimeAppointmentCalendar","session hien tai khong du thoi gian, nhung cung khong co session lien ke de bu tru");
                    	res.json({status:'fail',msg:"session hien tai khong du thoi gian, nhung cung khong co session lien ke de bu tru"});
                    }
                }
                else
                {

                    res.json({status:'success',msg:'Co the booking voi this session vi session nay co du thoi gian'});
                }
			}
			else
			{
				kiss.exlog("handlePeriodTimeAppointmentCalendar","Khong the booking voi session nay");
				res.json({status:'fail'});
			}
		},function(err){
			kiss.exlog("handlePeriodTimeAppointmentCalendar","Loi truy van",err);
			res.json({status:'fail'});
		});
	}

}