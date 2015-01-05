angular.module('starter.worker', [
    'starter.worker.add.controller',
    'starter.worker.services',
])

    .config (function ($stateProvider) {
    $stateProvider
        .state('app.worker',{
            url:"/worker/:nonEmerg",
            views: {
                'menuContent':{
                    templateUrl: "modules/worker/views/structure.html",
                    controller:"workerAddController"
                }
            }
        })
        .state('app.worker.add',{
            url:"/add",
            views: {
                'content':{
                    templateUrl: "modules/worker/views/add.html"
                }
            }
        })
        .state('app.worker.main', {
            url:"/main",
            views: {
                'content':{
                    templateUrl: "modules/worker/views/main.html"
                }
            }
        })
        .state('app.worker.second', {
            url:"/second",
            views: {
                'content':{
                    templateUrl: "modules/worker/views/second.html"
                }
            }
        })
})
