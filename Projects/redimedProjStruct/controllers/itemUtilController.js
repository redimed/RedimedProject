/**
 * tannv.dts@gmail.com
 * 17-07-2015
 */

var kiss=require('./kissUtilsController');
var moment = require('moment');
module.exports =
{
    feeGroupType:{
        privateFund:{value:'private_fund',display:'Private Fund'},//tannv: giu nguyen group type cu
        medicare:{value:'medicare',display:'Medicare'},//tannv: chuyen tu type 'item_fee_type' sang 'Medicare'
        dva:{value:'dva',display:'DVA'},//tannv: add
        publicHospital:{value:'public_hospital',display:'Public Hospital'},//tannv: add
        workcover:{value:'workcover',display:'Workcover'}//tan add
    },

    sourceFolderPath:'uploadFile/ItemFee/',
}