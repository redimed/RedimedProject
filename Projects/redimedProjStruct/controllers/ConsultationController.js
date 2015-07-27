var db = require('../models');
var fs = require('fs');
var util = require("util");
var mime = require("mime");
var mkdirp = require('mkdirp');
var moment = require('moment');
var chainer = new db.Sequelize.Utils.QueryChainer;
var kiss=require('./kissUtilsController');
var errorCode=require('./errorCode');
var invoiceUtil=require('./invoiceUtilController');
var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var _ = require('lodash');
var S = require('string');

//tannv.dts@gmail.com
var controllerCode="RED_CONSULT";

module.exports = {

    getByIdProblem: function(req, res){

        var postData = req.body.consult_id;

        var sql = knex
        .column('cln_patient_consults.history',
        'cln_patient_consults.Creation_date',
        'cln_patient_consults.examination',
        'cln_patient_consults.treatment_plan',
        'cln_patient_consults.diagnosis',
        'cln_problems.Notes')
        .from('cln_patient_consults')
        .innerJoin('cln_problems', 'cln_patient_consults.problem_id', 'cln_problems.Problem_id')
        .where({'consult_id': postData})
        .toString();
        db.sequelize.query(sql)
        .success(function(data){
            res.json({data: data[0]});
        })
        .error(function(error){
            res.json({'status': 'error', 'message': error})
        })

    },

	getPatientProblem: function(req,res){
		var patientId = req.body.patient_id;

		db.Problem.findAll({where:{Patient_id: patientId}})
			.success(function(data){
				res.json({status:'success',data: data});
			})
			.error(function(err){
				res.json({status:'error'});
				console.log(err);
			})
	},

    uploadFile: function(req,res){
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder = prefix+'uploadFile\\'+'PatientID_'+req.body.patient_id;
        var targetFolderForSave='.\\uploadFile\\'+'PatientID_'+req.body.patient_id;
            mkdirp(targetFolder, function(err) {
                if(err) return err;

                var tmp_path = req.files.file.path;
                var target_path =targetFolder+"\\" + req.files.file.name;
                fs.rename(tmp_path, target_path, function(err) {
                    if (err) throw err;
                    fs.unlink(tmp_path, function() {
                        if (err) throw err;
                    });
                });

                db.UploadFile.max('id')
                    .success(function(max){
                         db.UploadFile.create({
                            id: max + 1,
                            fileName: req.files.file.name,
                            url: targetFolderForSave + "\\" + req.files.file.name
                        })
                            .success(function(data){
                                res.json({status:"success", id: data.values.id, fileName: data.values.fileName});
                            })
                            .error(function(err){
                                res.json({status:'error'});
                                console.log(err);
                            })
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })

            });
    },

    downloadFile: function(req,res){
        var id = req.params.id;

        db.UploadFile.find({where:{id:id}},{raw:true})
            .success(function(data){
                if(data)
                {
                    if(data.url!=null || data.url!='')
                    {
                        var ex = fs.existsSync(data.url);

                        if(ex)
                            res.download(data.url);
                        else
                            res.json({status:'error'});
                    }
                }
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },

    saveImage: function(req,res){
        var patient_id = req.body.patient_id;
        var cal_id = req.body.cal_id;
        var imgData = req.body.imgData;

        var data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');

        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+'uploadFile\\'+'Drawings\\'+'PatientID_'+patient_id;
        var targetFolderForSave='.\\uploadFile\\'+'Drawings\\'+'PatientID_'+patient_id;

        mkdirp(targetFolder, function (err) {
            if(err) return err;

            var date = moment();
            fs.writeFile(targetFolder+"\\image_"+date+".png", buf, function(err){
                if(err) res.json({'status':'error'});

                db.ClnPatientDrawing.max('id')
                    .success(function(max){
                        db.ClnPatientDrawing.create({
                            id: max + 1,
                            patient_id: patient_id,
                            cal_id: cal_id,
                            url: targetFolderForSave+"\\image_"+date+".png"
                        })
                        .success(function(data){
                            res.json({status:'success', id: data.values.id })
                        })
                        .error(function(err){
                            res.json({status:'error'});
                            console.log(err);
                        })
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })
            })
        })
    },

    getImage: function(req,res){
        var id = req.params.id;

        db.ClnPatientDrawing.find({where:{id:id}},{raw:true})
            .success(function(data){
                if(data)
                {
                    if(data.url!=null || data.url!='')
                        res.json({'status':'success', 'data':base64Image(data.url)});
                    else
                        res.json({'status':'error'});
                }
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },

	getDrawTemplate: function(req,res){
		db.DrawingTemplate.findAll({raw:true})
			.success(function(data){
				res.json({status:'success', data: data});
			})
			.error(function(err){
				res.json({status:'error'});
				console.log(err);
			})
	},

	getTemplateImg: function(req,res){
		var id = req.params.id;

		db.DrawingTemplate.find({where: {id: id}}, {raw: true})
            .success(function(data){
              if(data)
              {
              	if(data.isFolder != 1 && (data.fileUrl!=null || data.fileUrl!=''))
              	{
                    res.json({'status':'success', 'data':base64Image(data.fileUrl)});
              	}
              	else
              	{
              		res.json({'status':'error'});
              	}
              }
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
	},

    /*
    *phanquocchien.c1109g@gmail.com
    *update Measurements
    */
    submitMeasurements: function (req,res) {
        var info = req.body.info;
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var insertRow = {
            measure_id : info.measure_id,
            patient_id : info.patient_id,
            cal_id : info.cal_id,
            measure_date: info.measure_date,
            bp1: info.bp1,
            bp2: info.bp2,
            rate: info.rate,
            height: info.height,
            weight: info.weight,
            waist: info.waist,
            hips: info.hips,
            neck: info.neck,
            head_circ: info.head_circ,
            fev1: info.fev1,
            fvc: info.fvc,
            gas_transfer: info.gas_transfer,
            cholesterol: info.cholesterol,
            triglycerides: info.triglycerides,
            hdl: info.hdl,
            ldl: info.ldl,
            bsl: info.bsl,
            hbA1c: info.hbA1c,
            microalbuminuria: info.microalbuminuria,
            potassium: info.potassium,
            psa: info.psa,
            creatitine: info.creatitine,
            acr: info.acr,
            gfr: info.gfr,
            isMdrd: info.isMdrd,
            isCockroft_gault: info.isCockroft_gault,
            right_pressure: info.right_pressure,
            left_pressure: info.left_pressure,
            right_uncorrected: info.right_uncorrected,
            left_uncorrected: info.left_uncorrected,
            right_corrected: info.right_corrected,
            left_corrected: info.left_corrected,
            Last_update_date:moment().format("YYYY-MM-DD HH:mm:ss"),
            Creation_date:moment().format("YYYY-MM-DD HH:mm:ss"),
            Created_by:userId,
            Last_updated_by:userId
        };
        kiss.executeInsertIfDupKeyUpdate(req,'cln_patient_measurements',[insertRow],['!Creation_date','!Created_by'],function(data) {
            res.json({status:'success',data:data});
        },function (error) {
            res.json({status:'error',error:error});
        })
    },
    /*
    *phanquocchien.c1109g@gmail.com
    *update Measurements
    */
    submitMedication: function (req,res) {
        var info = req.body.info;
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var insertRow = {
            id: info.id,
            medication_name: info.medication_name,
            dose: info.dose,
            unit: info.unit,
            route: info.route,
            frequency: info.frequency,
            start_date: info.start_date,
            end_date: info.end_date,
            qty: info.qty,
            doctor_id: info.doctor_id,
            condition_Indication: info.condition_Indication,
            patient_id: info.patient_id,
            consult_id: info.consult_id,
            cal_id: info.cal_id,
            Last_update_date:moment().format("YYYY-MM-DD HH:mm:ss"),
            Creation_date:moment().format("YYYY-MM-DD HH:mm:ss"),
            Created_by:userId,
            Last_updated_by:userId
        };
        kiss.executeInsertIfDupKeyUpdate(req,'cln_patient_medication_details',[insertRow],['!Creation_date','!Created_by'],function(data) {
            res.json({status:'success',data:data});
        },function (error) {
            res.json({status:'error',error:error});
        })
    },
     /*
    *phanquocchien.c1109g@gmail.com
    *set Is Enable Measurements
    */
    setIsEnableMeasurements: function (req,res) {
        var measure_id = req.body.measure_id;
        var isEnable = req.body.isEnable;
        db.ClnPatientMeasurement.update({
            isEnable : isEnable
        }, {measure_id : measure_id}, {raw: true})
        .success(function(data){
            res.json({status:'success',data:data});
        })
        .error(function(err){
            res.json({status:'error'});
            console.log(err);
        });
    },
     /*
    *phanquocchien.c1109g@gmail.com
    *set Is Enable Measurements
    */
    setIsEnableMedication: function (req,res) {
        var id = req.body.id;
        var isEnable = req.body.isEnable;
        db.ClnPatientMedication.update({
            isEnable : isEnable
        }, {id : id}, {raw: true})
        .success(function(data){
            res.json({status:'success',data:data});
        })
        .error(function(err){
            res.json({status:'error'});
            console.log(err);
        });
    },
    /*
    *phanquocchien.c1109g@gmail.com
    *submit consualtation
    */
    submitConsult: function(req,res){
        var info = req.body.info;
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var insertRow = {
            consult_id: info.consult_id,
            patient_id: info.patient_id,
            problem_id: info.problem_id,
            cal_id: info.cal_id,
            history: info.history,
            examination: info.examination,
            treatment_plan: info.treatment,
            investigation: info.investigation,
            specialist: info.specialist,
            progress_note: info.progress_note,
            attendance_record: info.attendance_record,
            communication_record: info.communication_record,
            diagnosis: info.diagnosis,
            hand_therapist: info.hand_therapist,
            Last_update_date:moment().format("YYYY-MM-DD HH:mm:ss"),
            Creation_date:moment().format("YYYY-MM-DD HH:mm:ss"),
            Created_by:userId,
            Last_updated_by:userId
        };
        kiss.executeInsertIfDupKeyUpdate(req,'cln_patient_consults',[insertRow],['!Creation_date','!Created_by'],function(data) {
            res.json({status:'success',data:data});
        },function (error) {
            res.json({status:'error',error:error});
        });
    },

  /**
   * create by: unknown
   * modify by:tannv.dts@gmail.com
   */
  getPatientCompany: function(req,res){
    var fHeader="ConsultationController->getPatientCompany";
    var functionCode="FN002";
    var patient_id = req.body.patient_id;

    var info = {
        Company_name: null,
        Industry: null,
        Addr: null,
        users: []
    };

    db.sequelize.query("SELECT c.`Company_name`, c.`Industry`, c.`Addr` FROM companies c WHERE c.`id` = (SELECT p.`company_id` FROM cln_patients p WHERE p.`Patient_id` = ?)",
                        null,{raw:true},[patient_id])
    .success(function(data)
    {
        if(data.length > 0)
        {
            info.Company_name = data[0].Company_name;
            info.Industry = data[0].Industry;
            info.Addr = data[0].Addr;

            db.sequelize.query("SELECT u.id, u.`user_name`, u.`Booking_Person`, u.`socket` "+
                                "FROM  users u "+
                                "WHERE u.`socket` IS NOT NULL "+
                                "AND (u.`company_id` = (SELECT p.`company_id` FROM cln_patients p WHERE p.`Patient_id` = ?) "+
                                "OR u.id = (SELECT p.user_id FROM cln_patients p WHERE p.`Patient_id` = ?))", null,{raw:true},[patient_id,patient_id])
            .success(function(rs)
            {
                info.users = rs;
                res.json({status:'success', info: info});
            })
            .error(function(err)
            {
                kiss.exlog(fHeader,"Loi truy van lay cac user trong cung cong ty",err);
                res.json({status:'error',error:errorCode.get(controllerCode,functionCode,'TN003')});
            })
        }
        else
        {
            db.sequelize.query("SELECT u.id, u.`user_name`, u.`Booking_Person`, u.`socket` "+
                                "FROM  users u "+
                                "WHERE u.`socket` IS NOT NULL "+
                                "AND (u.`company_id` = (SELECT p.`company_id` FROM cln_patients p WHERE p.`Patient_id` = ?) "+
                                "OR u.id = (SELECT p.user_id FROM cln_patients p WHERE p.`Patient_id` = ?))", null,{raw:true},[patient_id,patient_id])
            .success(function(rs)
            {
                info.users = rs;
                res.json({status:'success', info: info});
            })
            .error(function(err)
            {
                kiss.exlog(fHeader,"Loi truy van lay cac user trong cung cong ty",err);
                res.json({status:'error',error:errorCode.get(controllerCode,functionCode,'TN003')});
            })
        }
    })
    .error(function(err)
    {
        kiss.exlog(fHeader,"Loi truy van lay thong tin company",err);
        res.json({status:'error',error:errorCode.get(controllerCode,functionCode,'TN002')});
    })
  },

    /**
     * tannv.dts@gmail.com
     * ----------------------------------------------------------------------
     * ----------------------------------------------------------------------
     * ----------------------------------------------------------------------
     */
    beforeStartSession:function(req,res)
    {
        var fHeader="ConsultationController->beforeStartSession";
        var functionCode="FN006";
        var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
        var doctorId=kiss.checkData(postData.doctorId)?postData.doctorId:'';
        var actualDoctorId=kiss.checkData(postData.actualDoctorId)?postData.actualDoctorId:'';
        // if(!kiss.checkListData(doctorId))
        // {
        //     kiss.exlog(fHeader,"Loi data truyen den");
        //     res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,"TN001")});
        //     return;
        // }
        if(kiss.checkData(actualDoctorId))
        {
            var sql=
            " SELECT patient.*,calendar.`FROM_TIME`,apptPatient.appt_status,apptPatient.CAL_ID           "+
            " FROM `cln_appt_patients` apptPatient                                                       "+
            " INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`   "+
            " INNER JOIN `cln_patients` patient ON `apptPatient`.`Patient_id`=patient.`Patient_id`       "+
            " WHERE apptPatient.`actual_doctor_id`=? AND `apptPatient`.`appt_status`=?                             ";
        }
        else
        {
            var sql=
            " SELECT patient.*,calendar.`FROM_TIME`,apptPatient.appt_status,apptPatient.CAL_ID           "+
            " FROM `cln_appt_patients` apptPatient                                                       "+
            " INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`   "+
            " INNER JOIN `cln_patients` patient ON `apptPatient`.`Patient_id`=patient.`Patient_id`       "+
            " WHERE calendar.`DOCTOR_ID`=? AND `apptPatient`.`appt_status`=?                             ";
        }
        

        kiss.executeQuery(req,sql,[doctorId,invoiceUtil.apptStatus.inConsult.value],function(rows){
            res.json({status:'success',data:rows});
        },function(err){
            kiss.exlog(fHeader,"Loi truy van select du lieu",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,"TN002")});
        },true);
    },

    startSession:function(req,res)
    {
        var fHeader="ConsultationController->startSession";
        var functionCode="FN001";
        var postData=kiss.checkData(req.body.data)?req.body.data:{};
        var calId=kiss.checkData(postData.calId)?postData.calId:'';
        var patientId=kiss.checkData(postData.patientId)?postData.patientId:'';
        var startSessionTime=kiss.checkData(postData.startSessionTime)?postData.startSessionTime:'';
        if(!kiss.checkListData(calId,patientId,startSessionTime))
        {
            kiss.exlog(fHeader,"Loi data truyen den");
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }

        var sql="UPDATE `cln_appt_patients` SET appt_status=?,SESSION_START_TIME=? WHERE `Patient_id`=? AND `CAL_ID`=? AND appt_status<>?";
        var params=[invoiceUtil.apptStatus.inConsult.value,startSessionTime,patientId,calId,invoiceUtil.apptStatus.cancelled.value];
        kiss.executeQuery(req,sql,params,function(result){
            if(result.affectedRows>0)
            {
                res.json({status:'success'});
            }
            else
            {
                kiss.exlog(fHeader,"Khong co dong nao duoc update status");
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
            }
        },function(err){
            kiss.exlog(fHeader,"Loi truy van cap nhat status",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
        },true)
    },

    /**
     * tannv.dts@gmail.com
     */
    beforeFinishSession:function(req,res)
    {
        fHeader="ConsultationController->beforeFinishSession";
        var functionCode="FN005";
        var postData=kiss.checkData(req.body.data)?req.body.data:{};
        var calId=kiss.checkData(postData.calId)?postData.calId:'';
        var patientId=kiss.checkData(postData.patientId)?postData.patientId:'';
        if(!kiss.checkListData(calId,patientId))
        {
            kiss.exlog(fHeader,"Loi data truyen den");
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }

        var sql=
            " SELECT line.*                                                                    "+
            " FROM `cln_invoice_lines` line                                                    "+
            " INNER JOIN `cln_invoice_header` header ON line.`HEADER_ID`=header.`header_id`    "+
            " WHERE header.`cal_id`=? AND header.`Patient_id`=? AND line.`IS_ENABLE`=1;        ";
            
        var params=[calId,patientId];
        kiss.executeQuery(req,sql,params,function(rows){
            kiss.exlog(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",rows);
           res.json({status:'success',data:rows})
        },function(err){
            kiss.exlog(fHeader,"Loi truy van select cac item cua apptPatient",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
        });
    },

    /**
     * tannv.dts@gmail.com
     */
    finishSession:function(req,res)
    {
        fHeader="ConsultationController->finishSession";
        var functionCode="FN004";
        var postData=kiss.checkData(req.body.data)?req.body.data:{};
        var calId=kiss.checkData(postData.calId)?postData.calId:'';
        var patientId=kiss.checkData(postData.patientId)?postData.patientId:'';
        var endSessionTime=kiss.checkData(postData.endSessionTime)?postData.endSessionTime:'';
        if(!kiss.checkListData(calId,patientId,endSessionTime))
        {
            kiss.exlog(fHeader,"Loi data truyen den");
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }

        var sql="UPDATE `cln_appt_patients` SET appt_status=?,SESSION_END_TIME=? WHERE `Patient_id`=? AND `CAL_ID`=? AND appt_status=?";
        var params=[invoiceUtil.apptStatus.completed.value,endSessionTime,patientId,calId,invoiceUtil.apptStatus.inConsult.value];
        kiss.executeQuery(req,sql,params,function(result){
            if(result.affectedRows>0)
            {
                res.json({status:'success'});
            }
            else
            {
                kiss.exlog(fHeader,"Khong co dong nao duoc update status");
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
            }
        },function(err){
            kiss.exlog(fHeader,"Loi truy van cap nhat status",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
        },true)
    },

    /**
     * Lay thong tin patient tuong ung voi calendar id
     * tannv.dts@gmail.com
     */
    getApptPatient:function(req,res)
    {
        var fHeader="PatientConsultController->getApptPatient";
        var functionCode="FN003";
        var postData=kiss.checkData(req.body.data)?req.body.data:{};
        var calId=kiss.checkData(postData.calId)?postData.calId:'';
        var patientId=kiss.checkData(postData.patientId)?postData.patientId:'';
        if(!kiss.checkListData(calId,patientId))
        {
            kiss.exlog(fHeader,"Loi data truyen den");
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }
        var sql=
            " SELECT `apptPatient`.*,calendar.`DOCTOR_ID`                                               "+
            " FROM `cln_appt_patients` apptPatient                                                      "+
            " INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`  "+
            " WHERE apptPatient.`Patient_id`=? AND apptPatient.`CAL_ID`=? AND apptPatient.`appt_status`<>?; ";
        var params=[patientId,calId,invoiceUtil.apptStatus.cancelled.value];
        kiss.executeQuery(req,sql,params,function(rows){
            if(rows.length>0)
            {
                res.json({status:'success',data:rows[0]});
            }
            else
            {
                kiss.exlog(fHeader,"Thong tin appt patient khong ton tai");
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
            }
        },function(err){
            kiss.exlog(fHeader,"Loi truy van lay appt patient.",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
        },true);

    },
    /**
     * get list consultation of patient
     * pahnquocchien.c1109g@gmail.com@gmail.com
     */
    getListConsultOfPatient:function(req,res)
    {
        var patientId=kiss.checkData(req.body.patient_id)?req.body.patient_id:'';
        if(!kiss.checkListData(patientId))
        {
            kiss.exlog("getListConsultOfPatient Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT consult.*,problem.`Notes`, DATE_FORMAT(app.`FROM_TIME`, '%d/%m/%Y - %h:%i') AS form_time FROM `cln_patient_consults` consult       "+ 
            " LEFT JOIN `cln_problems` problem ON consult.`problem_id` = problem.`Problem_id`                                                           "+ 
            " inner join `cln_appointment_calendar` app on consult.`cal_id` = app.`CAL_ID`                                                              "+ 
            " WHERE consult.`patient_id` = ?                                                                                                            "+ 
            " ORDER BY app.`FROM_TIME` DESC                                                                                                             "; 

        kiss.executeQuery(req,sql,patientId,function(rows){
            if(rows.length>0)
            {
                res.json({status:'success',data:rows});
            }
            else
            {
                res.json({status:'fail'});
            }
        },function(erro){
            res.json({status:'error',error:err})
        });
    },
    getListConsultOfPatientMobile:function(req,res)
    {
        var patientId=kiss.checkData(req.body.patient_id)?req.body.patient_id:'';
        if(!kiss.checkListData(patientId))
        {
            kiss.exlog("getListConsultOfPatientMobile Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT consult.`cal_id`, consult.`patient_id` ,app.`FROM_TIME` FROM `cln_patient_consults` consult       "+ 
            " inner join `cln_appointment_calendar` app on consult.`cal_id` = app.`CAL_ID`                             "+ 
            " WHERE consult.`patient_id` = ?                                                                           "+
            " ORDER BY app.`FROM_TIME` DESC                                                                            "; 
        kiss.executeQuery(req,sql,patientId,function(rows){
            if(rows.length>0)
            {
                res.json({status:'success',data:rows});
            }
            else
            {
                res.json({status:'fail'});
            }
        },function(erro){
            res.json({status:'error',error:err})
        })
    },
    getdetailHistoryAndDrawing:function(req,res)
    {
        var cal_id=kiss.checkData(req.body.cal_id)?req.body.cal_id:'';
        var patient_id=kiss.checkData(req.body.patient_id)?req.body.patient_id:'';
        if(!kiss.checkListData(cal_id,patient_id))
        {
            kiss.exlog("getdetailHistoryAndDrawing Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT * FROM `cln_patient_consults` WHERE `cal_id` = ? AND `patient_id` = ? "; 
        var data = {};
        kiss.executeQuery(req,sql,[cal_id,patient_id],function(rows){
            if(rows.length>0)
            {
                data.history = rows[0];
                var sql2=
                    " SELECT id FROM `cln_patient_drawings` WHERE `patient_id` = ? AND `cal_id` = ?"; 
                kiss.executeQuery(req,sql2,[patient_id,cal_id],function(rows){
                    if(rows.length>0)
                    {
                        data.drawing = rows;
                        res.json({status:'success',data:data});
                    }
                    else
                    {
                        res.json({status:'success',data:data});
                    }
                },function(erro){
                    res.json({status:'error',error:err})
                });
            }
            else
            {
                res.json({status:'fail'});
            }
        },function(erro){
            res.json({status:'error',error:err})
        });
    },
    /*
    * phanquocchien.c1109g@gmail.com
    * check consultation
    */
   checkConsultation:function(req,res){
        var patientId=kiss.checkData(req.body.patient_id)?req.body.patient_id:'';
        var calId=kiss.checkData(req.body.cal_id)?req.body.cal_id:'';
        if(!kiss.checkListData(patientId,calId))
        {
            kiss.exlog("checkConsultation Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT * FROM `cln_patient_consults` WHERE `patient_id` = ? AND `cal_id` = ? ";
        kiss.executeQuery(req,sql,[patientId,calId],function(rows){
            if(rows.length>0)
            {
                res.json({status:'success',data:rows[0]});
            }
            else
            {
                res.json({status:'error'});
            }
        },function(erro){
            res.json({status:'error',error:err})
        })
   },
   /*
    * phanquocchien.c1109g@gmail.com
    * list Measurements
    */
   getListMeasurements:function(req,res){
        var patientId=kiss.checkData(req.body.patient_id)?req.body.patient_id:'';
        if(!kiss.checkListData(patientId))
        {
            kiss.exlog("getListMeasurements Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT mea.*,cal.`FROM_TIME` FROM `cln_patient_measurements` mea          "+
            " INNER JOIN `cln_appointment_calendar` cal ON mea.`cal_id` = cal.`CAL_ID`  "+
            " WHERE mea.`patient_id` = ?                                                "+
            " AND mea.`isEnable` = 1                                                    "+
            " ORDER BY cal.`FROM_TIME` DESC                                             "; 
        kiss.executeQuery(req,sql,[patientId],function(rows){
            res.json({status:'success',data:rows});
        },function(erro){
            res.json({status:'error',error:err})
        })
   },
   /*
    * phanquocchien.c1109g@gmail.com
    * list Measurements
    */
   getListMedication:function(req,res){
        var patientId=kiss.checkData(req.body.patient_id)?req.body.patient_id:'';
        if(!kiss.checkListData(patientId))
        {
            kiss.exlog("getListMedication Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT medi.*, cal.`FROM_TIME`, doc.`NAME`, doc.`Provider_no`  FROM `cln_patient_medication_details` medi  "+
            " INNER JOIN `cln_appointment_calendar` cal ON medi.`cal_id` = cal.`CAL_ID`                                  "+
            " LEFT JOIN `doctors` doc ON medi.`doctor_id` = doc.`doctor_id`                                              "+
            " WHERE medi.`patient_id` = ?                                                                                "+
            " AND medi.`isEnable` = 1                                                                                    "+
            " ORDER BY cal.`FROM_TIME` DESC                                                                              ";
        kiss.executeQuery(req,sql,[patientId],function(rows){
            res.json({status:'success',data:rows});
        },function(erro){
            res.json({status:'error',error:err})
        })
   },
    /*
    * phanquocchien.c1109g@gmail.com
    * get Img Drawing History
    */
   getImgDrawingHistory:function(req,res){
        var patientId=kiss.checkData(req.body.patient_id)?req.body.patient_id:'';
        var calId=kiss.checkData(req.body.cal_id)?req.body.cal_id:'';
        if(!kiss.checkListData(patientId,calId))
        {
            kiss.exlog("getImgDrawingHistory Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        // var sql=
        //     " SELECT d.*, p.`cal_id`  FROM `cln_patient_drawings` d                      "+
        //     " INNER JOIN `cln_patient_consults` p ON d.`consult_id` = p.`consult_id`     "+
        //     " WHERE d.`patient_id` = ?                                                   "+
        //     " AND p.`cal_id` = ?                                                         ";

        var sql = "SELECT d.* FROM `cln_patient_drawings` d WHERE d.`patient_id` = ? AND d.`cal_id` = ?";
        kiss.executeQuery(req,sql,[patientId,calId],function(rows){
            if(rows.length>0)
            {
                res.json({status:'success',data:rows});
            }
            else
            {
                res.json({status:'fail'});
            }
        },function(erro){
            res.json({status:'error',error:err})
        });
    },
    drawingImageById: function(req,res) {
        var imageId = req.param('imageId');
        if(!kiss.checkListData(imageId))
        {
            kiss.exlog("drawingImageById Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=" SELECT `url` FROM `cln_patient_drawings` WHERE `id` = ?";
        kiss.executeQuery(req,sql,[imageId],function(data){
            if(data)
            {
                if(data[0].url!=null || data[0].url!='')
                {
                    fs.exists(data[0].url,function(exists){
                        if (exists) {
                            res.sendfile(data[0].url);
                        } else {
                            res.sendfile("./uploadFile/no-image.png");
                        }
                    })
                }
            }
        },function(erro){
            res.json({status:'error',error:err})
        });
    },
    listExercise: function(req,res){
        var postData = req.body.data;
        var sql = knex
            .select('*')
            .from('cln_exercise_program')
            .where('patient_id',postData.patient_id)
            .toString();
        db.sequelize.query(sql)
        .success(function(data){
            res.json({data: data,sql:sql});
        })
        .error(function(error){
            res.json(500, {error: error,sql:sql});
        })
    },
    getOneExercise:function(req,res){
         var postData = req.body.data;

        var sql = knex('cln_exercise_program')
            .column(
                '*'
            )
            .where('Exercise_id', postData.id)
            .toString();

        db.sequelize.query(sql)
        .success(function(rows){
            res.json({data: rows[0]});
        })
        .error(function(error){
            res.json(500, {error: error});
        })
    },

    updateExercise:function(req,res){
       var postData = req.body.data;
        var errors = [];
        var required = [
            {field: 'exercise', message: 'Exercise exists required'}
        ]
        if(postData.sets % 1 !== 0){
                errors.push({field: 'sets', message: 'sets must be number'});
            }
        if(postData.lastest_weight % 1 !== 0){
            errors.push({field: 'lastest_weight', message: 'Lastest Weight must be number'});
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

        var sql = knex('cln_exercise_program')
            .where('Exercise_id', postData.Exercise_id)
            .update(postData)
            .toString();
         db.sequelize.query(sql)
            .success(function(created){
                res.json({data: created});  
            })
            .error(function(error){
                res.json(500, {error: error});
            })
    },
    deleteExercise:function(req,res){
        var postData = req.body.data;
        var sql = knex('cln_exercise_program')
            .where('Exercise_id', postData.Exercise_id)
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
    addExercise:function(req,res){
        var postData = req.body.data;
        var errors = [];
        var required = [
            {field: 'exercise', message: 'Exercise exists required'}
        ]
        if(postData.sets % 1 !== 0){
                errors.push({field: 'sets', message: 'sets must be number'});
            }
        if(postData.lastest_weight % 1 !== 0){
            errors.push({field: 'lastest_weight', message: 'Lastest Weight must be number'});
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
         

        var unique_sql = knex('cln_exercise_program')
            .where({
                    'cal_id':postData.cal_id,
                    'patient_id':postData.patient_id
                  })
            .toString();

        var sql = knex('cln_exercise_program')
            .insert(postData)
            .toString();
        db.sequelize.query(unique_sql)
        .success(function(rows){
            if(rows.length > 0){
                var sql1 = knex('cln_exercise_program')
                    .where('Exercise_id', rows[0].Exercise_id)
                    .update(postData)
                    .toString();
                db.sequelize.query(sql1)
                .success(function(created){
                    res.json({data: created});  
                })
                .error(function(error){
                    res.json(500, {error: error});
                })
            }else{
                db.sequelize.query(sql)
                .success(function(created){
                    res.json({data: created});  
                })
                .error(function(error){
                    res.json(500, {error: error});
                })
            }
        })
        .error(function(error){
            res.json(500, {error: error});
        })
    },
        // Correspondence
    postListCor: function(req, res){

        var postData = req.body.data;

        var sql = knex('cln_patient_correspondence')
        .where({
            'PATIENT_ID': postData.PATIENT_ID
        })
        .limit(postData.limit)
        .offset(postData.offset)
        .toString();

        var sql_count = knex('cln_patient_correspondence')
        .where({
            'CAL_ID': postData.CAL_ID,
            'PATIENT_ID': postData.PATIENT_ID
        })
        .count('ID as a')
        .toString();

        db.sequelize.query(sql)
        .success(function(data){
            db.sequelize.query(sql_count)
            .success(function(count){
                res.json({data: data, count: count[0].a});
            })
            .error(function(error){
                res.json(500, {'status': 'error', 'message': error});
            })
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': error});
        })

    },
    postAddCor: function(req, res){
        var errors = [];
        var postData = req.body.data;
        console.log('$$$$$$$$$$ ',postData);
        var required = [
            {field: 'Mode', message: 'Mode is required'},
            {field: 'Duration', message: 'Duration is required'},
            {field: 'Who', message: 'who is required'},
            {field: 'Therapist', message: 'Therapist is required'},
            {field: 'Details', message: 'Details is required'}
        ]

        _.forIn(postData, function(value, field){
            _.forEach(required, function(field_error){
                if(field_error.field === field && S(value).isEmpty()){
                    errors.push(field_error);
                    return;
                }
            })
        })

        if(errors.length>0){
            res.status(500).json({errors: errors});
            return;
        }   

        var unique_sql = knex('cln_patient_correspondence')
        .where({
            'CAL_ID': postData.CAL_ID,
            'PATIENT_ID': postData.PATIENT_ID
        })
        .toString();

        var sql = knex('cln_patient_correspondence')
        .insert(postData)
        .toString();

        var sql_update = knex('cln_patient_correspondence')
        .where({
            ID: postData.ID
        })
        .update(postData)
        .toString();

        var sql_ud = knex('cln_patient_correspondence')
        .where({
            'CAL_ID': postData.CAL_ID,
            'PATIENT_ID': postData.PATIENT_ID
        })
        .update(postData)
        .toString();

        db.sequelize.query(unique_sql)
        .success(function(rows){
            //console.log('ID log: ',rows[0].ID);
            if(rows.length > 0){
                if(rows[0].ID){
                    db.sequelize.query(sql_ud)
                    .success(function(crt){
                        res.json({data: crt});  
                    })
                    .error(function(error){
                        res.json(500, {error: error});
                    })
                }else{
                    db.sequelize.query(sql_update)
                    .success(function(cr){
                        res.json({data: cr});  
                    })
                    .error(function(error){
                        res.json(500, {error: error});
                    })
                }
            }else{
                db.sequelize.query(sql)
                .success(function(created){
                    res.json({data: created});  
                })
                .error(function(error){
                    res.json(500, {error: error});
                })
            }
        })
        .error(function(error){
            res.json(500, {error: error});
        })

    },
    /*postEditCor: function(req, res){
        
        var postData = req.body.data;

        var errors = [];
        var required = [
            {field: 'Mode', message: 'Mode is required'},
            {field: 'Duration', message: 'Duration is required'},
            {field: 'who', message: 'who is required'},
            {field: 'Therapist', message: 'Therapist is required'},
            {field: 'Details', message: 'Details is required'}
        ]

        _.forIn(postData, function(value, field){
            _.forEach(required, function(field_error){
                if(field_error.field === field && S(value).isEmpty()){
                    errors.push(field_error);
                    return;
                }
            })
        })

        if(errors.length>0){
            res.status(500).json({errors: errors});
            return;
        }

        var sql = knex('cln_patient_correspondence')
        .where({
            ID: postData.ID
        })
        .update(postData)
        .toString();
        db.sequelize.query(sql)
        .success(function(data){
            res.json({data: data});
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': error});
        })
    }*/
    postById: function(req, res){

        var postData = req.body.data;
        var sql = knex('cln_patient_correspondence')
        .where({
            ID: postData
        })
        .toString();
        db.sequelize.query(sql)
        .success(function(data){
            res.json({data: data[0]});
        })
        .error(function(error){
            res.json(500, {'status': 'error', 'message': error});
        })

    }
}

function base64Image(src) {
    try
    {
        var srcImage;
        var data;
        var ex = fs.existsSync(src);

        if(ex)
            srcImage = src;
        else
            srcImage = "./uploadFile/no-image.png";

        data = fs.readFileSync(srcImage).toString("base64");
        return util.format("data:%s;base64,%s", mime.lookup(srcImage), data);
    }
    catch(err){
        if (err.code !== 'ENOENT')
            return null;
    }
}

