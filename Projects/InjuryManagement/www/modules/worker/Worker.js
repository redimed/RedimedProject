angular.module('starter.worker', [
    'starter.worker.add.controller',
    'starter.worker.services',
])

    .config (function ($stateProvider) {
    $stateProvider
        .state('app.worker',{
            url:"/worker",
            views: {
                'menuContent':{
                    templateUrl: "modules/worker/views/structure.html",
                    controller:"workerAddController"
                }
            }
        })
        .state('app.worker.add',{
            url:"/add/:nonEmerg",
            views: {
                'content':{
                    templateUrl: "modules/worker/views/add.html",
                    controller:"workerAddController"
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
        .state('app.worker.writeNFC',{
            url:"/writeNFC",
            views:{
                'content':{
                    templateUrl:"modules/worker/views/writeNFC.html"
                }
            }
        })
        .state('app.worker.readNFC',{
            url:"/readNFC",
            views:{
                'content':{
                    templateUrls:"modules/worker/views/readNFC.html"
                }
            }
        })

})
