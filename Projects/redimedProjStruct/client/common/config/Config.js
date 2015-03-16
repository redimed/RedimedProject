angular.module('app.config', [])

.constant('MODE_ROW', [
    {code:5},
    {code:10},
    {code:20},
    {code:50},
    {code:500}
])
.constant("INVOICE_STATUS", [
    {"code":"enter", "label": "Enter"},
    {"code":"approach", "label": "Approach"},
    {"code":"done", "label":"Done"}
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

.constant("TIMETABLE_DAY_OF_WEEK", [{
        code: 'Monday',
        name: 'Monday'
    }, {
        code: 'Tuesday',
        name: 'Tuesday'
    }, {
        code: 'Wednesday',
        name: 'Wednesday'
    }, {
        code: 'Thursday',
        name: 'Thursday'
    }, {
        code: 'Friday',
        name: 'Friday'
    }])
    .constant("MONTH_IN_YEAR", [{
        code: 1,
        title: 'January'
    }, {
        code: 2,
        title: 'February'
    }, {
        code: 3,
        title: 'March'
    }, {
        code: 4,
        title: 'April'
    }, {
        code: 5,
        title: 'May'
    }, {
        code: 6,
        title: 'June'
    }, {
        code: 7,
        title: 'July'
    }, {
        code: 8,
        title: 'August'
    }, {
        code: 9,
        title: 'September'
    }, {
        code: 10,
        title: 'October'
    }, {
        code: 11,
        title: 'November'
    }, {
        code: 12,
        title: 'December'
    }, ])
    .constant("RECALL_PERIOD", [{
        code: 1,
        title: '1 month'
    }, {
        code: 2,
        title: '2 months'
    }, {
        code: 3,
        title: '3 months'
    }, {
        code: 6,
        title: '6 months'
    }, {
        code: 12,
        title: '12 months'
    }, {
        code: 24,
        title: '24 months'
    }, ])
    .constant("RECALL_REMIND", [{
        code: 1,
        title: '1 month'
    }, {
        code: 2,
        title: '2 months'
    }, {
        code: 3,
        title: '3 months'
    }, ])
    //thanh
    .constant('MODE_WEEK', [{
        code: 1
    }, {
        code: 2
    }, {
        code: 3
    }, {
        code: 4
    }, {
        code: 5
    }, {
        code: 6
    }, {
        code: 7
    }, {
        code: 8
    }, {
        code: 9
    }, {
        code: 10
    }, {
        code: 11
    }, {
        code: 12
    }, {
        code: 13
    }, {
        code: 14
    }, {
        code: 15
    }, {
        code: 16
    }, {
        code: 17
    }, {
        code: 18
    }, {
        code: 19
    }, {
        code: 20
    }, {
        code: 21
    }, {
        code: 22
    }, {
        code: 23
    }, {
        code: 24
    }, {
        code: 25
    }, {
        code: 26
    }, {
        code: 27
    }, {
        code: 28
    }, {
        code: 29
    }, {
        code: 30
    }, {
        code: 31
    }, {
        code: 32
    }, {
        code: 33
    }, {
        code: 34
    }, {
        code: 35
    }, {
        code: 36
    }, {
        code: 37
    }, {
        code: 38
    }, {
        code: 39
    }, {
        code: 40
    }, {
        code: 41
    }, {
        code: 42
    }, {
        code: 43
    }, {
        code: 44
    }, {
        code: 45
    }, {
        code: 46
    }, {
        code: 47
    }, {
        code: 48
    }, {
        code: 49
    }, {
        code: 50
    }, {
        code: 51
    }, {
        code: 52
    }])
    //end thanh

.factory('ConfigService', function (TIMETABLE_DAY_OF_WEEK, PRIORITY_OPTION, DAY_OF_WEEK, NUMBER_OF_WEEK, SEX_LIST, YES_NO_OPT, ACC_TYPE, APP_TYPE, APPT_STATUS, MONTH_IN_YEAR, INVOICE_STATUS, RECALL_PERIOD, RECALL_REMIND, Restangular) {
    var configService = {};
    var configApi = Restangular.all("api/erm");
    var mdtApi = Restangular.all("api/meditek/v1");

    configService.recall_period_option = function(){
         return RECALL_PERIOD;
    }

    configService.recall_remind_option = function(){
         return RECALL_REMIND;
    }

    configService.invoice_status_option = function() {
        return INVOICE_STATUS;
    }

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
        var month = parseInt(split[1]);
        var date = parseInt(split[0]);

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

    configService.convertToDatetime = function(dateTime){
        if(typeof dateTime === 'string')
            dateTime = new Date(dateTime);

        var prefix = configService.convertToDate(dateTime);
        var postfix = configService.convertToTimeStringApp (dateTime)

        return  prefix + ' ' + postfix;
    }

    configService.convertStringToDate = function(dateTime){
        var newDate = new Date(dateTime.substr(0,4),dateTime.substr(5,2)-1,dateTime.substr(8,2),dateTime.substr(11,2),dateTime.substr(14,2));
        return newDate;
    }

	/*
	*	END DATE TIME FUNCTION 
	*/
	
    configService.acc_type_option = function(){
        return ACC_TYPE;
    }

    configService.app_type_option = function() {
            return APP_TYPE;
        }
        //thanh
    configService.getDayOfYear = function(date) {

        var offset = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 1).getTime();

        return Math.ceil(offset / 1000 / 60 / 60 / 24);

    };
    configService.getWeekOfYear = function(date) {

        var dayOfYear = configService.getDayOfYear(date);

        return Math.ceil(dayOfYear / 7);

    };
    //end thanh


    return configService;
})
