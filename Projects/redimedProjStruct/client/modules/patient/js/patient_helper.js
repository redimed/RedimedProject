/**
 * tannv.dts@gmail.com
 * 01-06-2015
 */
var ptnConst={
	/**
	 * cac status cua appointment cua patient 
	 * booking: patient da booking appointment
	 * checkedIn: patient da den dang ki kham
	 * workInProgress: patient dang kham
	 * billing: dang tao bill
	 * close: ket thuc
	 * tannv.dts@gmail.com
	 */
	apptStatus:{
		booking:{value:'Booking',display:'Booking'},
		checkedIn:{value:'Checked In',display:'Checked In'},
		preProgress:{value:'Pre-progress',display:'Pre-progress'},
		workInProgress:{value:'Work In Progress',display:'Work In Progress'},
		completed:{value:'Completed',display:'Completed'},
		billing:{value:'Billing',display:'Billing'},
		close:{value:'Close',display:'Close'},
		cancelled:{value:'Cancelled',display:'Cancelled'}
	},
	apptStatusDisplay:{
		'Booking':'Booking',
		'Checked In':'Checked In',
		'Work In Progress':'Work In Progress',
		'Completed':'Completed',
		'Billing':'Billing',
		'Close':'Close',
		'Cancelled':'Cancelled'
	},
	unit:{
		mg:{value:'mg',display:'mg'},
		g:{value:'g',display:'g'},
		litre:{value:'litre',display:'litre'},
		tablet:{value:'tablet',display:'tablet'},
		capsule:{value:'capsule',display:'capsule'}
	},
	route:{
		PO:{value:'PO',display:'PO'},
		PR:{value:'PR',display:'PR'},
		IV:{value:'IV',display:'IV'},
		IM:{value:'IM',display:'IM'},
		SC:{value:'S/C',display:'S/C'},
		Topical:{value:'Topical',display:'Topical'}
	},
	frequency:{
		OD:{value:'OD',display:'OD'},
		BD:{value:'BD',display:'BD'},
		TDS:{value:'TDS',display:'TDS'},
		QID:{value:'QID',display:'QID'}
	}
}

