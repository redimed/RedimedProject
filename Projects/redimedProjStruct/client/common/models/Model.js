angular.module("app.model", [])

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
	Occupation: '',
	UR_no: null, //yes
	Custom: '', //yes
	Culture_id: null, //yes
	Language_id: null, //yes
	Student_id: null, //yes
	Faculty_id: null, //yes
	Fee_type: '', //yes
	Gradudate_status: null, //yes
	Patient_note: '',
	Isenable: '1', //yes
	Created_by: null,
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
	data: '',
	Type: '',
	test: null,
	company_id: null
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
	Creation_date: null,
	Last_updated_by: null,
	Last_update_date: null,
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
	priority: null,
	doctor_id: null,
	Patient_id: null,
	Creation_date: null,
	Created_by: null
})
//END WAITING LIST