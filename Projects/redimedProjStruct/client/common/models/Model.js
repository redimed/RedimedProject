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
