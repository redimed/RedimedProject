/**
 * Created by meditech on 30/09/2014.
 */
angular.module('app.loggedIn.booking.admin',[
    'app.loggedIn.booking.admin.services',
    'app.loggedIn.booking.admin.booking.controller',
    'app.loggedIn.booking.admin.assessment.controller',
    'app.loggedIn.booking.admin.company.controller',
    'app.loggedIn.booking.admin.user.controller',
    'app.loggedIn.booking.admin.site.controller',
    'app.loggedIn.booking.admin.requiment.controller',
    'app.loggedIn.booking.admin.requirement.directive'
])
.config(function($stateProvider){
        $stateProvider
            .state('loggedIn.admin_booking',{
                url:'/admin/booking/booking',
                templateUrl: 'modules/onlineBooking_Admin/views/booking.html',
                controller: 'AdminBookingController'
            })

            .state('loggedIn.admin_assessment',{
                url:'/admin/booking/assessment',
                templateUrl: 'modules/onlineBooking_Admin/views/assessment.html',
                controller: 'AdminAssessmentController'
            })

            .state('loggedIn.admin_company',{
                url:'/admin/booking/companies',
                templateUrl: 'modules/onlineBooking_Admin/views/companies.html',
                controller: 'AdminCompanyController'
            })

            .state('loggedIn.admin_company_new',{
                url:'/admin/booking/company/new/:id',
                templateUrl: 'modules/onlineBooking_Admin/views/addNewCompany.html',
                controller:'AdminNewCompanyController'
            })

            // .state('loggedIn.admin_subCompany_new',{
            //     url:'/admin/booking/company/:id/new',
            //     templateUrl: 'modules/onlineBooking_Admin/views/addNewCompany.html',
            //     controller:'AdminNewCompanyController'
            // })

            .state('loggedIn.admin_company_edit',{
                url:'/admin/booking/company/edit/:fatherId/:subId',
                templateUrl:'modules/onlineBooking_Admin/views/addNewCompany.html',
                controller:'AdminEditCompanyController'
            })

            .state('loggedIn.admin_user',{
                url:'/admin/booking/user',
                templateUrl:'modules/onlineBooking_Admin/views/user.html',
                controller:'AdminUserController'
            })

            .state('loggedIn.admin_user_new',{
                url:'/admin/booking/user/new',
                templateUrl:'modules/onlineBooking_Admin/views/newUser.html',
                controller:'AdminNewUserController'
            })

            .state('loggedIn.admin_user_edit',{
                url:'/admin/booking/user/:id',
                templateUrl: 'modules/onlineBooking_Admin/views/newUser.html',
                controller:'AdminEditUserController'
            })

            .state('loggedIn.admin_sites',{
                url:'/admin/booking/sites',
                templateUrl:'modules/onlineBooking_Admin/views/sites.html',
                controller:'AdminSiteController'
            })

            .state('loggedIn.admin_sites_new',{
                url:'/admin/booking/sites/new',
                templateUrl:'modules/onlineBooking_Admin/views/newSite.html',
                controller:'AdminNewSiteController'
            })

            .state('loggedIn.admin_sites_edit',{
                url:'/admin/booking/sites/:id',
                templateUrl:'modules/onlineBooking_Admin/views/newSite.html',
                controller:'AdminEditSiteController'
            })


    })