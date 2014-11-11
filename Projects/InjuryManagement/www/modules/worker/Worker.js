angular.module('starter.worker',
    ['starter.worker.add.controller'])

    .config (function ($stateProvider) {
    $stateProvider
        .state('app.worker',{
            url:"/worker",
            views: {
                'menuContent':{
                    templateUrl: "modules/worker/views/structure.html",
                    controller:""
                }
            }
        })
        .state('app.worker.add',{
            url:"/add",
            views: {
                'content':{
                    templateUrl: "modules/worker/views/add.html",
                    controller:"workerAddController"
                }
            }
        })
        .state('app.worker.contact', {
            url:"/contact",
            views: {
                'content':{
                    templateUrl: "modules/worker/views/contact.html",
                    controller: ""
                }
            }
        })
})
