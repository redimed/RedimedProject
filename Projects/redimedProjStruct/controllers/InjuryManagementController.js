/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var db = require('../models');
module.exports = {
      search : function(req,res) {
          var comId = req.body.companyId;
          db.sequelize.query("SELECT p.Patient_id, p.Title, p.First_name, p.Sur_name, p.Middle_name, p.DOB, p.Mobile FROM cln_patients p WHERE p.company_id = ?", null, {raw: true},[comId])
              .success(function (data) {
                  res.json({status: 'success', rs: data});
              })
              .error(function (err) {
                  res.json({status: 'error', err: err});
                  console.log(err);
              })
      },
      getById: function(req,res){
          var id = req.body.id;
          db.Patient.find({where:{Patient_id: id}},{raw:true})
              .success(function(data){
                  res.json(data);
              })
              .error(function(err){
                  res.json('error');
                  console.log(err);
              })
      },
      checkMobile: function(req,res){
          var mobile = req.body.mobile;

          db.Patient.count({where:["Mobile LIKE ?",mobile]})
              .success(function(c){
                  res.json({status:'success',rs:c});
              })
              .error(function(err){
                  res.json({status:'success'});
                  console.log(err);
              })
      },
      submitInjury: function(req,res){
          var pInfo = req.body.pInfo;
          var iInfo = req.body.iInfo;

          if(pInfo.Patient_id == null)
          {
              db.Patient.create({
                  Title: pInfo.Title,
                  First_name: pInfo.First_name,
                  Sur_name: pInfo.Sur_name,
                  Middle_name : pInfo.Middle_name,
                  Known_as: pInfo.Known_as,
                  Address1: pInfo.Address1,
                  Address2: pInfo.Address2,
                  Surburb: pInfo.Surburb,
                  State: pInfo.State,
                  Post_code: pInfo.Post_code,
                  Country : pInfo.Country,
                  DOB : pInfo.DOB,
                  Sex: pInfo.Sex,
                  Phone_ext : pInfo.Phone_ext,
                  Home_phone : pInfo.Home_phone,
                  Work_phone : pInfo.Work_phone,
                  Mobile : pInfo.Mobile,
                  No_SMS : pInfo.No_SMS,
                  isLock : pInfo.isLock,
                  Account_type : pInfo.Account_type,
                  Account_holder : pInfo.Account_holder,
                  Account_Seft : pInfo.Account_Seft,
                  Medicare_no : pInfo.Medicare_no,
                  Ref : pInfo.Ref,
                  Exp_medicare : pInfo.Exp_medicare,
                  Private_fund_id : pInfo.Private_fund_id,
                  MemberShip_no : pInfo.MemberShip_no,
                  UPI : pInfo.UPI,
                  HCC_Pension_No : pInfo.HCC_Pension_No,
                  Exp_pension : pInfo.Exp_pension,
                  DVA_No : pInfo.DVA_No,
                  Balance : pInfo.Balance,
                  Pays_Gap_Only : pInfo.Pays_Gap_Only,
                  Partner_name: pInfo.Partner_name,
                  Partner_DOB : pInfo.Partner_DOB,
                  Partner_Occupation: pInfo.Partner_Occupation,
                  NOK_Emerg_Contact: pInfo.NOK_Emerg_Contact,
                  NOK_Phone : pInfo.NOK_Phone,
                  Alias_First_name: pInfo.Alias_First_name,
                  Alias_Sur_name: pInfo.Alias_Sur_name,
                  Email: pInfo.Email,
                  GP_Sur_name: pInfo.GP_Sur_name,
                  GP_First_name: pInfo.GP_First_name,
                  Clinic: pInfo.Clinic,
                  Suburb: pInfo.Suburb,
                  Specialty: pInfo.Specialty,
                  Usual_provider : pInfo.Usual_provider,
                  Referral_source : pInfo.Referral_source,
                  Marial_Status: pInfo.Marial_Status,
                  Diabetic : pInfo.Diabetic,
                  Inactive : pInfo.Inactive,
                  Deceased : pInfo.Deceased,
                  Memo : pInfo.Memo,
                  Occupation: pInfo.Occupation,
                  UR_no : pInfo.UR_no,
                  Custom: pInfo.Custom,
                  Culture_id : pInfo.Culture_id,
                  Language_id : pInfo.Language_id,
                  Student_id : pInfo.Student_id,
                  Faculty_id : pInfo.Faculty_id,
                  Fee_type : pInfo.Fee_type,
                  Gradudate_status : pInfo.Gradudate_status,
                  Patient_note: pInfo.Patient_note,
                  Isenable : pInfo.Isenable,
                  company_id: pInfo.company_id
              },{raw:true})
                  .success(function(data){
                      db.Patient.max('Patient_id')
                          .success(function(max){
                              db.IMInjury.create({
                                  patient_id: max,
                                  cal_id: iInfo.cal_id,
                                  driver_id: iInfo.driver_id,
                                  doctor_id: iInfo.doctor_id,
                                  injury_date: iInfo.injury_date,
                                  injury_description: iInfo.injury_description,
                                  STATUS: iInfo.STATUS
                              })
                                  .success(function(rs){
                                      res.json({status:'success'});
                                  })
                                  .error(function(err){
                                      res.json({status:'error'});
                                      console.log(err);
                                  })
                          })
                  })
                  .error(function(err){
                      res.json({status:'error'});
                      console.log(err);
                  })
          }
          else
          {
              db.Patient.update({
                  Title: pInfo.Title,
                  First_name: pInfo.First_name,
                  Sur_name: pInfo.Sur_name,
                  Middle_name : pInfo.Middle_name,
                  Known_as: pInfo.Known_as,
                  Address1: pInfo.Address1,
                  Address2: pInfo.Address2,
                  Surburb: pInfo.Surburb,
                  State: pInfo.State,
                  Post_code: pInfo.Post_code,
                  Country : pInfo.Country,
                  DOB : pInfo.DOB,
                  Sex: pInfo.Sex,
                  Phone_ext : pInfo.Phone_ext,
                  Home_phone : pInfo.Home_phone,
                  Work_phone : pInfo.Work_phone,
                  Mobile : pInfo.Mobile,
                  No_SMS : pInfo.No_SMS,
                  isLock : pInfo.isLock,
                  Account_type : pInfo.Account_type,
                  Account_holder : pInfo.Account_holder,
                  Account_Seft : pInfo.Account_Seft,
                  Medicare_no : pInfo.Medicare_no,
                  Ref : pInfo.Ref,
                  Exp_medicare : pInfo.Exp_medicare,
                  Private_fund_id : pInfo.Private_fund_id,
                  MemberShip_no : pInfo.MemberShip_no,
                  UPI : pInfo.UPI,
                  HCC_Pension_No : pInfo.HCC_Pension_No,
                  Exp_pension : pInfo.Exp_pension,
                  DVA_No : pInfo.DVA_No,
                  Balance : pInfo.Balance,
                  Pays_Gap_Only : pInfo.Pays_Gap_Only,
                  Partner_name: pInfo.Partner_name,
                  Partner_DOB : pInfo.Partner_DOB,
                  Partner_Occupation: pInfo.Partner_Occupation,
                  NOK_Emerg_Contact: pInfo.NOK_Emerg_Contact,
                  NOK_Phone : pInfo.NOK_Phone,
                  Alias_First_name: pInfo.Alias_First_name,
                  Alias_Sur_name: pInfo.Alias_Sur_name,
                  Email: pInfo.Email,
                  GP_Sur_name: pInfo.GP_Sur_name,
                  GP_First_name: pInfo.GP_First_name,
                  Clinic: pInfo.Clinic,
                  Suburb: pInfo.Suburb,
                  Specialty: pInfo.Specialty,
                  Usual_provider : pInfo.Usual_provider,
                  Referral_source : pInfo.Referral_source,
                  Marial_Status: pInfo.Marial_Status,
                  Diabetic : pInfo.Diabetic,
                  Inactive : pInfo.Inactive,
                  Deceased : pInfo.Deceased,
                  Memo : pInfo.Memo,
                  Occupation: pInfo.Occupation,
                  UR_no : pInfo.UR_no,
                  Custom: pInfo.Custom,
                  Culture_id : pInfo.Culture_id,
                  Language_id : pInfo.Language_id,
                  Student_id : pInfo.Student_id,
                  Faculty_id : pInfo.Faculty_id,
                  Fee_type : pInfo.Fee_type,
                  Gradudate_status : pInfo.Gradudate_status,
                  Patient_note: pInfo.Patient_note,
                  Isenable : pInfo.Isenable,
                  company_id: pInfo.company_id
              },{Patient_id: pInfo.Patient_id},{raw:true})
                  .success(function(data){
                      db.IMInjury.create({
                          patient_id: iInfo.patient_id,
                          cal_id: iInfo.cal_id,
                          driver_id: iInfo.driver_id,
                          doctor_id: iInfo.doctor_id,
                          injury_date: iInfo.injury_date,
                          injury_description: iInfo.injury_description,
                          STATUS: iInfo.STATUS
                      })
                          .success(function(rs){
                              res.json({status:'success'});
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
          }

      }
};