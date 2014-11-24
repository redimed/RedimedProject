/**
 * Created by thanh on 10/22/2014.
 */
var db = require('../../models');

var mkdirp = require('mkdirp');

var java = require('java');
java.options.push("-Djava.awt.headless=true");
java.classpath.push('commons-lang3-3.1.jar');
java.classpath.push('commons-io.jar');
java.classpath.push('./lib/commons-beanutils-1.8.2.jar');
java.classpath.push('./lib/commons-collections-3.2.1.jar');
java.classpath.push('./lib/commons-digester-2.1.jar');
java.classpath.push('./lib/commons-logging-1.1.jar');
java.classpath.push('./lib/groovy-all-2.0.1.jar');
java.classpath.push('./lib/iText-2.1.7.js2.jar');
java.classpath.push('./lib/jasperreports-5.6.0.jar');
java.classpath.push('./lib/mysql-connector-java-5.1.13-bin.jar');
java.classpath.push('./lib/org-apache-commons-codec.jar');


//var ImageIO = java.import('javax.imageio.ImageIO');
var HashMap = java.import('java.util.HashMap');
var JRException = java.import('net.sf.jasperreports.engine.JRException');
var JasperExportManager = java.import('net.sf.jasperreports.engine.JasperExportManager');
var JasperFillManager = java.import('net.sf.jasperreports.engine.JasperFillManager');
var JasperPrint = java.import('net.sf.jasperreports.engine.JasperPrint');
var DriverManager = java.import('java.sql.DriverManager');
var Driver = java.import('com.mysql.jdbc.Driver');
var InputStream = java.import('java.io.InputStream');
var FileInputStream = java.import('java.io.FileInputStream');


module.exports = {

    printReport: function (req, res, next) {
        var calId = req.params.CalId;
        var id = req.params.Gorgon_Id;
        var patientId = req.params.Patient_Id;

        mkdirp('.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId, function (err) {
            if (err) console.error(err)
            else {
                var con = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', "jdbc:mysql://localhost:3306/sakila", "root", "root");

                var paramMap = new HashMap();

                paramMap.putSync("id", parseInt(id));
                paramMap.putSync("realPath", "./reports/Gorgon/");

                var filePath = '.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId + '\\gorgonMH.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager', 'fillReport', './reports/Gorgon/GorgonMHReport.jasper', paramMap, con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager', 'exportReportToPdfFile', jPrint, filePath, function (err, rs) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    else {

                        res.download(filePath, 'gorgonMH.pdf', function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                    }

                });
            }
        });


    },

    loadGGMH: function (req, res) {
        var info = req.body.info;
        var Patient_Id = info.Patient_Id;
        var CalId = info.CalId;
        db.gorgonMH.find({where: {Patient_Id: Patient_Id, CalId: CalId}}, {raw: true})
            .success(function (data) {
                db.Patient.find({where: {Patient_Id: info.Patient_Id}})
                    .success(function (patient) {
                        if (data === null || data.length === 0) {
                            var response = [
                                {"status": "findNull", "patient": patient}
                            ];
                            res.json(response);
                        }
                        else {
                            var response = [
                                {"status": 'findFound', "data": data, "patient": patient}
                            ];
                            res.json(response);
                        }
                    })
                    .error(function (err) {
                        console.log("ERROR:" + err);
                    })
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: 'fail'});
            })
    },
    insertGGMH: function (req, res) {
        var info = req.body.info;
        db.gorgonMH.max('gorgon_id')
            .success(function (maxId) {
                var gorgon_id = maxId + 1;
                db.gorgonMH.create({
                    Gorgon_Id: gorgon_id,
                    Patient_Id: info.Patient_Id,
                    JobNo: info.JobNo,
                    Occupation: info.Occupation,
                    JobLocation: info.JobLocation,
                    SpecificLocation: info.SpecificLocation,
                    PhoneNumber: info.PhoneNumber,
                    Q1_YearFrom1: info.Q1_YearFrom1,
                    Q1_YearFrom2: info.Q1_YearFrom2,
                    Q1_YearTo1: info.Q1_YearTo1,
                    Q1_YearTo2: info.Q1_YearTo2,
                    Q1_Job1: info.Q1_Job1,
                    Q1_Job2: info.Q1_Job2,
                    Q1_Employer1: info.Q1_Employer1,
                    Q1_Employer2: info.Q1_Employer2,
                    Q1_TypeOfWork: info.Q1_TypeOfWork,
                    Q1_WorkPast: info.Q1_WorkPast,
                    Q1_WorkEnvironment: info.Q1_WorkEnvironment,
                    Q1_AnyProblems: info.Q1_AnyProblems,
                    Q1_CauseProblems: info.Q1_CauseProblems,
                    Q1_Underground: info.Q1_Underground,
                    Q1_GrainDust: info.Q1_GrainDust,
                    Q1_RemoteEnv: info.Q1_RemoteEnv,
                    Q1_AtHeights: info.Q1_AtHeights,
                    Q1_WetConditions: info.Q1_WetConditions,
                    Q1_Nickel: info.Q1_Nickel,
                    Q1_HumidConditions: info.Q1_HumidConditions,
                    Q1_FIFO: info.Q1_FIFO,
                    Q1_FIFODone: info.Q1_FIFODone,
                    Q1_FIFOProblems: info.Q1_FIFOProblems,
                    Q1_ShiftWork: info.Q1_ShiftWork,
                    Q1_ShiftWorkDone: info.Q1_ShiftWorkDone,
                    Q1_ShiftWorkProblems: info.Q1_ShiftWorkProblems,
                    Q1_SafetyEquipment: info.Q1_SafetyEquipment,
                    Q1_ExaminersComments: info.Q1_ExaminersComments,
                    Q2_Operation: info.Q2_Operation,
                    Q2_Accident: info.Q2_Accident,
                    Q2_SportsInjury: info.Q2_SportsInjury,
                    Q2_YesWhen: info.Q2_YesWhen,
                    Q2_TimeOfWork: info.Q2_TimeOfWork,
                    Q2_HowLongOff: info.Q2_HowLongOff,
                    Q2_HowLongModified: info.Q2_HowLongModified,
                    Q2_HowLongTreatment: info.Q2_HowLongTreatment,
                    Q2_NormalDuties: info.Q2_NormalDuties,
                    Q2_Compensation: info.Q2_Compensation,
                    Q2_PsychologicalProblems: info.Q2_PsychologicalProblems,
                    Q2_ExaminersComments: info.Q2_ExaminersComments,
                    Q2_DentalHealth: info.Q2_DentalHealth,
                    Q2_Diabetic: info.Q2_Diabetic,
                    Q2_Seizure: info.Q2_Seizure,
                    Q2_Epileptic: info.Q2_Epileptic,
                    Q2_Asthmatic: info.Q2_Asthmatic,
                    Q2_AnyScars: info.Q2_AnyScars,
                    Q2_MedicAlert: info.Q2_MedicAlert,
                    Q3_NeckInjury: info.Q3_NeckInjury,
                    Q3_DiskInjury: info.Q3_DiskInjury,
                    Q3_Backache: info.Q3_Backache,
                    Q3_Physio: info.Q3_Physio,
                    Q3_BackInjury: info.Q3_BackInjury,
                    Q3_Sciatica: info.Q3_Sciatica,
                    Q3_BackSurgery: info.Q3_BackSurgery,
                    Q3_SwollenJoints: info.Q3_SwollenJoints,
                    Q3_ArthriticKnee: info.Q3_ArthriticKnee,
                    Q3_Arm: info.Q3_Arm,
                    Q3_HandInjury: info.Q3_HandInjury,
                    Q3_LegInjury: info.Q3_LegInjury,
                    Q3_KneeCartilage: info.Q3_KneeCartilage,
                    Q3_KneeReconstruction: info.Q3_KneeReconstruction,
                    Q3_FootProblems: info.Q3_FootProblems,
                    Q3_OtherBone: info.Q3_OtherBone,
                    Q3_Rheumatism: info.Q3_Rheumatism,
                    Q3_RSI: info.Q3_RSI,
                    Q3_Hernia: info.Q3_Hernia,
                    Q4_MentalHealth: info.Q4_MentalHealth,
                    Q4_Psychologist: info.Q4_Psychologist,
                    Q4_DrugsProblems: info.Q4_DrugsProblems,
                    Q4_Depression: info.Q4_Depression,
                    Q4_PanicAttacks: info.Q4_PanicAttacks,
                    Q4_NervousProblem: info.Q4_NervousProblem,
                    Q4_Anxiety: info.Q4_Anxiety,
                    Q4_Insomnia: info.Q4_Insomnia,
                    Q5_Eczema: info.Q5_Eczema,
                    Q5_Psoriasis: info.Q5_Psoriasis,
                    Q5_SkinProblem: info.Q5_SkinProblem,
                    Q5_Dermatitis: info.Q5_Dermatitis,
                    Q5_SkinCancers: info.Q5_SkinCancers,
                    Q6_Asthma: info.Q6_Asthma,
                    Q6_LungDisease: info.Q6_LungDisease,
                    Q6_Artery: info.Q6_Artery,
                    Q6_HighBloodPressure: info.Q6_HighBloodPressure,
                    Q6_DVT: info.Q6_DVT,
                    Q6_UsedPuffer: info.Q6_UsedPuffer,
                    Q6_CardiacPacemaker: info.Q6_CardiacPacemaker,
                    Q6_Emphysema: info.Q6_Emphysema,
                    Q6_HeartDisease: info.Q6_HeartDisease,
                    Q6_Bronchitis: info.Q6_Bronchitis,
                    Q6_CollapsedLung: info.Q6_CollapsedLung,
                    Q6_HeartAttack: info.Q6_HeartAttack,
                    Q7_HeadInjury: info.Q7_HeadInjury,
                    Q7_Epilepsy: info.Q7_Epilepsy,
                    Q7_SevereHeadaches: info.Q7_SevereHeadaches,
                    Q7_NeurologicalDisorder: info.Q7_NeurologicalDisorder,
                    Q8_DOInsulin: info.Q8_DOInsulin,
                    Q8_DOMedication: info.Q8_DOMedication,
                    Q8_DietControl: info.Q8_DietControl,
                    Q8_KidneyProblems: info.Q8_KidneyProblems,
                    Q8_LiverDisease: info.Q8_LiverDisease,
                    Q8_HearingLoss: info.Q8_HearingLoss,
                    Q8_Exhaustion: info.Q8_Exhaustion,
                    Q8_Arthritis: info.Q8_Arthritis,
                    Q8_BloodDisorder: info.Q8_BloodDisorder,
                    Q8_Cancer: info.Q8_Cancer,
                    Q8_BowelProblems: info.Q8_BowelProblems,
                    Q8_Hepatitis: info.Q8_Hepatitis,
                    Q8_VisionProblem: info.Q8_VisionProblem,
                    Q8_ChronicIllness: info.Q8_ChronicIllness,
                    Q9_Pregnant: info.Q9_Pregnant,
                    Q9_BreastFeeding: info.Q9_BreastFeeding,
                    Q9_ExaminersComments: info.Q9_ExaminersComments,
                    Q10_Disabilities: info.Q10_Disabilities,
                    Q11_Climb: info.Q11_Climb,
                    Q11_Bend: info.Q11_Bend,
                    Q11_WorkOverhead: info.Q11_WorkOverhead,
                    Q11_WorkHeights: info.Q11_WorkHeights,
                    Q11_WorkIsolation: info.Q11_WorkIsolation,
                    Q11_Instruments: info.Q11_Instruments,
                    Q11_WorkAwkward: info.Q11_WorkAwkward,
                    Q11_Squat: info.Q11_Squat,
                    Q11_Push: info.Q11_Push,
                    Q11_WorkUnderground: info.Q11_WorkUnderground,
                    Q11_WorkDusty: info.Q11_WorkDusty,
                    Q11_WorkConfined: info.Q11_WorkConfined,
                    Q11_WorkGround: info.Q11_WorkGround,
                    Q11_WorkVibration: info.Q11_WorkVibration,
                    Q12_LossFullBack: info.Q12_LossFullBack,
                    Q12_LossFullLeg: info.Q12_LossFullLeg,
                    Q12_DifficultyHearing: info.Q12_DifficultyHearing,
                    Q12_LossEye: info.Q12_LossEye,
                    Q12_Glasses: info.Q12_Glasses,
                    Q12_OtherLoss: info.Q12_OtherLoss,
                    Q12_LossFullMovements: info.Q12_LossFullMovements,
                    Q12_OtherProblem: info.Q12_OtherProblem,
                    Q12_LossFullArm: info.Q12_LossFullArm,
                    Q12_Psychological: info.Q12_Psychological,
                    Q12_Breathing: info.Q12_Breathing,
                    Q12_ChronicSkin: info.Q12_ChronicSkin,
                    Q12_AlcoholMisuse: info.Q12_AlcoholMisuse,
                    Q12_LossMobility: info.Q12_LossMobility,
                    Q12_LossFullNeck: info.Q12_LossFullNeck,
                    Q12_ExaminersComments: info.Q12_ExaminersComments,
                    Q13_AdvisedToChange: info.Q13_AdvisedToChange,
                    Q13_AdvisedToChangeComment: info.Q13_AdvisedToChangeComment,
                    Q13_AdvisedToLimit: info.Q13_AdvisedToLimit,
                    Q13_AdvisedToLimitComment: info.Q13_AdvisedToLimitComment,
                    Q13_OffInjury: info.Q13_OffInjury,
                    Q13_OffInjuryComment: info.Q13_OffInjuryComment,
                    Q13_WhatWas: info.Q13_WhatWas,
                    Q13_Medi_Vac: info.Q13_Medi_Vac,
                    Q13_Details: info.Q13_Details,
                    Q13_ExaminersComments: info.Q13_ExaminersComments,
                    Q14_WorkRelatedDisease: info.Q14_WorkRelatedDisease,
                    Q14_Year: info.Q14_Year,
                    Q14_HowLongOff: info.Q14_HowLongOff,
                    Q14_HowLongModified: info.Q14_HowLongModified,
                    Q14_HowLongTreatment: info.Q14_HowLongTreatment,
                    Q14_NormalDuties: info.Q14_NormalDuties,
                    Q14_Compensation: info.Q14_Compensation,
                    Q14_Psychological: info.Q14_Psychological,
                    Q14_Details: info.Q14_Details,
                    Q14_WCClaim: info.Q14_WCClaim,
                    Q14_ExaminersComments: info.Q14_ExaminersComments,
                    Q15_TakeMedications: info.Q15_TakeMedications,
                    Q15_ListMedication: info.Q15_ListMedication,
                    Q16_HayFever: info.Q16_HayFever,
                    Q16_Eczema: info.Q16_Eczema,
                    Q16_Allergic: info.Q16_Allergic,
                    Q16_Adrenaline: info.Q16_Adrenaline,
                    Q16_Epipen: info.Q16_Epipen,
                    Q16_Asthma: info.Q16_Asthma,
                    Q17_QFever: info.Q17_QFever,
                    Q17_HepatitisA: info.Q17_HepatitisA,
                    Q17_Tetanus: info.Q17_Tetanus,
                    Q17_HepatitisB: info.Q17_HepatitisB,
                    Q17_ExaminersComments: info.Q17_ExaminersComments,
                    Q18_IncreasedCough: info.Q18_IncreasedCough,
                    Q18_ChestIllness: info.Q18_ChestIllness,
                    Q18_SOBHurrying: info.Q18_SOBHurrying,
                    Q18_SOBwalking: info.Q18_SOBwalking,
                    Q18_SOBWakeUp: info.Q18_SOBWakeUp,
                    Q18_CESWheezy: info.Q18_CESWheezy,
                    Q18_CEFTight: info.Q18_CEFTight,
                    Q18_GivenPuffer: info.Q18_GivenPuffer,
                    Q18_LastTimePuffer: info.Q18_LastTimePuffer,
                    Q19_Smoke: info.Q19_Smoke,
                    Q19_SmokeDay: info.Q19_SmokeDay,
                    Q19_SmokeWeek: info.Q19_SmokeWeek,
                    Q19_SmokeYear: info.Q19_SmokeYear,
                    Q20_DrinkWeek: info.Q20_DrinkWeek,
                    Q20_DrinkMax: info.Q20_DrinkMax,
                    Q21_Exercise: info.Q21_Exercise,
                    Q21_PlaySport: info.Q21_PlaySport,
                    Q21_SportDetails: info.Q21_SportDetails,
                    Q21_IsFootball: info.Q21_IsFootball,
                    Q21_IsGolf: info.Q21_IsGolf,
                    Q21_IsTennis: info.Q21_IsTennis,
                    Q21_IsSquash: info.Q21_IsSquash,
                    Q21_IsBowls: info.Q21_IsBowls,
                    Q21_IsGym: info.Q21_IsGym,
                    Q21_IsOther: info.Q21_IsOther,
                    Q22_SleepDisorder: info.Q22_SleepDisorder,
                    Q22_Choking: info.Q22_Choking,
                    Q22_UseCPAP: info.Q22_UseCPAP,
                    Q23_SittingReading: info.Q23_SittingReading,
                    Q23_WatchingTV: info.Q23_WatchingTV,
                    Q23_Inactive: info.Q23_Inactive,
                    Q23_Passenger: info.Q23_Passenger,
                    Q23_LyingDown: info.Q23_LyingDown,
                    Q23_SittingTalking: info.Q23_SittingTalking,
                    Q23_SittingQuietly: info.Q23_SittingQuietly,
                    Q23_InACar: info.Q23_InACar,
                    Q23_TotalScore: info.Q23_TotalScore,
                    Signature: info.Signature,
                    GorgonDate: new Date(),
                    Created_by: info.Created_by,
                    Last_updated_by: info.Last_updated_by,
                    CalId: info.CalId,
                    DocId: info.DocId,
                    Q21Other1Comment: info.Q21Other1Comment,
                    PATIENT_SIGNATURE: info.PATIENT_SIGNATURE
                }, {raw: true})
                    .success(function () {
                        res.json({status: 'success'});
                    })
                    .error(function (err) {
                        console.log("ERROR:" + err);
                        res.json({status: 'fail'});
                    })
            }).error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: 'fail'});
            })
    },
    editGGMH: function (req, res) {
        var info = req.body.info;
        db.gorgonMH.update({
            Patient_Id: info.Patient_Id,
            JobNo: info.JobNo,
            Occupation: info.Occupation,
            JobLocation: info.JobLocation,
            SpecificLocation: info.SpecificLocation,
            PhoneNumber: info.PhoneNumber,
            Q1_YearFrom1: info.Q1_YearFrom1,
            Q1_YearFrom2: info.Q1_YearFrom2,
            Q1_YearTo1: info.Q1_YearTo1,
            Q1_YearTo2: info.Q1_YearTo2,
            Q1_Job1: info.Q1_Job1,
            Q1_Job2: info.Q1_Job2,
            Q1_Employer1: info.Q1_Employer1,
            Q1_Employer2: info.Q1_Employer2,
            Q1_TypeOfWork: info.Q1_TypeOfWork,
            Q1_WorkPast: info.Q1_WorkPast,
            Q1_WorkEnvironment: info.Q1_WorkEnvironment,
            Q1_AnyProblems: info.Q1_AnyProblems,
            Q1_CauseProblems: info.Q1_CauseProblems,
            Q1_Underground: info.Q1_Underground,
            Q1_GrainDust: info.Q1_GrainDust,
            Q1_RemoteEnv: info.Q1_RemoteEnv,
            Q1_AtHeights: info.Q1_AtHeights,
            Q1_WetConditions: info.Q1_WetConditions,
            Q1_Nickel: info.Q1_Nickel,
            Q1_HumidConditions: info.Q1_HumidConditions,
            Q1_FIFO: info.Q1_FIFO,
            Q1_FIFODone: info.Q1_FIFODone,
            Q1_FIFOProblems: info.Q1_FIFOProblems,
            Q1_ShiftWork: info.Q1_ShiftWork,
            Q1_ShiftWorkDone: info.Q1_ShiftWorkDone,
            Q1_ShiftWorkProblems: info.Q1_ShiftWorkProblems,
            Q1_SafetyEquipment: info.Q1_SafetyEquipment,
            Q1_ExaminersComments: info.Q1_ExaminersComments,
            Q2_Operation: info.Q2_Operation,
            Q2_Accident: info.Q2_Accident,
            Q2_SportsInjury: info.Q2_SportsInjury,
            Q2_YesWhen: info.Q2_YesWhen,
            Q2_TimeOfWork: info.Q2_TimeOfWork,
            Q2_HowLongOff: info.Q2_HowLongOff,
            Q2_HowLongModified: info.Q2_HowLongModified,
            Q2_HowLongTreatment: info.Q2_HowLongTreatment,
            Q2_NormalDuties: info.Q2_NormalDuties,
            Q2_Compensation: info.Q2_Compensation,
            Q2_PsychologicalProblems: info.Q2_PsychologicalProblems,
            Q2_ExaminersComments: info.Q2_ExaminersComments,
            Q2_DentalHealth: info.Q2_DentalHealth,
            Q2_Diabetic: info.Q2_Diabetic,
            Q2_Seizure: info.Q2_Seizure,
            Q2_Epileptic: info.Q2_Epileptic,
            Q2_Asthmatic: info.Q2_Asthmatic,
            Q2_AnyScars: info.Q2_AnyScars,
            Q2_MedicAlert: info.Q2_MedicAlert,
            Q3_NeckInjury: info.Q3_NeckInjury,
            Q3_DiskInjury: info.Q3_DiskInjury,
            Q3_Backache: info.Q3_Backache,
            Q3_Physio: info.Q3_Physio,
            Q3_BackInjury: info.Q3_BackInjury,
            Q3_Sciatica: info.Q3_Sciatica,
            Q3_BackSurgery: info.Q3_BackSurgery,
            Q3_SwollenJoints: info.Q3_SwollenJoints,
            Q3_ArthriticKnee: info.Q3_ArthriticKnee,
            Q3_Arm: info.Q3_Arm,
            Q3_HandInjury: info.Q3_HandInjury,
            Q3_LegInjury: info.Q3_LegInjury,
            Q3_KneeCartilage: info.Q3_KneeCartilage,
            Q3_KneeReconstruction: info.Q3_KneeReconstruction,
            Q3_FootProblems: info.Q3_FootProblems,
            Q3_OtherBone: info.Q3_OtherBone,
            Q3_Rheumatism: info.Q3_Rheumatism,
            Q3_RSI: info.Q3_RSI,
            Q3_Hernia: info.Q3_Hernia,
            Q4_MentalHealth: info.Q4_MentalHealth,
            Q4_Psychologist: info.Q4_Psychologist,
            Q4_DrugsProblems: info.Q4_DrugsProblems,
            Q4_Depression: info.Q4_Depression,
            Q4_PanicAttacks: info.Q4_PanicAttacks,
            Q4_NervousProblem: info.Q4_NervousProblem,
            Q4_Anxiety: info.Q4_Anxiety,
            Q4_Insomnia: info.Q4_Insomnia,
            Q5_Eczema: info.Q5_Eczema,
            Q5_Psoriasis: info.Q5_Psoriasis,
            Q5_SkinProblem: info.Q5_SkinProblem,
            Q5_Dermatitis: info.Q5_Dermatitis,
            Q5_SkinCancers: info.Q5_SkinCancers,
            Q6_Asthma: info.Q6_Asthma,
            Q6_LungDisease: info.Q6_LungDisease,
            Q6_Artery: info.Q6_Artery,
            Q6_HighBloodPressure: info.Q6_HighBloodPressure,
            Q6_DVT: info.Q6_DVT,
            Q6_UsedPuffer: info.Q6_UsedPuffer,
            Q6_CardiacPacemaker: info.Q6_CardiacPacemaker,
            Q6_Emphysema: info.Q6_Emphysema,
            Q6_HeartDisease: info.Q6_HeartDisease,
            Q6_Bronchitis: info.Q6_Bronchitis,
            Q6_CollapsedLung: info.Q6_CollapsedLung,
            Q6_HeartAttack: info.Q6_HeartAttack,
            Q7_HeadInjury: info.Q7_HeadInjury,
            Q7_Epilepsy: info.Q7_Epilepsy,
            Q7_SevereHeadaches: info.Q7_SevereHeadaches,
            Q7_NeurologicalDisorder: info.Q7_NeurologicalDisorder,
            Q8_DOInsulin: info.Q8_DOInsulin,
            Q8_DOMedication: info.Q8_DOMedication,
            Q8_DietControl: info.Q8_DietControl,
            Q8_KidneyProblems: info.Q8_KidneyProblems,
            Q8_LiverDisease: info.Q8_LiverDisease,
            Q8_HearingLoss: info.Q8_HearingLoss,
            Q8_Exhaustion: info.Q8_Exhaustion,
            Q8_Arthritis: info.Q8_Arthritis,
            Q8_BloodDisorder: info.Q8_BloodDisorder,
            Q8_Cancer: info.Q8_Cancer,
            Q8_BowelProblems: info.Q8_BowelProblems,
            Q8_Hepatitis: info.Q8_Hepatitis,
            Q8_VisionProblem: info.Q8_VisionProblem,
            Q8_ChronicIllness: info.Q8_ChronicIllness,
            Q9_Pregnant: info.Q9_Pregnant,
            Q9_BreastFeeding: info.Q9_BreastFeeding,
            Q9_ExaminersComments: info.Q9_ExaminersComments,
            Q10_Disabilities: info.Q10_Disabilities,
            Q11_Climb: info.Q11_Climb,
            Q11_Bend: info.Q11_Bend,
            Q11_WorkOverhead: info.Q11_WorkOverhead,
            Q11_WorkHeights: info.Q11_WorkHeights,
            Q11_WorkIsolation: info.Q11_WorkIsolation,
            Q11_Instruments: info.Q11_Instruments,
            Q11_WorkAwkward: info.Q11_WorkAwkward,
            Q11_Squat: info.Q11_Squat,
            Q11_Push: info.Q11_Push,
            Q11_WorkUnderground: info.Q11_WorkUnderground,
            Q11_WorkDusty: info.Q11_WorkDusty,
            Q11_WorkConfined: info.Q11_WorkConfined,
            Q11_WorkGround: info.Q11_WorkGround,
            Q11_WorkVibration: info.Q11_WorkVibration,
            Q12_LossFullBack: info.Q12_LossFullBack,
            Q12_LossFullLeg: info.Q12_LossFullLeg,
            Q12_DifficultyHearing: info.Q12_DifficultyHearing,
            Q12_LossEye: info.Q12_LossEye,
            Q12_Glasses: info.Q12_Glasses,
            Q12_OtherLoss: info.Q12_OtherLoss,
            Q12_LossFullMovements: info.Q12_LossFullMovements,
            Q12_OtherProblem: info.Q12_OtherProblem,
            Q12_LossFullArm: info.Q12_LossFullArm,
            Q12_Psychological: info.Q12_Psychological,
            Q12_Breathing: info.Q12_Breathing,
            Q12_ChronicSkin: info.Q12_ChronicSkin,
            Q12_AlcoholMisuse: info.Q12_AlcoholMisuse,
            Q12_LossMobility: info.Q12_LossMobility,
            Q12_LossFullNeck: info.Q12_LossFullNeck,
            Q12_ExaminersComments: info.Q12_ExaminersComments,
            Q13_AdvisedToChange: info.Q13_AdvisedToChange,
            Q13_AdvisedToChangeComment: info.Q13_AdvisedToChangeComment,
            Q13_AdvisedToLimit: info.Q13_AdvisedToLimit,
            Q13_AdvisedToLimitComment: info.Q13_AdvisedToLimitComment,
            Q13_OffInjury: info.Q13_OffInjury,
            Q13_OffInjuryComment: info.Q13_OffInjuryComment,
            Q13_WhatWas: info.Q13_WhatWas,
            Q13_Medi_Vac: info.Q13_Medi_Vac,
            Q13_Details: info.Q13_Details,
            Q13_ExaminersComments: info.Q13_ExaminersComments,
            Q14_WorkRelatedDisease: info.Q14_WorkRelatedDisease,
            Q14_Year: info.Q14_Year,
            Q14_HowLongOff: info.Q14_HowLongOff,
            Q14_HowLongModified: info.Q14_HowLongModified,
            Q14_HowLongTreatment: info.Q14_HowLongTreatment,
            Q14_NormalDuties: info.Q14_NormalDuties,
            Q14_Compensation: info.Q14_Compensation,
            Q14_Psychological: info.Q14_Psychological,
            Q14_Details: info.Q14_Details,
            Q14_WCClaim: info.Q14_WCClaim,
            Q14_ExaminersComments: info.Q14_ExaminersComments,
            Q15_TakeMedications: info.Q15_TakeMedications,
            Q15_ListMedication: info.Q15_ListMedication,
            Q16_HayFever: info.Q16_HayFever,
            Q16_Eczema: info.Q16_Eczema,
            Q16_Allergic: info.Q16_Allergic,
            Q16_Adrenaline: info.Q16_Adrenaline,
            Q16_Epipen: info.Q16_Epipen,
            Q16_Asthma: info.Q16_Asthma,
            Q17_QFever: info.Q17_QFever,
            Q17_HepatitisA: info.Q17_HepatitisA,
            Q17_Tetanus: info.Q17_Tetanus,
            Q17_HepatitisB: info.Q17_HepatitisB,
            Q17_ExaminersComments: info.Q17_ExaminersComments,
            Q18_IncreasedCough: info.Q18_IncreasedCough,
            Q18_ChestIllness: info.Q18_ChestIllness,
            Q18_SOBHurrying: info.Q18_SOBHurrying,
            Q18_SOBwalking: info.Q18_SOBwalking,
            Q18_SOBWakeUp: info.Q18_SOBWakeUp,
            Q18_CESWheezy: info.Q18_CESWheezy,
            Q18_CEFTight: info.Q18_CEFTight,
            Q18_GivenPuffer: info.Q18_GivenPuffer,
            Q18_LastTimePuffer: info.Q18_LastTimePuffer,
            Q19_Smoke: info.Q19_Smoke,
            Q19_SmokeDay: info.Q19_SmokeDay,
            Q19_SmokeWeek: info.Q19_SmokeWeek,
            Q19_SmokeYear: info.Q19_SmokeYear,
            Q20_DrinkWeek: info.Q20_DrinkWeek,
            Q20_DrinkMax: info.Q20_DrinkMax,
            Q21_Exercise: info.Q21_Exercise,
            Q21_PlaySport: info.Q21_PlaySport,
            Q21_SportDetails: info.Q21_SportDetails,
            Q21_IsFootball: info.Q21_IsFootball,
            Q21_IsGolf: info.Q21_IsGolf,
            Q21_IsTennis: info.Q21_IsTennis,
            Q21_IsSquash: info.Q21_IsSquash,
            Q21_IsBowls: info.Q21_IsBowls,
            Q21_IsGym: info.Q21_IsGym,
            Q21_IsOther: info.Q21_IsOther,
            Q22_SleepDisorder: info.Q22_SleepDisorder,
            Q22_Choking: info.Q22_Choking,
            Q22_UseCPAP: info.Q22_UseCPAP,
            Q23_SittingReading: info.Q23_SittingReading,
            Q23_WatchingTV: info.Q23_WatchingTV,
            Q23_Inactive: info.Q23_Inactive,
            Q23_Passenger: info.Q23_Passenger,
            Q23_LyingDown: info.Q23_LyingDown,
            Q23_SittingTalking: info.Q23_SittingTalking,
            Q23_SittingQuietly: info.Q23_SittingQuietly,
            Q23_InACar: info.Q23_InACar,
            Q23_TotalScore: info.Q23_TotalScore,
            Signature: info.Signature,
            GorgonDate: new Date(),
            Created_by: info.Created_by,
            Last_updated_by: info.Last_updated_by,
            CalId: info.CalId,
            DocId: info.DocId,
            Q21Other1Comment: info.Q21Other1Comment,
            PATIENT_SIGNATURE: info.PATIENT_SIGNATURE
        }, {Gorgon_Id: info.Gorgon_Id})
            .success(function () {
                res.json({status: 'success'});
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: 'fail'});
            });
    }
}