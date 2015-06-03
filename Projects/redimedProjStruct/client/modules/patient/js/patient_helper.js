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
	}
}

