var itemConst={
	feeGroupType:{
		private_fund:{value:'private_fund',display:'Private Fund',haveStartDate:true,sourceFileTypes:{txt:{value:'txt',display:'txt'}}},//tannv: giu nguyen group type cu
		medicare:{value:'medicare',display:'Medicare',haveStartDate:false,sourceFileTypes:{xml:{value:'xml',display:'xml'}}},//tannv: chuyen tu type 'item_fee_type' sang 'Medicare'
		dva:{value:'dva',display:'DVA',haveStartDate:true,sourceFileTypes:{xml:{value:'xml',display:'xml'}}},//tannv: add
		public_hospital:{value:'public_hospital',haveStartDate:false,display:'Public Hospital'},//tannv: add
		workcover:{value:'workcover',haveStartDate:false,display:'Workcover'}//tan add
	},
	//tannv
	sourceFileType:{
		xml:'xml',
		txt:'txt',
		xls:'xls'
	}

	
};
