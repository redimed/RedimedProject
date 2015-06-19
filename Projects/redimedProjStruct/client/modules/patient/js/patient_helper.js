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
		waiting:{value:'Waiting',display:'Waiting'},
		inConsult:{value:'In Consult',display:'In Consult'},
		completed:{value:'Completed',display:'Completed'},
		billing:{value:'Billing',display:'Billing'},
		close:{value:'Close',display:'Close'},
		cancelled:{value:'Cancelled',display:'Cancelled'}
	},
	apptStatusDisplay:{
		'Booking':'Booking',
		'Checked In':'Checked In',
		'Waiting':'Waiting',
		'In Consult':'In Consult',
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
		OD:{value:'1',display:'OD'},
		BD:{value:'2',display:'BD'},
		TDS:{value:'3',display:'TDS'},
		QID:{value:'4',display:'QID'}
	}
}

