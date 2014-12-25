angular.module('app.config', [])

.constant('MODE_ROW', [
    {code:5},
    {code:10},
    {code:20},
    {code:50},
    {code:500}
])

.constant("ACC_TYPE", [
    {"code":"PRIVATE", "name": "Private"},
    {"code":"PUBLIC", "name": "Public"},
    {"code":"WORKCOVER", "name":"Work Cover"}
])

.constant("APP_TYPE", [
    {"code":"NotYet", "name": "Not Yet"},
    {"code":"Done", "name": "Done"},
    {"code":"Doing", "name": "Doing"},
    {"code":"ChangePersonInCharge", "name":"Change person in charge"},
    {"code":"Billing", "name": "Billing"}
])

.constant('SEX_LIST', [
    {'code': 'Male', 'name': 'Male'},
    {'code': 'Female', 'name': 'Female'}
])
.constant('YES_NO_OPT', [
    {'name': 'Yes', code: "1"},
    {'name': 'No', code: "0"},
])

.constant('DAY_OF_WEEK', [
    {code:'Monday', name: 'Monday'},
    {code:'Tuesday', name: 'Tuesday'},
    {code:'Wednesday', name: 'Webnesday'},
    {code:'Thursday', name: 'Thursday'},
    {code: 'Friday', name: 'Friday'}
])

.constant('NUMBER_OF_WEEK', [
    {code:1, name: 'Week 1'},
    {code:2, name: 'Week 2'},
    {code:3, name: 'Week 3'},
    {code:4, name: 'Week 4'},
])

.constant("REAL_DAY_OF_WEEK", [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
])
.constant('APPT_STATUS', [
	{code: 'ChangePers', title: 'Change Permisssion'},
    {code:'Done', title: 'Done'},
    {code:'NotYet', title: 'Not Yet'},
    {code:'Billing', title: 'Billing'},
    {code: null, title: 'Not Met'},
])

.constant("PRIORITY_OPTION", [
    {code: 'high', name: 'High'},
    {code: 'average', name: 'Average'},
    {code: 'low', name: 'Low'}
])

.constant("TIMETABLE_DAY_OF_WEEK", [
    {code: 'Monday', name: 'Monday'},
    {code: 'Tuesday', name: 'Tuesday'},
    {code: 'Wednesday', name: 'Wednesday'},
    {code: 'Thursday', name: 'Thursday'},
    {code: 'Friday', name: 'Friday'}
])
.constant("MONTH_IN_YEAR", [
    {code: 1, title: 'January'},
    {code: 2, title: 'February'},
    {code: 3, title: 'March'},
    {code: 4, title: 'April'},
    {code: 5, title: 'May'},
    {code: 6, title: 'June'},
    {code: 7, title: 'July'},
    {code: 8, title: 'August'},
    {code: 9, title: 'September'},
    {code: 10, title: 'October'},
    {code: 11, title: 'November'},
    {code: 12, title: 'December'},
])
.factory('ConfigService', function (TIMETABLE_DAY_OF_WEEK, PRIORITY_OPTION, DAY_OF_WEEK, NUMBER_OF_WEEK, SEX_LIST, YES_NO_OPT, ACC_TYPE, APP_TYPE, APPT_STATUS, MONTH_IN_YEAR, Restangular) {
    var configService = {};
    var configApi = Restangular.all("api/erm");
    var mdtApi = Restangular.all("api/meditek/v1");

    configService.timetable_dow_option = function(){
        return TIMETABLE_DAY_OF_WEEK;
    }

    configService.redimedsite_option = function(){
        var instanceApi = mdtApi.one("mdtredimedsites/list");
        return instanceApi.get();
    }

    configService.countries_option = function(){
        var instanceApi = mdtApi.one("syscountry/list");
        return instanceApi.get();
    }

    configService.rl_type_option = function(){
        var instanceApi = mdtApi.one("sysrltypes/list");
        return instanceApi.get();
    }

    configService.title_option = function(){
        var instanceApi = mdtApi.one("systitle/list");
        return instanceApi.get();
    }

    configService.provider_option = function(){
        var instanceApi = mdtApi.one("mdtprovider/list");
        return instanceApi.get();
    }

    configService.department_option = function(){
        var instanceApi = mdtApi.one("mdtdept/list");
        return instanceApi.get();
    }

    configService.qualification_option = function(){
        var qualificationApi = mdtApi.one("sysqualification/list");
        return qualificationApi.get();
    }       

    configService.priority_option = function(){
        return PRIORITY_OPTION;
    }

    configService.number_of_week_option = function(){
        return NUMBER_OF_WEEK;
    }

    configService.day_of_week_option = function(){
        return DAY_OF_WEEK;
    }
    
    /* KHANK */
    configService.month_in_year = function() {
        return MONTH_IN_YEAR;
    }

    configService.date_in_month = function() {
        var arr = [];
        for (var i = 1; i <= 31; ++i) {
            arr.push({title: i, code: i});
        };
        return arr;
    }

    configService.appt_status_option = function(){
        return APPT_STATUS;
    }	
	configService.taxes_option = function(){
        var siteApi = configApi.one("v1/system/list_taxes");
        return siteApi.get({is_option: 1});
    };
	
	configService.prefix_headers_option = function(form_code){
        var siteApi = configApi.one("v1/system/list_prefix_headers");
        return siteApi.get({is_option: 1, form_code: form_code});
    };
	
	configService.provider_types_option = function(){
        var siteApi = configApi.one("v1/system/list_provider_types");
        return siteApi.get({is_option: 1});
    };
	
	configService.inv_uoms_option = function(){
        var siteApi = configApi.one("v1/inv/list_uoms");
        return siteApi.get({is_option: 1});
    };


    configService.fee_type_option = function(){
          var siteApi = configApi.one("v2/fees/type/option");
        return siteApi.get();
    }
    
    configService.sex_option = function () {
        return SEX_LIST;
    };
    
    configService.yes_no_option = function () {
        return YES_NO_OPT;
    };

    configService.autoConvertData = function(data) {
        for (var key in data) {
            if (data[key]) {
                if (key.toLowerCase().indexOf("is") === 0) 
                    data[key] = data[key].toString();
                else if (key.toLowerCase().indexOf("_date") != -1 || key.toLowerCase().indexOf("date") != -1)
                    data[key] = new Date(data[key]);
            }
        }
    }

    /* END KHANK */

    configService.user_option = function () {
        return USER_OPTION;
    };

    configService.redimed_sites_option = function(){
        var siteApi = configApi.one("redimedsites/list");
        return siteApi.get();
    };

    configService.clinical_option = function(){
        var clinicalApi = configApi.one("clinicals/list");
        return clinicalApi.get();
    };

    configService.provider_type_option = function () {
        var providerApi = configApi.one("patient/list_provider_type");
        return providerApi.get();
    }

    configService.account_type_option = function(){
        var accountApi = configApi.one("patient/list_account_type");
        return accountApi.get();
    }

    configService.private_type_option = function(){
        var privateApi = configApi.one("patient/list_private_fund");
        return privateApi.get();
    }

    configService.referral_source_option = function(){
        var referralApi = configApi.one("patient/list_referral_source");
        return referralApi.get();
    }

    configService.marial_status_option = function(){
        var marialApi = configApi.one("patient/list_marial_status");
        return marialApi.get();
    }

    configService.culture_option = function(){
        var cultureApi = configApi.one("patient/list_culture");
        return cultureApi.get();
    }

    configService.language_option = function(){
        var languageApi = configApi.one("patient/list_language");
        return languageApi.get();
    }

    configService.system_service_by_clinical = function(clinical_dept_id){
        var serviceApi = configApi.all("system/listServiceByClinical");
        return serviceApi.post({dept:clinical_dept_id});
    }

	/*
	*	START DATE TIME FUNCTION 
	*/
	
    configService.getCommonDateDefault = function(dateTime){
        if(!dateTime) return '';

        if(typeof dateTime === 'string')
            dateTime = new Date(dateTime);

        var year = dateTime.getFullYear();
        var month = dateTime.getMonth()+1;
        var date = dateTime.getDate();

        if(month < 10){
            month = "0"+month;
        }

        if(date < 10){
            date = "0"+date;
        }

        return date+"/"+month+"/"+year;
    }

    configService.getCommonDate = function(dateTime){
        if(!dateTime) return '';

        if(typeof dateTime === 'string')
            dateTime = new Date(dateTime);

        var year = dateTime.getFullYear();
        var month = dateTime.getMonth()+1;
        var date = dateTime.getDate();

        if(month < 10){
            month = "0"+month;
        }

        if(date < 10){
            date = "0"+date;
        }

        return year+"-"+month+"-"+date;
    }

    configService.getCommonDatetime = function(dateTime){
        if(!dateTime) return '';

        if(typeof dateTime === 'string')
            dateTime = new Date(dateTime);

        var year = dateTime.getFullYear();
        var month = dateTime.getMonth()+1;
        var date = dateTime.getDate();

        var seconds = dateTime.getSeconds();

        seconds = (seconds < 10) ? "0"+seconds: seconds;

        var minutes = dateTime.getMinutes();

        minutes = (minutes < 10) ? "0"+minutes: minutes;

        var hours = dateTime.getHours();

        hours = (hours < 10) ? "0"+hours: hours;

        if(month < 10){
            month = "0"+month;
        }

        if(date < 10){
            date = "0"+date;
        }

        return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
    }

    configService.getDayFromTime = function(time){
        var date = new Date(time);

        return date.getDay();
    }

    configService.getWeekFromDate = function(date){
        if(typeof date === 'string')
            date = new Date(date);
        var firstDay = new Date(date.getFullYear(), date.getMonth()+1, 1).getDay();
        return Math.ceil((date.getDate() + firstDay)/7);
    }

    configService.getCommonDateDatabase = function(dateTime){
        if(dateTime === '' || typeof dateTime === 'undefined')
            return '';

        var split = dateTime.split("/");

        var year = split[2];
        var month = split[1];
        var date = split[0];

        if(month < 10){
            month = "0"+month;
        }

        if(date < 10){
            date = "0"+date;
        }

        return year+"-"+month+"-"+date;
    };

    configService.convertToTimeString = function(dateTimeStr){
        var tempDate = dateTimeStr.split(" ");
        tempDate = tempDate[1].split(":");

        return tempDate[0]+":"+tempDate[1];
    };

    configService.convertToTimeStringApp = function(dateTimeStr){
        var tempDate = new Date(dateTimeStr);

        var minutes = tempDate.getMinutes();
        if(minutes < 10){
            minutes = "0"+minutes;
        }        

        return tempDate.getHours()+":"+minutes;
    }

    configService.convertToDate = function(dateTime){
        if(typeof dateTime === 'string')
            dateTime = new Date(dateTime);

        var year = dateTime.getFullYear();
        var month = dateTime.getMonth()+1;

        if(month < 10) month = "0"+month;

        var date = dateTime.getDate();

        if(date < 10) date = "0"+date;

        return date+"/"+month+"/"+year;
    }

	/*
	*	END DATE TIME FUNCTION 
	*/
	
    configService.acc_type_option = function(){
        return ACC_TYPE;
    }

    configService.app_type_option = function(){
        return APP_TYPE;
    }
    
    /*
         BEGIN THANH
         */
        configService.focus_input = function (Form) {
            //check parameter
            if (Form == null || Form == undefined || Form.length == 0) {
                return false;
            }
            else {
                /*
                 * begin focus input when err
                 */
                var value = 0;
                var MinOffset;
                var element = [];
                //begin set value name-id input
                //begin email
                value = 0;
                MinOffset = ((Form.$error.email == undefined ||
                Form.$error.email.length == 0 ||
                Form.$error.email == false) ? 9999999999 : $('[name="' + Form.$error.email[0].$name + '"]').offset().top);
                for (var i = 1; i <= ((Form.$error.email == undefined || Form.$error.email.length == 0 ||
                Form.$error.email == false) ? 0 : Form.$error.email.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.email[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.email[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[0] = ((Form.$error.email == undefined || Form.$error.email.length == 0 ||
                Form.$error.mail == false) ? "" : Form.$error.email[value].$name);
                //end email

                //begin max
                value = 0;
                MinOffset = ((Form.$error.max == undefined ||
                Form.$error.max.length == 0 ||
                Form.$error.max == false) ? 9999999999 : $('[name="' + Form.$error.max[0].$name + '"]').offset().top);
                for (var i = 1; i <= ((Form.$error.max == undefined || Form.$error.max.length == 0 ||
                Form.$error.max == false) ? 0 : Form.$error.max.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.max[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.max[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[1] = ((Form.$error.max == undefined ||
                Form.$error.max.length == 0 || Form.$error.max == false) ? "" : Form.$error.max[value].$name);
                //end max

                //begin maxlength
                value = 0;
                MinOffset = ((Form.$error.maxlength == undefined ||
                Form.$error.maxlength.length == 0 ||
                Form.$error.maxlength == false) ? 9999999999 : ($('[name="' + Form.$error.maxlength[0].$name + '"]').offset().top));
                for (var i = 1; i <= ((Form.$error.maxlength == undefined || Form.$error.maxlength.length == 0 ||
                Form.$error.maxlength == false) ? 0 : Form.$error.maxlength.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.maxlength[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.maxlength[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[2] = ((Form.$error.maxlength == undefined ||
                Form.$error.maxlength.length == 0 ||
                Form.$error.maxlength == false) ? "" : Form.$error.maxlength[value].$name);
                //end maxlength

                //begin min
                value = 0;
                MinOffset = ((Form.$error.min == undefined ||
                Form.$error.min.length == 0 ||
                Form.$error.min == false) ? 9999999999 : $('[name="' + Form.$error.min[0].$name + '"]').offset().top);
                for (var i = 1; i <= ((Form.$error.min == undefined || Form.$error.min.length == 0 ||
                Form.$error.min == false) ? 0 : Form.$error.min.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.min[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.min[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[3] = ((Form.$error.min == undefined ||
                Form.$error.min.length == 0 ||
                Form.$error.min == false) ? "" : Form.$error.min[value].$name);
                //end min

                //begin minlength
                value = 0;
                MinOffset = ((Form.$error.minlength == undefined ||
                Form.$error.minlength.length == 0 ||
                Form.$error.minlength == false) ? 9999999999 : $('[name="' + Form.$error.minlength[0].$name + '"]').offset().top);
                for (var i = 1; i <= ((Form.$error.minlength == undefined ||
                Form.$error.minlength.length == 0 ||
                Form.$error.minlength == false) ? 0 : Form.$error.minlength.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.minlength[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.minlength[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[4] = ((Form.$error.minlength == undefined ||
                Form.$error.minlength.length == 0 ||
                Form.$error.minlength == false) ? "" : Form.$error.minlength[value].$name);
                //end minlength

                //begin number
                value = 0;
                MinOffset = ((Form.$error.number == undefined ||
                Form.$error.number.length == 0 ||
                Form.$error.number == false) ? 9999999999 : $('[name="' + Form.$error.number[0].$name + '"]').offset().top);
                for (var i = 1; i <= ((Form.$error.number == undefined ||
                Form.$error.number.length == 0 ||
                Form.$error.number == false) ? 0 : Form.$error.number.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.number[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.number[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[5] = (
                    (Form.$error.number == undefined ||
                    Form.$error.number.length == 0 ||
                    Form.$error.number == false) ? "" : Form.$error.number[value].$name);
                //end number

                //begin pattern
                value = 0;
                MinOffset = ((Form.$error.pattern == undefined ||
                Form.$error.pattern.length == 0 ||
                Form.$error.pattern == false) ? 9999999999 : $('[name="' + Form.$error.pattern[0].$name + '"]').offset().top);
                for (var i = 1; i <= ((Form.$error.pattern == undefined ||
                Form.$error.pattern.length == 0 || Form.$error.pattern == false) ? 0 : Form.$error.pattern.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.pattern[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.pattern[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[6] = (
                    (Form.$error.pattern == undefined ||
                    Form.$error.pattern.length == 0 ||
                    Form.$error.pattern == false) ? "" : Form.$error.pattern[value].$name);
                //end pattern

                //begin required
                value = 0;
                MinOffset = (
                    (Form.$error.required == undefined ||
                    Form.$error.required.length == 0 ||
                    Form.$error.required == false) ? 9999999999 : ($('[name="' + Form.$error.required[0].$name + '"]').offset().top));
                for (var i = 1; i <= (
                    (Form.$error.required == undefined ||
                    Form.$error.required.length == 0 ||
                    Form.$error.required == false) ? 0 : Form.$error.required.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.required[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.required[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[7] = (
                    (Form.$error.required == undefined ||
                    Form.$error.required.length == 0 ||
                    Form.$error.required == false) ? "" : Form.$error.required[value].$name);
                //end required

                //begin url
                value = 0;
                MinOffset = (
                    (Form.$error.url == undefined ||
                    Form.$error.url.length == 0 ||
                    Form.$error.url == false) ? 9999999999 : $('[name="' + Form.$error.url[0].$name + '"]').offset().top);
                for (var i = 1; i <= ((Form.$error.url == undefined || Form.$error.url.length == 0) ? 0 : Form.$error.url.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.url[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.url[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[8] = (
                    (Form.$error.url == undefined ||
                    Form.$error.url.length == 0 ||
                    Form.$error.url == false) ? "" : Form.$error.url[value].$name);
                //end url

                //begin date
                value = 0;
                MinOffset = (
                    (Form.$error.date == undefined ||
                    Form.$error.date.length == 0 ||
                    Form.$error.date == false) ? 9999999999 : $('[name="' + Form.$error.date[0].$name + '"]').offset().top);
                for (var i = 1; i <= ((Form.$error.date == undefined ||
                Form.$error.date.length == 0 ||
                Form.$error.date == false) ? 0 : Form.$error.date.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.date[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.date[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[9] = (
                    (Form.$error.date == undefined ||
                    Form.$error.date.length == 0 ||
                    Form.$error.date == false) ? "" : Form.$error.date[value].$name);
                //end date

                //begin datetimelocal
                value = 0;
                MinOffset = (
                    (Form.$error.datetimelocal == undefined ||
                    Form.$error.datetimelocal.length == 0 ||
                    Form.$error.datetimelocal == false) ? 9999999999 : $('[name="' + Form.$error.datetimelocal[0].$name + '"]').offset().top);
                for (var i = 1; i <= (
                    (Form.$error.datetimelocal == undefined ||
                    Form.$error.datetimelocal.length == 0 ||
                    Form.$error.datetimelocal == false) ? 0 : Form.$error.datetimelocal.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.datetimelocal[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.datetimelocal[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[10] = (
                    (Form.$error.datetimelocal == undefined ||
                    Form.$error.datetimelocal.length == 0 ||
                    Form.$error.datetimelocal == false) ? "" : Form.$error.datetimelocal[value].$name);
                //end datetimelocal

                //begin time
                value = 0;
                MinOffset = (
                    (Form.$error.time == undefined ||
                    Form.$error.time.length == 0 ||
                    Form.$error.time == false) ? 9999999999 : $('[name="' + Form.$error.time[0].$name + '"]').offset().top);
                for (var i = 1; i <= (
                    (Form.$error.time == undefined ||
                    Form.$error.time.length == 0 ||
                    Form.$error.time == false) ? 0 : Form.$error.time.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.time[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.time[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[11] = (
                    (Form.$error.time == undefined ||
                    Form.$error.time.length == 0 ||
                    Form.$error.time == false) ? "" : Form.$error.time[value].$name);
                //end time

                //begin week
                value = 0;
                MinOffset = (
                    (Form.$error.week == undefined ||
                    Form.$error.week.length == 0 ||
                    Form.$error.week == false) ? 9999999999 : $('[name="' + Form.$error.week[0].$name + '"]').offset().top);
                for (var i = 1; i <= (
                    (Form.$error.week == undefined ||
                    Form.$error.week.length == 0 ||
                    Form.$error.week == false) ? 0 : Form.$error.week.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.week[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.week[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[12] = (
                    (Form.$error.week == undefined ||
                    Form.$error.week.length == 0 ||
                    Form.$error.week == false) ? "" : Form.$error.week[value].$name);
                //end week

                //begin month
                value = 0;
                MinOffset = (
                    (Form.$error.month == undefined ||
                    Form.$error.month.length == 0 ||
                    Form.$error.month == false) ? 9999999999 : $('[name="' + Form.$error.month[0].$name + '"]').offset().top);
                for (var i = 1; i <= (
                    (Form.$error.month == undefined ||
                    Form.$error.month.length == 0 ||
                    Form.$error.month == false) ? 0 : Form.$error.month.length - 1); i++) {
                    if (MinOffset > $('[name="' + Form.$error.month[0].$name + '"]').offset().top) {
                        MinOffset = $('[name="' + Form.$error.month[0].$name + '"]').offset().top;
                        value = i;
                    }
                }
                element[13] = (
                    (Form.$error.month == undefined ||
                    Form.$error.month.length == 0 ||
                    Form.$error.month == false) ? "" : Form.$error.month[value].$name);
                //end month

                //end set value name-id input
                MinOffset = element[0] != "" ? $('[name="' + element[0] + '"]').offset().top : 9999999999;
                for (var i = 1; i <= 13; i++) {
                    var OffsetFor = element[i] != "" ? $('[name="' + element[i] + '"]').offset().top : 9999999999;
                    if (MinOffset > OffsetFor) {
                        MinOffset = $('[name="' + element[i] + '"]').offset().top;
                        value = i;
                    }
                }
                $('[name="' + element[value] + '"]').focus();
                return true;
                /*
                 * end focus input when err
                 */
            }
        };
        /*
         END THANH
         */


    return configService;
})
