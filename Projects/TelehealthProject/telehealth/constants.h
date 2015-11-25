//
//  constants.h
//  telehealth
//
//  Created by Khoa Nguyen on 16/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#ifndef telehealth_constants_h
#define telehealth_constants_h

#define SCROLLVIEW_CONTENT_HEIGHT 1268
#define SCROLLVIEW_CONTENT_WIDTH  1004

#if SANDBOX
#define SITE_URN_STRING @"http://redimed.golden-team.org/telehealth/index.php/"
#else
#define SITE_URL_IN_STRING @"https://telehealth.redimed.com.au/telehealth/index.php/"
#endif


#define WIDHT_CELL 150
#define HEIGHT_CELL 150

#define WIDTH_CELL_IPHONE 90
#define HEIGHT_CELL_IPHONE 90

#define SITE_URL_IN_STRING_MEDITEK @"http://telehealth.redimed.com.au/telehealth/index.php/"
#define ZWWS (@"\u200b") // this invisible symbol is placed at the very first textfield element.

//#if SANDBOX
//#define SITE_URL_IN_STRING @"http://192.168.133.50/new_webapi/index.php/"
//#else
//#define SITE_URL_IN_STRING @"http://192.168.133.50/new_webapi/index.php/"
//#endif

//#if SANDBOX
//#define SITE_URL_IN_STRING @"http://128.199.192.223/meditek/telehealth/new_webapi/index.php/"
//#else
//#define SITE_URL_IN_STRING @"http://128.199.192.223/meditek/telehealth/new_webapi/index.php/"
//#endif

#define SITE_URL ([NSURL URLWithString:SITE_URL_IN_STRING])

#define fields [NSArray arrayWithObjects: @"relation", @"require", @"salut", @"occupation", @"fname", @"gname", @"dob", @"address", @"suburb", @"postcode", @"hfone", @"mfone", @"wfone", @"nok", @"Kfone",@"PHI",@"HC",@"healFund",@"memno",@"medicareno",@"posno",@"expiry",@"vano",@"cholder",@"authen",@"signtext",@"itype",@"adate",@"alocation",@"hasbe4",@"reason",@"injdesc",@"injdesctxt",@"bdypart",@"bdyparttxt",@"mhistory",@"medications",@"allergies",@"symptoms",@"slider",@"injuretxt",@"gillness",@"gillnesstxt",@"hr",@"temp",@"rr",@"sao2",@"bp",@"mhistorytxt",@"smedic",@"inittreatment",@"claimno",@"email",nil]

#define required [NSArray arrayWithObjects: @"no", @"yes", @"no", @"yes", @"yes", @"yes", @"yes", @"yes", @"yes", @"yes", @"no", @"no", @"no", @"no", @"no",@"no",@"no",@"no",@"no",@"no",@"no",@"no",@"no",@"no",@"no",@"yes",@"yes",@"yes",@"yes",@"yes",@"yes",@"yes",@"no",@"yes",@"no",@"no",@"no",@"no",@"no",@"no",@"no",@"yes",@"no",@"no",@"no",@"no",@"no",@"no",@"no",@"no",@"no",nil]
// NSW cert's fields
#define nsw_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"diagnosis", @"check-1", @"pre-existing", @"medication", @"referralname", @"referraldetails", @"check-2", @"fitdatefrom-1", @"fitdateto-1", @"restricthours", @"restrictdays", @"fitdatefrom-2", @"fitdateto-2", @"estimatetime", @"factorsdelay", @"check-3", @"lift", @"sit", @"stand", @"dname",@"push",@"bend",@"drive",@"othertxt",@"nextdate-1",@"comments",@"otherdoctor", nil]
// Vic cert's fields
#define vic_assessment_fields [NSArray arrayWithObjects: @"draddress", @"drphone", @"dremail", @"drsign", @"drname", @"drdateissue", @"dateWorkerDeclaration", @"drprovider", nil]
// Huy code
    // Vic cert's textfield
#define vic_assessment_textfields [NSArray arrayWithObjects: @"textfield_iexamon", @"textfield_myclinical", @"textfield_haveapreinjury", @"textfield_haveasuitablefrom", @"textfield_haveasuitableto", @"textfield_havenocapacityfrom", @"textfield_havenocapacityto", @"textfield_estimate", @"textfield_daysor", nil]
// Vic cert's checkbox
#define vic_assessment_checkbox [NSArray arrayWithObjects: @"chk_transport", @"chk_workrelated", @"chk_havepreinjury", @"chk_havesuitable", @"chk_havenocapacity", nil]

// Vic cert's radio
#define vic_assessment_radio [NSArray arrayWithObjects: @"rd_sit", @"rd_standwalk", @"rd_bend", @"rd_squat", @"rd_kneel", @"rd_reachabove", @"rd_useinjury", @"rd_lift", @"rd_neckmovement", @"rd_attention", @"rd_memory", @"rd_judgement",  @"rd_nohavenot", @"rd_yeshave",  nil]

// Vic cert's textview
#define vic_assessment_textviews [NSArray arrayWithObjects: @"tv_physicalcmt", @"tv_mentalcmt", @"tv_otheraddcmt", @"tv_otherfuncconsider", @"tv_workenvironment", @"tv_treatmentplan", @"tv_providedetails", @"tv_declarethatthedetails", nil]


// TAS cert's fields
#define tas_first_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"psymptoms", @"diagnosis", @"diagnosisdetails", @"reason1", @"reason2", @"historytxt", @"workplacecontact", @"contactdate", @"fitdatefrom1", @"fitdateto1", @"restrictionstxt", @"fitdatefrom2", @"fitdateto2", @"reason3", @"fitdatefrom3", @"consulteddetail", @"medication", @"GPname", @"GPdetails",@"dname", @"reviewdate", @"consulted", nil]

#define tas_final_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"psymptoms", @"pdiagnosis", @"diagnosis", @"diagnosisdetails", @"workplacecontact", @"contactdate", @"fitdatefrom1", @"fitdateto1", @"fitdatefrom2", @"fitdateto2", @"reason1", @"fitdatefrom3", @"fitdatefrom4", @"permanent", @"fulltime", @"graduated", @"hdfrom1", @"dwfrom1", @"hdto1",@"dname", @"dwto1", @"hdfrom2", @"dwfrom2", @"hdto2", @"dwto2", @"weekfrom1", @"weekto1", @"weekfrom2", @"weekto2", @"break", @"mins", @"hrs", @"cap1", @"cap2", @"cap3", @"cap4", @"cap5", @"cap6", @"cap7", @"cap8", @"cap9", @"cap10", @"cap11", @"comments", @"impediments", @"impedimentsdetails", @"consulted", @"consulteddetails", @"treatment", @"GP", @"GPdetails", @"proceduredetails", @"scheduled", @"reviewdate", nil]
// NT cert's fields
#define nt_first_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"history", @"priorhistory", @"examination", @"investigations", @"diagnosis", @"complications", @"fromdate1", @"todate1", @"days", @"weeks", @"fromdate2", @"todate2", @"liftlimit", @"fromdate3", @"todate3", @"firstandfinal", @"contactday", @"contacttime", @"treatment",@"dname", @"medication", @"appdate", @"apptime", @"refhospital", @"physioname", @"physiosess", @"chironame", @"chirosess", @"other", @"conference", @"rehab", @"reviewdate", @"uncertaincomment", @"restrictedother", @"refspec", @"prefereccontactday", nil]

#define nt_first_assessment_checkbox [NSArray arrayWithObjects: @"chk_avoidprolonged", @"assessment-ihave", nil]

#define nt_progress_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"diagnosis", @"fromdate1", @"todate1", @"days", @"weeks", @"fromdate2", @"todate2", @"liftlimit", @"restrictother", @"recommend", @"unfitdays", @"fromdate3", @"todate3", @"reviewdate", @"medication", @"medicalother", @"refspecname", @"refspecspec", @"refhospital",@"dname", @"comments", @"rehabweeks", @"contactdays", @"contacttimes", @"vocationalpreferdays", @"medicalprecday", @"medicalpredtime", @"phyname", @"phynumber", @"chiname", @"chinumber", @"dateappoint", @"timeappoint", @"vocationalprefertime", @"todaterestricted", @"todateonrestrictedduties", @"dateiwillreview", nil]
//phy 35

#define nt_final_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"date", @"groundidea", @"diagnosis", @"diagnosisdetails", @"workplacecontact", @"contactdate", @"fitdatefrom1", @"fitdateto1", @"fitdatefrom2", @"fitdateto2", @"reason1", @"fitdatefrom3", @"fitdatefrom4", @"permanent", @"fulltime", @"graduated", @"hdfrom1", @"dwfrom1", @"hdto1",@"dname", nil]

#define nt_final_assessment_checkbox [NSArray arrayWithObjects: @"chk-1", @"chk-2", @"chk-3", nil]

// QLD cert's fields
#define qld_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"diagnosis", @"consistent", @"pre-existing", @"fromdate1", @"fromdate2", @"todate2", @"fromdate3", @"todate3", @"estimate", @"fromdate4", @"todate4", @"nextdate", @"details", @"treatment", @"medication", @"referralspecialist", @"referralahp", @"detail2", @"further",@"dname", @"check-2", @"check-3", @"check-4",@"check-5",@"check-6",@"check-7",@"check-8",@"comments",@"otherconsiderations",@"restricteddays", @"weight", nil]

// Huy define sa_assessment

    //textfield
//#define sa_assessment_textfield [NSArray arrayWithObjects: @"textfield_dateofinjury",@"textfield_dateworkplaceduties",@"textfield_dutiesfrom",@"textfield_dutiesto",@"textfield_unfitforworkfrom",@"textfield_unfitforworkto",@"textfield_releasethisworkon",@"textfield_releasethisworkor",@"textfield_seenthisworkeron",@"textfield_seenthisworkat",@"textfield_healthprofessional",@"textfield_nameofpersonreferred",@"textfield_serial",nil]

#define sa_assessment_textfield [NSArray arrayWithObjects: @"textfield_examinedyouon", @"textfield_forinjurydevelopedon", @"textfield_haverecovered", @"textfield_fromarefittoperform", @"textfield_toarefittoperform", @"textfield_periodaremedicalunfitto", @"textfield_toaremedicalunfitto", @"textfield_iwouldliketoreviewprogresson", @"textfield_iestimateyouin", @"textfield_iestimateyoudays", @"textfield_medicalspecialist", @"textfield_psychologist", @"textfield_physiotherapist", @"textfield_other", @"textfield_agraduatedincreaseinover", @"textfield_agraduatedincreaseinweeksfrom", @"textfield_agraduatedincreaseinhoursadaytoyournormalhours", @"textfield_nonconsecutiveworkingof", @"textfield_nonconsecutiveworkingdaysor", @"textfield_fax", @"textfield_providerNumber", @"textfield_completiondate",nil]

    //radiobutton
//#define sa_assessment_radio [NSArray arrayWithObjects: @"radio_statedcause_yes",@"radio_statedcause_no",@"radio_workerworkplace_yes",@"radio_workerworkplace_no",@"radio_releasethisworker_yes",nil]
//#define sa_assessment_radio [NSArray arrayWithObjects: @"radio_statedcause_yes",@"radio_workerworkplace_yes",@"radio_thedisability_yes",@"radio_releasethisworker_yes",@"radio_statedcause_no",@"radio_workerworkplace_no",@"radio_thedisability_no",nil]

#define sa_assessment_radio [NSArray arrayWithObjects: @"radio_injuryyoupresentedwith_yes", @"radio_injuryyoupresentedwith_no", @"radio_newcondition", @"radio_recurrencecondition", @"radio_iconsiderthatthedisability_yes", @"radio_iconsiderthatthedisability_no", @"radio_sitting", @"radio_standingwalking", @"radio_kneelingsquatting", @"radio_carryingholdinglifting", @"radio_reachingablove", @"radio_bending", @"radio_useofaffectedbodypart", @"radio_neckmovement", @"radio_climbingstepsstairsladders", @"radio_driving", @"radio_attentionconcentration", @"radio_memory", @"radio_judgement", nil]

    //checkbox
//#define sa_assessment_checkbox [NSArray arrayWithObjects: @"checkbox_fittoreturntopre_injury",@"checkbox_fittoreturntomodified",@"checkbox_unfitforwork",@"checkbox_nofurtherreviewrequired",nil]

#define sa_assessment_checkbox [NSArray arrayWithObjects: @"checkbox_haverecoveredfromyourinjury", @"checkbox_somefurthertreatment", @"checkbox_arefittoperformsuitable", @"checkbox_aremedicallyunfitto", @"checkbox_medicalspecialist", @"checkbox_psychologist", @"checkbox_physiotherapist", @"checkbox_other", @"checkbox_norestrictions", @"checkbox_atyournextmedical", @"checkbox_otherfunctional", @"checkbox_ihaveprescribedmedications", @"checkbox_agraduatedincrease", @"checkbox_non-consecutiveworking", @"checkbox_iwouldlikemoreinformationabout", @"checkbox_iwouldlikeacopyof", @"checkbox_casemanagertocontact", @"checkbox_employertocontact", @"checkbox_preferred_phone", @"checkbox_preferred_email", @"checkbox_preferred_fax", @"checkbox_preferred_writing", @"checkbox_preferred_visit", @"checkbox_iestimateyoushould", @"checkbox_uncertainatthisstate" ,nil]

    //textview
//#define sa_assessment_textview [NSArray arrayWithObjects: @"textview_workerstatedcause",@"textview_examiningtheworker",@"textview_followingrestrictions",@"textview_othercomment",nil]

#define sa_assessment_textview [NSArray arrayWithObjects: @"textview_thestatedcausewas", @"textview_myclinicaldiagnosis", @"textview_othercommentsclinicalfindings", @"textview_reason", @"textview_comments_certification", @"textview_thefollowingtreatment", @"textview_commentsfunctionalability",@"textview_details",nil]

// Huy end defined sa_assessment

// WA cert's fields
//#define general_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"symptomology", @"examination", @"ddiagnosis", @"medication", @"physioallied", @"dutyrestriction", @"recommendation", @"follow", @"referrals",@"dname", nil]
//EditAgain general
#define assessment_fields_info [NSArray arrayWithObjects:@"info_drname", @"info_drcode", @"info_draddress", @"info_drphone", @"info_dremail",@"info_drsign", @"info_drexamdate",nil]

//#define general_assessment_fields [NSArray arrayWithObjects:  @"textfield_symptomology", @"textfield_examination", @"textfield_ddiagnosis", @"textfield_medication", @"textfield_physioallied", @"textfield_dutyrestriction", @"textfield_recommendation", @"textfield_follow", @"textfield_referrals", nil]

//huy fix general assessment
#define general_assessment_textview [NSArray arrayWithObjects: @"textview_gewhathappened", @"textview_gesymptoms", @"textview_geclinicalfindings", @"textview_gediagnosis",@"textview_gerestictions_treament_recommendations", @"textview_gecomments", nil]

#define general_assessment_checkbox [NSArray arrayWithObjects: @"checkbox_gefullcapacityforwork" ,@"checkbox_gerequirefurthertreatment" ,@"checkbox_gesomecapacityforwork" ,@"checkbox_genocapacityforanywork" ,@"checkbox_geworkerdoesnotneedtobereviewedagain",@"checkbox_iwillreviewtheworkeragainon",@"checkbox_iwillneedtoreviewforWA",  nil]

#define general_assessment_datefield [NSArray arrayWithObjects: @"textfield_gefullcapacityforwork",@"textfield_gesomecapacityforworkfrom",@"textfield_getosomecapacityforwork",@"textfield_genocapacityforanyworkfrom",@"textfield_getonocapacityforanywork",@"textfield_geIwillreviewagain", nil]

//end general assessment


//#define first_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"massessment", @"does", @"assessment", @"dateFrom", @"dateTo", @"restrictedhours", @"restrictedDays", @"weight", @"otherRes", @"unfitDays", @"unfitFrom", @"unfitTo", @"medicationtxt", @"treatmenttxt", @"imagingtxt", @"refertxt", @"treatmentother", @"datenext", @"timenext", @"dname", nil]
#define first_assessment_checkbox [NSArray arrayWithObjects: @"checkbox_fullcapacityforwork", @"checkbox_requirefurthertreatment",@"checkbox_somecapacityforwork", @"checkbox_pre-injuryduties",@"checkbox_modifiedoralternative",@"checkbox_workplacemodifications",@"checkbox_pre-injuryhours",@"checkbox_modifiedhoursof",@"checkbox_nocapacityforanywork",@"checkbox_liftupto",@"checkbox_situpto",@"checkbox_standuptp",@"checkbox_walkupto",@"checkbox_workbelowshoulderheight",@"checkbox_moreinformation",@"checkbox_aRTWprogram",@"checkbox_tobeinvolved",@"checkbox_workerdoesnotneed",@"checkbox_Iwillreviewagain",nil]

#define first_assessment_radio [NSArray arrayWithObjects: @"radio_theinjuryinconsistent_yes",@"radio_theinjuryinconsistent_no",@"radio_theinjuryinconsistent_uncertain",@"radio_theinjuryis_newcondition",@"radio_theinjuryis_recurrence", nil]

#define first_assessment_textview [NSArray arrayWithObjects: @"textview_clinicalfindings",@"textview_workbelowshoulderheight",@"textview_happened",@"textview_symptoms", nil]

#define first_assessment_fields [NSArray arrayWithObjects:@"textfield_diagnosis",@"textfield_workerusualduties",@"textfield_hrs/day",@"textfield_days/wk",@"textfield_kg",@"textfield_minssitupto",@"textfield_minsstandupto",@"textfield_m",@"textfield_comments", nil]
#define first_assessment_datefield [NSArray arrayWithObjects: @"textfield_DateOfExamination",@"textfield_fullcapacityforwork",@"textfield_somecapacityforwork",@"textfield_tosomecapacityforwork",@"textfield_nocapacityforanywork",@"textfield_tonocapacityforanywork",@"textfield_Iwillreviewagain", nil]

#define first_assessment_fields_subtextfield [NSArray arrayWithObjects: @"textfield_activities1",@"textfield_purpose1",@"textfield_activities2",@"textfield_purpose2",@"textfield_activities3",@"textfield_purpose3",@"textfield_activities4",@"textfield_purpose4",@"textfield_activities5",@"textfield_purpose5", nil]
//EditAgain First assessment
//#define first_assessment_fields [NSArray arrayWithObjects: @"massessment", @"does", @"assessment", @"dateFrom", @"dateTo", @"restrictedhours", @"restrictedDays", @"weight", @"otherRes", @"unfitDays", @"unfitFrom", @"unfitTo", @"medicationtxt", @"treatmenttxt", @"imagingtxt", @"refertxt", @"treatmentother", @"datenext", @"timenext", @"dname", nil]

//end First Assessment

//EditAgain process assessment
#define process_assessment_datefield [NSArray arrayWithObjects: @"textfield_dateofexamination", @"textfield_fullcapacityforwork",@"textfield_somecapacityforwork",@"textfield_tosomecapacityforwork",@"textfield_tonocapacityforanywork",@"textfield_nocapacityforanywork",@"textfield_IsupporttheRTWprogramestablished",@"textfield_reviewworkeragain", nil]

#define process_assessment_subtextfield [NSArray arrayWithObjects: @"textfield_activities2",@"textfield_actual1",@"textfield_activities1",@"textfield_actual2",@"textfield_activities3",@"textfield_actual3",@"textfield_activities4",@"textfield_actual4",@"textfield_activities5",@"textfield_actual5",@"textfield_activities1_1",@"textfield_purpose1_1",@"textfield_activities2_2",@"textfield_purpose2_2",@"textfield_activities3_3",@"textfield_purpose3_3",@"textfield_activities4_4",@"textfield_purpose4_4",@"textfield_activities5_5",@"textfield_purpose5_5", nil]

#define process_assessment_fields [NSArray arrayWithObjects:@"textfield_diagnosis",@"textfield_workerusualduties",@"textfield_kg",@"textfield_situptomins",@"textfield_standuptomins",@"textfield_m",@"textfield_providenamenandcontact",@"textfield_comment",@"hoursday",@"dayswk", nil]

#define process_assessment_radio [NSArray arrayWithObjects: @"radio_activites1_yes",@"radio_activities2_yes",@"radio_activities3_yes",@"radio_activities4_yes",@"radio_activities5_yes", nil]
#define process_assessment_radio_no [NSArray arrayWithObjects: @"radio_activites1_no",@"radio_activities2_no",@"radio_activities3_no",@"radio_activities4_no",@"radio_activities5_no", nil]
#define process_assessment_textview [NSArray arrayWithObjects: @"textview_workbelowshoulder",@"textview_comment", nil]
#define process_assessment_checkbox [NSArray arrayWithObjects: @"checkbox_otherfactorsappear",@"checkbox_fullcapacityforwork",@"checkbox_somecapacityforwork",@"checkbox_butrequiresfurthertreatment",@"checkbox_pre-injuryduties",@"checkbox_modifiedoralternativeduties",@"checkbox_pre-injuryhours",@"checkbox_modifiedhoursof",@"checkbox_nocapacityforanywork",@"checkbox_liftupto",@"checkbox_situpto",@"checkbox_standupto",@"checkbox_walkupto",@"checkbox_workbelowshoulder",@"checkbox_IsupporttheRTWprogram",@"checkbox_Iwouldlikemoreinformation",@"checkbox_Iwouldliketobeinvolved",@"checkbox_pleaseengageaworkplaceehabilitationprovider",@"checkbox_Iwillreviewworkeragain",@"checkbox_workplacemodifications", nil]

//End process assessment
//#define progress_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"p-massessment", @"p-assessment", @"p-dateFrom", @"p-dateTo", @"p-restrictedhours", @"p-restrictedDays", @"p-weight", @"p-otherRes", @"p-unfitDays", @"p-unfitFrom", @"p-unfitTo", @"p-medicationtxt", @"p-treatmenttxt", @"p-imagingtxt", @"p-refertxt", @"p-treatmentother", @"p-datenext", @"p-timenext", @"p-reviewweek", @"p-refprovider", @"p-noprovider", @"p-withtxt", @"p-comments", @"dname", nil]


//#define final_assessment_fields [NSArray arrayWithObjects: @"name2", @"dcode", @"daddress", @"dphone", @"demail", @"drsign", @"examdate", @"examtime", @"f-from-date1", @"f-assessment", @"f-from-date", @"f-fittxt", @"f-other",@"dname",  nil]
//EditAgain Final Assessment
#define final_assessment_fields [NSArray arrayWithObjects: @"textfield_dateofthisassessment",@"textfield_fullcapacityforwork",@"textfield_capacityforworkfrom",@"textfield_hoursperday",@"textfield_daysperweek",@"textfield_liftupto",@"textfield_situpto",@"textfield_standupto",@"textfield_walkupto", nil]
#define final_assessment_checkbox [NSArray arrayWithObjects: @"checkbox_theworkercondition",@"checkbox_fullcapacityforwordperforming",@"checkbox_requiresfurthertreatment",@"checkbox_capacityforwork",@"checkbox_liftupto",@"checkbox_situpto",@"checkbox_standupto",@"checkbox_walkupto",@"checkbox_workbelowshoulder",@"checkbox_theworkerincapacity", nil]
#define final_assessment_textview [NSArray arrayWithObjects: @"textview_theworkerincapacity",@"textview_outlineyourclinical", nil]
//End

#define red_flags [NSDictionary dictionaryWithObjectsAndKeys: [NSDictionary dictionaryWithObjectsAndKeys: @"Neurologic deficits",@"0",@"Neck stiffness/photophobia/rash/fever",@"1",@"Vomitting",@"2",@"Pain worse on waking",@"3",@"Altered conscious state",@"4",@"Past history of Cancer, immune suppression or drug use",@"5", nil], @"0", [NSDictionary dictionaryWithObjectsAndKeys:nil], @"1",[NSDictionary dictionaryWithObjectsAndKeys:nil],@"2",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"3",[NSDictionary dictionaryWithObjectsAndKeys: @"Difficulty swallowing liquids",@"0",@"Stridor",@"1",@"Altered voice",@"2",@"Unable to lie flat",@"3", nil], @"4",[NSDictionary dictionaryWithObjectsAndKeys: @"Resp rate greater than 25",@"0",@"SaO2 less than 95%",@"1",@"Haemoptysis/calf pain",@"2", @"Chest pain/palpitations",@"3", nil], @"5",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"6",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"7",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"8",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"9",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"10",[NSDictionary dictionaryWithObjectsAndKeys: @"Resp rate greater than 25",@"0",@"SaO2 less than 95%",@"1",@"Haemoptysis/calf pain",@"2", @"Chest pain/palpitations",@"3",@"Difficulty swallowing/altered voice/stridor",@"4", nil], @"11",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"12",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"13",[NSDictionary dictionaryWithObjectsAndKeys: @"Fever",@"0",@"Pain beyond 6 weeks",@"1",@"Pin point tenderness",@"2",@"Neurologic deficit",@"3",@"Past history of Cancer, immune suppression or drug use",@"4",@"Night pain",@"5", nil], @"14",[NSDictionary dictionaryWithObjectsAndKeys: @"Hearing loss",@"0",@"Neurologic deficits",@"1",@"Stiff neck/photophobia/vomitting",@"2",@"Mastoiditis",@"3", nil], @"15",[NSDictionary dictionaryWithObjectsAndKeys: @"Suicidal ideation",@"0",@"Sleep disturbance",@"1",@"Previous suicide attempt",@"2",@"Recent bereavement/loss",@"3",@"Lack of social support",@"4",@"Substance abuse",@"5", nil], @"16",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"17",[NSDictionary dictionaryWithObjectsAndKeys:nil], @"18",[NSDictionary dictionaryWithObjectsAndKeys: @"Facial cellulitis",@"0",@"Jaw pain, with no focal tooth pain",@"1",@"Sinus pain",@"2", nil], @"19",  nil]

//Setting
#define setting_radio_button [NSArray arrayWithObjects:@"radio_surface",@"radio_underground",@"radio_NA",@"radio_road",@"radio_rail",@"radio_ambulance",@"radio_air",@"radio_others",@"radio_yes",@"radio_no",nil]
#define setting_subtextfield [NSArray arrayWithObjects:@"textfield_Medic1",@"textfield_ContactNumber1",@"textfield_Medic2",@"textfield_ContactNumber2",@"textfield_Medic3",@"textfield_ContactNumber3",@"textfield_Medic4",@"textfield_ContactNumber4",@"textfield_Medic5",@"textfield_ContactNumber5",@"textfield_Medic6",@"textfield_ContactNumber6",@"textfield_pharmacy_name",@"textfield_pharmacy_phone",@"textfield_pharmacy_fax",@"textfield_pharmacy_tax",nil]
#define setting_textfield [NSArray arrayWithObjects: @"textfield_mode_of_transfer",@"textfield_have_a_physical",@"textfield_closest_medical_centre",@"textfield_medical_centre",@"textfield_frequency_of_commerical",@"textfield_light_duty_options",@"textview_further_informations",nil]


#endif



//check version
#define SYSTEM_VERSION_EQUAL_TO(v)                  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedSame)
#define SYSTEM_VERSION_GREATER_THAN(v)              ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedDescending)
#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN(v)                 ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN_OR_EQUAL_TO(v)     ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedDescending)


