angular.module("starter.model",['starter.model.controller'])
    .config(function($stateProvider) {
        $stateProvider
            .state('app.model', {
                url: "/model/:linkGender",
                views:{
                    'menuContent':{
                        templateUrl: "modules/model3D/views/model.html",
                        controller: 'modelController'
                    }
                }
            });
    });