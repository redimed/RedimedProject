var db = require('../../models');

module.exports = {
    insertFA : function(req,res){
        var info = req.body.info;

        console.log(info);

        db.gorgonFA.max('id')
            .success(function(max){
                var id = max + 1;
                db.gorgonFA.create({
                    id : id ,
                    patientId : info.patientId ,
                    fName : info.fName ,
                    JAF : info.JAF ,
                    DOB : info.DOB ,
                    DOA : info.DOA ,
                    IsConsentReason : info.IsConsentReason ,
                    fsign : info.fsign ,
                    fsignDate : info.fsignDate ,
                    Estimated : info.Estimated ,
                    EstimatedComments : info.EstimatedComments ,
                    MS_HeartConditions : info.MS_HeartConditions ,
                    MS_HeartConditions_Comment : info.MS_HeartConditions_Comment ,
                    MS_Lung_Asthma : info.MS_Lung_Asthma ,
                    MS_Lung__Asthma_Comment : info.MS_Lung__Asthma_Comment ,
                    MS_Diabetes : info.MS_Diabetes ,
                    MS_Diabetes_Comment : info.MS_Diabetes_Comment ,
                    MS_Fits : info.MS_Fits ,
                    MS_Fits_Comment : info.MS_Fits_Comment ,
                    MS_Medication : info.MS_Medication ,
                    MS_Medication_Comment : info.MS_Medication_Comment ,
                    MS_Other : info.MS_Other ,
                    MS_Other_Comment : info.MS_Other_Comment ,
                    MS_ie_Comment : info.MS_ie_Comment ,
                    MS_Mx_Heart_Rage_1 : info.MS_Mx_Heart_Rage_1 ,
                    MS_Mx_Heart_Rage_2 : info.MS_Mx_Heart_Rage_2 ,
                    MS_Mx_Weight_1 : info.MS_Mx_Weight_1 ,
                    MS_MX_Weight_2 : info.MS_MX_Weight_2 ,
                    MS_Blood_Pressure_1 : info.MS_Blood_Pressure_1 ,
                    MS_Blood_Pressure_2 : info.MS_Blood_Pressure_2 ,
                    MS_Resting_Heart_Rate : info.MS_Resting_Heart_Rate ,
                    "1Rom_Neck"  : info.Rom_Neck1,
                    "1Rom_Thoracic"  : info.Rom_Thoracic1,
                    "1Rom_Lumbar"  : info.Rom_Lumbar1,
                    "1Rom_Shoulder"  : info.Rom_Shoulder1,
                    "1Rom_Elbow"  : info.Rom_Elbow1,
                    "1Rom_Wrist"  : info.Rom_Wrist1,
                    "1Rom_Fingers"  : info.Rom_Fingers1,
                    "1Rom_Hips"  : info.Rom_Hips1,
                    "1Rom_Knees"  : info.Rom_Knees1,
                    "1Rom_Ankles"  : info.Rom_Ankles1,
                    "1Rom_Comments" : info.Rom_Comments1,
                    "1Rom_Total"  : info.Rom_Total1,
                    "2Heart_Rate_30S"  : info.Heart_Rate_30S2 == '' ? null : info.Heart_Rate_30S2,
                    "2Heart_Rate_1M"  : info.Heart_Rate_1M2 == '' ? null : info.Heart_Rate_1M2,
                    "2Heart_Rate_1M_30S"  : info.Heart_Rate_1M_30S2 == '' ? null : info.Heart_Rate_1M_30S2,
                    "2Heart_Rate_2M"  : info.Heart_Rate_2M2 == '' ? null : info.Heart_Rate_2M2,
                    "2Heart_Rate_2M_30S"  : info.Heart_Rate_2M_30S2 == '' ? null : info.Heart_Rate_2M_30S2,
                    "2Heart_Rate_3M"  : info.Heart_Rate_3M2 == '' ? null : info.Heart_Rate_3M2,
                    "2Heart_Rate_1M_Post"  : info.Heart_Rate_1M_Post2 == '' ? null : info.Heart_Rate_1M_Post2,
                    "2Step_Result"  : info.Step_Result2,
                    "2Step_Correct"  : info.Step_Correct2,
                    "2Comments" : info.Comments2,
                    "2Total"  : info.Total2,
                    "3a_Right" :  info.a_Right3,
                    "3a_Left" :  info.a_Left3,
                    "3b_Right"  : info.b_Right3,
                    "3b_Left" :  info.b_Left3,
                    "3c_Grip"  : info.c_Grip3,
                    "3c_Right"  : info.c_Right3 == '' ? null : info.c_Right3,
                    "3c_Left"  : info.c_Left3 == '' ? null : info.c_Left3,
                    "3c_Result"  : info.c_Result3,
                    "3d_Push_ups_total"  : info.d_Push_ups_total3 == '' ? null : info.d_Push_ups_total3,
                    "3d_Result"  : info.d_Result3,
                    "3e_total"  : info.e_total3 == '' ? null : info.e_total3,
                    "3e_Result"  : info.e_Result3,
                    "3Comments" : info.Comments3,
                    "3Total"  : info.Total3,
                    "4aSec"  : info.aSec4 == '' ? null : info.aSec4,
                    "4aResult"  : info.aResult4,
                    "4bTotal"  : info.bTotal4 == '' ? null : info.bTotal4,
                    "4bCrepitus"  : info.bCrepitus4,
                    "4bResult"  : info.bResult4,
                    "4cKneeling"  : info.cKneeling4 == '' ? null : info.cKneeling4,
                    "4cResult"  : info.cResult4,
                    "4Comments" : info.Comments4,
                    "4Total"  : info.Total4,
                    "5aPosture"  : info.aPosture5,
                    "5bHoverResult" : info.bHoverResult5,
                    "5cStrenght"  : info.cStrenght5 == '' ? null : info.cStrenght5,
                    "5cResult" : info.cResult5,
                    "5dTotal"  : info.dTotal5 == '' ? null : info.dTotal5,
                    "5dResult" : info.dResult5,
                    "5eWaitesBow"  : info.eWaitesBow5,
                    "5eResult" : info.eResult5,
                    "5fRight" : info.fRight5,
                    "5fLeft" : info.fLeft5,
                    "5gRight" : info.gRight5,
                    "5gFloat" : info.gFloat5,
                    "5Total" : info.Total5,
                    "6aMax"  : info.aMax6 == '' ? null : info.aMax6,
                    "6aResult"  : info.aResult6,
                    "6bMax"  : info.bMax6 == '' ? null : info.bMax6,
                    "6bResult"  : info.bResult6,
                    "6c_1"  : info.c_16,
                    "6c_1Comment" : info.c_1Comment6,
                    "6c_2"  : info.c_26,
                    "6c_2Comment" : info.c_2Comment6,
                    "6c_3"  : info.c_36,
                    "6c_3Comment" : info.c_3Comment6,
                    "6c_4"  : info.c_46,
                    "6c_4Comment" : info.c_4Comment6,
                    "6c_5"  : info.c_56,
                    "6c_5Comment" : info.c_5Comment6,
                    "6Comments" : info.Comments6,
                    "6Total"  : info.Total6,
                    Score1Comment : info.Score1Comment ,
                    Score2Comment : info.Score2Comment ,
                    Score3Comment : info.Score3Comment ,
                    Score4Comment : info.Score4Comment ,
                    Score5Comment : info.Score5Comment ,
                    Score6Comment : info.Score6Comment ,
                    Score7Comment : info.Score7Comment ,
                    Score8Comment : info.Score8Comment ,
                    FCAToTal : info.FCAToTal ,
                    FCAResult : info.FCAResult ,
                    LEPDC : info.LEPDC ,
                    LAPC : info.LAPC ,
                    LComment : info.LComment ,
                    Created_by : info.Created_by ,
                    //Creation_date : info.Creation_date ,
                    Last_updated_by : info.Last_updated_by,
                    //Last_update_date : info.Last_update_date
                    CalId : info.CalId ,
                    DocId : info.DocId

                },{raw:true})
                    .success(function(data){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })
            }).error(function(err){
                console.log(err);
            })

    },
    editFA: function(req,res){
        var info = req.body.info;

            db.gorgonFA.update({
                fName : info.fName ,
                JAF : info.JAF ,
                DOB : info.DOB ,
                DOA : info.DOA ,
                IsConsentReason : info.IsConsentReason ,
                fsign : info.fsign ,
                fsignDate : info.fsignDate ,
                Estimated : info.Estimated ,
                EstimatedComments : info.EstimatedComments ,
                MS_HeartConditions : info.MS_HeartConditions ,
                MS_HeartConditions_Comment : info.MS_HeartConditions_Comment ,
                MS_Lung_Asthma : info.MS_Lung_Asthma ,
                MS_Lung__Asthma_Comment : info.MS_Lung__Asthma_Comment ,
                MS_Diabetes : info.MS_Diabetes ,
                MS_Diabetes_Comment : info.MS_Diabetes_Comment ,
                MS_Fits : info.MS_Fits ,
                MS_Fits_Comment : info.MS_Fits_Comment ,
                MS_Medication : info.MS_Medication ,
                MS_Medication_Comment : info.MS_Medication_Comment ,
                MS_Other : info.MS_Other ,
                MS_Other_Comment : info.MS_Other_Comment ,
                MS_ie_Comment : info.MS_ie_Comment ,
                MS_Mx_Heart_Rage_1 : info.MS_Mx_Heart_Rage_1 ,
                MS_Mx_Heart_Rage_2 : info.MS_Mx_Heart_Rage_2 ,
                MS_Mx_Weight_1 : info.MS_Mx_Weight_1 ,
                MS_MX_Weight_2 : info.MS_MX_Weight_2 ,
                MS_Blood_Pressure_1 : info.MS_Blood_Pressure_1 ,
                MS_Blood_Pressure_2 : info.MS_Blood_Pressure_2 ,
                MS_Resting_Heart_Rate : info.MS_Resting_Heart_Rate ,
                "1Rom_Neck"  : info.Rom_Neck1,
                "1Rom_Thoracic"  : info.Rom_Thoracic1,
                "1Rom_Lumbar"  : info.Rom_Lumbar1,
                "1Rom_Shoulder"  : info.Rom_Shoulder1,
                "1Rom_Elbow"  : info.Rom_Elbow1,
                "1Rom_Wrist"  : info.Rom_Wrist1,
                "1Rom_Fingers"  : info.Rom_Fingers1,
                "1Rom_Hips"  : info.Rom_Hips1,
                "1Rom_Knees"  : info.Rom_Knees1,
                "1Rom_Ankles"  : info.Rom_Ankles1,
                "1Rom_Comments" : info.Rom_Comments1,
                "1Rom_Total"  : info.Rom_Total1,
                "2Heart_Rate_30S"  : info.Heart_Rate_30S2 == '' ? null : info.Heart_Rate_30S2,
                "2Heart_Rate_1M"  : info.Heart_Rate_1M2 == '' ? null : info.Heart_Rate_1M2,
                "2Heart_Rate_1M_30S"  : info.Heart_Rate_1M_30S2 == '' ? null : info.Heart_Rate_1M_30S2,
                "2Heart_Rate_2M"  : info.Heart_Rate_2M2 == '' ? null : info.Heart_Rate_2M2,
                "2Heart_Rate_2M_30S"  : info.Heart_Rate_2M_30S2 == '' ? null : info.Heart_Rate_2M_30S2,
                "2Heart_Rate_3M"  : info.Heart_Rate_3M2 == '' ? null : info.Heart_Rate_3M2,
                "2Heart_Rate_1M_Post"  : info.Heart_Rate_1M_Post2 == '' ? null : info.Heart_Rate_1M_Post2,
                "2Step_Result"  : info.Step_Result2,
                "2Step_Correct"  : info.Step_Correct2,
                "2Comments" : info.Comments2,
                "2Total"  : info.Total2,
                "3a_Right" :  info.a_Right3,
                "3a_Left" :  info.a_Left3,
                "3b_Right"  : info.b_Right3,
                "3b_Left" :  info.b_Left3,
                "3c_Grip"  : info.c_Grip3,
                "3c_Right"  : info.c_Right3 == '' ? null : info.c_Right3,
                "3c_Left"  : info.c_Left3 == '' ? null : info.c_Left3,
                "3c_Result"  : info.c_Result3,
                "3d_Push_ups_total"  : info.d_Push_ups_total3 == '' ? null : info.d_Push_ups_total3,
                "3d_Result"  : info.d_Result3,
                "3e_total"  : info.e_total3 == '' ? null : info.e_total3,
                "3e_Result"  : info.e_Result3,
                "3Comments" : info.Comments3,
                "3Total"  : info.Total3,
                "4aSec"  : info.aSec4 == '' ? null : info.aSec4,
                "4aResult"  : info.aResult4,
                "4bTotal"  : info.bTotal4 == '' ? null : info.bTotal4,
                "4bCrepitus"  : info.bCrepitus4,
                "4bResult"  : info.bResult4,
                "4cKneeling"  : info.cKneeling4 == '' ? null : info.cKneeling4,
                "4cResult"  : info.cResult4,
                "4Comments" : info.Comments4,
                "4Total"  : info.Total4,
                "5aPosture"  : info.aPosture5,
                "5bHoverResult" : info.bHoverResult5,
                "5cStrenght"  : info.cStrenght5 == '' ? null : info.cStrenght5,
                "5cResult" : info.cResult5,
                "5dTotal"  : info.dTotal5 == '' ? null : info.dTotal5,
                "5dResult" : info.dResult5,
                "5eWaitesBow"  : info.eWaitesBow5,
                "5eResult" : info.eResult5,
                "5fRight" : info.fRight5,
                "5fLeft" : info.fLeft5,
                "5gRight" : info.gRight5,
                "5gFloat" : info.gFloat5,
                "5Total" : info.Total5,
                "6aMax"  : info.aMax6 == '' ? null : info.aMax6,
                "6aResult"  : info.aResult6,
                "6bMax"  : info.bMax6 == '' ? null : info.bMax6,
                "6bResult"  : info.bResult6,
                "6c_1"  : info.c_16,
                "6c_1Comment" : info.c_1Comment6,
                "6c_2"  : info.c_26,
                "6c_2Comment" : info.c_2Comment6,
                "6c_3"  : info.c_36,
                "6c_3Comment" : info.c_3Comment6,
                "6c_4"  : info.c_46,
                "6c_4Comment" : info.c_4Comment6,
                "6c_5"  : info.c_56,
                "6c_5Comment" : info.c_5Comment6,
                "6Comments" : info.Comments6,
                "6Total"  : info.Total6,
                Score1Comment : info.Score1Comment ,
                Score2Comment : info.Score2Comment ,
                Score3Comment : info.Score3Comment ,
                Score4Comment : info.Score4Comment ,
                Score5Comment : info.Score5Comment ,
                Score6Comment : info.Score6Comment ,
                Score7Comment : info.Score7Comment ,
                Score8Comment : info.Score8Comment ,
                FCAToTal : info.FCAToTal ,
                FCAResult : info.FCAResult ,
                LEPDC : info.LEPDC ,
                LAPC : info.LAPC ,
                LComment : info.LComment ,
                Created_by : info.Created_by ,
                //Creation_date : info.Creation_date ,
                Last_updated_by : info.Last_updated_by// ,
                //Last_update_date : info.Last_update_date
            },{id:info.id})
                .success(function(data){
                    res.json({status:'success'});
                })
                .error(function(err){
                    res.json({status:'error',err:err});
                    console.log(err);
                })
    },
    checkGorgonFA: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;

        db.gorgonFA.find({where:{patientId:Patient_Id,CalId : CalId}})
            .success(function(data){
                db.gorgonMA.find({where:{PATIENT_ID:Patient_Id,CalId : CalId},attribute:['SYSTOLIC_BP','DIASTOLIC_BP','PULSE','WEIGHT']})
                    .success(function(dataMA){
                        if(data == null)
                        {
                            if(dataMA == null)
                            {
                                res.json({status:'not'});
                            }else
                            {
                                db.APPTCAL.find({where: {cal_id: CalId}}, {raw: true})
                                    .success(function (appt) {
                                        if (appt === null || appt.length === 0) {
                                            console.log("Not found APPTCAL in table");
                                            res.json({status: 'fail'});
                                            return false;
                                        }
                                        db.Doctor.find({where: {doctor_id: appt.DOCTOR_ID}}, {raw: true})
                                            .success(function (doctor) {
                                                if (doctor === null || doctor.length === 0) {
                                                    console.log("Not found doctor in table");
                                                    res.json({status: 'fail'});
                                                    return false;
                                                }else
                                                {
                                                    res.json({status:'insert',data:dataMA,docID : doctor.doctor_id,docName:doctor.NAME,docSign:doctor.Signature});
                                                }
                                            })
                                            .error(function (err) {
                                                console.log("ERROR:" + err);
                                                res.json({status: 'error'});
                                                return false;
                                            });
                                    })
                                    .error(function (err) {
                                        console.log("ERROR:" + err);
                                        res.json({status: 'error'});
                                        return false;
                                    });
                            }
                        }else
                        {
                            db.Doctor.find({where: {doctor_id: data.DocId}}, {raw: true})
                                .success(function (doctor) {
                                    if (doctor === null || doctor.length === 0) {
                                        console.log("Not found doctor in table");
                                        res.json({status: 'fail'});
                                        return false;
                                    }else
                                    {
                                        data.MS_Blood_Pressure_1=dataMA.SYSTOLIC_BP;
                                        data.MS_Blood_Pressure_2 =dataMA.DIASTOLIC_BP ;
                                        data.MS_Resting_Heart_Rate =dataMA.PULSE;
                                        data.MS_Mx_Weight_1 = dataMA.WEIGHT;
                                        res.json({status:'update',data : data,docName:doctor.NAME,docSign:doctor.Signature});
                                    }
                                })
                                .error(function (err) {
                                    console.log("ERROR:" + err);
                                    res.json({status: 'error'});
                                    return false;
                                });
                        }
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
};




