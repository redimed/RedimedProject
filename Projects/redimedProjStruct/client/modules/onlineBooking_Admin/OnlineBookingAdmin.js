/**
 * Created by meditech on 30/09/2014.
 */
angular.module('app.loggedIn.booking.admin',[
    'app.loggedIn.booking.admin.services',
    'app.loggedIn.booking.admin.booking.controller',
    'app.loggedIn.booking.admin.assessment.controller',
    'app.loggedIn.booking.admin.company.controller',
    'app.loggedIn.booking.admin.user.controller'
])
.config(function($stateProvider){
        $stateProvider
            .state('loggedIn.admin_booking',{
                url:'/admin/booking/booking',
                templateUrl: 'modules/onlineBooking_Admin/views/booking.html',
                controller: 'BookingController'
            })

            .state('loggedIn.admin_assessment',{
                url:'/admin/booking/assessment',
                templateUrl: 'modules/onlineBooking_Admin/views/assessment.html',
                controller: 'AssessmentController'
            })

            .state('loggedIn.admin_company',{
                url:'/admin/booking/companies',
                templateUrl: 'modules/onlineBooking_Admin/views/companies.html',
                controller: 'CompanyController'
            })

            .state('loggedIn.admin_company_new',{
                url:'/admin/booking/company/new',
                templateUrl: 'modules/onlineBooking_Admin/views/addNewCompany.html',
                controller:'NewCompanyController'
            })

            .state('loggedIn.admin_subCompany_new',{
                url:'/admin/booking/company/:id/new',
                templateUrl: 'modules/onlineBooking_Admin/views/addNewCompany.html',
                controller:'NewCompanyController'
            })

            .state('loggedIn.admin_company_edit',{
                url:'/admin/booking/company/:id',
                templateUrl:'modules/onlineBooking_Admin/views/addNewCompany.html',
                controller:'EditCompanyController'
            })

            .state('loggedIn.admin_user',{
                url:'/admin/booking/user',
                templateUrl:'modules/onlineBooking_Admin/views/user.html',
                controller:'UserController'
            })

            .state('loggedIn.admin_user_new',{
                url:'/admin/booking/user/new',
                templateUrl:'modules/onlineBooking_Admin/views/newUser.html',
                controller:'NewUserController'
            })

            .state('loggedIn.admin_user_edit',{
                url:'/admin/booking/user/:id',
                templateUrl: 'modules/onlineBooking_Admin/views/newUser.html',
                controller:'EditUserController'
            })


    })