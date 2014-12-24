var db = require('../../models');

module.exports = {

    insertMA : function(req,res){
        var info = req.body.info;
        db.gorgonMA.max('GORGON_ID')
            .success(function(max){
                var id = max + 1;
                db.gorgonMA.create({
                    GORGON_ID : id ,
                    PATIENT_ID : info.PATIENT_ID ,
                    PHOTO_ID : info.PHOTO_ID ,
                    HAND_DOR : info.HAND_DOR ,
                    HEIGHT : info.HEIGHT == '' ? null : info.HEIGHT ,
                    WEIGHT : info.WEIGHT  == '' ? null : info.WEIGHT,
                    PROTEIN : info.PROTEIN ,
                    GLUCOSE : info.GLUCOSE ,
                    BLOOD : info.BLOOD ,
                    CANNABIS : info.CANNABIS ,
                    OPIATES : info.OPIATES ,
                    AMPHETS : info.AMPHETS ,
                    ANCOHOL : info.ANCOHOL ,
                    BENZOS : info.BENZOS ,
                    COCAIN : info.COCAIN ,
                    METHAMPH : info.METHAMPH ,
                    AUDIOGRAM : info.AUDIOGRAM ,
                    SPIROMETRY : info.SPIROMETRY ,
                    SPIROMETRY_STATIS : info.SPIROMETRY_STATIS ,
                    CANDIDATE_EVER : info.CANDIDATE_EVER ,
                    YES_TO_EITHER : info.YES_TO_EITHER ,
                    SPI_EXAMINERS_COMMENTS : info.SPI_EXAMINERS_COMMENTS ,
                    VA_UNCORRECTED_LEFT : info.VA_UNCORRECTED_LEFT == '' ? null : info.VA_UNCORRECTED_LEFT ,
                    VA_UNCORRECTED_RIGHT : info.VA_UNCORRECTED_RIGHT == '' ? null : info.VA_UNCORRECTED_RIGHT ,
                    VA_CORRECTED_LEFT : info.VA_CORRECTED_LEFT == '' ? null : info.VA_CORRECTED_LEFT ,
                    VA_CORRECTED_RIGHT : info.VA_CORRECTED_RIGHT == '' ? null : info.VA_CORRECTED_RIGHT ,
                    NV_UNCORRECTED_LEFT : info.NV_UNCORRECTED_LEFT == '' ? null : info.NV_UNCORRECTED_LEFT ,
                    NV_UNCORRECTED_RIGHT : info.NV_UNCORRECTED_RIGHT == '' ? null : info.NV_UNCORRECTED_RIGHT ,
                    NV_CORRECTED_LEFT : info.NV_CORRECTED_LEFT == '' ? null : info.NV_CORRECTED_LEFT ,
                    NV_CORRECTED_RIGHT : info.NV_CORRECTED_RIGHT == '' ? null : info.NV_CORRECTED_RIGHT ,
                    VF_LEFT : info.VF_LEFT ,
                    VF_RIGHT : info.VF_RIGHT ,
                    ISHIHARA_RESPONSE : info.ISHIHARA_RESPONSE == '' ? null : info.ISHIHARA_RESPONSE ,
                    AS_Nil : info.AS_Nil,
                    AS_Wide : info.AS_Wide,
                    AS_Basal : info.AS_Basal,
                    AS_Wheezes : info.AS_Wheezes,
                    AS_Rub : info.AS_Rub,
                    EC_normal : info.EC_normal,
                    EC_dermatitis : info.EC_dermatitis,
                    EC_fungal : info.EC_fungal,
                    EC_structural : info.EC_structural,
                    EC_wax : info.EC_wax,
                    TM_normal : info.TM_normal,
                    TM_effusion : info.TM_effusion,
                    TM_wet : info.TM_wet,
                    TM_dry : info.TM_dry,
                    SYSTOLIC_BP : info.SYSTOLIC_BP == '' ? null : info.SYSTOLIC_BP,
                    DIASTOLIC_BP : info.DIASTOLIC_BP == '' ? null : info.DIASTOLIC_BP,
                    PULSE : info.PULSE == '' ? null : info.PULSE,
                    HEART_RHYTHM : info.HEART_RHYTHM ,
                    HEART_SOUNDS : info.HEART_SOUNDS ,
                    PACEMAKER : info.PACEMAKER ,
                    CHEST : info.CHEST ,
                    UPPER_ZONES : info.UPPER_ZONES ,
                    LOWER_ZONES : info.LOWER_ZONES ,
                    ECZEMA : info.ECZEMA ,
                    PSORIASIS : info.PSORIASIS ,
                    TINEA : info.TINEA ,
                    SOLAR_DAMAGE : info.SOLAR_DAMAGE ,
                    FOLLICULITIS : info.FOLLICULITIS ,
                    EC_OTHER : info.EC_OTHER ,
                    SKIN_EXAMINERS_COMMENTS : info.SKIN_EXAMINERS_COMMENTS ,
                    SCARS_NIL : info.SCARS_NIL ,
                    SCARS_APPENDIX : info.SCARS_APPENDIX ,
                    SCARS_GALLBLADDER : info.SCARS_GALLBLADDER ,
                    SCARS_HERNIA : info.SCARS_HERNIA ,
                    SCARS_OTHER : info.SCARS_OTHER ,
                    HERNIAL : info.HERNIAL ,
                    HERNIAL_LEFT : info.HERNIAL_LEFT ,
                    HERNIAL_RIGHT : info.HERNIAL_RIGHT ,
                    RECTUS : info.RECTUS ,
                    MUSCLE_TONE : info.MUSCLE_TONE ,
                    MUSCLE_POWER : info.MUSCLE_POWER ,
                    MUSCLE_WASTING : info.MUSCLE_WASTING ,
                    TREMOR : info.TREMOR ,
                    GAIT : info.GAIT ,
                    LOWER_LEFT : info.LOWER_LEFT ,
                    LOWER_RIGHT : info.LOWER_RIGHT ,
                    CNS_COMMENTS : info.CNS_COMMENTS ,
                    NECK_POSTURE : info.NECK_POSTURE ,
                    NECK_RHYTHM : info.NECK_RHYTHM ,
                    NECK_FLEXION : info.NECK_FLEXION ,
                    NECK_EXTENSION : info.NECK_EXTENSION ,
                    NECK_LATERAL : info.NECK_LATERAL ,
                    NECK_ROTATION : info.NECK_ROTATION ,
                    BACK_POSTURE : info.BACK_POSTURE ,
                    BACK_RHYTHM : info.BACK_RHYTHM ,
                    BACK_FLEXION : info.BACK_FLEXION ,
                    BACK_EXTENSION : info.BACK_EXTENSION ,
                    BACK_LATERAL : info.BACK_LATERAL ,
                    BACK_ROTATION : info.BACK_ROTATION ,
                    BACK_EXAMINERS_COMMENTS : info.BACK_EXAMINERS_COMMENTS ,
                    SHOULDER : info.SHOULDER ,
                    ELBOWS : info.ELBOWS ,
                    WRISTS : info.WRISTS ,
                    KNEES : info.KNEES ,
                    ANKLES : info.ANKLES ,
                    GRIP_STRENGTH : info.GRIP_STRENGTH ,
                    EPICONDYLES : info.EPICONDYLES ,
                    HEEL_WALK : info.HEEL_WALK ,
                    DUCK_WALK : info.DUCK_WALK ,
                    TOE_WALK : info.TOE_WALK ,
                    RHOMBERGS : info.RHOMBERGS ,
                    FUTHER_COMMENTS : info.FUTHER_COMMENTS ,
                    LIMB_EXAMINERS_COMMENTS : info.LIMB_EXAMINERS_COMMENTS ,
                    GORGON_DATE: info.GORGON_DATE ,
                    SIGNATURE: info.SIGNATURE ,
                    Created_by : info.Created_by ,
                    //Creation_date: info.Creation_date ,
                    Last_updated_by : info.Last_updated_by ,
                    //Last_update_date: info.Last_update_date ,
                    CalId : info.CalId ,
                    DocId : info.DocId ,
                    EXAMINER_NAME: info.EXAMINER_NAME ,
                    EXAMINER_ADDRESS: info.EXAMINER_ADDRESS ,
                    RIGHT_EAR_500 : info.RIGHT_EAR_500 == '' ? null : info.RIGHT_EAR_500 ,
                    RIGHT_EAR_1000 : info.RIGHT_EAR_1000 == '' ? null : info.RIGHT_EAR_1000 ,
                    RIGHT_EAR_1500 : info.RIGHT_EAR_1500 == '' ? null : info.RIGHT_EAR_1500 ,
                    RIGHT_EAR_2000 : info.RIGHT_EAR_2000 == '' ? null : info.RIGHT_EAR_2000 ,
                    RIGHT_EAR_3000 : info.RIGHT_EAR_3000 == '' ? null : info.RIGHT_EAR_3000 ,
                    RIGHT_EAR_4000 : info.RIGHT_EAR_4000 == '' ? null : info.RIGHT_EAR_4000 ,
                    RIGHT_EAR_6000 : info.RIGHT_EAR_6000 == '' ? null : info.RIGHT_EAR_6000 ,
                    RIGHT_EAR_8000 : info.RIGHT_EAR_8000 == '' ? null : info.RIGHT_EAR_8000 ,
                    LEFT_EAR_500 : info.LEFT_EAR_500 == '' ? null : info.LEFT_EAR_500 ,
                    LEFT_EAR_1000 : info.LEFT_EAR_1000 == '' ? null : info.LEFT_EAR_1000 ,
                    LEFT_EAR_1500 : info.LEFT_EAR_1500 == '' ? null : info.LEFT_EAR_1500 ,
                    LEFT_EAR_2000 : info.LEFT_EAR_2000 == '' ? null : info.LEFT_EAR_2000 ,
                    LEFT_EAR_3000 : info.LEFT_EAR_3000 == '' ? null : info.LEFT_EAR_3000 ,
                    LEFT_EAR_4000 : info.LEFT_EAR_4000 == '' ? null : info.LEFT_EAR_4000 ,
                    LEFT_EAR_6000 : info.LEFT_EAR_6000 == '' ? null : info.LEFT_EAR_6000 ,
                    LEFT_EAR_8000 : info.LEFT_EAR_8000 == '' ? null : info.LEFT_EAR_8000 ,
                    PRE_BR1_V1 : info.PRE_BR1_V1 == '' ? null : info.PRE_BR1_V1 ,
                    PRE_BR1_V2 : info.PRE_BR1_V2 == '' ? null : info.PRE_BR1_V2 ,
                    PRE_BR1_V3 : info.PRE_BR1_V3 == '' ? null : info.PRE_BR1_V3 ,
                    PRE_BR1_V4 : info.PRE_BR1_V4 == '' ? null : info.PRE_BR1_V4 ,
                    PRE_BR1_V5 : info.PRE_BR1_V5 == '' ? null : info.PRE_BR1_V5 ,
                    PRE_BR1_V6 : info.PRE_BR1_V6 == '' ? null : info.PRE_BR1_V6 ,
                    PRE_BR1_V7 : info.PRE_BR1_V7 == '' ? null : info.PRE_BR1_V7 ,
                    PRE_BR2_V1 : info.PRE_BR2_V1 == '' ? null : info.PRE_BR2_V1 ,
                    PRE_BR2_V2 : info.PRE_BR2_V2 == '' ? null : info.PRE_BR2_V2 ,
                    PRE_BR2_V3 : info.PRE_BR2_V3 == '' ? null : info.PRE_BR2_V3 ,
                    PRE_BR2_V4 : info.PRE_BR2_V4 == '' ? null : info.PRE_BR2_V4 ,
                    PRE_BR2_V5 : info.PRE_BR2_V5 == '' ? null : info.PRE_BR2_V5 ,
                    PRE_BR2_V6 : info.PRE_BR2_V6 == '' ? null : info.PRE_BR2_V6 ,
                    PRE_BR2_V7 : info.PRE_BR2_V7 == '' ? null : info.PRE_BR2_V7 ,
                    PROTEIN_COMMENT : info.PROTEIN_COMMENT ,
                    GLUCOSE_COMMENT : info.GLUCOSE_COMMENT ,
                    BLOOD_COMMENT : info.BLOOD_COMMENT

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
    editMA: function(req,res){
        var info = req.body.info;
                db.gorgonMA.update({
                    PHOTO_ID : info.PHOTO_ID ,
                    HAND_DOR : info.HAND_DOR ,
                    HEIGHT : info.HEIGHT == '' ? null : info.HEIGHT ,
                    WEIGHT : info.WEIGHT  == '' ? null : info.WEIGHT,
                    PROTEIN : info.PROTEIN ,
                    GLUCOSE : info.GLUCOSE ,
                    BLOOD : info.BLOOD ,
                    CANNABIS : info.CANNABIS ,
                    OPIATES : info.OPIATES ,
                    AMPHETS : info.AMPHETS ,
                    ANCOHOL : info.ANCOHOL ,
                    BENZOS : info.BENZOS ,
                    COCAIN : info.COCAIN ,
                    METHAMPH : info.METHAMPH ,
                    AUDIOGRAM : info.AUDIOGRAM ,
                    SPIROMETRY : info.SPIROMETRY ,
                    SPIROMETRY_STATIS : info.SPIROMETRY_STATIS ,
                    CANDIDATE_EVER : info.CANDIDATE_EVER ,
                    YES_TO_EITHER : info.YES_TO_EITHER ,
                    SPI_EXAMINERS_COMMENTS : info.SPI_EXAMINERS_COMMENTS ,
                    VA_UNCORRECTED_LEFT : info.VA_UNCORRECTED_LEFT == '' ? null : info.VA_UNCORRECTED_LEFT ,
                    VA_UNCORRECTED_RIGHT : info.VA_UNCORRECTED_RIGHT == '' ? null : info.VA_UNCORRECTED_RIGHT ,
                    VA_CORRECTED_LEFT : info.VA_CORRECTED_LEFT == '' ? null : info.VA_CORRECTED_LEFT ,
                    VA_CORRECTED_RIGHT : info.VA_CORRECTED_RIGHT == '' ? null : info.VA_CORRECTED_RIGHT ,
                    NV_UNCORRECTED_LEFT : info.NV_UNCORRECTED_LEFT == '' ? null : info.NV_UNCORRECTED_LEFT ,
                    NV_UNCORRECTED_RIGHT : info.NV_UNCORRECTED_RIGHT == '' ? null : info.NV_UNCORRECTED_RIGHT ,
                    NV_CORRECTED_LEFT : info.NV_CORRECTED_LEFT == '' ? null : info.NV_CORRECTED_LEFT ,
                    NV_CORRECTED_RIGHT : info.NV_CORRECTED_RIGHT == '' ? null : info.NV_CORRECTED_RIGHT ,
                    VF_LEFT : info.VF_LEFT ,
                    VF_RIGHT : info.VF_RIGHT ,
                    ISHIHARA_RESPONSE : info.ISHIHARA_RESPONSE == '' ? null : info.ISHIHARA_RESPONSE ,
                    AS_Nil : info.AS_Nil,
                    AS_Wide : info.AS_Wide,
                    AS_Basal : info.AS_Basal,
                    AS_Wheezes : info.AS_Wheezes,
                    AS_Rub : info.AS_Rub,
                    EC_normal : info.EC_normal,
                    EC_dermatitis : info.EC_dermatitis,
                    EC_fungal : info.EC_fungal,
                    EC_structural : info.EC_structural,
                    EC_wax : info.EC_wax,
                    TM_normal : info.TM_normal,
                    TM_effusion : info.TM_effusion,
                    TM_wet : info.TM_wet,
                    TM_dry : info.TM_dry,
                    SYSTOLIC_BP : info.SYSTOLIC_BP == '' ? null : info.SYSTOLIC_BP,
                    DIASTOLIC_BP : info.DIASTOLIC_BP == '' ? null : info.DIASTOLIC_BP,
                    PULSE : info.PULSE == '' ? null : info.PULSE,
                    HEART_RHYTHM : info.HEART_RHYTHM ,
                    HEART_SOUNDS : info.HEART_SOUNDS ,
                    PACEMAKER : info.PACEMAKER ,
                    CHEST : info.CHEST ,
                    UPPER_ZONES : info.UPPER_ZONES ,
                    LOWER_ZONES : info.LOWER_ZONES ,
                    ECZEMA : info.ECZEMA ,
                    PSORIASIS : info.PSORIASIS ,
                    TINEA : info.TINEA ,
                    SOLAR_DAMAGE : info.SOLAR_DAMAGE ,
                    FOLLICULITIS : info.FOLLICULITIS ,
                    EC_OTHER : info.EC_OTHER ,
                    SKIN_EXAMINERS_COMMENTS : info.SKIN_EXAMINERS_COMMENTS ,
                    SCARS_NIL : info.SCARS_NIL ,
                    SCARS_APPENDIX : info.SCARS_APPENDIX ,
                    SCARS_GALLBLADDER : info.SCARS_GALLBLADDER ,
                    SCARS_HERNIA : info.SCARS_HERNIA ,
                    SCARS_OTHER : info.SCARS_OTHER ,
                    HERNIAL : info.HERNIAL ,
                    HERNIAL_LEFT : info.HERNIAL_LEFT ,
                    HERNIAL_RIGHT : info.HERNIAL_RIGHT ,
                    RECTUS : info.RECTUS ,
                    MUSCLE_TONE : info.MUSCLE_TONE ,
                    MUSCLE_POWER : info.MUSCLE_POWER ,
                    MUSCLE_WASTING : info.MUSCLE_WASTING ,
                    TREMOR : info.TREMOR ,
                    GAIT : info.GAIT ,
                    LOWER_LEFT : info.LOWER_LEFT ,
                    LOWER_RIGHT : info.LOWER_RIGHT ,
                    CNS_COMMENTS : info.CNS_COMMENTS ,
                    NECK_POSTURE : info.NECK_POSTURE ,
                    NECK_RHYTHM : info.NECK_RHYTHM ,
                    NECK_FLEXION : info.NECK_FLEXION ,
                    NECK_EXTENSION : info.NECK_EXTENSION ,
                    NECK_LATERAL : info.NECK_LATERAL ,
                    NECK_ROTATION : info.NECK_ROTATION ,
                    BACK_POSTURE : info.BACK_POSTURE ,
                    BACK_RHYTHM : info.BACK_RHYTHM ,
                    BACK_FLEXION : info.BACK_FLEXION ,
                    BACK_EXTENSION : info.BACK_EXTENSION ,
                    BACK_LATERAL : info.BACK_LATERAL ,
                    BACK_ROTATION : info.BACK_ROTATION ,
                    BACK_EXAMINERS_COMMENTS : info.BACK_EXAMINERS_COMMENTS ,
                    SHOULDER : info.SHOULDER ,
                    ELBOWS : info.ELBOWS ,
                    WRISTS : info.WRISTS ,
                    KNEES : info.KNEES ,
                    ANKLES : info.ANKLES ,
                    GRIP_STRENGTH : info.GRIP_STRENGTH ,
                    EPICONDYLES : info.EPICONDYLES ,
                    HEEL_WALK : info.HEEL_WALK ,
                    DUCK_WALK : info.DUCK_WALK ,
                    TOE_WALK : info.TOE_WALK ,
                    RHOMBERGS : info.RHOMBERGS ,
                    FUTHER_COMMENTS : info.FUTHER_COMMENTS ,
                    LIMB_EXAMINERS_COMMENTS : info.LIMB_EXAMINERS_COMMENTS ,
                    GORGON_DATE: info.GORGON_DATE ,
                    SIGNATURE: info.SIGNATURE ,
                    Created_by : info.Created_by ,
                    //Creation_date: info.Creation_date ,
                    Last_updated_by : info.Last_updated_by ,
                    //Last_update_date: info.Last_update_date ,
                    EXAMINER_NAME: info.EXAMINER_NAME ,
                    EXAMINER_ADDRESS: info.EXAMINER_ADDRESS ,
                    RIGHT_EAR_500 : info.RIGHT_EAR_500 == '' ? null : info.RIGHT_EAR_500 ,
                    RIGHT_EAR_1000 : info.RIGHT_EAR_1000 == '' ? null : info.RIGHT_EAR_1000 ,
                    RIGHT_EAR_1500 : info.RIGHT_EAR_1500 == '' ? null : info.RIGHT_EAR_1500 ,
                    RIGHT_EAR_2000 : info.RIGHT_EAR_2000 == '' ? null : info.RIGHT_EAR_2000 ,
                    RIGHT_EAR_3000 : info.RIGHT_EAR_3000 == '' ? null : info.RIGHT_EAR_3000 ,
                    RIGHT_EAR_4000 : info.RIGHT_EAR_4000 == '' ? null : info.RIGHT_EAR_4000 ,
                    RIGHT_EAR_6000 : info.RIGHT_EAR_6000 == '' ? null : info.RIGHT_EAR_6000 ,
                    RIGHT_EAR_8000 : info.RIGHT_EAR_8000 == '' ? null : info.RIGHT_EAR_8000 ,
                    LEFT_EAR_500 : info.LEFT_EAR_500 == '' ? null : info.LEFT_EAR_500 ,
                    LEFT_EAR_1000 : info.LEFT_EAR_1000 == '' ? null : info.LEFT_EAR_1000 ,
                    LEFT_EAR_1500 : info.LEFT_EAR_1500 == '' ? null : info.LEFT_EAR_1500 ,
                    LEFT_EAR_2000 : info.LEFT_EAR_2000 == '' ? null : info.LEFT_EAR_2000 ,
                    LEFT_EAR_3000 : info.LEFT_EAR_3000 == '' ? null : info.LEFT_EAR_3000 ,
                    LEFT_EAR_4000 : info.LEFT_EAR_4000 == '' ? null : info.LEFT_EAR_4000 ,
                    LEFT_EAR_6000 : info.LEFT_EAR_6000 == '' ? null : info.LEFT_EAR_6000 ,
                    LEFT_EAR_8000 : info.LEFT_EAR_8000 == '' ? null : info.LEFT_EAR_8000 ,
                    PRE_BR1_V1 : info.PRE_BR1_V1 == '' ? null : info.PRE_BR1_V1 ,
                    PRE_BR1_V2 : info.PRE_BR1_V2 == '' ? null : info.PRE_BR1_V2 ,
                    PRE_BR1_V3 : info.PRE_BR1_V3 == '' ? null : info.PRE_BR1_V3 ,
                    PRE_BR1_V4 : info.PRE_BR1_V4 == '' ? null : info.PRE_BR1_V4 ,
                    PRE_BR1_V5 : info.PRE_BR1_V5 == '' ? null : info.PRE_BR1_V5 ,
                    PRE_BR1_V6 : info.PRE_BR1_V6 == '' ? null : info.PRE_BR1_V6 ,
                    PRE_BR1_V7 : info.PRE_BR1_V7 == '' ? null : info.PRE_BR1_V7 ,
                    PRE_BR2_V1 : info.PRE_BR2_V1 == '' ? null : info.PRE_BR2_V1 ,
                    PRE_BR2_V2 : info.PRE_BR2_V2 == '' ? null : info.PRE_BR2_V2 ,
                    PRE_BR2_V3 : info.PRE_BR2_V3 == '' ? null : info.PRE_BR2_V3 ,
                    PRE_BR2_V4 : info.PRE_BR2_V4 == '' ? null : info.PRE_BR2_V4 ,
                    PRE_BR2_V5 : info.PRE_BR2_V5 == '' ? null : info.PRE_BR2_V5 ,
                    PRE_BR2_V6 : info.PRE_BR2_V6 == '' ? null : info.PRE_BR2_V6 ,
                    PRE_BR2_V7 : info.PRE_BR2_V7 == '' ? null : info.PRE_BR2_V7 ,
                    PROTEIN_COMMENT : info.PROTEIN_COMMENT ,
                    GLUCOSE_COMMENT : info.GLUCOSE_COMMENT ,
                    BLOOD_COMMENT : info.BLOOD_COMMENT

                },{GORGON_ID : info.GORGON_ID})
                    .success(function(data){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })


    },

    checkGorgonMA: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;

        db.gorgonMA.find({where:{PATIENT_ID:Patient_Id,CalId : CalId}})
            .success(function(data){
                if(data == null)
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
                                        res.json({status:'insert',DocId : doctor.doctor_id,docName:doctor.NAME,docSign:doctor.Signature});
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
                }else
                {
                    console.log(data);
                    db.Doctor.find({where: {doctor_id: data.DocId}}, {raw: true})
                        .success(function (doctor) {
                            if (doctor === null || doctor.length === 0) {
                                console.log("Not found doctor in table");
                                res.json({status: 'fail'});
                                return false;
                            }else
                            {
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
    }
};