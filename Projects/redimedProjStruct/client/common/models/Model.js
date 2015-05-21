angular.module("app.model", [])
// 
// INSURER
.value("InsurerModel", {
    id: null, // int (11)
    insurer_name: null, // varchar (200)
    address: null, // varchar (200)
    suburb: null, // varchar (200)
    postcode: null, // varchar (50)
    state: null, // varchar (100)
    phone: null, // varchar (15)
    country: null, // int (11)
    isenable: '1', // tinyint (1)
    created_by: null, // int (11)
    creation_date: null, // datetime ()
    last_updated_by: null, // int (11)
    last_update_date: null, // datetime ()
})
// END INSURER
// 
// PATIENT MODEL
.value("PatientModel", {
	Patient_id: null,
	Title: '', //yes
	First_name: '', //yes
	Sur_name: '', //yes
	Middle_name: '', //yes
	Known_as: '', //yes
	Address1: '', //yes
	Address2: '', //yes
	Surburb: '', //yes
	State: '', //yes
	Post_code: '', //yes
	Country: '', //yes
	DOB: null, //yes
	Sex: '', //yes
	Phone_ext: '', //yes
	Home_phone: '', //yes
	Work_phone: '', //yes
	Mobile: '', //yes
	No_SMS: null, //yes
	isLock: null, //yes	
	Account_type: null, //yes
	Account_holder: '', //yes
	Account_Seft: null, //yes
	Medicare_no: null, //yes
	Ref: null, //yes
	Exp_medicare: null, //yes
	Private_fund_id: null, //yes
	MemberShip_no: null, //yes
	UPI: null, //yes
	HCC_Pension_No: null, //yes
	Exp_pension: null, //yes
	DVA_No: null, //yes
	Balance: null, //yes
	Pays_Gap_Only: null, //yes
	Partner_name: '', //yes
	Partner_DOB: null, //yes
	Partner_Occupation: '', //yes
	NOK_Emerg_Contact: '', //yes
	NOK_Phone: '', //yes
	Alias_First_name: '', //yes
	Alias_Sur_name: '', //yes
	Email: '', //yes
	GP_Sur_name: '', //yes
	GP_First_name: '', //yes
	Clinic: '', //yes
	Specialty: '', //yes
	Usual_provider: null, //yes
	Referral_source: null, //yes
	Marial_Status: '', //yes
	Diabetic: null, //yes
	Inactive: null, //yes
	Deceased: null, //yes
	Memo: '', //yes
	Occupation: '', //yes
	UR_no: null, //yes
	Custom: '', //yes
	Culture_id: null, //yes
	Language_id: null, //yes
	Student_id: null,
	Faculty_id: null,
	Fee_type: '', //yes
	Gradudate_status: null, //yes
	Patient_note: '',
	Isenable: '1', //yes
	Created_by: null,
	Last_updated_by: null,
	data: '',
	Type: '',
	test: null,
	company_id: null, //yes
	passport: '', //yes
	driver_license: '', //yes
	avatar: ''
})
// END PATIENT MODEL

// OUTSIDE REFERRAL
.value("OutsideReferralModel", {
	id: null,
	date_issued: null, //yes
	date_started: null, //yes
	duration: null, //yes
	expire_date: null, //yes
	referred_to_doctor: null, //yes
	doctor_id: null, //yes
	patient_id: null,
	created_by: null,
	creation_date: null,
	last_updated_by: null,
	last_update_date: null
})
// END OUTSIDE REFERRAL

// APPOINTMENT CALENDAR
.value("ClnAppointmentCalendarModel", {
	CAL_ID: null,
	DOCTOR_ID: null,
	SITE_ID: null,
	FROM_TIME: null,
	TO_TIME: null,
	NOTES: '',
	PHONE: '',
	APP_TYPE: '',
	STATUS: '',
	ARR_TIME: null,
	ATTEND_TIME: null,
	AVAILABLE: null,
	SERVICE_ID: null,
	CLINICAL_DEPT_ID: null,
	ACC_TYPE: '',
	bill_to: 1
})
.value('mdtAppointmentModel', {
	CAL_ID: null,
	DOCTOR_ID: null,
	SITE_ID: null,
	FROM_TIME: null,
	TO_TIME: null,
	NOTES: '',
	PHONE: '',
	APP_TYPE: '',
	STATUS: '',
	ARR_TIME: null,
	ATTEND_TIME: null,
	AVAILABLE: null,
	Patient_id: '',
	SERVICE_ID: null,
	CLINICAL_DEPT_ID: null,
	ACC_TYPE: '',
	bill_to: null,
	PATIENTS: '',
})
// END APPOINTMENT CALENDAR

//WAITING LIST
.value("WaitingListModel", {
	id: null,
	reason: '',
	priority: 'low',
	doctor_id: null,
	Patient_id: null,
	Created_by: null,
	Last_updated_by: null
})
//END WAITING LIST

/*AUTO CREATE*/
.value('InvoiceHeaderModel', {
	cal_id: null,
	claim_id: null,
	Patient_id: null,
	Company_id: null,
	Insurer_id: null,
	DOCTOR_ID: null,
	SITE_ID: null,
	DEPT_ID: null,
	SERVICE_ID: '',
	INVOICE_NUMBER: null,
	INVOICE_DATE: null,
	CURRENCY_CODE: null,
	RATE_TYPE: null,
	RATE: null,
	STATUS: null,
	DESCRIPTION: '',
	DUE_DATE: null,
	AMOUNT: null,
	TAX_AMOUNT: null,
	TOTAL_AMOUNT: null,
	BASE_AMOUNT: null,
	BASE_TAX_AMOUNT: null,
	BASE_TOTAL_AMOUNT: null,
	LAST_UPDATE_DATE: null,
	LAST_UPDATED_BY: null,
	CREATION_DATE: null,
	CREATED_BY: null,
})
.value('mdtInsurerModel', {
	insurer_name: '',
	address: '',
	suburb: '',
	postcode: '',
	state: '',
	isenable: '',
	created_by: null,
	creation_date: null,
	last_updated_by: null,
	last_update_date: null,
})
.value('mdtClaimModel', {
	Patient_id: '',
	Injury_name: '',
	Injury_date: null,
	How_Injury_Occurred: '',
	Location: '',
	ENTITY_id: null,
	Claim_date: null,
	Insurer: '',
	Address: '',
	Claim_no: null,
	Case_manager: '',
	Isenable: '1',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	isCurr: null,
	insurer_site: null
})
.value('mdtOutdoctorModel', {
	provider_no: '',
	name: '',
	address: '',
	suburb: '',
	state: '',
	phone: '',
	created_by: null,
	last_updated_by: null
})
.value('mdtoutreferralModel', {
	date_issued: null,
	date_started: null,
	duration: null,
	expire_date: null,
	referred_to_doctor: null,
	doctor_id: null,
	patient_id: null,
	created_by: null,
	last_updated_by: null
})
.value('sysStateModel', {
	State: '',
	Country_name: '',
	Isenable: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
.value('sysCountryModel', {
	Country_name: '',
	Isenable: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
.value('mdtRedimedsitesModel', {
	Site_name: '',
	Site_addr: '',
	postcode: null,
	State: '',
	latitude: '',
	longitude: '',
	country: '',
	Available_def: null,
	booking_status: '',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	isPreEmpBK: null,
})
.value('sysServiceModel', {
	SERVICE_NAME: '',
	DESCRIPTION: '',
	Isenable: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	Prefix: '',
	ITEM_START_DATE: null,
	ITEM_END_DATE: null,
	CATEGORY: '',
	INV_GROUP: '',
	SUB_GROUP: '',
	SUB_HEADING: '',
	FEE_TYPE: '',
	PROVIDER_TYPE: '',
	NEW_ITEM: '',
	ITEM_CHANGE: '',
	ANAES_CHANGE: '',
	DESCRIPTOR_CHANGE: '',
	FEE_CHANGE: '',
	EMSN_CHANGE: '',
	EMSN_CAP: '',
	BENEFIT_TYPE: '',
	BENEFIT_START_DATE: null,
	EMSN_START_DATE: null,
	EMSN_END_DATE: null,
	EMSN_FIXED_CAP_AMOUNT: '',
	EMSN_PERCENTAGE_CAP: '',
	EMSN_MAXIMUM_CAP: '',
	EMSN_DESCRIPTION: '',
	EMSN_CHANGE_DATE: null,
	DERIVED_FEE_START_DATE: null,
	DERIVED_FEE: '',
	ANAES: '',
	DESCRIPTION_START_DATE: null,
	QFE_START_DATE: null,
	QFE_END_DATE: null,
	ITEM_CODE: '', // r
	SUB_ITEM_CODE: '',
	DURING_TIME: null,
	AMA_CODE: '',
	AMA_DESC: '',
	isPO: null, // r
	isOM: null, // r
})
.value('sysrlTypesModel', {
	Rl_TYPE_NAME: '',
	ISENABLE: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
.value('mdtSpecialtyModel', {
	Specialties_name: '',
	Isenable: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	RL_TYPE_ID: null,
})
.value('sysQualificationModel', {
	name: '',
	Isenable: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
.value('mdtDeptModel', {
	CLINICAL_DEPT_NAME: '',
	ISENABLE: '1',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
.value('mdtProviderModel', {
	Provider_types_name: '',
	Isenable: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
.value('sysTitleModel', {
	name: '',
	Isenable: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
.value('mdtDoctorModel', {
	NAME: '',
	Address: '',
	Email: '',
	User_id: null,
	Provider_no: '',
	Phone: '',
	Signature: '',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	isReceiveEmailAfterHour: null,
	Title: '',
	First_name: '',
	Middle_name: '',
	Sur_name: '',
	Qualification_id: null,
	Prescriber_no: null,
	Sign_off: '',
	Payee_provider_no: null,
	ABN_no: null,
	Provider_type: null,
	Specialty_id: null,
	Default_bank_account_id: null,
	Medical_Registration_no: null,
	OSHC_ID: null,
	isAppointmentBook: null,
	isMonday: null,
	isTuesday: null,
	isWednesday: null,
	isThursday: null,
	isFriday: null,
	isSaturday: null,
	isSunday: null,
	Appt_interval: null,
	Isenable: '1',
	CLINICAL_DEPT_ID: null,
	isNewCalendarSlot: null,
})
.value('DepartmentModel', {
	departmentid: null,
	departmentName: '',
	locationID: null,
	managerId: null,
})
// .value('ScriptModel', {
// 	Patient_id: null,
// 	CAL_ID: null,
// 	prescriber: '',
// 	scriptNum: null,
// 	Medicare: '',
// 	isRefNo: null,
// 	EntitlementNo: '',
// 	isSafety: null,
// 	isConcessional: null,
// 	isPBS: null,
// 	isRPBS: null,
// 	isBrand: null,
// 	pharmacist: '',
// 	doctorSign: '',
// 	doctordate: null,
// 	patientSign: '',
// 	patientDate: null,
// 	agentAddress: '',
// 	Created_by: null,
// 	Creation_date: null,
// 	Last_updated_by: null,
// 	Last_update_date: null,
// })
.value('ReferralModel', {
     Patient_id: null,
     CAL_ID: null,
     IS_CT_SCAN: null,
     IS_X_RAY: null,
     IS_MRI: null,
     IS_ULTRASOUND: null,
     IS_PATHOLOGY: null,
     CLINICAL_DETAILS: '',
     IS_ALLERGIES: null,
     REQUESTING_PRACTITIONER: '',
     IS_REPORT_URGENT: null,
     IS_ELECTRONIC: null,
     IS_FAX: null,
     IS_Email: null,
     IS_PHONE: null,
     IS_RETURN_WITH_PATIENT: null,
     APPOINTMENT_DATE: null,
     Created_by: null,
     Creation_date: null,
     Last_updated_by: null,
     Last_update_date: null,
     Isenable: 1,
})
/*END AUTO CREATE*/

.value('DepartmentModel', {
	CLINICAL_DEPT_ID: '',
	CLINICAL_DEPT_NAME: '',
	ISENABLE: '1',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})

// ITEM 
.value('ItemModel', {
	ITEM_NAME: '', // r 
	ALT_NAME: '', // r
	DESCRIPTION: '', // r 
	UOM: '', // r
	ITEM_TYPE: '', // r
	TAX_ID: null,
	ISINV: null,
	ISASSET: null,
	ISBOM: null,
	LOT_OR_SERIAL: '',
	ISEXP: null,
    PRICE: 0,
	ISENABLE: null,
	CREATED_BY: null,
	CREATION_DATE: null,
	Last_updated_by: null,
	Last_update_date: null,
	Prefix: '',
	ITEM_START_DATE: null,
	ITEM_END_DATE: null,
	CATEGORY: '',
	INV_GROUP: '',
	SUB_GROUP: '',
	SUB_HEADING: '',
	FEE_TYPE: '',
	PROVIDER_TYPE: '',
	NEW_ITEM: '',
	ITEM_CHANGE: '',
	ANAES_CHANGE: '',
	DESCRIPTOR_CHANGE: '',
	FEE_CHANGE: '',
	EMSN_CHANGE: '',
	EMSN_CAP: '',
	BENEFIT_TYPE: '',
	BENEFIT_START_DATE: null,
	EMSN_START_DATE: null,
	EMSN_END_DATE: null,
    EMSN_FIXED_CAP_AMOUNT: 0,
    EMSN_PERCENTAGE_CAP: 0,
    EMSN_MAXIMUM_CAP: 0,
    EMSN_DESCRIPTION: '',
	EMSN_CHANGE_DATE: null,
	DERIVED_FEE_START_DATE: null,
	DERIVED_FEE: '',
	ANAES: '',
	DESCRIPTION_START_DATE: null,
	QFE_START_DATE: null,
	QFE_END_DATE: null,
	ITEM_CODE: '', // r
	SUB_ITEM_CODE: '',
	DURING_TIME: null,
	AMA_CODE: '',
	AMA_DESC: '',
	isPO: null, // r
	isOM: null, // r
})
// END ITEM
// ITEM HEADER 
.value('ItemHeaderModel', {
	'POPULAR_CODE': '',
	'POPULAR_NAME': '',
	'ISENABLE': '1',
})
// END ITEM HEADER
// SERVICE 
.value('SysServicesModel', {
	SERVICE_NAME: '',
	DESCRIPTION: '',
	SERVICE_COLOR: '',
	FEE_TYPE_ID: '',
	IS_REFERRAL: '0',
	Isenable: '1',
	IS_BOOKABLE:'1',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
// CLN DEPARTMENT
.value('ClnDepartmentModel', {
	CLINICAL_DEPT_ID: '',
	CLINICAL_DEPT_NAME: '',
	ISENABLE: '1',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
// END CLN DEPARTMENT

//FEE GROUP MODEL
.value('FeeGroupModel', {
    FEE_GROUP_NAME: '',
    FEE_GROUP_TYPE: 'fee_type',
    PRICE_SOURCE: '',
    ISENABLE: '1',
    CREATION_DATE: null,
    LAST_UPDATE_DATE: null,
    CREATED_BY: null,
    LAST_UPDATED_BY: null,
})
//END FEE GROUP MODEL

//FEE TYPE MODEL
.value('FeeTypesModel', {
    FEE_TYPE_NAME: '',
    PRICE_SOURCE: '',
    FEE_GROUP_ID: null,
    FEE_GROUP_ORDER: null,
    ISENABLE: '1',
    Creation_date: null,
    Created_by: null,
    Last_update_date: null,
    Last_updated_by: null,
})
//END FEE TYPE MODEL

//PRIVATE FUNDS MODEL
.value('PrivateFundsModel', {
    Fund_name: '',
    Isenable: '1',
    Created_by: null,
    Creation_date: null,
    Last_updated_by: null,
    Last_update_date: null,
    isAHSA: null,
    isBUPA: null,
})
//END PRIVATE FUNDS MODEL

//SCRIPT REFERRAL MODEL
.value('ScriptReferralModel', {
	Patient_id: null,
	CAL_ID: null,
	prescriber: '',
	scriptNum: null,
	Medicare: '',
	isRefNo: null,
	EntitlementNo: '',
	isSafety: null,
	isConcessional: null,
	isPBS: null,
	isRPBS: null,
	isBrand: null,
	pharmacist: '',
	doctorSign: '',
	doctordate: null,
	patientSign: '',
	patientDate: null,
	agentAddress: '',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})

//END SCRIPT REFERRAL MODEL

//GENERAL ASSESSMENT
.value('GeneralWorkCoverModel', {
	cal_id: '',
	patient_id: null,
	injuryDate: null,
	Symptoms: '',
	vitalSigns: '',
	medicalHistory: '',
	medications: '',
	allergies: '',
	symptomology: '',
	examiantion: '',
	diffDiagnosis: '',
	medication: '',
	physio: '',
	dutyrestriction: '',
	recommendations: '',
	followup: '',
	referrals: '',
	telehealth_id: null,
	Name: '',
	Address: '',
	Email: '',
	registionNo: '',
	Phone: '',
	examDate: null,
	signature: '',
	reportlocal: '',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	AssessmentName: '',
})
//END GENERAL ASSESSMENT

// RECALL
.value('mdtRecallModel', {
	patient_id: null,
	notes: '',
	transaction_date: null,
	recall_period: null,
	recall_date: null,
	remind_before: null,
	created_by: null,
	last_updated_by: null,
})
// END RECALL 

// MEDICINE
.value('MedicineModel',{
	medicine_id: null,
	medicine_name: '',
	medicine_price: null,
	medicine_unit: '',
	isEnable: null,
	created_by: null,
	creation_date: null,
	last_updated_by: null,
	last_update_date: null
})
// END MEDICINE

//ALLERGY
.value("AllergyModel",{
	allergy_id: null,
	allergy_name: '',
	isEnable: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
// END ALLERGY

// PROBLEM
.value("ProblemModel",{
	Problem_id: null,
  	Patient_id: null,
  	From_date: null,
  	To_date: null, 
  	Notes: '',
  	ICD10_code: '', 
  	ICPC_code: '',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
})
// END PROBLEM

// FA HEADER
.value("FaHeaderModel",{
	FA_ID: null,
	ENTITY_ID: null, 
	TYPE:'',
	FA_NAME:'',
	ISENABLE: null,
	ITEM_ID: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	Risk: '',
	Comments: '',
	Recommend: '',
	Att_Flexibility: null,
	Att_Core_Stability: null,
	Att_Wirst_Elbow_func: null,
	Att_Shoulder_func: null,
	Att_Lower_Limb_func: null,
	Att_Balance: null,
	ASSESSED_ID: null,
	ASSESSED_SIGN: '',
	ASSESSED_DATE: null,
	ASSESSED_NAME: ''
})
// END FA HEADER

// FA SECTION
.value('FaSectionModel', {
	SECTION_ID: null,
	FA_ID: null,
	SECTION_NAME: '',
	ISENABLE: null,
	ORD: null, 
	USER_TYPE:'',
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null, 
	Last_update_date: null,
	SECTION_TYPE: null
})
// END FA SECTION

// FA LINE
.value('FaLineModel', {
	LINE_ID: null,
	SECTION_ID: null,
	FA_ID: null,
	QUESTION: '',
	PICTURE: null,
	ISSCORE1: null,
	SCORE_TYPE1: null,
	SCORE1: null,
	ISRATING1: null,
	RATING_ID1: null,
	RATING_VALUE1: null,
	COMMENTS: '',
	ORD: null,
	ISSCORE2: null,
	SCORE_TYPE2: null,
	SCORE2: null,
	ISRATING2: null,
	RATING_ID2: null,
	RATING_VALUE2: null,
	ISENABLE: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	IsCommentsText: null,
	LineType: null,
	RATE1: '',
	RATE2: '',
	VAL1_NAME_HEADER: '',
	VAL1_VALUE_HEADER: '',
	VAL2_NAME_HEADER: '',
	VAL2_VALUE_HEADER: '',
	IS_SHOW_RANKING_TABLE: null
})
// END FA LINE

// FA LINE DETAIL
.value('FaLineDetailModel', {
	DETAIL_ID: null,
	LINE_ID: null,
	QUESTION: '',
	VAL1_NAME: '',
	VAL1_ISVALUE: null,
	VAL1_VALUE: '',
	VAL1_ISCHECKBOX: null,
	VAL1_CHECKBOX: '',
	VAL2_NAME: '',
	VAL2_ISVALUE: null,
	VAL2_VALUE: '',
	VAL2_ISCHECKBOX: null,
	VAL2_CHECKBOX: '',
	COMMENTS: '',
	PICTURE: null,
	ORD: null,
	ISENABLE: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	VAL1_ISCOMMENT_WHEN_YES: null,
	VAL1_ISCOMMENT_WHEN_NO: null,
	VAL2_ISCOMMENT_WHEN_YES: null, 
	VAL2_ISCOMMENT_WHEN_NO: null,
	IsCommentText: null,
	LineTestRefer: null,  
	VAL1_VALUE_IS_NUMBER: null,
	VAL2_VALUE_IS_NUMBER: null

})
// END FA LINE DETAIL

//FA COMMENT
.value('FaCommentModel', {
	FA_COMMENT_ID: null,
	LINE_ID: null,           
	NAME: '',
	VALUE: '',
	ISENABLE: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	Comment_Type: null
})
// END FA COMMENT