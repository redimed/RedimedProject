var db = require('../models');
var rlobEmailController=require('./rlobEmailController');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');
var moment=require('moment');
var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');

/**
 * Xu ly cap nhat lai appointment fromTime va toTime
 * day la function con, la mot function chay trong 1 function beginTransaction truoc do
 * function nay khong the chay truc tiep ma phai duoc nam trong function beginTransaction
 * tannv.dts@gmail.com
 */
var handlePeriodTimeAppointmentCalendar=function(req,res)	
{
	var handlePeriodInfo=kiss.checkData(req.body.handlePeriodInfo)?req.body.handlePeriodInfo:{};
	var doctorId=kiss.checkData(handlePeriodInfo.doctorId)?handlePeriodInfo.doctorId:'';
	var siteId=kiss.checkData(handlePeriodInfo.siteId)?handlePeriodInfo.siteId:'';
	var selectedAppFromTime=kiss.checkData(handlePeriodInfo.selectedAppFromTime)?
						moment(new Date(handlePeriodInfo.selectedAppFromTime)).format("YYYY-MM-DD HH:mm:ss"):null;
	var selectedDate=kiss.checkData(handlePeriodInfo.selectedAppFromTime)?
				moment(new Date(handlePeriodInfo.selectedAppFromTime)).format("YYYY-MM-DD"):null;
	var rlTypeId=kiss.checkData(handlePeriodInfo.rlTypeId)?handlePeriodInfo.rlTypeId:'';
	var periodTimeDefault=rlobUtil.periodTimeDefault;

	if(!kiss.checkListData(doctorId,siteId,selectedAppFromTime,rlTypeId))
	{
		kiss.exlog("handlePeriodTimeAppointmentCalendar","Loi data truyen den");
		kiss.rollback(req,function(){
			res.json({status:'fail'});
		})
		return;
	}

	if(!rlobUtil.periodTimeOfRlType[rlTypeId])
	{
		kiss.exlog("handlePeriodTimeAppointmentCalendar","RL Type khong hop le!");
		kiss.rollback(req,function(){
			res.json({status:'fail'});
		})
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
                    for(var i=1;i<listY.length;i++)
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
                            if(i<listY.length-1)
                            	item.TO_TIME=moment(new Date(item.TO_TIME)).add(periodLack,"minutes").toDate();
                            listChanged.push(item);
                        }
                    }

                    function updateAppointmentCalendar(req,list,index)
                    {
                    	var item=list[index];
                    	var sql="UPDATE `cln_appointment_calendar` SET ? WHERE CAL_ID=?";
                    	var updateInfo={
                    		FROM_TIME:moment(new Date(item.FROM_TIME)).format("YYYY/MM/DD HH:mm:ss"),
                    		TO_TIME:moment(new Date(item.TO_TIME)).format("YYYY/MM/DD HH:mm:ss")
                    	}
                    	kiss.executeQuery(req,sql,[updateInfo,item.CAL_ID],function(result){
                    		if(result.affectedRows>0)
                    		{
                    			if(index<list.length-1)
                    			{
                    				updateAppointmentCalendar(req,list,index+1);
                    			}
                    			else
                    			{
                    				kiss.commit(req,function(){
                    					res.json({status:'success'});
                    				},function(err)
                    				{
                    					res.json({status:'fail'});
                    				})
                    			}
                    		}
                    		else
                    		{
                    			kiss.exlog("handlePeriodTimeAppointmentCalendar","updateAppointmentCalendar -> khong co dong nao duoc doi");
                    			kiss.rollback(req,function(){
	                    			res.json({status:'fail'});
	                    		})
                    		}
                    	},function(err)
                    	{
                    		kiss.exlog("handlePeriodTimeAppointmentCalendar","updateAppointmentCalendar-> loi khi chay cau update",err);
                    		kiss.rollback(req,function(){
                    			res.json({status:'fail'});
                    		})

                    	})
                    }

                    // for(var i=0;i<listChanged.length;i++)
                    // {
                    //     console.log(moment(new Date(listChanged[i].FROM_TIME)).format("HH:mm DD/MM/YYYY")+
                    //         " "+moment(new Date(listChanged[i].TO_TIME)).format("HH:mm DD/MM/YYYY"));
                    // }
                    updateAppointmentCalendar(req,listChanged,0);
                }
                else
                {
                	kiss.exlog("handlePeriodTimeAppointmentCalendar","session hien tai khong du thoi gian, nhung cung khong co session lien ke de bu tru");
                	kiss.rollback(req,function(){
                		res.json({status:'fail',msg:"session hien tai khong du thoi gian, nhung cung khong co session lien ke de bu tru"});
                	})
                }
            }
            else
            {
            	kiss.commit(req,function(){
                	res.json({status:'success',msg:'Co the booking voi this session vi session nay co du thoi gian'});
				},function(err)
				{
					res.json({status:'fail'});
				})
            }
		}
		else
		{
			kiss.exlog("handlePeriodTimeAppointmentCalendar","Khong the booking voi session nay");
			kiss.rollback(req,function(){
        		res.json({status:'fail'});
        	})
		}
	},function(err){
		kiss.exlog("handlePeriodTimeAppointmentCalendar","Loi truy van",err);
		kiss.rollback(req,function(){
    		res.json({status:'fail'});
    	})
	},true);
}

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

	checkPeriodTimeAppointmentCalendar:function(req,res)	
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
	                    for(var i=1;i<listY.length;i++)
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
	                            if(i<listY.length-1)
	                            	item.TO_TIME=moment(new Date(item.TO_TIME)).add(periodLack,"minutes").toDate();
	                            listChanged.push(item);
	                        }
	                    }

	                    function updateAppointmentCalendar(req,list,index)
	                    {
	                    	var item=list[index];
	                    	var sql="UPDATE `cln_appointment_calendar` SET ? WHERE CAL_ID=?";
	                    	var updateInfo={
	                    		FROM_TIME:moment(new Date(item.FROM_TIME)).format("YYYY/MM/DD HH:mm:ss"),
	                    		TO_TIME:moment(new Date(item.TO_TIME)).format("YYYY/MM/DD HH:mm:ss")
	                    	}
	                    	kiss.executeQuery(req,sql,[updateInfo,item.CAL_ID],function(result){
	                    		if(result.affectedRows>0)
	                    		{
	                    			if(index<list.length-1)
	                    			{
	                    				updateAppointmentCalendar(req,list,index+1);
	                    			}
	                    			else
	                    			{
	                    				kiss.commit(req,function(){
	                    					res.json({status:'success',data:list});
	                    				},function(err)
	                    				{
	                    					res.json({status:'fail'});
	                    				})
	                    			}
	                    		}
	                    		else
	                    		{
	                    			kiss.rollback(req,function(){
		                    			res.json({status:'fail'});
		                    		})
	                    		}
	                    	},function(err)
	                    	{
	                    		kiss.rollback(req,function(){
	                    			res.json({status:'fail'});
	                    		})

	                    	})
	                    }

	                    // for(var i=0;i<listChanged.length;i++)
	                    // {
	                    //     console.log(moment(new Date(listChanged[i].FROM_TIME)).format("HH:mm DD/MM/YYYY")+
	                    //         " "+moment(new Date(listChanged[i].TO_TIME)).format("HH:mm DD/MM/YYYY"));
	                    // }
	                    updateAppointmentCalendar(req,listChanged,0);
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
		},true);
	},

	

	saveBookingInfo:function(req,res)
	{
		var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;

		var bookingInfo=kiss.checkData(req.body.bookingInfo)?req.body.bookingInfo:{};
        var patientInfo={
        	Sur_name:bookingInfo.WRK_SURNAME,
        	First_name:bookingInfo.WRK_OTHERNAMES,
        	DOB:bookingInfo.WRK_DOB,
        	Email:bookingInfo.WRK_EMAIL,
        	Mobile:bookingInfo.WRK_CONTACT_NO
        }

        var claimInfo={
        	Claim_no :bookingInfo.CLAIM_NO,
            Injury_name : 'No Description'
        }

        var currentTime=kiss.getCurrentTimeStr();

        var sql="INSERT INTO `cln_patients` SET ?";

        kiss.beginTransaction(req,function(){
        	kiss.executeQuery(req,sql,[patientInfo],function(result){
	        	var patientId=result.insertId;
	        	claimInfo.Patient_id = patientId;
	        	var sql="INSERT INTO `cln_claims` SET ?";
	        	kiss.executeQuery(req,sql,[claimInfo],function(result){
	        		var sql="SELECT ap.id FROM `cln_appt_patients` ap WHERE ap.`Patient_id`=? AND ap.`CAL_ID`=?";
	        		kiss.executeQuery(req,sql,[patientId,claimInfo.Claim_no],function(data){
	        			if(data.length>0)
	        			{
	        				kiss.exlog("saveBookingInfo","Bi trung du lieu tai cln_appt_patients, patient nay da booking cal_id tu truoc roi");
                    		kiss.rollback(req,function(){
        						res.json({status:"fail"});
        					});
	        			}
	        			else
	        			{
	        				var sql="INSERT INTO `cln_appt_patients` SET ?";
	        				var apptPatientInsertInfo={
	        					Patient_id:patientId,
	        					CAL_ID:bookingInfo.CAL_ID,
	        					Created_by:userId,
	        					Creation_date:currentTime
	        				}
	        				kiss.executeQuery(req,sql,[apptPatientInsertInfo],function(result){
	        					var sql="SELECT * FROM `cln_appointment_calendar` calendar WHERE calendar.`CAL_ID`=?";
			        			kiss.executeQuery(req,sql,[bookingInfo.CAL_ID],function(data){
			        				if(data.length>0)
			        				{
			        					if (data[0].PATIENTS == null) {
			                                var arr = [];
			                                arr.push({"Patient_id":patientId,"Patient_name":bookingInfo.WRK_OTHERNAMES+" "+bookingInfo.WRK_SURNAME});
			                                var PATIENTS = JSON.stringify(arr);
			                            }else{
			                                var arr = JSON.parse(data[0].PATIENTS);
			                                arr.push({"Patient_id":idPatient,"Patient_name":bookingInfo.WRK_OTHERNAMES+" "+bookingInfo.WRK_SURNAME});
			                                var PATIENTS = JSON.stringify(arr);
			                            };
			                            var sql="UPDATE `cln_appointment_calendar` SET ? WHERE `CAL_ID`=?";
			                            var appointmentUpdateInfo={
			                            	PATIENTS:PATIENTS
			                            }
			                            kiss.executeQuery(req,sql,[appointmentUpdateInfo,bookingInfo.CAL_ID],function(result){
			                            	if(result.affectedRows>0)
			                            	{
			                            		var insertBookingInfo={
										            BOOKING_ID:bookingInfo.BOOKING_ID,
										            BOOKING_DATE:bookingInfo.BOOKING_DATE,
										            COMPANY_ID:bookingInfo.COMPANY_ID,
										            RL_TYPE_ID:bookingInfo.RL_TYPE_ID,
										            SPECIALITY_ID:bookingInfo.SPECIALITY_ID,
										            DOCTOR_ID:bookingInfo.DOCTOR_ID,
										            SITE_ID:bookingInfo.SITE_ID,
										            FROM_DATE:bookingInfo.FROM_DATE,
										            TO_DATE:bookingInfo.TO_DATE,
										            CAL_ID:bookingInfo.CAL_ID,
										            ASS_SURNAME:bookingInfo.ASS_SURNAME,
										            ASS_OTHERNAMES:bookingInfo.ASS_OTHERNAMES,
										            ASS_CONTACT_NO:bookingInfo.ASS_CONTACT_NO,
										            ASS_EMAIL:bookingInfo.ASS_EMAIL,
										            WRK_SURNAME:bookingInfo.WRK_SURNAME,
										            WRK_OTHERNAMES:bookingInfo.WRK_OTHERNAMES,
										            WRK_CONTACT_NO:bookingInfo.WRK_CONTACT_NO,
										            WRK_EMAIL:bookingInfo.WRK_EMAIL,
										            DESC_INJURY:bookingInfo.DESC_INJURY,
										            ISNEW:bookingInfo.ISNEW,
										            ISCONTACTPATIENT:bookingInfo.ISCONTACTPATIENT,
										            ISCONTACTMANAGER:bookingInfo.ISCONTACTMANAGER,
										            NOTES:bookingInfo.NOTES,
										            STATUS:bookingInfo.STATUS,
										            CREATED_BY:userId,
										            CREATION_DATE:currentTime,
										            refered_date_string:bookingInfo.refered_date_string,
										            isUrgent:bookingInfo.isUrgent,
										            CLAIM_NO:bookingInfo.CLAIM_NO,
										            WRK_DOB:bookingInfo.WRK_DOB,
										            APPOINTMENT_DATE:bookingInfo.APPOINTMENT_DATE,
										            ASS_ID:bookingInfo.ASS_ID,
										            EMPLOYEE_NUMBER:bookingInfo.EMPLOYEE_NUMBER,
										            DEPARTMENT_NAME:bookingInfo.DEPARTMENT_NAME,
										            DESC_VACCIN:bookingInfo.DESC_VACCIN,
										            BOOKING_TYPE:bookingInfo.BOOKING_TYPE,
										            WRK_DATE_OF_INJURY:bookingInfo.WRK_DATE_OF_INJURY,
										            PATIENT_ID:patientId
										        }
										        var sql="INSERT INTO `rl_bookings` SET ?";
										        kiss.executeQuery(req,sql,[insertBookingInfo],function(result){
										        	//xu ly dieu chinh fromtime va to time cua cac appointment calendar phia sau
													var handlePeriodInfo={
														doctorId:bookingInfo.DOCTOR_ID,
														siteId:bookingInfo.SITE_ID,
														selectedAppFromTime:bookingInfo.APPOINTMENT_DATE,
														rlTypeId:bookingInfo.RL_TYPE_ID
													}
													req.body.handlePeriodInfo=handlePeriodInfo;
										        	handlePeriodTimeAppointmentCalendar(req,res);
										        },function(err){
										        	kiss.exlog("saveBookingInfo","Loi insert booking info",err);
										        	kiss.rollback(req,function(){
						        						res.json({status:"fail"});
						        					});
										        });
										        
			                            	}
			                            	else
			                            	{
			                            		kiss.exlog("saveBookingInfo","khong co cln_appointment_calendar duoc cap nhat");
			                            		kiss.rollback(req,function(){
					        						res.json({status:"fail"});
					        					});
			                            	}
			                            },function(err){
			                            	kiss.exlog("saveBookingInfo","loi truy van cap nhat cln_appointment_calendar",err);
			                            	kiss.rollback(req,function(){
				        						res.json({status:"fail"});
				        					})
			                            })
			        				}
			        				else
			        				{
			        					kiss.exlog("saveBookingInfo","Khong co cln_appointment_calendar tuong ung");
			        					kiss.rollback(req,function(){
			        						res.json({status:"fail"});
			        					})
			        				}
			        			},function(err){
			        				kiss.exlog("saveBookingInfo","Loi select cln_appointment_calendar",err);
			        				kiss.rollback(req,function(){
			        					res.json({status:"fail"});
			        				})
			        			})
	        				},function(err){
	        					kiss.exlog("saveBookingInfo","Khong the thuc thi insert cln_appt_patients",err);
	        					kiss.rollback(req,function(){
	        						res.json({status:"fail"});
	        					});
	        				});
	        			}
	        			
	        		},function(err){
	        			kiss.exlog("saveBookingInfo","loi select cln_appt_patients",err);
	        			kiss.rollback(req,function(){
	        				res.json({status:'fail'});
	        			});
	        		})
	        	},function(err){
	        		kiss.exlog("saveBookingInfo","Loi khong the insert claim",err);
	        		kiss.rollback(req,function(){
	        			res.json({status:'fail'});
	        		})
	        	})

	        },function(err){
	        	kiss.exlog("saveBookingInfo","Loi khong the insert patient",err);
	        	kiss.rollback(req,function(){
	        		res.json({status:'fail'});
	        	})
	        });
        },function(err){
        	kiss.exlog("saveBookingInfo","Loi khong the mo transaction",err);
        	res.json({status:'fail'});
        })
        
	}

}