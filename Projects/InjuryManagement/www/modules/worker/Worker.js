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
            url:"/firstInfo",
            views: {
                'content':{
                    templateUrl: "modules/worker/views/first.html"
                }
            }
        })
        .state('app.worker.main', {
            url:"/secondInfo",
            views: {
                'content':{
                    templateUrl: "modules/worker/views/second.html"
                }
            }
        })
        .state('app.worker.second', {
            url:"/last",
            views: {
                'content':{
                    templateUrl: "modules/worker/views/last.html"
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


})
