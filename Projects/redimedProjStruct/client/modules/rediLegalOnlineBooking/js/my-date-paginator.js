/**
 * Created by meditech on 9/9/2014.
 */

/**
 * tannv.dts@gmail.com
 * @param date: typical javascript date type
 * @param callBackFunc : function to be called when datepaginator change value
 * callBackFunc need passed typical javascript date type
 *
 */
function MyDatePaginator(selector,momentDate,callBackFunc) {
    var options = {
        //startDate:moment().add(14,'day'),
        //startDateFormat:'DD-MM-YYYY',
        selectedDate: momentDate.format("DD-MM-YYYY"),
        selectedDateFormat: 'DD-MM-YYYY',
        onSelectedDateChanged: function(event, date) {
            //parse moment date to typical date
            callBackFunc(date);
        }
    }
    $(selector).datepaginator(options);
//    return {
//        init:function()
//        {
//            $('#mydatepaginator').datepaginator(options);
//        }
//    }


};