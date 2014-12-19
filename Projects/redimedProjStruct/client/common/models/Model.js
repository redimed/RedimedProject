angular.module("app.model", [])
// COMPANY
.value("CompanyModel", {
    id: null, // int (11)
    Company_name: null, // varchar (100)r
    Industry: null, // varchar (50)r
    Addr: null, // varchar (100)r
    postcode: null, // int (11)r
    State: null, // varchar (25)r
    Description: null, // varchar (250) r
    latitude: null, // float ()
    longitude: null, // float ()
    country: null, // varchar (45)r
    result_email: null, // varchar (100) r
    invoice_email: null, // varchar (100) r
    PO_number: null, // varchar (50) r
    isProject: null, // tinyint (4)
    isCalendar: null, // tinyint (4) 
    father_id: null, // int (11)
    report_to_email: null, // varchar (50) r
    default_status: null, // varchar (20)
    isInvoiceEmailToUser: null, // int (11) r
    Created_by: null, // int (11) 
    Creation_date: null, // datetime ()
    Last_updated_by: null, // int (11)
    Last_update_date: null, // datetime ()
    isAddContactEmailToResult: null, // int (11) r 
    IMA: null, // varchar (50) 
    Site_name: null, // varchar (100)
    Medic_contact_no: null, // varchar (15)
    Email: null, // varchar (100) r
    CODE: null, // varchar (100) r
    Insurer: null, // int (11)r
    Phone: null, // varchar (15) r
    Site_medic: null, // varchar (100) r
    User_id: null, // int (11)
    isPO: null, // int (11) r 
    isExtra: null, // int (11) 
})
// END COMPANY
// 
// INSURER
.value("InsurerModel", {
    id: null, // int (11)
    insurer_name: null, // varchar (200)
    address: null, // varchar (200)
    suburb: null, // varchar (200)
    postcode: null, // varchar (50)
    state: null, // varchar (100)
    isenable: null, // tinyint (1)
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
	driver_license: '' //yes
})
// END PATIENT MODEL

// CLAIM MODEL
.value("ClaimModel", {
	Claim_id: null,
	Patient_id: null,
	Injury_name: '', //yes
	Injury_date: null, //yes
	How_Injury_Occurred: '', //yes
	Location: '', // yes
	ENTITY_Id: null,
	Claim_date: new Date(), //yes
	Insurer: '', //yes
	Address: '', //yes
	Claim_no: null, //yes
	Case_manager: '', //yes
	Isenable: '1', //yes
	Created_by: null,
	Last_updated_by: null,
	isCurr: '1', //yes
	insurer_site: null
})
// END CLAIM MODEL

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
	Medical_Reg_no: null,
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
.value('ScriptModel', {
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
	ELECTRONIC: null,
	FAX: null,
	Email: '',
	PHONE: null,
	IS_RETURN_WITH_PATIENT: null,
	APPOINTMENT_DATE: null,
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	Isenable: null,
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
	Isenable: null,
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