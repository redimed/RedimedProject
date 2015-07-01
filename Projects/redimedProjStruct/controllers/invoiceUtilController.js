/**
 * tannv.dts@gmail.com
 * 02-06-2015
 */

var kiss=require('./kissUtilsController');
var moment = require('moment');
module.exports =
{
    apptStatus:{
		booking:{value:'Booking',display:'Booking'},
		checkedIn:{value:'Checked In',display:'Checked In'},
		inConsult:{value:'In Consult',display:'In Consult'},
		completed:{value:'Completed',display:'Completed'},
		billing:{value:'Billing',display:'Billing'},
		close:{value:'Close',display:'Close'},
		cancelled:{value:'Cancelled',display:'Cancelled'}
	},

    invoiceErpStatus:{
        open:'open'
    },

	getNewInvoiceNumber:function(req,functionSuccess,functionErr)
	{
		var prefix=moment().format("YYYYMM");
        var sql=
            " SELECT MAX(header.`INVOICE_NUMBER`) AS CURRENT_INVOICE_NUMBER FROM `cln_invoice_header` header    "+
            " WHERE header.`INVOICE_NUMBER` LIKE CONCAT(?,'%')                        ";
        kiss.executeQuery(req,sql,[prefix],function(rows){
            var nextInvoiceNumber=null;
            if(rows.length>0)
            {
                var currentInvoiceNumber=rows[0].CURRENT_INVOICE_NUMBER;
                var currentNo=parseInt( currentInvoiceNumber.substring(currentInvoiceNumber.indexOf('.')+1) );
                var nextNo=currentNo+1;
                nextInvoiceNumber=prefix+'.'+kiss.pad(nextNo,4);
            }
            else
            {
                nextInvoiceNumber=prefix+'.'+kiss.pad(1,4); //prefix+'.'+0001

            }
            functionSuccess(nextInvoiceNumber);
        },function(err){
        	functionErr(err);
        })
	}
}