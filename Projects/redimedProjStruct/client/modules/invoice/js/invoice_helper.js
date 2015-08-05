var invConst={
	billTo:{
		privateFund:{display:'Private Funds',value:'private_fund'},
		otherFeeType:{display:'Other Fee Types',value:'other_fee_type'}
	},
	feeGroupType:{
		private_fund:{value:'private_fund',display:'Private Fund',haveStartDate:true,sourceFileTypes:{txt:{value:'txt',display:'txt'}}},//tannv: giu nguyen group type cu
		medicare:{value:'medicare',display:'Medicare',haveStartDate:false,sourceFileTypes:{xml:{value:'xml',display:'xml'}}},//tannv: chuyen tu type 'item_fee_type' sang 'Medicare'
		dva:{value:'dva',display:'DVA',haveStartDate:true,sourceFileTypes:{xml:{value:'xml',display:'xml'}}},//tannv: add
		public_hospital:{value:'public_hospital',haveStartDate:false,display:'Public Hospital'},//tannv: add
		workcover:{value:'workcover',haveStartDate:false,display:'Workcover'}//tan add
	},
	feeGroupTypeAuto:{
		private_fund:{value:'private_fund',display:'Private Fund',haveStartDate:true,sourceFileTypes:{txt:{value:'txt',display:'txt'}}},//tannv: giu nguyen group type cu
		workcover:{value:'workcover',haveStartDate:false,display:'Workcover'}//tan add
	},

};

//tannv.dts@gmail.com
//05-08-2015
var testReport=true;
function getUrlReport(){
	if(testReport)
		return 'http://localhost:3003/RedimedJavaREST/api/document';
	else
	{
		return 'http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document';
	}
}