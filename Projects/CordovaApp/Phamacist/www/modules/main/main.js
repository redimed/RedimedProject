angular.module('starter.main',[
    'starter.main.services',
    'starter.main.controller',
    'starter.main.usercontroller',
    'starter.main.pharmacistController',
    'starter.main.companyController',
    'starter.main.profileController',
    'starter.main.shopController',
    'starter.main.postsController',
    'starter.main.homeController',
])
    .config(function ($stateProvider){
        $stateProvider
            .state('app.main',{
                cache: false,
                url: "/main",
                views: {
                    'menuContent' : {
                        templateUrl: "modules/main/views/main.html",
                        controller: "mainController"
                    }
                }
            })
            .state('app.main.profile',{
                url:"/profile",
                views: {
                    'profile' : {
                        templateUrl: "modules/main/views/profile.html",
                        controller:"profileController"
                    }
                }
            })
             .state('app.main.userinfo',{
                url:"/userinfo",
                views: {
                    'profile' : {
                        templateUrl: "modules/main/views/userinfo.html",
                        controller:"userController"
                    }
                }
            })
            .state('app.main.company',{
                cache: false,
                url:"/company",
                views: {
                    'profile' : {
                        templateUrl: "modules/main/views/company.html",
                        controller:"companyController"
                    }
                }
            })
            .state('app.main.companyinfo',{
                url:"/companyinfo",
                views: {
                    'profile' : {
                        templateUrl: "modules/main/views/companyinfo.html",
                        controller:'companyController'
                    }
                }
            })
            .state('app.main.userincompany',{
                cache: false,
                url:"/userincompany",
                views: {
                    'profile' : {
                        templateUrl: "modules/main/views/userincompany.html",
                        controller:'companyController'
                    }
                }
            })
            .state('app.main.pharmacist',{
                url:"/pharmacist",
                views: {
                    'profile' : {
                        templateUrl: "modules/main/views/pharmacist.html",
                        controller:'pharmacistController'
                    }
                }
            })
             .state('app.main.pharmacistinfo',{
                url:"/pharmacistinfo",
                views: {
                    'profile' : {
                        templateUrl: "modules/main/views/pharmacistinfo.html",
                        controller:'pharmacistController'
                    }
                }
            })
            .state('app.main.pharmacistQualification',{
                url:"/pharmacistQualification",
                views: {
                    'profile' : {
                        templateUrl: "modules/main/views/pharmacistQualification.html",
                        controller:'pharmacistController'
                    }
                }
            })

            .state('app.main.pharmacistExperience',{
                url:"/pharmacistExperience",
                views: {
                    'profile' : {
                        templateUrl: "modules/main/views/pharmacistExperience.html",
                        controller:'pharmacistController'
                    }
                }
            })

            .state('app.main.shop',{
                cache: false,
                url:"/shop",
                views: {
                    'shop' : {
                        templateUrl: "modules/main/views/shopCompany.html",
                        controller:'shopController'
                    }
                }
            })

            .state('app.main.posts',{
                url:"/posts",
                views: {
                    'shop' : {
                        templateUrl: "modules/main/views/posts.html",
                        controller:'postsController'
                    }
                }
            })

            .state('app.main.postDetail',{
                cache: false,
                url:"/postDetail",
                views: {
                    'home' : {
                        templateUrl: "modules/main/views/postDetail.html",
                        controller:'postsController'
                    }
                }
            })
           
            //state home
            .state('app.main.home',{
                cache: false,
                url:"/home",
                views: {
                    'home' : {
                        templateUrl: "modules/main/views/home.html",
                        controller:'homeController'
                    }
                }
            })

            .state('app.main.postShop',{
                cache: false,
                url:"/postShop/:shopId",
                views: {
                    'shop' : {
                        templateUrl: "modules/main/views/postShop.html",
                        controller:'shopController'
                    }
                }
            })

            .state('app.main.postDetailShop',{
                cache: false,
                url:"/postDetailShops",
                views: {
                    'shop' : {
                        templateUrl: "modules/main/views/postDetailShop.html",
                        controller: 'shopController'
                    }
                }
            })

            .state('app.main.postPharmacist',{
                cache: false,
                url:"/postPharmacist",
                views: {
                    'post' : {
                        templateUrl: "modules/main/views/postPharmacist.html",
                        controller:'postsController'
                    }
                }
            })

            .state('app.main.addNewShop',{
                //cache: false,
                url:"/addNewShop/:title",
                views: {
                    'shop' : {
                        templateUrl: "modules/main/views/addnewShop.html",
                        controller:'shopController'
                    }
                }
            })

            .state('app.main.editShop',{
                //cache: false,
                url:"/editShop/:title",
                views: {
                    'shop' : {
                        templateUrl: "modules/main/views/addnewShop.html",
                        controller:'shopController'
                    }
                }
            })

            .state('app.main.infoPhar',{
                cache: false,
                url:"/infoPhar",
                views: {
                    'shop' : {
                        templateUrl: "modules/main/views/infoPharmacist.html",
                        controller:'pharmacistController'
                    }
                }
            })

            .state('app.main.detailInfoPhar',{
                cache: false,
                url:"/detailInfoPhar",
                views: {
                    'shop' : {
                        templateUrl: "modules/main/views/detailInfoPhar.html",
                        controller:'shopController'
                    }
                }
            })

            .state('app.main.allPost',{
                cache: false,
                url:"/allPost",
                views: {
                    'post' : {
                        templateUrl:"modules/main/views/allPost.html",
                        controller: 'homeController'
                    }
                }
            })

            .state('app.main.postDetailPost',{
                cache: false,
                url:"/postDetailPost",
                views: {
                    'post' : {
                        templateUrl:"modules/main/views/postDetailShop.html",
                        controller: 'shopController'
                    }
                }
            })

            .state('app.main.postDetailPostApply',{
                cache: false,
                url:"/postDetailPostApply",
                views: {
                    'post' : {
                        templateUrl:"modules/main/views/postDetailPostApply.html",
                        controller: 'pharmacistController'
                    }
                }
            })

            .state('app.main.addNewPosts',{
                cache: false,
                url:"/addNewPosts",
                views: {
                    'shop' : {
                        templateUrl:"modules/main/views/addNewPosts.html",
                        controller: 'shopController'
                    }
                }
            })
    })

